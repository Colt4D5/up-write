import { error, redirect, fail, json } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ProjectService } from '$lib/server/services';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const project = await ProjectService.getProject(params.id, locals.user.id);
	
	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) {
			// For async requests, return JSON instead of redirecting
			if (request.headers.get('accept')?.includes('application/json')) {
				return json({ error: 'Not authenticated' }, { status: 401 });
			}
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const genre = data.get('genre') as string;
		const targetWordCount = data.get('targetWordCount') as string;
		const status = data.get('status') as string;

		if (!title || title.trim().length === 0) {
			const errorResponse = {
				error: 'Project title is required',
				title,
				description,
				genre,
				targetWordCount,
				status
			};
			
			// For async requests, return JSON
			if (request.headers.get('accept')?.includes('application/json')) {
				return json(errorResponse, { status: 400 });
			}
			return fail(400, errorResponse);
		}

		try {
			const statusValue = status as 'draft' | 'in_progress' | 'completed' | 'published';
			
			const updatedProject = await ProjectService.updateProject(params.id, locals.user.id, {
				title: title.trim(),
				description: description.trim() || undefined,
				genre: genre.trim() || undefined,
				targetWordCount: targetWordCount ? parseInt(targetWordCount) : undefined,
				status: statusValue || 'draft'
			});

			// For async requests, return success JSON
			if (request.headers.get('accept')?.includes('application/json')) {
				return json({ 
					success: true, 
					message: 'Project updated successfully',
					project: updatedProject
				});
			}

			// For traditional form submission, redirect
			throw redirect(302, `/projects/${params.id}`);
		} catch (err) {
			// Re-throw SvelteKit redirects - they should not be caught as errors
			if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
				throw err;
			}
			
			console.error('Project update error:', err);
			
			const errorResponse = {
				error: 'Failed to update project. Please try again.',
				title,
				description,
				genre,
				targetWordCount,
				status
			};

			// For async requests, return JSON error
			if (request.headers.get('accept')?.includes('application/json')) {
				return json(errorResponse, { status: 500 });
			}
			return fail(500, errorResponse);
		}
	}
};
