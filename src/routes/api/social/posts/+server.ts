import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { socialPost } from '$lib/server/db/schema';
import { generateId } from '$lib/utils';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const { type, title, content, metadata, projectId, visibility = 'friends' } = await request.json();

		if (!type || !title) {
			throw error(400, 'Type and title are required');
		}

		const postId = generateId();

		const newPost = await db.insert(socialPost).values({
			id: postId,
			userId: locals.user.id,
			type,
			title,
			content: content || null,
			metadata: metadata ? JSON.stringify(metadata) : null,
			projectId: projectId || null,
			visibility,
		}).returning();

		return json(newPost[0]);
	} catch (err) {
		console.error('Error creating social post:', err);
		if (err instanceof Error && err.message.includes('400')) {
			throw err;
		}
		throw error(500, 'Failed to create post');
	}
};
