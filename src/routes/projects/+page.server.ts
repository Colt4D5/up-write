import type { PageServerLoad } from './$types';
import { ProjectService } from '$lib/server/services';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const projects = await ProjectService.getUserProjectsWithWordCounts(locals.user.id);

	return {
		projects
	};
};
