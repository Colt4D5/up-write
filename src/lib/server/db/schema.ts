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

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Project = typeof project.$inferSelect;
export type Notebook = typeof notebook.$inferSelect;
export type Document = typeof document.$inferSelect;
export type Character = typeof character.$inferSelect;
export type AiSuggestion = typeof aiSuggestion.$inferSelect;
export type WritingStatistic = typeof writingStatistic.$inferSelect;
