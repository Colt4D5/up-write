import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	birthday: text('birthday'), // Format: YYYY-MM-DD
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	email: text('email').unique(),
	displayName: text('display_name'),
	profileImage: text('profile_image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const project = sqliteTable('project', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	genre: text('genre'),
	targetWordCount: integer('target_word_count'),
	status: text('status').notNull().$default(() => 'draft'), // 'draft', 'in_progress', 'completed', 'published'
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

export const notebook = sqliteTable('notebook', {
	id: text('id').primaryKey(),
	projectId: text('project_id').notNull().references(() => project.id),
	title: text('title').notNull(),
	type: text('type').notNull(), // 'chapters', 'characters', 'plot', 'research', 'notes'
	parentId: text('parent_id'),
	sortOrder: integer('sort_order').notNull().$default(() => 0),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

export const document = sqliteTable('document', {
	id: text('id').primaryKey(),
	notebookId: text('notebook_id').notNull().references(() => notebook.id),
	title: text('title').notNull(),
	content: text('content').notNull().$default(() => ''),
	wordCount: integer('word_count').notNull().$default(() => 0),
	sortOrder: integer('sort_order').notNull().$default(() => 0),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

export const character = sqliteTable('character', {
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
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

export const aiSuggestion = sqliteTable('ai_suggestion', {
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
	isAccepted: integer('is_accepted', { mode: 'boolean' }).$default(() => false),
	isDismissed: integer('is_dismissed', { mode: 'boolean' }).$default(() => false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

export const writingStatistic = sqliteTable('writing_statistic', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	projectId: text('project_id').references(() => project.id),
	date: text('date').notNull(), // YYYY-MM-DD format
	wordsWritten: integer('words_written').notNull().$default(() => 0),
	timeSpent: integer('time_spent').notNull().$default(() => 0), // in minutes
	sessionsCount: integer('sessions_count').notNull().$default(() => 0),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// Friends system
export const friendship = sqliteTable('friendship', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	friendId: text('friend_id').notNull().references(() => user.id),
	status: text('status').notNull(), // 'pending', 'accepted', 'blocked'
	requestedBy: text('requested_by').notNull().references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// Social feed posts
export const socialPost = sqliteTable('social_post', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	type: text('type').notNull(), // 'achievement', 'milestone', 'project_update', 'challenge'
	title: text('title').notNull(),
	content: text('content'),
	metadata: text('metadata'), // JSON string with additional data
	projectId: text('project_id').references(() => project.id), // Optional reference to project
	visibility: text('visibility').notNull().$default(() => 'friends'), // 'public', 'friends', 'private'
	likesCount: integer('likes_count').notNull().$default(() => 0),
	commentsCount: integer('comments_count').notNull().$default(() => 0),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// Social post likes
export const socialPostLike = sqliteTable('social_post_like', {
	id: text('id').primaryKey(),
	postId: text('post_id').notNull().references(() => socialPost.id),
	userId: text('user_id').notNull().references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// Social post comments
export const socialPostComment = sqliteTable('social_post_comment', {
	id: text('id').primaryKey(),
	postId: text('post_id').notNull().references(() => socialPost.id),
	userId: text('user_id').notNull().references(() => user.id),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// Writing challenges
export const writingChallenge = sqliteTable('writing_challenge', {
	id: text('id').primaryKey(),
	createdBy: text('created_by').notNull().references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	type: text('type').notNull(), // 'word_count', 'daily_streak', 'time_based', 'custom'
	goalValue: integer('goal_value').notNull(), // Target value (words, days, minutes, etc.)
	duration: integer('duration'), // Duration in days (null for indefinite)
	isPublic: integer('is_public', { mode: 'boolean' }).notNull().$default(() => false),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }),
	status: text('status').notNull().$default(() => 'active'), // 'active', 'completed', 'cancelled'
	participantsCount: integer('participants_count').notNull().$default(() => 0),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// Challenge participation
export const challengeParticipation = sqliteTable('challenge_participation', {
	id: text('id').primaryKey(),
	challengeId: text('challenge_id').notNull().references(() => writingChallenge.id),
	userId: text('user_id').notNull().references(() => user.id),
	currentProgress: integer('current_progress').notNull().$default(() => 0),
	isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().$default(() => false),
	joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	completedAt: integer('completed_at', { mode: 'timestamp' })
});

// User privacy settings
export const userPrivacySettings = sqliteTable('user_privacy_settings', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id).unique(),
	shareWritingStats: integer('share_writing_stats', { mode: 'boolean' }).notNull().$default(() => true),
	shareProjects: integer('share_projects', { mode: 'boolean' }).notNull().$default(() => false),
	shareAchievements: integer('share_achievements', { mode: 'boolean' }).notNull().$default(() => true),
	allowFriendRequests: integer('allow_friend_requests', { mode: 'boolean' }).notNull().$default(() => true),
	showOnlineStatus: integer('show_online_status', { mode: 'boolean' }).notNull().$default(() => true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
});

// User achievements 
export const userAchievement = sqliteTable('user_achievement', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	type: text('type').notNull(), // 'first_project', 'word_milestone', 'daily_streak', 'challenge_winner', etc.
	title: text('title').notNull(),
	description: text('description'),
	icon: text('icon'), // Icon identifier
	unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
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
