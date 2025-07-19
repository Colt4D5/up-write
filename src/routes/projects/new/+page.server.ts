import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ProjectService } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const genre = data.get('genre') as string;
		const targetWordCount = data.get('targetWordCount') as string;

		if (!title || title.trim().length === 0) {
			return fail(400, {
				error: 'Project title is required',
				title,
				description,
				genre,
				targetWordCount
			});
		}

		try {
			const project = await ProjectService.createProject(locals.user.id, {
				title: title.trim(),
				description: description.trim() || undefined,
				genre: genre.trim() || undefined,
				targetWordCount: targetWordCount ? parseInt(targetWordCount) : undefined
			});

			throw redirect(302, `/projects/${project.id}`);
		} catch (error) {
			console.error('Project creation error:', error);
			return fail(500, {
				error: 'Failed to create project',
				title,
				description,
				genre,
				targetWordCount
			});
		}
	}
};
