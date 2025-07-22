import { ProjectService, NotebookService, DocumentService } from '$lib/server/services';
import { AiWritingService } from '$lib/server/ai';
import { SubscriptionService } from '$lib/server/subscription';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
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

		// Get AI access information
		const aiAccessInfo = AiWritingService.getAccessInfo(locals.user);
		const userTierFeatures = SubscriptionService.getTierFeatures(locals.user.subscriptionTier);

		return {
			project,
			notebooks: notebooksWithDocuments,
			user: {
				id: locals.user.id,
				username: locals.user.username,
				displayName: locals.user.displayName,
				subscriptionTier: locals.user.subscriptionTier,
				aiAccessEnabled: locals.user.aiAccessEnabled
			},
			aiAccess: aiAccessInfo,
			tierFeatures: userTierFeatures
		};
	} catch (err) {
		console.error('Project load error:', err);
		throw error(500, 'Failed to load project');
	}
};
