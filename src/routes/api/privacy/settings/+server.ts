import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sessionCookieName, validateSessionToken } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userPrivacySettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '$lib/utils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	const sessionToken = cookies.get(sessionCookieName);
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	const { session, user } = await validateSessionToken(sessionToken);
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const settings = await request.json();
		
		// Validate settings structure
		const validKeys = [
			'showWritingStats',
			'showProjects', 
			'showStreaks',
			'showDailyGoals',
			'showTotalWords',
			'allowChallengeInvites',
			'showOnlineStatus'
		];
		
		const filteredSettings: Record<string, boolean> = {};
		for (const key of validKeys) {
			if (typeof settings[key] === 'boolean') {
				filteredSettings[key] = settings[key];
			}
		}

		// Upsert privacy settings
		const existingSettings = await db
			.select()
			.from(userPrivacySettings)
			.where(eq(userPrivacySettings.userId, user.id))
			.limit(1);

		let updatedSettings;
		
		if (existingSettings.length > 0) {
			// Update existing settings
			updatedSettings = await db
				.update(userPrivacySettings)
				.set({
					...filteredSettings,
					updatedAt: new Date()
				})
				.where(eq(userPrivacySettings.userId, user.id))
				.returning();
		} else {
			// Insert new settings
			updatedSettings = await db
				.insert(userPrivacySettings)
				.values({
					id: generateId(),
					userId: user.id,
					...filteredSettings
				})
				.returning();
		}

		return json(updatedSettings[0]);
	} catch (err) {
		console.error('Privacy settings update error:', err);
		throw error(500, 'Failed to update privacy settings');
	}
};

export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	const sessionToken = cookies.get(sessionCookieName);
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	const { session, user } = await validateSessionToken(sessionToken);
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const settings = await db
			.select()
			.from(userPrivacySettings)
			.where(eq(userPrivacySettings.userId, user.id))
			.limit(1);

		// Return default settings if none exist
		if (settings.length === 0) {
			return json({
				showWritingStats: true,
				showProjects: true,
				showStreaks: true,
				showDailyGoals: true,
				showTotalWords: true,
				allowChallengeInvites: true,
				showOnlineStatus: true
			});
		}

		return json(settings[0]);
	} catch (err) {
		console.error('Privacy settings fetch error:', err);
		throw error(500, 'Failed to fetch privacy settings');
	}
};
