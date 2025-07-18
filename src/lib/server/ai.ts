import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import type { AiAnalysisResult, SuggestionType, SuggestionSeverity } from '$lib/types';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export class AiWritingService {
	static async analyzeText(text: string): Promise<AiAnalysisResult> {
		if (!text.trim()) {
			return {
				suggestions: [],
				overallScore: 100,
				wordCount: 0
			};
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

	static async suggestImprovement(originalText: string, context?: string): Promise<string> {
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
		
		// Basic passive voice detection
		const passivePatterns = [
			/\b(was|were|is|are|been|being)\s+\w+ed\b/gi,
			/\b(was|were|is|are|been|being)\s+\w+en\b/gi
		];

		for (const pattern of passivePatterns) {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				suggestions.push({
					type: 'style',
					severity: 'medium',
					message: 'Consider using active voice instead of passive voice for stronger, more direct writing.',
					originalText: match[0],
					startPosition: match.index,
					endPosition: match.index + match[0].length
				});
			}
		}

		// Basic repetition detection
		const wordFreq: Record<string, number> = {};
		const textWords = text.toLowerCase().match(/\b\w+\b/g) || [];
		
		for (const word of textWords) {
			if (word.length > 4) { // Only check longer words
				wordFreq[word] = (wordFreq[word] || 0) + 1;
			}
		}

		for (const [word, count] of Object.entries(wordFreq)) {
			if (count > 3) {
				suggestions.push({
					type: 'style',
					severity: 'low',
					message: `The word "${word}" appears ${count} times. Consider using synonyms for variety.`,
					originalText: word,
					startPosition: text.toLowerCase().indexOf(word),
					endPosition: text.toLowerCase().indexOf(word) + word.length
				});
			}
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
