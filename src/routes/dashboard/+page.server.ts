import type { PageServerLoad } from './$types';
import { ProjectService } from '$lib/server/services';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		throw redirect(302, '/demo/lucia/login');
	}

	try {
		// Get user's recent projects
		const recentProjects = await ProjectService.getUserProjects(locals.user.id);

		// Calculate basic stats
		const stats = {
			projectCount: recentProjects.length,
			totalWords: 0, // We'll calculate this properly later
			totalTime: 0,
			weeklyWords: 0
		};

		return {
			user: locals.user,
			recentProjects: recentProjects.slice(0, 5),
			stats
		};
	} catch (error) {
		console.error('Dashboard load error:', error);
		return {
			user: locals.user,
			recentProjects: [],
			stats: {
				projectCount: 0,
				totalWords: 0,
				totalTime: 0,
				weeklyWords: 0
			}
		};
	}
};
