import type { PageServerLoad } from './$types';
import { ProjectService, StatisticsService } from '$lib/server/services';
import { generateSampleActivityData } from '$lib/utils/sampleData';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	try {
		// Get user's projects with word counts
		const projects = await ProjectService.getUserProjectsWithWordCounts(locals.user.id);

		// Get comprehensive writing statistics
		const stats = await StatisticsService.getUserWritingStatistics(locals.user.id);

		// Get activity data for the grid
		let activityData = await StatisticsService.getUserActivityData(locals.user.id);
		
		// If no real data exists, use sample data for demonstration
		if (activityData.length === 0) {
			activityData = generateSampleActivityData();
		}

		// Calculate additional analytics
		const totalProjectsCompleted = projects.filter(p => p.status === 'completed').length;
		const totalProjectsInProgress = projects.filter(p => p.status === 'in_progress').length;
		const averageWordsPerProject = projects.length > 0 
			? Math.round(projects.reduce((sum, p) => sum + (p.currentWordCount || 0), 0) / projects.length)
			: 0;

		// Calculate streak
		let currentStreak = 0;
		let longestStreak = 0;
		let tempStreak = 0;
		const sortedActivity = activityData.sort((a, b) => b.date.localeCompare(a.date));
		
		// Check current streak from today backwards
		const today = new Date().toISOString().split('T')[0];
		for (let i = 0; i < sortedActivity.length; i++) {
			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() - i);
			const expectedDateStr = expectedDate.toISOString().split('T')[0];
			
			const dayData = sortedActivity.find(d => d.date === expectedDateStr);
			if (dayData && dayData.words > 0) {
				currentStreak++;
			} else if (i === 0) {
				// If today has no activity, check yesterday as today might not be over
				continue;
			} else {
				break;
			}
		}

		// Calculate longest streak
		for (const activity of activityData) {
			if (activity.words > 0) {
				tempStreak++;
				longestStreak = Math.max(longestStreak, tempStreak);
			} else {
				tempStreak = 0;
			}
		}

		return {
			user: locals.user,
			projects,
			stats,
			activityData,
			analytics: {
				totalProjectsCompleted,
				totalProjectsInProgress,
				averageWordsPerProject,
				currentStreak,
				longestStreak
			}
		};
	} catch (error) {
		console.error('Analytics load error:', error);
		return {
			user: locals.user,
			projects: [],
			stats: {
				projectCount: 0,
				totalWords: 0,
				totalTime: 0,
				weeklyWords: 0
			},
			activityData: generateSampleActivityData(),
			analytics: {
				totalProjectsCompleted: 0,
				totalProjectsInProgress: 0,
				averageWordsPerProject: 0,
				currentStreak: 0,
				longestStreak: 0
			}
		};
	}
};
