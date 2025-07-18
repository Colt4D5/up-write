import type { PageServerLoad } from './$types';
import { ProjectService } from '$lib/server/services';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/demo/lucia/login');
	}

	const projects = await ProjectService.getUserProjects(locals.user.id);

	return {
		projects
	};
};
