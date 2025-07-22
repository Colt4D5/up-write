<script lang="ts">
	import { HelpCircle, Eye, EyeOff } from 'lucide-svelte';
	import type { AiAnalysisResult, SuggestionType } from '$lib/types';

	interface Props {
		analysis: AiAnalysisResult | null;
		content: string;
		onSuggestionClick?: (suggestionIndex: number) => void;
		showLegend?: boolean;
		onToggleLegend?: () => void;
	}

	let {
		analysis,
		content,
		onSuggestionClick,
		showLegend = false,
		onToggleLegend
	}: Props = $props();

	// Define colors for different suggestion types
	const suggestionColors: Record<SuggestionType, { underline: string; background: string; label: string; description: string }> = {
		spelling: {
			underline: 'decoration-red-500 decoration-wavy',
			background: 'bg-red-100 border-red-300',
			label: 'Spelling Error',
			description: 'Potential spelling mistakes or typos'
		},
		grammar: {
			underline: 'decoration-blue-500 decoration-wavy',
			background: 'bg-blue-100 border-blue-300',
			label: 'Grammar Issue',
			description: 'Grammar errors and syntax issues'
		},
		passive_voice: {
			underline: 'decoration-orange-400 decoration-wavy',
			background: 'bg-orange-100 border-orange-300',
			label: 'Passive Voice',
			description: 'Consider using active voice for stronger writing'
		},
		weak_language: {
			underline: 'decoration-yellow-500 decoration-wavy',
			background: 'bg-yellow-100 border-yellow-300',
			label: 'Weak Language',
			description: 'Vague or weak language that could be more specific'
		},
		continuity: {
			underline: 'decoration-purple-500 decoration-wavy',
			background: 'bg-purple-100 border-purple-300',
			label: 'Continuity Issue',
			description: 'Potential plot holes or continuity problems'
		},
		style: {
			underline: 'decoration-green-500 decoration-wavy',
			background: 'bg-green-100 border-green-300',
			label: 'Style Improvement',
			description: 'Style and tone suggestions'
		},
		structure: {
			underline: 'decoration-indigo-500 decoration-wavy',
			background: 'bg-indigo-100 border-indigo-300',
			label: 'Structure',
			description: 'Sentence and paragraph structure improvements'
		},
		clarity: {
			underline: 'decoration-cyan-500 decoration-wavy',
			background: 'bg-cyan-100 border-cyan-300',
			label: 'Clarity',
			description: 'Unclear or confusing passages'
		},
		pacing: {
			underline: 'decoration-pink-500 decoration-wavy',
			background: 'bg-pink-100 border-pink-300',
			label: 'Pacing',
			description: 'Story pacing and flow issues'
		},
		repetition: {
			underline: 'decoration-rose-500 decoration-wavy',
			background: 'bg-rose-100 border-rose-300',
			label: 'Repetition',
			description: 'Repeated words or phrases'
		}
	};

	// Create marked up content with inline suggestions
	let markedContent = $derived.by(() => {
		if (!analysis || !analysis.suggestions.length) {
			return content;
		}

		// Sort suggestions by start position (descending) to process from end to beginning
		const sortedSuggestions = [...analysis.suggestions]
			.map((suggestion, index) => ({ ...suggestion, originalIndex: index }))
			.sort((a, b) => b.startPosition - a.startPosition);

		let result = content;

		for (const suggestion of sortedSuggestions) {
			const { startPosition, endPosition, type, originalIndex } = suggestion;
			
			// Make sure positions are valid
			if (startPosition >= result.length || endPosition > result.length || startPosition >= endPosition) {
				continue;
			}
			
			const beforeText = result.substring(0, startPosition);
			const suggestionText = result.substring(startPosition, endPosition);
			const afterText = result.substring(endPosition);
			
			const colorConfig = suggestionColors[type] || suggestionColors.style;
			
			// Create a span with underline and click handler
			const markedSpan = `<span 
				class="underline underline-offset-2 ${colorConfig.underline} cursor-pointer hover:bg-opacity-50 transition-colors" 
				data-suggestion-index="${originalIndex}"
				title="${suggestion.message}"
				style="text-decoration-thickness: 2px;"
			>${suggestionText}</span>`;
			
			result = beforeText + markedSpan + afterText;
		}

		return result;
	});

	function handleContentClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const suggestionIndex = target.getAttribute('data-suggestion-index');
		
		if (suggestionIndex !== null && onSuggestionClick) {
			onSuggestionClick(parseInt(suggestionIndex, 10));
		}
	}

	function handleContentKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			const target = event.target as HTMLElement;
			const suggestionIndex = target.getAttribute('data-suggestion-index');
			
			if (suggestionIndex !== null && onSuggestionClick) {
				event.preventDefault();
				onSuggestionClick(parseInt(suggestionIndex, 10));
			}
		}
	}

	// Get unique suggestion types present in current analysis
	let presentTypes = $derived.by(() => {
		if (!analysis || !analysis.suggestions.length) return [];
		const types = new Set(analysis.suggestions.map(s => s.type));
		return Array.from(types).sort();
	});
</script>

<!-- Inline content with suggestions -->
<div 
	class="prose prose-lg max-w-none suggestion-content"
	onclick={handleContentClick}
	onkeydown={handleContentKeydown}
	role="textbox"
	tabindex="0"
>
	{@html markedContent}
</div>

<style>
	:global(.suggestion-content span[data-suggestion-index]) {
		position: relative;
	}
	
	:global(.suggestion-content span[data-suggestion-index]:hover) {
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 2px;
		padding: 1px 2px;
		margin: -1px -2px;
	}
	
	/* Enhanced underline styles for better visibility */
	:global(.suggestion-content .decoration-red-500) {
		text-decoration-color: #ef4444;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-blue-500) {
		text-decoration-color: #3b82f6;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-orange-400) {
		text-decoration-color: #fb923c;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-yellow-500) {
		text-decoration-color: #eab308;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-purple-500) {
		text-decoration-color: #a855f7;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-green-500) {
		text-decoration-color: #22c55e;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-indigo-500) {
		text-decoration-color: #6366f1;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-cyan-500) {
		text-decoration-color: #06b6d4;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-pink-500) {
		text-decoration-color: #ec4899;
		text-decoration-style: wavy;
	}
	
	:global(.suggestion-content .decoration-rose-500) {
		text-decoration-color: #f43f5e;
		text-decoration-style: wavy;
	}
</style>

<!-- Legend Toggle Button -->
{#if presentTypes.length > 0}
	<div class="fixed bottom-4 right-4 z-20">
		<button
			onclick={onToggleLegend}
			class="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-shadow text-sm font-medium text-gray-700 hover:text-gray-900"
			title="Toggle suggestion legend"
		>
			<HelpCircle class="h-4 w-4" />
			<span>Legend</span>
			{#if showLegend}
				<EyeOff class="h-4 w-4" />
			{:else}
				<Eye class="h-4 w-4" />
			{/if}
		</button>
	</div>
{/if}

<!-- Floating Legend -->
{#if showLegend && presentTypes.length > 0}
	<div class="fixed bottom-20 right-4 z-30 bg-white border border-gray-300 rounded-lg shadow-xl max-w-xs">
		<div class="p-3">
			<div class="flex items-center justify-between mb-2">
				<h3 class="font-semibold text-gray-900 text-sm">Suggestion Colors</h3>
				<button
					onclick={onToggleLegend}
					class="text-gray-400 hover:text-gray-600"
				>
					<EyeOff class="h-4 w-4" />
				</button>
			</div>
			
			<div class="space-y-1.5">
				{#each presentTypes as type}
					{@const config = suggestionColors[type]}
					<div class="flex items-center space-x-2 text-xs">
						<div class="flex-shrink-0">
							<div class="w-6 h-0.5 {config.underline.replace('decoration-', 'bg-').replace(' decoration-wavy', '')} rounded"></div>
						</div>
						<div class="min-w-0">
							<div class="font-medium text-gray-900">{config.label}</div>
						</div>
					</div>
				{/each}
			</div>
			
			<div class="mt-2 pt-2 border-t border-gray-200">
				<p class="text-xs text-gray-500">
					Click underlined text for details
				</p>
			</div>
		</div>
	</div>
{/if}
