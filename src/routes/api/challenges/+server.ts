import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { writingChallenge, socialPost } from '$lib/server/db/schema';
import { generateId } from '$lib/utils';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const { 
			title, 
			description, 
			type, 
			goalValue, 
			duration, 
			isPublic = false,
			startDate,
			endDate
		} = await request.json();

		if (!title || !type || !goalValue || !startDate) {
			throw error(400, 'Title, type, goal value, and start date are required');
		}

		const challengeId = generateId();

		const newChallenge = await db.insert(writingChallenge).values({
			id: challengeId,
			createdBy: locals.user.id,
			title,
			description: description || null,
			type,
			goalValue,
			duration: duration || null,
			isPublic,
			startDate: new Date(startDate),
			endDate: endDate ? new Date(endDate) : null,
		}).returning();

		// Create a social post about the new challenge
		await db.insert(socialPost).values({
			id: generateId(),
			userId: locals.user.id,
			type: 'challenge',
			title: `Created a new writing challenge: ${title}`,
			content: description,
			metadata: JSON.stringify({
				challengeId,
				type,
				goalValue,
				duration,
			}),
			visibility: isPublic ? 'public' : 'friends',
		});

		return json(newChallenge[0]);
	} catch (err) {
		console.error('Error creating challenge:', err);
		if (err instanceof Error && err.message.includes('400')) {
			throw err;
		}
		throw error(500, 'Failed to create challenge');
	}
};
