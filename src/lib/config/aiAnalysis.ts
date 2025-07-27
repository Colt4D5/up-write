/**
 * Configuration for cost-effective AI analysis
 * Adjust these settings based on your budget and usage patterns
 */

export const AI_ANALYSIS_CONFIG = {
	// Timing settings
	DEBOUNCE_DELAY: 5000, // 5 seconds - wait time before analyzing
	CACHE_DURATION: 10 * 60 * 1000, // 10 minutes - how long to cache results
	MIN_ANALYSIS_INTERVAL: 30 * 1000, // 30 seconds - minimum time between API calls per user
	
	// Content thresholds
	MIN_WORDS_FOR_ANALYSIS: 30, // Don't analyze very short text
	MIN_WORDS_FOR_AI: 100, // Use AI only for longer text
	SIGNIFICANT_CHANGE_THRESHOLD: 20, // Word count change to trigger re-analysis
	TEXT_SIMILARITY_THRESHOLD: 0.85, // How similar text must be to skip analysis
	
	// Cost optimization
	USE_GPT_3_5: true, // Use cheaper model when possible
	MAX_TOKENS_PER_REQUEST: 2000, // Limit request size to control costs
	MAX_DAILY_REQUESTS_PER_USER: 50, // Daily limit per user
	BATCH_ANALYSIS: true, // Batch multiple requests when possible
	
	// Local analysis preferences
	LOCAL_CONFIDENCE_THRESHOLD: 0.6, // Only show high-confidence local suggestions
	MAX_LOCAL_SUGGESTIONS: 10, // Limit local suggestions to avoid overwhelming UI
	PREFER_LOCAL_WHEN_MANY_ISSUES: 5, // If many local issues found, skip AI
	
	// Feature flags
	ENABLE_CACHING: true,
	ENABLE_RATE_LIMITING: true,
	ENABLE_HYBRID_ANALYSIS: true,
	ENABLE_BACKGROUND_ANALYSIS: false, // Analyze while user is idle
	
	// API settings (for when you integrate real AI)
	OPENAI_MODEL: 'gpt-3.5-turbo', // Cheaper than GPT-4
	OPENAI_TEMPERATURE: 0.3, // Lower temperature for more consistent results
	OPENAI_MAX_TOKENS: 500, // Limit response size
	
	// Prompts for cost-effective AI analysis
	ANALYSIS_PROMPT: `Analyze this text for writing issues. Focus only on:
1. Clear grammar errors
2. Obvious style improvements  
3. Unclear phrasing
Return max 5 suggestions in JSON format with type, text, suggestion, reason.`,
	
	// User tier limits
	TIER_LIMITS: {
		free: {
			dailyRequests: 5,
			useAI: false,
			localOnly: true
		},
		premium: {
			dailyRequests: 50,
			useAI: true,
			advancedFeatures: false
		},
		pro: {
			dailyRequests: 200,
			useAI: true,
			advancedFeatures: true
		}
	}
};

/**
 * Get configuration for a specific user tier
 */
export function getConfigForTier(tier: 'free' | 'premium' | 'pro') {
	return {
		...AI_ANALYSIS_CONFIG,
		...AI_ANALYSIS_CONFIG.TIER_LIMITS[tier]
	};
}

/**
 * Calculate estimated cost per analysis (in cents)
 */
export function estimateCostPerAnalysis(wordCount: number): number {
	// GPT-3.5-turbo costs approximately $0.002 per 1K tokens
	// Rough estimate: 1 word ≈ 1.3 tokens
	const estimatedTokens = wordCount * 1.3;
	const costPer1KTokens = 0.2; // cents
	return (estimatedTokens / 1000) * costPer1KTokens;
}

/**
 * Check if analysis should use AI based on cost and content
 */
export function shouldUseAIAnalysis(
	text: string, 
	userTier: 'free' | 'premium' | 'pro',
	dailyUsage: number
): boolean {
	const config = getConfigForTier(userTier);
	
	// Check tier permissions
	if (!config.useAI) return false;
	
	// Check daily limits
	if (dailyUsage >= config.dailyRequests) return false;
	
	// Check content length
	const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
	if (wordCount < AI_ANALYSIS_CONFIG.MIN_WORDS_FOR_AI) return false;
	
	// Estimate cost
	const estimatedCost = estimateCostPerAnalysis(wordCount);
	
	// Skip AI for expensive requests unless pro tier
	if (estimatedCost > 1 && userTier !== 'pro') return false;
	
	return true;
}
