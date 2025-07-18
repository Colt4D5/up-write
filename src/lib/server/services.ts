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
		return await db.delete(project).where(
			and(eq(project.id, projectId), eq(project.userId, userId))
		);
	}

	private static async createDefaultNotebooks(projectId: string) {
		const defaultNotebooks = [
			{ title: 'Chapters', type: 'chapters' as const },
			{ title: 'Characters', type: 'characters' as const },
			{ title: 'Plot & Structure', type: 'plot' as const },
			{ title: 'Research & Notes', type: 'research' as const },
			{ title: 'General Notes', type: 'notes' as const }
		];

		for (const [index, nb] of defaultNotebooks.entries()) {
			await db.insert(notebook).values({
				id: generateId(),
				projectId,
				title: nb.title,
				type: nb.type,
				sortOrder: index
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
