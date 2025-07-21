import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProjectService } from '$lib/server/services';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const genre = data.get('genre') as string;
		const targetWordCount = data.get('targetWordCount') as string;
		const status = data.get('status') as string;

		if (!title || title.trim().length === 0) {
			return json({
				error: 'Project title is required'
			}, { status: 400 });
		}

		const statusValue = status as 'draft' | 'in_progress' | 'completed' | 'published';
		
		const updatedProject = await ProjectService.updateProject(params.id, locals.user.id, {
			title: title.trim(),
			description: description.trim() || undefined,
			genre: genre.trim() || undefined,
			targetWordCount: targetWordCount ? parseInt(targetWordCount) : undefined,
			status: statusValue || 'draft'
		});

		return json({ 
			success: true, 
			message: 'Project updated successfully!',
			project: updatedProject
		});

	} catch (err) {
		console.error('Project update error:', err);
		
		return json({
			error: 'Failed to update project. Please try again.'
		}, { status: 500 });
	}
};
