import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import type { AiAnalysisResult, SuggestionType, SuggestionSeverity } from '$lib/types';
import type { User } from './db/schema';
import { SubscriptionService } from './subscription';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export class AiWritingService {
	/**
	 * Check if AI features are available for the user
	 */
	static isAvailable(user?: User): boolean {
		if (!env.OPENAI_API_KEY) {
			return false;
		}
		
		if (!user) {
			return false;
		}

		const accessInfo = SubscriptionService.checkAiAccess(user);
		return accessInfo.hasAccess;
	}

	/**
	 * Get access information for a user
	 */
	static getAccessInfo(user?: User) {
		if (!user) {
			return {
				hasAccess: false,
				reason: 'not_authenticated',
				tier: 'free'
			};
		}

		return SubscriptionService.checkAiAccess(user);
	}

	static async analyzeText(text: string, user?: User): Promise<AiAnalysisResult> {
		if (!text.trim()) {
			return {
				suggestions: [],
				overallScore: 100,
				wordCount: 0
			};
		}

		// Check access first
		if (!this.isAvailable(user)) {
			// For users without AI access, return basic analysis
			return this.basicAnalysis(text);
		}

		try {
			const completion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: [
					{
						role: 'system',
						content: `You are an expert writing coach and editor. Analyze the provided text for:
						
1. Grammar and spelling errors
2. Passive voice usage (suggest active voice alternatives)
3. Weak or unclear sentence structure
4. Ambiguous phrasing or word choice
5. Pacing and flow issues
6. Clarity and conciseness
7. Style improvements

For each issue you find, provide:
- The exact text that needs improvement
- A clear explanation of the issue
- A suggested replacement (if applicable)
- The position in the text (character start and end positions)
- Severity level (low, medium, high)
- Category (grammar, style, structure, clarity, pacing)

Also provide an overall score (0-100) and basic readability metrics.

Return your analysis as a JSON object with this structure:
{
  "suggestions": [
    {
      "type": "grammar|style|structure|clarity|pacing",
      "severity": "low|medium|high",
      "message": "Clear explanation of the issue",
      "originalText": "exact text with the issue",
      "suggestedText": "proposed replacement (optional)",
      "startPosition": number,
      "endPosition": number
    }
  ],
  "overallScore": number,
  "wordCount": number,
  "readabilityScore": number
}

Focus on actionable, specific feedback that will help the author improve their writing.`
					},
					{
						role: 'user',
						content: text
					}
				],
				temperature: 0.3
			});

			const result = completion.choices[0]?.message?.content;
			if (!result) {
				throw new Error('No response from OpenAI');
			}

			return JSON.parse(result) as AiAnalysisResult;
		} catch (error) {
			console.error('AI analysis error:', error);
			
			// Fallback analysis using basic rules
			return this.basicAnalysis(text);
		}
	}

	static async suggestImprovement(originalText: string, context?: string, user?: User): Promise<string> {
		// Check access first
		if (!this.isAvailable(user)) {
			// Return original text for users without AI access
			return originalText;
		}

		try {
			const completion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: [
					{
						role: 'system',
						content: `You are an expert writing coach. Provide a single, improved version of the given text. Focus on:
						- Converting passive voice to active voice
						- Improving clarity and conciseness
						- Strengthening weak word choices
						- Improving sentence flow and structure
						
						Return only the improved text, nothing else.`
					},
					{
						role: 'user',
						content: context ? `Context: ${context}\n\nText to improve: ${originalText}` : originalText
					}
				],
				temperature: 0.3
			});

			return completion.choices[0]?.message?.content || originalText;
		} catch (error) {
			console.error('AI suggestion error:', error);
			return originalText;
		}
	}

	private static basicAnalysis(text: string): AiAnalysisResult {
		const suggestions: AiAnalysisResult['suggestions'] = [];
		const words = text.trim().split(/\s+/).length;
		
		// Basic spelling errors (common mistakes)
		const spellingPatterns = [
			{ pattern: /\bteh\b/gi, correct: 'the', type: 'spelling' as SuggestionType },
			{ pattern: /\badnwer\b/gi, correct: 'answer', type: 'spelling' as SuggestionType },
			{ pattern: /\brecieve\b/gi, correct: 'receive', type: 'spelling' as SuggestionType },
			{ pattern: /\boccured\b/gi, correct: 'occurred', type: 'spelling' as SuggestionType }
		];

		for (const { pattern, correct, type } of spellingPatterns) {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				suggestions.push({
					type,
					severity: 'high' as SuggestionSeverity,
					message: `Spelling error: "${match[0]}" should be "${correct}".`,
					originalText: match[0],
					suggestedText: correct,
					startPosition: match.index,
					endPosition: match.index + match[0].length
				});
			}
		}
		
		// Basic passive voice detection
		const passivePatterns = [
			/\b(was|were|is|are|been|being)\s+\w+ed\b/gi,
			/\b(was|were|is|are|been|being)\s+\w+en\b/gi
		];

		for (const pattern of passivePatterns) {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				suggestions.push({
					type: 'passive_voice' as SuggestionType,
					severity: 'medium' as SuggestionSeverity,
					message: 'Consider using active voice instead of passive voice for stronger, more direct writing.',
					originalText: match[0],
					startPosition: match.index,
					endPosition: match.index + match[0].length
				});
			}
		}

		// Weak language patterns
		const weakLanguagePatterns = [
			{ pattern: /\bvery\s+\w+/gi, message: 'Consider using a stronger adjective instead of "very + adjective".' },
			{ pattern: /\bquite\s+\w+/gi, message: 'The word "quite" can weaken your statement. Consider removing it or using a stronger word.' },
			{ pattern: /\bsomewhat\b/gi, message: '"Somewhat" is vague. Be more specific.' },
			{ pattern: /\bkind of\b/gi, message: '"Kind of" is informal and vague. Be more precise.' },
			{ pattern: /\bsort of\b/gi, message: '"Sort of" is informal and vague. Be more precise.' }
		];

		for (const { pattern, message } of weakLanguagePatterns) {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				suggestions.push({
					type: 'weak_language' as SuggestionType,
					severity: 'low' as SuggestionSeverity,
					message,
					originalText: match[0],
					startPosition: match.index,
					endPosition: match.index + match[0].length
				});
			}
		}

		// Grammar patterns
		const grammarPatterns = [
			{ pattern: /\bits\s+going\s+to\s+affect/gi, correct: "it's going to affect", message: "Missing apostrophe in contraction." },
			{ pattern: /\byour\s+going\b/gi, correct: "you're going", message: 'Should be "you\'re" (you are).' },
			{ pattern: /\bshould\s+of\b/gi, correct: "should have", message: 'Should be "should have", not "should of".' }
		];

		for (const { pattern, correct, message } of grammarPatterns) {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				suggestions.push({
					type: 'grammar' as SuggestionType,
					severity: 'high' as SuggestionSeverity,
					message,
					originalText: match[0],
					suggestedText: correct,
					startPosition: match.index,
					endPosition: match.index + match[0].length
				});
			}
		}

		// Basic repetition detection
		const wordFreq: Record<string, { count: number; positions: number[] }> = {};
		const textWords = text.toLowerCase().match(/\b\w+\b/g) || [];
		let currentPos = 0;
		
		for (const word of textWords) {
			if (word.length > 4) { // Only check longer words
				const pos = text.toLowerCase().indexOf(word, currentPos);
				if (!wordFreq[word]) {
					wordFreq[word] = { count: 0, positions: [] };
				}
				wordFreq[word].count++;
				wordFreq[word].positions.push(pos);
				currentPos = pos + word.length;
			}
		}

		for (const [word, { count, positions }] of Object.entries(wordFreq)) {
			if (count > 3 && positions.length > 0) {
				suggestions.push({
					type: 'repetition' as SuggestionType,
					severity: 'low' as SuggestionSeverity,
					message: `The word "${word}" appears ${count} times. Consider using synonyms for variety.`,
					originalText: word,
					startPosition: positions[0],
					endPosition: positions[0] + word.length
				});
			}
		}

		// Structure issues - long sentences
		const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
		let sentenceStart = 0;
		
		for (const sentence of sentences) {
			const sentenceWords = sentence.trim().split(/\s+/).length;
			if (sentenceWords > 30) {
				const startPos = text.indexOf(sentence.trim(), sentenceStart);
				suggestions.push({
					type: 'structure' as SuggestionType,
					severity: 'medium' as SuggestionSeverity,
					message: `This sentence is very long (${sentenceWords} words). Consider breaking it into shorter sentences for better readability.`,
					originalText: sentence.trim(),
					startPosition: startPos,
					endPosition: startPos + sentence.trim().length
				});
			}
			sentenceStart += sentence.length + 1;
		}

		return {
			suggestions,
			overallScore: Math.max(50, 100 - suggestions.length * 5),
			wordCount: words,
			readabilityScore: this.calculateBasicReadability(text)
		};
	}

	private static calculateBasicReadability(text: string): number {
		const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
		const words = text.trim().split(/\s+/);
		const avgWordsPerSentence = words.length / sentences.length;
		
		// Simple readability score based on sentence length
		// Ideal is 15-20 words per sentence
		if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
			return 100;
		} else if (avgWordsPerSentence < 15) {
			return Math.max(60, 100 - (15 - avgWordsPerSentence) * 3);
		} else {
			return Math.max(40, 100 - (avgWordsPerSentence - 20) * 2);
		}
	}
}
