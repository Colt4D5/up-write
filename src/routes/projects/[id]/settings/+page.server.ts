import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
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
