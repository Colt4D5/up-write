import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DocumentService, ProjectService } from '$lib/server/services';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const projectId = params.id;
	if (!projectId) {
		throw error(400, 'Project ID is required');
	}

	// Verify the project belongs to the user
	const project = await ProjectService.getProject(projectId, locals.user.id);
	if (!project) {
		throw error(404, 'Project not found');
	}

	try {
		const { notebookId, title, content, description } = await request.json();

		if (!notebookId || !title?.trim()) {
			throw error(400, 'Notebook ID and title are required');
		}

		// Create the document
		const newDocument = await DocumentService.createDocument(notebookId, {
			title: title.trim(),
			content: content || ''
		});

		return json(newDocument);
	} catch (err) {
		console.error('Create document error:', err);
		
		// Re-throw SvelteKit errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		throw error(500, 'Failed to create document');
	}
};
