import { pgTable, text, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	birthday: text('birthday'), // Format: YYYY-MM-DD
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	email: text('email').unique(),
	displayName: text('display_name'),
	profileImage: text('profile_image'),
	// Subscription and AI access
	subscriptionTier: text('subscription_tier').notNull().default('free'), // 'free', 'premium', 'pro'
	subscriptionStatus: text('subscription_status').notNull().default('active'), // 'active', 'cancelled', 'expired'
	subscriptionExpiresAt: timestamp('subscription_expires_at'),
	aiAccessEnabled: boolean('ai_access_enabled').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const project = pgTable('project', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	genre: text('genre'),
	targetWordCount: integer('target_word_count'),
	status: text('status').notNull().default('draft'), // 'draft', 'in_progress', 'completed', 'published'
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const notebook = pgTable('notebook', {
	id: text('id').primaryKey(),
	projectId: text('project_id').notNull().references(() => project.id),
	title: text('title').notNull(),
	type: text('type').notNull(), // 'chapters', 'characters', 'plot', 'research', 'notes'
	parentId: text('parent_id'),
	sortOrder: integer('sort_order').notNull().default(0),
	contributesToWordCount: boolean('contributes_to_word_count').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const document = pgTable('document', {
	id: text('id').primaryKey(),
	notebookId: text('notebook_id').notNull().references(() => notebook.id),
	title: text('title').notNull(),
	content: text('content').notNull().default(''),
	wordCount: integer('word_count').notNull().default(0),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const character = pgTable('character', {
	id: text('id').primaryKey(),
	projectId: text('project_id').notNull().references(() => project.id),
	name: text('name').notNull(),
	description: text('description'),
	appearance: text('appearance'),
	personality: text('personality'),
	backstory: text('backstory'),
	goals: text('goals'),
	relationships: text('relationships'), // JSON string
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const aiSuggestion = pgTable('ai_suggestion', {
	id: text('id').primaryKey(),
	documentId: text('document_id').notNull().references(() => document.id),
	userId: text('user_id').notNull().references(() => user.id),
	type: text('type').notNull(), // 'grammar', 'style', 'structure', 'clarity', 'pacing'
	severity: text('severity').notNull(), // 'low', 'medium', 'high'
	message: text('message').notNull(),
	originalText: text('original_text').notNull(),
	suggestedText: text('suggested_text'),
	startPosition: integer('start_position').notNull(),
	endPosition: integer('end_position').notNull(),
	isAccepted: boolean('is_accepted').default(false),
	isDismissed: boolean('is_dismissed').default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const writingStatistic = pgTable('writing_statistic', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	projectId: text('project_id').references(() => project.id),
	date: text('date').notNull(), // YYYY-MM-DD format
	wordsWritten: integer('words_written').notNull().default(0),
	timeSpent: integer('time_spent').notNull().default(0), // in minutes
	sessionsCount: integer('sessions_count').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Friends system
export const friendship = pgTable('friendship', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	friendId: text('friend_id').notNull().references(() => user.id),
	status: text('status').notNull(), // 'pending', 'accepted', 'blocked'
	requestedBy: text('requested_by').notNull().references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Social feed posts
export const socialPost = pgTable('social_post', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	type: text('type').notNull(), // 'achievement', 'milestone', 'project_update', 'challenge'
	title: text('title').notNull(),
	content: text('content'),
	metadata: text('metadata'), // JSON string with additional data
	projectId: text('project_id').references(() => project.id), // Optional reference to project
	visibility: text('visibility').notNull().default('friends'), // 'public', 'friends', 'private'
	likesCount: integer('likes_count').notNull().default(0),
	commentsCount: integer('comments_count').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Social post likes
export const socialPostLike = pgTable('social_post_like', {
	id: text('id').primaryKey(),
	postId: text('post_id').notNull().references(() => socialPost.id),
	userId: text('user_id').notNull().references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Social post comments
export const socialPostComment = pgTable('social_post_comment', {
	id: text('id').primaryKey(),
	postId: text('post_id').notNull().references(() => socialPost.id),
	userId: text('user_id').notNull().references(() => user.id),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Writing challenges
export const writingChallenge = pgTable('writing_challenge', {
	id: text('id').primaryKey(),
	createdBy: text('created_by').notNull().references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	type: text('type').notNull(), // 'word_count', 'daily_streak', 'time_based', 'custom'
	goalValue: integer('goal_value').notNull(), // Target value (words, days, minutes, etc.)
	duration: integer('duration'), // Duration in days (null for indefinite)
	isPublic: boolean('is_public').notNull().default(false),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date'),
	status: text('status').notNull().default('active'), // 'active', 'completed', 'cancelled'
	participantsCount: integer('participants_count').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Challenge participation
export const challengeParticipation = pgTable('challenge_participation', {
	id: text('id').primaryKey(),
	challengeId: text('challenge_id').notNull().references(() => writingChallenge.id),
	userId: text('user_id').notNull().references(() => user.id),
	currentProgress: integer('current_progress').notNull().default(0),
	isCompleted: boolean('is_completed').notNull().default(false),
	joinedAt: timestamp('joined_at').notNull().defaultNow(),
	completedAt: timestamp('completed_at')
});

// User privacy settings
export const userPrivacySettings = pgTable('user_privacy_settings', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id).unique(),
	shareWritingStats: boolean('share_writing_stats').notNull().default(true),
	shareProjects: boolean('share_projects').notNull().default(false),
	shareAchievements: boolean('share_achievements').notNull().default(true),
	allowFriendRequests: boolean('allow_friend_requests').notNull().default(true),
	showOnlineStatus: boolean('show_online_status').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// User achievements 
export const userAchievement = pgTable('user_achievement', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	type: text('type').notNull(), // 'first_project', 'word_milestone', 'daily_streak', 'challenge_winner', etc.
	title: text('title').notNull(),
	description: text('description'),
	icon: text('icon'), // Icon identifier
	unlockedAt: timestamp('unlocked_at').notNull().defaultNow()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Project = typeof project.$inferSelect;
export type Notebook = typeof notebook.$inferSelect;
export type Document = typeof document.$inferSelect;
export type Character = typeof character.$inferSelect;
export type AiSuggestion = typeof aiSuggestion.$inferSelect;
export type WritingStatistic = typeof writingStatistic.$inferSelect;
export type Friendship = typeof friendship.$inferSelect;
export type SocialPost = typeof socialPost.$inferSelect;
export type SocialPostLike = typeof socialPostLike.$inferSelect;
export type SocialPostComment = typeof socialPostComment.$inferSelect;
export type WritingChallenge = typeof writingChallenge.$inferSelect;
export type ChallengeParticipation = typeof challengeParticipation.$inferSelect;
export type UserPrivacySettings = typeof userPrivacySettings.$inferSelect;
export type UserAchievement = typeof userAchievement.$inferSelect;
