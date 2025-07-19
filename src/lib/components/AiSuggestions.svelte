<script lang="ts">
	import { AlertCircle, CheckCircle, X, ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { getSuggestionSeverityColor } from '$lib/utils';
	import type { AiAnalysisResult } from '$lib/types';

	interface Props {
		analysis: AiAnalysisResult | null;
		onAcceptSuggestion?: (index: number) => void;
		onDismissSuggestion?: (index: number) => void;
		isLoading?: boolean;
	}

	let {
		analysis,
		onAcceptSuggestion,
		onDismissSuggestion,
		isLoading = false
	}: Props = $props();

	function getSeverityIcon(severity: string) {
		switch (severity) {
			case 'high':
				return AlertCircle;
			case 'medium':
				return AlertCircle;
			case 'low':
				return AlertCircle;
			default:
				return AlertCircle;
		}
	}

	function getSeverityBgColor(severity: string) {
		switch (severity) {
			case 'high':
				return 'bg-red-50 border-red-200';
			case 'medium':
				return 'bg-orange-50 border-orange-200';
			case 'low':
				return 'bg-yellow-50 border-yellow-200';
			default:
				return 'bg-gray-50 border-gray-200';
		}
	}

	function getTypeLabel(type: string) {
		switch (type) {
			case 'grammar':
				return 'Grammar';
			case 'style':
				return 'Style';
			case 'structure':
				return 'Structure';
			case 'clarity':
				return 'Clarity';
			case 'pacing':
				return 'Pacing';
			default:
				return 'Writing';
		}
	}
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-sm">
	<div class="px-4 py-3 border-b border-gray-200">
		<h3 class="text-lg font-medium text-gray-900">AI Writing Assistant</h3>
		<p class="text-sm text-gray-600 mt-1">Get suggestions to improve your writing</p>
	</div>

	<div class="p-4">
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Analyzing your writing...</span>
			</div>
		{:else if analysis}
			<!-- Overall Score -->
			<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<div class="flex items-center justify-between">
					<div>
						<h4 class="font-medium text-blue-900">Writing Score</h4>
						<p class="text-sm text-blue-700">
							{analysis.wordCount} words • 
							{#if analysis.readabilityScore}
								Readability: {analysis.readabilityScore}/100
							{/if}
						</p>
					</div>
					<div class="text-2xl font-bold text-blue-900">
						{analysis.overallScore}/100
					</div>
				</div>
				<div class="mt-2 w-full bg-blue-200 rounded-full h-2">
					<div 
						class="bg-blue-600 h-2 rounded-full transition-all duration-300"
						style="width: {analysis.overallScore}%"
					></div>
				</div>
			</div>

			<!-- Suggestions -->
			{#if analysis.suggestions.length > 0}
				<div class="space-y-3">
					<h4 class="font-medium text-gray-900">Suggestions ({analysis.suggestions.length})</h4>
					
					{#each analysis.suggestions as suggestion, index}
						{@const SeverityIcon = getSeverityIcon(suggestion.severity)}
						<div class="border rounded-lg p-4 {getSeverityBgColor(suggestion.severity)}">
							<div class="flex items-start justify-between">
								<div class="flex items-start space-x-2 flex-1">
									<div class="mt-0.5">
										<SeverityIcon class="h-4 w-4 {getSuggestionSeverityColor(suggestion.severity)}" />
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center space-x-2 mb-1">
											<span class="text-xs font-medium px-2 py-1 rounded-full bg-white text-gray-700">
												{getTypeLabel(suggestion.type)}
											</span>
											<span class="text-xs font-medium {getSuggestionSeverityColor(suggestion.severity)}">
												{suggestion.severity.toUpperCase()}
											</span>
										</div>
										<p class="text-sm text-gray-900 mb-2">{suggestion.message}</p>
										
										{#if suggestion.originalText}
											<div class="space-y-2">
												<div>
													<span class="text-xs font-medium text-gray-600">Original:</span>
													<p class="text-sm bg-white p-2 rounded border italic">"{suggestion.originalText}"</p>
												</div>
												
												{#if suggestion.suggestedText}
													<div>
														<span class="text-xs font-medium text-gray-600">Suggested:</span>
														<p class="text-sm bg-white p-2 rounded border font-medium">"{suggestion.suggestedText}"</p>
													</div>
												{/if}
											</div>
										{/if}
									</div>
								</div>
								
								<div class="flex items-center space-x-1 ml-2">
									{#if onAcceptSuggestion && suggestion.suggestedText}
										<button
											type="button"
											onclick={() => onAcceptSuggestion?.(index)}
											class="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
											title="Accept suggestion"
										>
											<ThumbsUp class="h-4 w-4" />
										</button>
									{/if}
									
									{#if onDismissSuggestion}
										<button
											type="button"
											onclick={() => onDismissSuggestion?.(index)}
											class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
											title="Dismiss suggestion"
										>
											<X class="h-4 w-4" />
										</button>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-6">
					<CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-3" />
					<h4 class="font-medium text-gray-900 mb-1">Great writing!</h4>
					<p class="text-sm text-gray-600">No suggestions at this time. Keep up the excellent work!</p>
				</div>
			{/if}
		{:else}
			<div class="text-center py-8 text-gray-500">
				<AlertCircle class="h-12 w-12 text-gray-300 mx-auto mb-3" />
				<p>Start writing to get AI-powered suggestions for improving your text.</p>
			</div>
		{/if}
	</div>
</div>
