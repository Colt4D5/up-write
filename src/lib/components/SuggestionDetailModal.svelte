<script lang="ts">
	import { X, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle } from 'lucide-svelte';
	import type { AiAnalysisResult } from '$lib/types';

	interface Props {
		visible: boolean;
		suggestion: AiAnalysisResult['suggestions'][0] | null;
		onClose: () => void;
		onAccept?: () => void;
		onDismiss?: () => void;
	}

	let {
		visible,
		suggestion,
		onClose,
		onAccept,
		onDismiss
	}: Props = $props();

	// Define the same colors as the inline component
	const suggestionColors: Record<string, { background: string; label: string; icon: string }> = {
		spelling: {
			background: 'bg-red-50 border-red-200',
			label: 'Spelling Error',
			icon: 'text-red-500'
		},
		grammar: {
			background: 'bg-blue-50 border-blue-200',
			label: 'Grammar Issue',
			icon: 'text-blue-500'
		},
		passive_voice: {
			background: 'bg-orange-50 border-orange-200',
			label: 'Passive Voice',
			icon: 'text-orange-500'
		},
		weak_language: {
			background: 'bg-yellow-50 border-yellow-200',
			label: 'Weak Language',
			icon: 'text-yellow-600'
		},
		continuity: {
			background: 'bg-purple-50 border-purple-200',
			label: 'Continuity Issue',
			icon: 'text-purple-500'
		},
		style: {
			background: 'bg-green-50 border-green-200',
			label: 'Style Improvement',
			icon: 'text-green-500'
		},
		structure: {
			background: 'bg-indigo-50 border-indigo-200',
			label: 'Structure',
			icon: 'text-indigo-500'
		},
		clarity: {
			background: 'bg-cyan-50 border-cyan-200',
			label: 'Clarity',
			icon: 'text-cyan-500'
		},
		pacing: {
			background: 'bg-pink-50 border-pink-200',
			label: 'Pacing',
			icon: 'text-pink-500'
		},
		repetition: {
			background: 'bg-rose-50 border-rose-200',
			label: 'Repetition',
			icon: 'text-rose-500'
		}
	};

	function getSeverityIcon(severity: string) {
		return severity === 'high' ? AlertCircle : CheckCircle;
	}

	function getSeverityColor(severity: string) {
		switch (severity) {
			case 'high':
				return 'text-red-500';
			case 'medium':
				return 'text-orange-500';
			case 'low':
				return 'text-yellow-600';
			default:
				return 'text-gray-500';
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			if (event.target === event.currentTarget) {
				event.preventDefault();
				onClose();
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible && suggestion}
	<!-- Modal Backdrop -->
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="0"
	>
		<div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
			{#if suggestion}
				{@const colorConfig = suggestionColors[suggestion.type] || suggestionColors.style}
				{@const SeverityIcon = getSeverityIcon(suggestion.severity)}
				
				<!-- Header -->
				<div class="flex items-start justify-between p-6 border-b border-gray-200">
					<div class="flex items-start space-x-3">
						<div class="flex-shrink-0 mt-1">
							<SeverityIcon class="h-5 w-5 {getSeverityColor(suggestion.severity)}" />
						</div>
						
						<div>
							<h3 class="text-lg font-semibold text-gray-900">
								{colorConfig.label}
							</h3>
							<div class="flex items-center space-x-2 mt-1">
								<span class="text-xs font-medium px-2 py-1 rounded-full {colorConfig.background} {colorConfig.icon}">
									{suggestion.type.toUpperCase().replace('_', ' ')}
								</span>
								<span class="text-xs font-medium px-2 py-1 rounded-full {getSeverityColor(suggestion.severity).replace('text-', 'bg-').replace('-500', '-100')} {getSeverityColor(suggestion.severity)}">
									{suggestion.severity.toUpperCase()}
								</span>
							</div>
						</div>
					</div>
					
					<button
						onclick={onClose}
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Close modal"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
			
			<!-- Content -->
			<div class="p-6">
				<!-- Message -->
				<div class="mb-6">
					<h4 class="font-medium text-gray-900 mb-2">Suggestion</h4>
					<p class="text-gray-700 leading-relaxed">{suggestion.message}</p>
				</div>
				
				<!-- Original Text -->
				{#if suggestion.originalText}
					<div class="mb-4">
						<h4 class="font-medium text-gray-900 mb-2">Original Text</h4>
						<div class="p-3 bg-gray-50 border border-gray-200 rounded-md">
							<p class="text-gray-900 italic">"{suggestion.originalText}"</p>
						</div>
					</div>
				{/if}
				
				<!-- Suggested Text -->
				{#if suggestion.suggestedText}
					<div class="mb-6">
						<h4 class="font-medium text-gray-900 mb-2">Suggested Replacement</h4>
						<div class="p-3 bg-green-50 border border-green-200 rounded-md">
							<p class="text-gray-900 font-medium">"{suggestion.suggestedText}"</p>
						</div>
					</div>
				{/if}
				
				<!-- Additional Context (could be added to the suggestion data) -->
				<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h4 class="font-medium text-blue-900 mb-2">Why this matters</h4>
					<p class="text-sm text-blue-800">
						{#if suggestion.type === 'spelling'}
							Correct spelling ensures your writing is professional and easy to read.
						{:else if suggestion.type === 'grammar'}
							Proper grammar helps convey your ideas clearly and professionally.
						{:else if suggestion.type === 'passive_voice'}
							Active voice creates more engaging and direct prose that keeps readers interested.
						{:else if suggestion.type === 'weak_language'}
							Specific, strong language creates more vivid and compelling writing.
						{:else if suggestion.type === 'continuity'}
							Maintaining continuity helps readers follow your story without confusion.
						{:else if suggestion.type === 'style'}
							Consistent style and tone enhance the reading experience.
						{:else if suggestion.type === 'structure'}
							Clear structure makes your writing easier to follow and understand.
						{:else if suggestion.type === 'clarity'}
							Clear writing ensures your readers understand your intended meaning.
						{:else if suggestion.type === 'pacing'}
							Good pacing keeps readers engaged throughout your story.
						{:else if suggestion.type === 'repetition'}
							Reducing unnecessary repetition improves the flow and variety of your writing.
						{:else}
							This suggestion will help improve the overall quality of your writing.
						{/if}
					</p>
				</div>
			</div>
			
			<!-- Actions -->
			<div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
				{#if onDismiss}
					<button
						onclick={() => { onDismiss?.(); onClose(); }}
						class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
					>
						<ThumbsDown class="h-4 w-4" />
						<span>Dismiss</span>
					</button>
				{/if}
				
				{#if onAccept && suggestion.suggestedText}
					<button
						onclick={() => { onAccept?.(); onClose(); }}
						class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
					>
						<ThumbsUp class="h-4 w-4" />
						<span>Accept Change</span>
					</button>
				{:else}
					<button
						onclick={onClose}
						class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span>Got it</span>
					</button>
				{/if}
			</div>
			{/if}
		</div>
	</div>
{/if}
