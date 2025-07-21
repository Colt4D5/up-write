export type NotebookType = 'chapters' | 'characters' | 'plot' | 'research' | 'notes';

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'published';

export type SuggestionType = 'grammar' | 'style' | 'structure' | 'clarity' | 'pacing';

export type SuggestionSeverity = 'low' | 'medium' | 'high';

export interface CreateProjectData {
	title: string;
	description?: string;
	genre?: string;
	targetWordCount?: number;
}

export interface CreateNotebookData {
	title: string;
	type: NotebookType;
	parentId?: string;
	contributesToWordCount?: boolean;
}

export interface CreateDocumentData {
	title: string;
	content?: string;
}

export interface CreateCharacterData {
	name: string;
	description?: string;
	appearance?: string;
	personality?: string;
	backstory?: string;
	goals?: string;
	relationships?: string;
	notes?: string;
}

export interface AiAnalysisResult {
	suggestions: {
		type: SuggestionType;
		severity: SuggestionSeverity;
		message: string;
		originalText: string;
		suggestedText?: string;
		startPosition: number;
		endPosition: number;
	}[];
	overallScore: number;
	wordCount: number;
	readabilityScore?: number;
}

export interface WritingSession {
	startTime: Date;
	wordsWritten: number;
	timeSpent: number; // in minutes
}

export interface ProjectWithWordCount {
	id: string;
	userId: string;
	title: string;
	description?: string;
	genre?: string;
	targetWordCount?: number;
	status: ProjectStatus;
	createdAt: Date;
	updatedAt: Date;
	currentWordCount: number;
}
