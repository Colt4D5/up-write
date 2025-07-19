import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { hash, verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	// Get the full user data including fields that might not be in locals
	const [userData] = await db
		.select({
			id: table.user.id,
			username: table.user.username,
			email: table.user.email,
			displayName: table.user.displayName,
			birthday: table.user.birthday,
			profileImage: table.user.profileImage,
			createdAt: table.user.createdAt
		})
		.from(table.user)
		.where(eq(table.user.id, event.locals.user.id));

	return {
		user: userData
	};
};

export const actions: Actions = {
	updateProfile: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Not logged in' });
		}

		const formData = await event.request.formData();
		const username = formData.get('username')?.toString();
		const email = formData.get('email')?.toString();
		const displayName = formData.get('displayName')?.toString();
		const birthdayString = formData.get('birthday')?.toString();

		// Validation
		if (!username || username.length < 3 || username.length > 31) {
			return fail(400, { message: 'Username must be between 3 and 31 characters', username, email, displayName, birthday: birthdayString });
		}

		if (!/^[a-z0-9_-]+$/.test(username)) {
			return fail(400, { message: 'Username can only contain lowercase letters, numbers, underscores, and hyphens', username, email, displayName, birthday: birthdayString });
		}

		if (email && email.length > 0) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return fail(400, { message: 'Please enter a valid email address', username, email, displayName, birthday: birthdayString });
			}
		}

		let birthday: string | null = null;
		if (birthdayString && birthdayString.length > 0) {
			// Validate birthday format (YYYY-MM-DD)
			const birthdayDate = new Date(birthdayString);
			const today = new Date();
			
			if (isNaN(birthdayDate.getTime())) {
				return fail(400, { message: 'Please enter a valid date', username, email, displayName, birthday: birthdayString });
			}
			
			// Check if birthday is not in the future
			if (birthdayDate > today) {
				return fail(400, { message: 'Birthday cannot be in the future', username, email, displayName, birthday: birthdayString });
			}
			
			// Check if birthday is reasonable (not more than 150 years ago)
			const minDate = new Date();
			minDate.setFullYear(today.getFullYear() - 150);
			
			if (birthdayDate < minDate) {
				return fail(400, { message: 'Please enter a valid birthday', username, email, displayName, birthday: birthdayString });
			}
			
			birthday = birthdayString;
		}

		try {
			// Check if username is taken by another user
			const existingUser = await db
				.select({ id: table.user.id })
				.from(table.user)
				.where(eq(table.user.username, username));

			if (existingUser.length > 0 && existingUser[0].id !== event.locals.user.id) {
				return fail(400, { message: 'Username is already taken', username, email, displayName, birthday: birthdayString });
			}

			// Check if email is taken by another user (if provided)
			if (email && email.length > 0) {
				const existingEmail = await db
					.select({ id: table.user.id })
					.from(table.user)
					.where(eq(table.user.email, email));

				if (existingEmail.length > 0 && existingEmail[0].id !== event.locals.user.id) {
					return fail(400, { message: 'Email is already taken', username, email, displayName, birthday: birthdayString });
				}
			}

			// Update user information
			await db
				.update(table.user)
				.set({
					username,
					email: email || null,
					displayName: displayName || null,
					birthday,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, event.locals.user.id));

			return { success: true, message: 'Profile updated successfully' };

		} catch (error) {
			console.error('Profile update error:', error);
			return fail(500, { message: 'An error occurred while updating your profile', username, email, displayName, birthday: birthdayString });
		}
	},

	changePassword: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Not logged in' });
		}

		const formData = await event.request.formData();
		const currentPassword = formData.get('currentPassword')?.toString();
		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		// Validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { message: 'All password fields are required' });
		}

		if (newPassword.length < 6 || newPassword.length > 255) {
			return fail(400, { message: 'New password must be between 6 and 255 characters' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { message: 'New password and confirmation do not match' });
		}

		try {
			// Get current password hash
			const [userData] = await db
				.select({ passwordHash: table.user.passwordHash })
				.from(table.user)
				.where(eq(table.user.id, event.locals.user.id));

			if (!userData) {
				return fail(404, { message: 'User not found' });
			}

			// Verify current password
			const validPassword = await verify(userData.passwordHash, currentPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			if (!validPassword) {
				return fail(400, { message: 'Current password is incorrect' });
			}

			// Hash new password
			const newPasswordHash = await hash(newPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			// Update password
			await db
				.update(table.user)
				.set({
					passwordHash: newPasswordHash,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, event.locals.user.id));

			return { success: true, message: 'Password changed successfully', passwordChanged: true };

		} catch (error) {
			console.error('Password change error:', error);
			return fail(500, { message: 'An error occurred while changing your password' });
		}
	},

	uploadAvatar: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Not logged in' });
		}

		const formData = await event.request.formData();
		const file = formData.get('avatar') as File;

		if (!file || file.size === 0) {
			return fail(400, { message: 'Please select an image file' });
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return fail(400, { message: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' });
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			return fail(400, { message: 'File size must be less than 5MB' });
		}

		try {
			// Ensure upload directory exists
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'avatars');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			// Generate unique filename
			const fileExtension = file.name.split('.').pop();
			const fileName = `${randomUUID()}.${fileExtension}`;
			const filePath = join(uploadDir, fileName);

			// Convert file to buffer and save
			const arrayBuffer = await file.arrayBuffer();
			const buffer = new Uint8Array(arrayBuffer);
			writeFileSync(filePath, buffer);

			// Get current profile image to delete old one
			const [currentUser] = await db
				.select({ profileImage: table.user.profileImage })
				.from(table.user)
				.where(eq(table.user.id, event.locals.user.id));

			// Update user profile image in database
			const profileImagePath = `/uploads/avatars/${fileName}`;
			await db
				.update(table.user)
				.set({
					profileImage: profileImagePath,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, event.locals.user.id));

			// Delete old profile image if it exists and is not the default
			if (currentUser?.profileImage && !currentUser.profileImage.includes('default-avatar')) {
				try {
					const oldFilePath = join(process.cwd(), 'static', currentUser.profileImage);
					if (existsSync(oldFilePath)) {
						unlinkSync(oldFilePath);
					}
				} catch (error) {
					console.error('Error deleting old profile image:', error);
					// Don't fail the request if old image deletion fails
				}
			}

			return { success: true, message: 'Profile image updated successfully' };

		} catch (error) {
			console.error('Avatar upload error:', error);
			return fail(500, { message: 'An error occurred while uploading your profile image' });
		}
	}
};
