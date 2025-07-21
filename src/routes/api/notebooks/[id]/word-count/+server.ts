import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NotebookService, ProjectService } from '$lib/server/services';

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const notebookId = params.id;
	if (!notebookId) {
		throw error(400, 'Notebook ID is required');
	}

	try {
		// Get the notebook and verify ownership through project
		const notebook = await NotebookService.getNotebook(notebookId);
		if (!notebook) {
			throw error(404, 'Notebook not found');
		}

		// Verify the project belongs to the user
		const project = await ProjectService.getProject(notebook.projectId, locals.user.id);
		if (!project) {
			throw error(403, 'Access denied');
		}

		const { contributesToWordCount } = await request.json();

		if (typeof contributesToWordCount !== 'boolean') {
			throw error(400, 'contributesToWordCount must be a boolean');
		}

		// Update the notebook's word count contribution setting
		const updatedNotebook = await NotebookService.toggleWordCountContribution(
			notebookId, 
			contributesToWordCount
		);

		return json(updatedNotebook);
	} catch (err) {
		console.error('Toggle word count contribution error:', err);
		
		// Re-throw SvelteKit errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		throw error(500, 'Failed to update notebook settings');
	}
};
