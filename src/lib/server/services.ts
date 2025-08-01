import { db } from '$lib/server/db';
import { project, notebook, document, character, aiSuggestion, writingStatistic } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateId } from '$lib/utils';
import type { CreateProjectData, CreateNotebookData, CreateDocumentData, CreateCharacterData } from '$lib/types';

export class ProjectService {
	static async createProject(userId: string, data: CreateProjectData) {
		const projectId = generateId();
		
		const [newProject] = await db.insert(project).values({
			id: projectId,
			userId,
			...data,
		}).returning();

		// Create default notebooks for the project
		await this.createDefaultNotebooks(projectId);

		return newProject;
	}

	static async getUserProjects(userId: string) {
		return await db.select().from(project).where(eq(project.userId, userId)).orderBy(desc(project.updatedAt));
	}

	static async getUserProjectsWithWordCounts(userId: string) {
		const userProjects = await db.select().from(project)
			.where(eq(project.userId, userId))
			.orderBy(desc(project.updatedAt));

		// Calculate current word count for each project
		const projectsWithWordCounts = await Promise.all(
			userProjects.map(async (proj) => {
				// Get only notebooks that contribute to word count for this project
				const notebooks = await db.select().from(notebook)
					.where(and(
						eq(notebook.projectId, proj.id),
						eq(notebook.contributesToWordCount, true)
					));

				let currentWordCount = 0;
				
				// Calculate total word count from documents in contributing notebooks only
				for (const nb of notebooks) {
					const documents = await db.select({ wordCount: document.wordCount })
						.from(document)
						.where(eq(document.notebookId, nb.id));
					
					const notebookWordCount = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
					currentWordCount += notebookWordCount;
				}

				return {
					...proj,
					currentWordCount
				};
			})
		);

		return projectsWithWordCounts;
	}

	static async getProject(projectId: string, userId: string) {
		const [proj] = await db.select().from(project).where(
			and(eq(project.id, projectId), eq(project.userId, userId))
		);
		return proj;
	}

	static async updateProject(projectId: string, userId: string, data: Partial<CreateProjectData>) {
		const [updated] = await db.update(project)
			.set({ ...data, updatedAt: new Date() })
			.where(and(eq(project.id, projectId), eq(project.userId, userId)))
			.returning();
		return updated;
	}

	static async deleteProject(projectId: string, userId: string) {
		// First, verify the project belongs to the user
		const [projectToDelete] = await db.select().from(project).where(
			and(eq(project.id, projectId), eq(project.userId, userId))
		);
		
		if (!projectToDelete) {
			throw new Error('Project not found');
		}

		// Delete all related data in the correct order to avoid foreign key constraint issues
		
		// 1. Get all notebooks for this project
		const projectNotebooks = await db.select().from(notebook)
			.where(eq(notebook.projectId, projectId));
		
		// 2. For each notebook, delete all AI suggestions for its documents
		for (const nb of projectNotebooks) {
			const notebookDocuments = await db.select().from(document)
				.where(eq(document.notebookId, nb.id));
			
			for (const doc of notebookDocuments) {
				// Delete AI suggestions for this document
				await db.delete(aiSuggestion).where(eq(aiSuggestion.documentId, doc.id));
			}
			
			// Delete all documents in this notebook
			await db.delete(document).where(eq(document.notebookId, nb.id));
		}
		
		// 3. Delete all notebooks for this project
		await db.delete(notebook).where(eq(notebook.projectId, projectId));
		
		// 4. Delete all characters for this project
		await db.delete(character).where(eq(character.projectId, projectId));
		
		// 5. Delete all writing statistics for this project
		await db.delete(writingStatistic).where(eq(writingStatistic.projectId, projectId));
		
		// 6. Finally, delete the project itself
		return await db.delete(project).where(
			and(eq(project.id, projectId), eq(project.userId, userId))
		);
	}

	private static async createDefaultNotebooks(projectId: string) {
		const defaultNotebooks = [
			{ title: 'Chapters', type: 'chapters' as const, contributesToWordCount: true },
			{ title: 'Characters', type: 'characters' as const, contributesToWordCount: false },
			{ title: 'Plot & Structure', type: 'plot' as const, contributesToWordCount: false },
			{ title: 'Research & Notes', type: 'research' as const, contributesToWordCount: false },
			{ title: 'General Notes', type: 'notes' as const, contributesToWordCount: false }
		];

		for (const [index, nb] of defaultNotebooks.entries()) {
			await db.insert(notebook).values({
				id: generateId(),
				projectId,
				title: nb.title,
				type: nb.type,
				sortOrder: index,
				contributesToWordCount: nb.contributesToWordCount
			});
		}
	}
}

export class NotebookService {
	static async createNotebook(projectId: string, data: CreateNotebookData) {
		const [newNotebook] = await db.insert(notebook).values({
			id: generateId(),
			projectId,
			...data,
		}).returning();
		return newNotebook;
	}

	static async getProjectNotebooks(projectId: string) {
		return await db.select().from(notebook)
			.where(eq(notebook.projectId, projectId))
			.orderBy(notebook.sortOrder);
	}

	static async getNotebook(notebookId: string) {
		const [nb] = await db.select().from(notebook).where(eq(notebook.id, notebookId));
		return nb;
	}

	static async updateNotebook(notebookId: string, data: Partial<CreateNotebookData>) {
		const [updated] = await db.update(notebook)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(notebook.id, notebookId))
			.returning();
		return updated;
	}

	static async toggleWordCountContribution(notebookId: string, contributesToWordCount: boolean) {
		const [updated] = await db.update(notebook)
			.set({ 
				contributesToWordCount,
				updatedAt: new Date() 
			})
			.where(eq(notebook.id, notebookId))
			.returning();
		return updated;
	}

	static async deleteNotebook(notebookId: string) {
		return await db.delete(notebook).where(eq(notebook.id, notebookId));
	}
}

export class DocumentService {
	static async createDocument(notebookId: string, data: CreateDocumentData) {
		const [newDocument] = await db.insert(document).values({
			id: generateId(),
			notebookId,
			...data,
		}).returning();
		return newDocument;
	}

	static async getNotebookDocuments(notebookId: string) {
		return await db.select().from(document)
			.where(eq(document.notebookId, notebookId))
			.orderBy(document.sortOrder);
	}

	static async getDocument(documentId: string) {
		const [doc] = await db.select().from(document).where(eq(document.id, documentId));
		return doc;
	}

	static async updateDocument(documentId: string, data: Partial<CreateDocumentData & { wordCount?: number }>) {
		const [updated] = await db.update(document)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(document.id, documentId))
			.returning();
		return updated;
	}

	static async deleteDocument(documentId: string) {
		return await db.delete(document).where(eq(document.id, documentId));
	}
}

export class CharacterService {
	static async createCharacter(projectId: string, data: CreateCharacterData) {
		const [newCharacter] = await db.insert(character).values({
			id: generateId(),
			projectId,
			...data,
		}).returning();
		return newCharacter;
	}

	static async getProjectCharacters(projectId: string) {
		return await db.select().from(character)
			.where(eq(character.projectId, projectId))
			.orderBy(character.name);
	}

	static async getCharacter(characterId: string) {
		const [char] = await db.select().from(character).where(eq(character.id, characterId));
		return char;
	}

	static async updateCharacter(characterId: string, data: Partial<CreateCharacterData>) {
		const [updated] = await db.update(character)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(character.id, characterId))
			.returning();
		return updated;
	}

	static async deleteCharacter(characterId: string) {
		return await db.delete(character).where(eq(character.id, characterId));
	}
}

export class StatisticsService {
	static async getUserWritingStatistics(userId: string) {
		try {
			// Get all user projects
			const userProjects = await db.select().from(project)
				.where(eq(project.userId, userId));

			// Calculate total words from documents in contributing notebooks only
			let totalWordCount = 0;
			
			// Get only notebooks that contribute to word count for user's projects
			const notebooks = await db.select()
				.from(notebook)
				.innerJoin(project, eq(notebook.projectId, project.id))
				.where(and(
					eq(project.userId, userId),
					eq(notebook.contributesToWordCount, true)
				));

			// Get word count from all documents in those contributing notebooks
			for (const nb of notebooks) {
				const documents = await db.select({ 
					wordCount: document.wordCount
				})
				.from(document)
				.where(eq(document.notebookId, nb.notebook.id));
				
				const notebookWordCount = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
				totalWordCount += notebookWordCount;
			}

			// Get writing statistics for time tracking
			const writingStats = await db.select()
				.from(writingStatistic)
				.where(eq(writingStatistic.userId, userId));

			const totalTime = writingStats.reduce((sum, stat) => sum + stat.timeSpent, 0);

			// Calculate words written this week
			const oneWeekAgo = new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			const weekStart = oneWeekAgo.toISOString().split('T')[0];

			const weeklyStats = writingStats.filter(stat => stat.date >= weekStart);
			const weeklyWords = weeklyStats.reduce((sum, stat) => sum + stat.wordsWritten, 0);

			// console.log('StatisticsService Debug:', {
			// 	totalWordCount,
			// 	weeklyWords,
			// 	writingStatsCount: writingStats.length,
			// 	weeklyStatsCount: weeklyStats.length,
			// 	weekStart,
			// 	recentStats: weeklyStats.slice(0, 3).map(s => ({ date: s.date, words: s.wordsWritten, time: s.timeSpent }))
			// });

			return {
				projectCount: userProjects.length,
				totalWords: totalWordCount,
				totalTime: Math.round(totalTime / 60), // Convert minutes to hours
				weeklyWords
			};
		} catch (error) {
			console.error('Error in getUserWritingStatistics:', error);
			return {
				projectCount: 0,
				totalWords: 0,
				totalTime: 0,
				weeklyWords: 0
			};
		}
	}

	static async getUserActivityData(userId: string) {
		try {
			// Get the last 365 days of writing statistics
			const oneYearAgo = new Date();
			oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
			const yearStart = oneYearAgo.toISOString().split('T')[0];

			const activityStats = await db.select({
				date: writingStatistic.date,
				wordsWritten: writingStatistic.wordsWritten,
				sessionsCount: writingStatistic.sessionsCount
			})
			.from(writingStatistic)
			.where(
				and(
					eq(writingStatistic.userId, userId),
					// Note: SQLite string comparison works for YYYY-MM-DD format
					// This will get all dates >= yearStart
				)
			)
			.orderBy(writingStatistic.date);

			// Group by date and sum up words/sessions across all projects for each day
			const dailyActivity = new Map();
			
			for (const stat of activityStats) {
				if (stat.date >= yearStart) {
					const existing = dailyActivity.get(stat.date) || { date: stat.date, words: 0, sessions: 0 };
					existing.words += stat.wordsWritten;
					existing.sessions += stat.sessionsCount;
					dailyActivity.set(stat.date, existing);
				}
			}

			return Array.from(dailyActivity.values()).sort((a, b) => a.date.localeCompare(b.date));
		} catch (error) {
			console.error('Error in getUserActivityData:', error);
			return [];
		}
	}

	static async recordWritingSession(userId: string, projectId: string, wordsWritten: number, timeSpent: number) {
		const today = new Date().toISOString().split('T')[0];
		
		// Check if there's already a record for today
		const [existingStat] = await db.select()
			.from(writingStatistic)
			.where(
				and(
					eq(writingStatistic.userId, userId),
					eq(writingStatistic.projectId, projectId),
					eq(writingStatistic.date, today)
				)
			);

		if (existingStat) {
			// Update existing record
			return await db.update(writingStatistic)
				.set({
					wordsWritten: existingStat.wordsWritten + wordsWritten,
					timeSpent: existingStat.timeSpent + timeSpent,
					sessionsCount: existingStat.sessionsCount + 1
				})
				.where(eq(writingStatistic.id, existingStat.id))
				.returning();
		} else {
			// Create new record
			return await db.insert(writingStatistic)
				.values({
					id: generateId(),
					userId,
					projectId,
					date: today,
					wordsWritten,
					timeSpent,
					sessionsCount: 1
				})
				.returning();
		}
	}
}
