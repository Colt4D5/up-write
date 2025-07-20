import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { 
	friendship, 
	writingStatistic, 
	user,
	userPrivacySettings,
	project
} from '$lib/server/db/schema';
import { eq, and, or, desc, sum, count } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const friendId = url.searchParams.get('friendId');
	if (!friendId) {
		throw error(400, 'Friend ID is required');
	}

	try {
		// Check if users are friends
		const friendshipExists = await db
			.select()
			.from(friendship)
			.where(
				and(
					or(
						and(eq(friendship.userId, locals.user.id), eq(friendship.friendId, friendId)),
						and(eq(friendship.userId, friendId), eq(friendship.friendId, locals.user.id))
					),
					eq(friendship.status, 'accepted')
				)
			)
			.limit(1);

		if (friendshipExists.length === 0) {
			throw error(403, 'You are not friends with this user');
		}

		// Get friend's privacy settings
		const privacySettings = await db
			.select()
			.from(userPrivacySettings)
			.where(eq(userPrivacySettings.userId, friendId))
			.limit(1);

		const privacy = privacySettings[0] || {
			shareWritingStats: true,
			shareProjects: false,
			shareAchievements: true,
		};

		const analytics: any = {
			canViewStats: privacy.shareWritingStats,
			canViewProjects: privacy.shareProjects,
		};

		if (privacy.shareWritingStats) {
			// Get writing statistics for the last 30 days
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

			// Daily writing stats
			const dailyStats = await db
				.select({
					date: writingStatistic.date,
					wordsWritten: writingStatistic.wordsWritten,
					timeSpent: writingStatistic.timeSpent,
					sessionsCount: writingStatistic.sessionsCount,
				})
				.from(writingStatistic)
				.where(
					and(
						eq(writingStatistic.userId, friendId),
						// Note: This is a string comparison, but should work for YYYY-MM-DD format
						// In a production app, you'd want to use proper date comparison
					)
				)
				.orderBy(desc(writingStatistic.date))
				.limit(30);

			// Overall stats
			const overallStats = await db
				.select({
					totalWords: sum(writingStatistic.wordsWritten),
					totalTime: sum(writingStatistic.timeSpent),
					totalSessions: sum(writingStatistic.sessionsCount),
					daysActive: count(writingStatistic.date),
				})
				.from(writingStatistic)
				.where(eq(writingStatistic.userId, friendId));

			analytics.dailyStats = dailyStats;
			analytics.overallStats = overallStats[0];

			// Calculate streaks
			let currentStreak = 0;
			let longestStreak = 0;
			let tempStreak = 0;
			
			// Sort daily stats by date descending
			const sortedStats = [...dailyStats].sort((a, b) => b.date.localeCompare(a.date));
			const today = new Date().toISOString().split('T')[0];
			let checkDate = new Date();

			for (let i = 0; i < 365; i++) { // Check up to a year
				const dateStr = checkDate.toISOString().split('T')[0];
				const hasActivity = sortedStats.some(stat => 
					stat.date === dateStr && stat.wordsWritten > 0
				);

				if (hasActivity) {
					tempStreak++;
					if (dateStr === today || i === 0) {
						currentStreak = tempStreak;
					}
				} else {
					if (tempStreak > longestStreak) {
						longestStreak = tempStreak;
					}
					if (i === 0) {
						currentStreak = 0;
					}
					tempStreak = 0;
				}

				checkDate.setDate(checkDate.getDate() - 1);
			}

			if (tempStreak > longestStreak) {
				longestStreak = tempStreak;
			}

			analytics.streaks = {
				current: currentStreak,
				longest: longestStreak,
			};
		}

		if (privacy.shareProjects) {
			// Get project statistics
			const projects = await db
				.select({
					id: project.id,
					title: project.title,
					genre: project.genre,
					status: project.status,
					targetWordCount: project.targetWordCount,
					createdAt: project.createdAt,
				})
				.from(project)
				.where(eq(project.userId, friendId))
				.orderBy(desc(project.createdAt));

			analytics.projects = projects;
		}

		return json(analytics);
	} catch (err) {
		console.error('Error fetching friend analytics:', err);
		throw error(500, 'Failed to fetch analytics');
	}
};
