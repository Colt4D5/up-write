/**
 * Local text analysis utilities to reduce OpenAI API costs
 * Pre-filters and handles simple cases locally before sending to AI
 */

export interface LocalSuggestion {
	type: 'grammar' | 'style' | 'clarity' | 'redundancy';
	text: string;
	startIndex: number;
	endIndex: number;
	suggestion: string;
	confidence: number; // 0-1, higher means more confident
	reason: string;
}

/**
 * Common writing issues that can be detected locally
 */
const LOCAL_PATTERNS = {
	// Basic grammar patterns
	grammar: [
		{
			pattern: /\bthat that\b/gi,
			suggestion: 'that',
			reason: 'Duplicate word',
			confidence: 0.9,
			isFunction: false
		},
		{
			pattern: /\bthe the\b/gi,
			suggestion: 'the',
			reason: 'Duplicate word',
			confidence: 0.9,
			isFunction: false
		},
		{
			pattern: /\band and\b/gi,
			suggestion: 'and',
			reason: 'Duplicate word',
			confidence: 0.9,
			isFunction: false
		},
		{
			pattern: /\bto to\b/gi,
			suggestion: 'to',
			reason: 'Duplicate word',
			confidence: 0.9,
			isFunction: false
		},
		{
			pattern: /\bit's\s+it's\b/gi,
			suggestion: "it's",
			reason: 'Duplicate contraction',
			confidence: 0.85,
			isFunction: false
		},
		{
			pattern: /\bwould of\b/gi,
			suggestion: 'would have',
			reason: 'Incorrect phrase',
			confidence: 0.95,
			isFunction: false
		},
		{
			pattern: /\bcould of\b/gi,
			suggestion: 'could have',
			reason: 'Incorrect phrase',
			confidence: 0.95,
			isFunction: false
		},
		{
			pattern: /\bshould of\b/gi,
			suggestion: 'should have',
			reason: 'Incorrect phrase',
			confidence: 0.95,
			isFunction: false
		}
	],

	// Style improvements
	style: [
		{
			pattern: /\bvery\s+(\w+)/gi,
			suggestion: '', // Will be computed by function
			reason: 'Consider a stronger adjective',
			confidence: 0.7,
			isFunction: true
		},
		{
			pattern: /\ba lot\b/gi,
			suggestion: 'many',
			reason: 'Consider more specific quantifier',
			confidence: 0.6,
			isFunction: false
		},
		{
			pattern: /\bthing\b/gi,
			suggestion: '',
			reason: 'Consider more specific noun',
			confidence: 0.5,
			isFunction: false
		},
		{
			pattern: /\bstuff\b/gi,
			suggestion: '',
			reason: 'Consider more specific noun',
			confidence: 0.5,
			isFunction: false
		}
	],

	// Redundancy patterns
	redundancy: [
		{
			pattern: /\bfree gift\b/gi,
			suggestion: 'gift',
			reason: 'Gifts are inherently free',
			confidence: 0.8,
			isFunction: false
		},
		{
			pattern: /\bexact same\b/gi,
			suggestion: 'same',
			reason: '"Same" already implies exactness',
			confidence: 0.8,
			isFunction: false
		},
		{
			pattern: /\bcompletely finished\b/gi,
			suggestion: 'finished',
			reason: '"Finished" already implies completion',
			confidence: 0.8,
			isFunction: false
		},
		{
			pattern: /\bunexpected surprise\b/gi,
			suggestion: 'surprise',
			reason: 'Surprises are inherently unexpected',
			confidence: 0.8,
			isFunction: false
		}
	],

	// Clarity improvements
	clarity: [
		{
			pattern: /\bin order to\b/gi,
			suggestion: 'to',
			reason: 'Simpler phrasing',
			confidence: 0.7,
			isFunction: false
		},
		{
			pattern: /\bdue to the fact that\b/gi,
			suggestion: 'because',
			reason: 'Simpler phrasing',
			confidence: 0.8,
			isFunction: false
		},
		{
			pattern: /\bat this point in time\b/gi,
			suggestion: 'now',
			reason: 'Simpler phrasing',
			confidence: 0.8,
			isFunction: false
		}
	]
};

/**
 * Enhanced adjectives to replace "very + adjective" patterns
 */
const STRONGER_ADJECTIVES: Record<string, string> = {
	'good': 'excellent',
	'bad': 'terrible',
	'big': 'enormous',
	'small': 'tiny',
	'happy': 'ecstatic',
	'sad': 'devastated',
	'angry': 'furious',
	'tired': 'exhausted',
	'hot': 'scalding',
	'cold': 'freezing',
	'fast': 'rapid',
	'slow': 'sluggish',
	'loud': 'deafening',
	'quiet': 'silent',
	'pretty': 'beautiful',
	'ugly': 'hideous',
	'old': 'ancient',
	'new': 'brand-new',
	'easy': 'effortless',
	'hard': 'challenging'
};

function getStrongerAdjective(adjective: string): string {
	const lower = adjective.toLowerCase();
	return STRONGER_ADJECTIVES[lower] || adjective;
}

/**
 * Analyze text locally for common issues
 */
export function analyzeTextLocally(text: string): LocalSuggestion[] {
	const suggestions: LocalSuggestion[] = [];

	// Process each category of patterns
	Object.entries(LOCAL_PATTERNS).forEach(([type, patterns]) => {
		patterns.forEach(pattern => {
			let match;
			const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
			
			while ((match = regex.exec(text)) !== null) {
				let suggestion: string = '';
				
				// Handle function-based suggestions (like "very" patterns)
				if (pattern.isFunction && match[1]) {
					suggestion = getStrongerAdjective(match[1]);
				} else {
					suggestion = pattern.suggestion;
				}

				suggestions.push({
					type: type as LocalSuggestion['type'],
					text: match[0],
					startIndex: match.index,
					endIndex: match.index + match[0].length,
					suggestion,
					confidence: pattern.confidence,
					reason: pattern.reason
				});

				// Prevent infinite loops with global regexes
				if (!pattern.pattern.global) break;
			}
		});
	});

	return suggestions;
}

/**
 * Determine if text needs AI analysis based on complexity and local findings
 */
export function shouldUseAI(text: string, localSuggestions: LocalSuggestion[]): boolean {
	const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
	
	// Don't use AI for very short text
	if (wordCount < 30) return false;
	
	// Don't use AI if we found many high-confidence local issues
	const highConfidenceIssues = localSuggestions.filter(s => s.confidence > 0.8).length;
	if (highConfidenceIssues > 5) return false;
	
	// Use AI for longer, more complex text
	if (wordCount > 100) return true;
	
	// Use AI if few local issues found (might need deeper analysis)
	return localSuggestions.length < 3;
}

/**
 * Convert local suggestions to the format expected by the editor
 */
export function convertLocalSuggestionsToInline(localSuggestions: LocalSuggestion[]) {
	return localSuggestions
		.filter(s => s.confidence > 0.6) // Only show confident suggestions
		.map(s => ({
			type: s.type,
			text: s.text,
			suggestion: s.suggestion,
			startIndex: s.startIndex,
			endIndex: s.endIndex,
			reason: s.reason,
			confidence: s.confidence
		}));
}

/**
 * Analyze text using hybrid approach - local first, then AI if needed
 */
export async function hybridAnalysis(
	text: string, 
	aiAnalysisFunction?: (text: string) => Promise<any[]>
): Promise<any[]> {
	// First, run local analysis
	const localSuggestions = analyzeTextLocally(text);
	
	// Determine if AI analysis is needed
	const needsAI = shouldUseAI(text, localSuggestions);
	
	if (!needsAI || !aiAnalysisFunction) {
		// Return only local suggestions
		return convertLocalSuggestionsToInline(localSuggestions);
	}
	
	try {
		// Get AI suggestions for complex cases
		const aiSuggestions = await aiAnalysisFunction(text);
		
		// Merge local and AI suggestions, removing duplicates
		const mergedSuggestions = [...convertLocalSuggestionsToInline(localSuggestions)];
		
		// Add AI suggestions that don't overlap with local ones
		aiSuggestions.forEach(aiSugg => {
			const hasOverlap = mergedSuggestions.some(localSugg => 
				Math.abs(localSugg.startIndex - aiSugg.startIndex) < 10
			);
			
			if (!hasOverlap) {
				mergedSuggestions.push(aiSugg);
			}
		});
		
		return mergedSuggestions;
	} catch (error) {
		console.warn('AI analysis failed, using local suggestions only:', error);
		return convertLocalSuggestionsToInline(localSuggestions);
	}
}

/**
 * Check if text has changed significantly enough to warrant re-analysis
 */
export function hasSignificantChange(oldText: string, newText: string): boolean {
	const oldWords = oldText.split(/\s+/).filter(word => word.length > 0);
	const newWords = newText.split(/\s+/).filter(word => word.length > 0);
	
	// Significant if word count changed by 15+ words
	if (Math.abs(oldWords.length - newWords.length) >= 15) return true;
	
	// Or if more than 20% of words changed
	const maxLength = Math.max(oldWords.length, newWords.length);
	if (maxLength === 0) return false;
	
	let commonWords = 0;
	const newWordSet = new Set(newWords);
	oldWords.forEach(word => {
		if (newWordSet.has(word)) commonWords++;
	});
	
	const similarity = commonWords / maxLength;
	return similarity < 0.8; // 20% change threshold
}
