import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatisticsService } from '$lib/server/services';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Not authenticated');
	}

	try {
		const { projectId, wordsWritten, timeSpent } = await request.json();

		if (!projectId || typeof wordsWritten !== 'number' || typeof timeSpent !== 'number') {
			throw error(400, 'Invalid request data');
		}

		const result = await StatisticsService.recordWritingSession(
			locals.user.id,
			projectId,
			wordsWritten,
			timeSpent
		);

		return json({ success: true, data: result });
	} catch (err) {
		console.error('Error recording writing session:', err);
		throw error(500, 'Failed to record writing session');
	}
};
