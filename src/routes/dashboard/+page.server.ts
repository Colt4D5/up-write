import type { PageServerLoad } from './$types';
import { ProjectService, StatisticsService } from '$lib/server/services';
import { generateSampleActivityData } from '$lib/utils/sampleData';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	try {
		// Get user's recent projects
		const recentProjects = await ProjectService.getUserProjects(locals.user.id);

		// Get comprehensive writing statistics
		const stats = await StatisticsService.getUserWritingStatistics(locals.user.id);

		// Get activity data for the grid
		let activityData = await StatisticsService.getUserActivityData(locals.user.id);
		
		// If no real data exists, use sample data for demonstration
		if (activityData.length === 0) {
			activityData = generateSampleActivityData();
		}

		return {
			user: locals.user,
			recentProjects: recentProjects.slice(0, 5),
			stats,
			activityData
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
			},
			activityData: generateSampleActivityData() // Use sample data on error too
		};
	}
};
