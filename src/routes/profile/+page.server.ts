import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { hash, verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

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
			age: table.user.age,
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
		const ageString = formData.get('age')?.toString();

		// Validation
		if (!username || username.length < 3 || username.length > 31) {
			return fail(400, { message: 'Username must be between 3 and 31 characters', username, email, displayName, age: ageString });
		}

		if (!/^[a-z0-9_-]+$/.test(username)) {
			return fail(400, { message: 'Username can only contain lowercase letters, numbers, underscores, and hyphens', username, email, displayName, age: ageString });
		}

		if (email && email.length > 0) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return fail(400, { message: 'Please enter a valid email address', username, email, displayName, age: ageString });
			}
		}

		let age: number | null = null;
		if (ageString && ageString.length > 0) {
			age = parseInt(ageString);
			if (isNaN(age) || age < 1 || age > 150) {
				return fail(400, { message: 'Age must be a number between 1 and 150', username, email, displayName, age: ageString });
			}
		}

		try {
			// Check if username is taken by another user
			const existingUser = await db
				.select({ id: table.user.id })
				.from(table.user)
				.where(eq(table.user.username, username));

			if (existingUser.length > 0 && existingUser[0].id !== event.locals.user.id) {
				return fail(400, { message: 'Username is already taken', username, email, displayName, age: ageString });
			}

			// Check if email is taken by another user (if provided)
			if (email && email.length > 0) {
				const existingEmail = await db
					.select({ id: table.user.id })
					.from(table.user)
					.where(eq(table.user.email, email));

				if (existingEmail.length > 0 && existingEmail[0].id !== event.locals.user.id) {
					return fail(400, { message: 'Email is already taken', username, email, displayName, age: ageString });
				}
			}

			// Update user information
			await db
				.update(table.user)
				.set({
					username,
					email: email || null,
					displayName: displayName || null,
					age,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, event.locals.user.id));

			return { success: true, message: 'Profile updated successfully' };

		} catch (error) {
			console.error('Profile update error:', error);
			return fail(500, { message: 'An error occurred while updating your profile', username, email, displayName, age: ageString });
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
	}
};
