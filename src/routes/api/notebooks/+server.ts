import { json } from '@sveltejs/kit';
import { NotebookService } from '$lib/server/services';
import { getUserFromEvent } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	try {
		// Validate user authentication
		const user = await getUserFromEvent(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { projectId, title, type, contributesToWordCount } = await event.request.json();

		// Validate required fields
		if (!projectId || !title || !type) {
			return json(
				{ error: 'Missing required fields: projectId, title, and type are required' },
				{ status: 400 }
			);
		}

		// Validate notebook type
		const validTypes = ['chapters', 'characters', 'plot', 'research', 'notes'];
		if (!validTypes.includes(type)) {
			return json({ error: 'Invalid notebook type' }, { status: 400 });
		}

		// Create the notebook
		const notebook = await NotebookService.createNotebook(projectId, {
			title,
			type,
			contributesToWordCount: contributesToWordCount || false
		});

		return json({ notebook }, { status: 201 });

	} catch (error) {
		console.error('Error creating notebook:', error);
		return json({ error: 'Failed to create notebook' }, { status: 500 });
	}
};
