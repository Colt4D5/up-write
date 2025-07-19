import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProjectService } from '$lib/server/services';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const { projectId } = await request.json();

		if (!projectId) {
			throw error(400, 'Project ID is required');
		}

		// Verify the project exists and belongs to the user before deleting
		const project = await ProjectService.getProject(projectId, locals.user.id);
		if (!project) {
			throw error(404, 'Project not found');
		}

		// Delete the project
		await ProjectService.deleteProject(projectId, locals.user.id);

		return json({ success: true, message: 'Project deleted successfully' });
	} catch (err) {
		console.error('Delete project error:', err);
		
		// Re-throw SvelteKit errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		throw error(500, 'Failed to delete project');
	}
};
