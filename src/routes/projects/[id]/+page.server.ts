import { ProjectService, NotebookService, DocumentService } from '$lib/server/services';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/demo/lucia/login');
	}

	const projectId = params.id;
	
	try {
		const project = await ProjectService.getProject(projectId, locals.user.id);
		
		if (!project) {
			throw error(404, 'Project not found');
		}

		const notebooks = await NotebookService.getProjectNotebooks(projectId);
		
		// Get documents for each notebook
		const notebooksWithDocuments = await Promise.all(
			notebooks.map(async (notebook) => {
				const documents = await DocumentService.getNotebookDocuments(notebook.id);
				return { ...notebook, documents };
			})
		);

		return {
			project,
			notebooks: notebooksWithDocuments
		};
	} catch (err) {
		console.error('Project load error:', err);
		throw error(500, 'Failed to load project');
	}
};
