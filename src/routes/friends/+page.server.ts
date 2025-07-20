import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { 
	friendship, 
	socialPost, 
	socialPostLike, 
	socialPostComment, 
	user, 
	writingStatistic,
	userPrivacySettings,
	userAchievement,
	writingChallenge,
	challengeParticipation
} from '$lib/server/db/schema';
import { eq, and, or, desc, sql, inArray, ne } from 'drizzle-orm';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userId = locals.user.id;

	// Get friends (accepted friendships)
	const friendsQuery = await db
		.select({
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			profileImage: user.profileImage,
			createdAt: user.createdAt,
			friendshipId: friendship.id,
			friendshipStatus: friendship.status,
			isOnline: sql<boolean>`false`.as('isOnline'), // Placeholder for online status
		})
		.from(friendship)
		.innerJoin(user, or(
			and(eq(friendship.userId, userId), eq(user.id, friendship.friendId)),
			and(eq(friendship.friendId, userId), eq(user.id, friendship.userId))
		))
		.where(
			and(
				or(eq(friendship.userId, userId), eq(friendship.friendId, userId)),
				eq(friendship.status, 'accepted')
			)
		);

	// Get pending friend requests (both sent and received)
	const sentRequestsQuery = await db
		.select({
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			profileImage: user.profileImage,
			friendshipId: friendship.id,
			requestedAt: friendship.createdAt,
		})
		.from(friendship)
		.innerJoin(user, eq(user.id, friendship.friendId))
		.where(
			and(
				eq(friendship.userId, userId),
				eq(friendship.status, 'pending'),
				eq(friendship.requestedBy, userId)
			)
		);

	const receivedRequestsQuery = await db
		.select({
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			profileImage: user.profileImage,
			friendshipId: friendship.id,
			requestedAt: friendship.createdAt,
		})
		.from(friendship)
		.innerJoin(user, eq(user.id, friendship.userId))
		.where(
			and(
				eq(friendship.friendId, userId),
				eq(friendship.status, 'pending'),
				ne(friendship.requestedBy, userId)
			)
		);

	// Get friend IDs for social feed filtering
	const friendIds = friendsQuery.map(f => f.id);
	friendIds.push(userId); // Include user's own posts

	// Get social feed posts
	let socialFeedPosts: any[] = [];
	if (friendIds.length > 0) {
		const postsQuery = await db
			.select({
				id: socialPost.id,
				type: socialPost.type,
				title: socialPost.title,
				content: socialPost.content,
				metadata: socialPost.metadata,
				likesCount: socialPost.likesCount,
				commentsCount: socialPost.commentsCount,
				createdAt: socialPost.createdAt,
				authorId: user.id,
				authorUsername: user.username,
				authorDisplayName: user.displayName,
				authorProfileImage: user.profileImage,
				isLikedByUser: sql<boolean>`false`.as('isLikedByUser'), // Will be updated below
			})
			.from(socialPost)
			.innerJoin(user, eq(user.id, socialPost.userId))
			.where(
				and(
					inArray(socialPost.userId, friendIds),
					or(
						eq(socialPost.visibility, 'public'),
						eq(socialPost.visibility, 'friends')
					)
				)
			)
			.orderBy(desc(socialPost.createdAt))
			.limit(50);

		// Check which posts are liked by the current user
		if (postsQuery.length > 0) {
			const postIds = postsQuery.map(p => p.id);
			const userLikes = await db
				.select({ postId: socialPostLike.postId })
				.from(socialPostLike)
				.where(
					and(
						inArray(socialPostLike.postId, postIds),
						eq(socialPostLike.userId, userId)
					)
				);

			const likedPostIds = new Set(userLikes.map(l => l.postId));
			socialFeedPosts = postsQuery.map(post => ({
				...post,
				isLikedByUser: likedPostIds.has(post.id)
			}));
		}
	}

	// Get recent achievements for friends
	let friendAchievements: any[] = [];
	if (friendIds.length > 0) {
		friendAchievements = await db
			.select({
				id: userAchievement.id,
				type: userAchievement.type,
				title: userAchievement.title,
				description: userAchievement.description,
				icon: userAchievement.icon,
				unlockedAt: userAchievement.unlockedAt,
				userId: user.id,
				username: user.username,
				displayName: user.displayName,
				profileImage: user.profileImage,
			})
			.from(userAchievement)
			.innerJoin(user, eq(user.id, userAchievement.userId))
			.where(inArray(userAchievement.userId, friendIds))
			.orderBy(desc(userAchievement.unlockedAt))
			.limit(20);
	}

	// Get writing challenges
	const challenges = await db
		.select({
			id: writingChallenge.id,
			title: writingChallenge.title,
			description: writingChallenge.description,
			type: writingChallenge.type,
			goalValue: writingChallenge.goalValue,
			duration: writingChallenge.duration,
			startDate: writingChallenge.startDate,
			endDate: writingChallenge.endDate,
			status: writingChallenge.status,
			participantsCount: writingChallenge.participantsCount,
			createdBy: writingChallenge.createdBy,
			createdAt: writingChallenge.createdAt,
			creatorUsername: user.username,
			creatorDisplayName: user.displayName,
			isParticipating: sql<boolean>`false`.as('isParticipating'),
		})
		.from(writingChallenge)
		.innerJoin(user, eq(user.id, writingChallenge.createdBy))
		.where(
			or(
				eq(writingChallenge.isPublic, true),
				inArray(writingChallenge.createdBy, friendIds)
			)
		)
		.orderBy(desc(writingChallenge.createdAt))
		.limit(20);

	// Check which challenges the user is participating in
	if (challenges.length > 0) {
		const challengeIds = challenges.map(c => c.id);
		const participations = await db
			.select({ challengeId: challengeParticipation.challengeId })
			.from(challengeParticipation)
			.where(
				and(
					inArray(challengeParticipation.challengeId, challengeIds),
					eq(challengeParticipation.userId, userId)
				)
			);

		const participatingChallengeIds = new Set(participations.map(p => p.challengeId));
		challenges.forEach(challenge => {
			challenge.isParticipating = participatingChallengeIds.has(challenge.id);
		});
	}

	return {
		friends: friendsQuery,
		sentRequests: sentRequestsQuery,
		receivedRequests: receivedRequestsQuery,
		socialFeed: socialFeedPosts,
		friendAchievements,
		challenges,
	};
};

export const actions: Actions = {
	sendFriendRequest: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const targetUsername = data.get('username') as string;

		if (!targetUsername) {
			return { success: false, error: 'Username is required' };
		}

		// Find the target user
		const targetUsers = await db
			.select()
			.from(user)
			.where(eq(user.username, targetUsername))
			.limit(1);

		if (targetUsers.length === 0) {
			return { success: false, error: 'User not found' };
		}

		const targetUser = targetUsers[0];

		// Check if they're trying to add themselves
		if (targetUser.id === locals.user.id) {
			return { success: false, error: 'You cannot add yourself as a friend' };
		}

		// Check if a friendship already exists
		const existingFriendship = await db
			.select()
			.from(friendship)
			.where(
				or(
					and(eq(friendship.userId, locals.user.id), eq(friendship.friendId, targetUser.id)),
					and(eq(friendship.userId, targetUser.id), eq(friendship.friendId, locals.user.id))
				)
			)
			.limit(1);

		if (existingFriendship.length > 0) {
			const status = existingFriendship[0].status;
			if (status === 'accepted') {
				return { success: false, error: 'You are already friends with this user' };
			} else if (status === 'pending') {
				return { success: false, error: 'A friend request is already pending' };
			}
		}

		// Check target user's privacy settings
		const privacySettings = await db
			.select()
			.from(userPrivacySettings)
			.where(eq(userPrivacySettings.userId, targetUser.id))
			.limit(1);

		if (privacySettings.length > 0 && !privacySettings[0].allowFriendRequests) {
			return { success: false, error: 'This user is not accepting friend requests' };
		}

		// Create the friend request
		await db.insert(friendship).values({
			id: generateId(),
			userId: locals.user.id,
			friendId: targetUser.id,
			status: 'pending',
			requestedBy: locals.user.id,
		});

		return { success: true };
	},

	acceptFriendRequest: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const friendshipId = data.get('friendshipId') as string;

		if (!friendshipId) {
			return { success: false, error: 'Friendship ID is required' };
		}

		// Update the friendship status
		await db
			.update(friendship)
			.set({ 
				status: 'accepted',
				updatedAt: new Date()
			})
			.where(
				and(
					eq(friendship.id, friendshipId),
					eq(friendship.friendId, locals.user.id),
					eq(friendship.status, 'pending')
				)
			);

		return { success: true };
	},

	declineFriendRequest: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const friendshipId = data.get('friendshipId') as string;

		if (!friendshipId) {
			return { success: false, error: 'Friendship ID is required' };
		}

		// Delete the friendship request
		await db
			.delete(friendship)
			.where(
				and(
					eq(friendship.id, friendshipId),
					eq(friendship.friendId, locals.user.id),
					eq(friendship.status, 'pending')
				)
			);

		return { success: true };
	},

	removeFriend: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const friendshipId = data.get('friendshipId') as string;

		if (!friendshipId) {
			return { success: false, error: 'Friendship ID is required' };
		}

		// Delete the friendship
		await db
			.delete(friendship)
			.where(
				and(
					eq(friendship.id, friendshipId),
					or(
						eq(friendship.userId, locals.user.id),
						eq(friendship.friendId, locals.user.id)
					),
					eq(friendship.status, 'accepted')
				)
			);

		return { success: true };
	},

	likePost: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const postId = data.get('postId') as string;

		if (!postId) {
			return { success: false, error: 'Post ID is required' };
		}

		// Check if already liked
		const existingLike = await db
			.select()
			.from(socialPostLike)
			.where(
				and(
					eq(socialPostLike.postId, postId),
					eq(socialPostLike.userId, locals.user.id)
				)
			)
			.limit(1);

		if (existingLike.length > 0) {
			// Unlike the post
			await db
				.delete(socialPostLike)
				.where(
					and(
						eq(socialPostLike.postId, postId),
						eq(socialPostLike.userId, locals.user.id)
					)
				);

			// Decrement likes count
			await db
				.update(socialPost)
				.set({ likesCount: sql`${socialPost.likesCount} - 1` })
				.where(eq(socialPost.id, postId));
		} else {
			// Like the post
			await db.insert(socialPostLike).values({
				id: generateId(),
				postId,
				userId: locals.user.id,
			});

			// Increment likes count
			await db
				.update(socialPost)
				.set({ likesCount: sql`${socialPost.likesCount} + 1` })
				.where(eq(socialPost.id, postId));
		}

		return { success: true };
	},

	joinChallenge: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const challengeId = data.get('challengeId') as string;

		if (!challengeId) {
			return { success: false, error: 'Challenge ID is required' };
		}

		// Check if already participating
		const existingParticipation = await db
			.select()
			.from(challengeParticipation)
			.where(
				and(
					eq(challengeParticipation.challengeId, challengeId),
					eq(challengeParticipation.userId, locals.user.id)
				)
			)
			.limit(1);

		if (existingParticipation.length > 0) {
			return { success: false, error: 'Already participating in this challenge' };
		}

		// Join the challenge
		await db.insert(challengeParticipation).values({
			id: generateId(),
			challengeId,
			userId: locals.user.id,
		});

		// Increment participants count
		await db
			.update(writingChallenge)
			.set({ participantsCount: sql`${writingChallenge.participantsCount} + 1` })
			.where(eq(writingChallenge.id, challengeId));

		return { success: true };
	},
};
