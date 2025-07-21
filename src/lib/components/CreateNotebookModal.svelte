<script lang="ts">
	import { X, BookOpen } from 'lucide-svelte';
	import type { NotebookType } from '$lib/types';

	export let visible: boolean;
	export let onClose: () => void;
	export let onSubmit: (data: { title: string; type: NotebookType; contributesToWordCount: boolean }) => void;
	export let isSubmitting: boolean = false;

	let title = '';
	let type: NotebookType = 'notes';
	let contributesToWordCount = false;

	const notebookTypes: { value: NotebookType; label: string; description: string }[] = [
		{ 
			value: 'chapters', 
			label: 'Chapters', 
			description: 'Main story content organized by chapters' 
		},
		{ 
			value: 'characters', 
			label: 'Characters', 
			description: 'Character profiles, backstories, and development notes' 
		},
		{ 
			value: 'plot', 
			label: 'Plot', 
			description: 'Plot outlines, story arcs, and narrative structure' 
		},
		{ 
			value: 'research', 
			label: 'Research', 
			description: 'Research notes, references, and background information' 
		},
		{ 
			value: 'notes', 
			label: 'Notes', 
			description: 'General notes and miscellaneous thoughts' 
		}
	];

	function handleSubmit() {
		if (!title.trim()) return;
		
		onSubmit({
			title: title.trim(),
			type,
			contributesToWordCount
		});
		
		// Reset form
		title = '';
		type = 'notes';
		contributesToWordCount = false;
	}

	function handleClose() {
		// Reset form on close
		title = '';
		type = 'notes';
		contributesToWordCount = false;
		onClose();
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if visible}
	<!-- Modal backdrop -->
	<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
		<!-- Modal content -->
		<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<BookOpen class="h-5 w-5 text-blue-600" />
					<h2 class="text-lg font-semibold text-gray-900">Create New Notebook</h2>
				</div>
				<button 
					onclick={handleClose}
					class="text-gray-400 hover:text-gray-600 transition-colors"
					disabled={isSubmitting}
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="p-6 space-y-6">
				<!-- Title -->
				<div>
					<label for="notebook-title" class="block text-sm font-medium text-gray-700 mb-2">
						Notebook Title *
					</label>
					<input
						id="notebook-title"
						type="text"
						bind:value={title}
						placeholder="Enter notebook title..."
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						disabled={isSubmitting}
						required
					/>
				</div>

				<!-- Type -->
				<div>
					<fieldset>
						<legend class="block text-sm font-medium text-gray-700 mb-3">
							Notebook Type *
						</legend>
						<div class="grid grid-cols-2 gap-3">
						{#each notebookTypes as notebookType}
							<label class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
								<input
									type="radio"
									bind:group={type}
									value={notebookType.value}
									class="mt-1 text-blue-600 focus:ring-blue-500"
									disabled={isSubmitting}
								/>
								<div class="flex-1 min-w-0">
									<div class="font-medium text-gray-900 text-sm">{notebookType.label}</div>
									<div class="text-xs text-gray-500 leading-tight">{notebookType.description}</div>
								</div>
							</label>
						{/each}
					</div>
					</fieldset>
				</div>

				<!-- Word Count Contribution -->
				<div class="bg-blue-50 p-4 rounded-lg">
					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={contributesToWordCount}
							class="mt-1 text-blue-600 focus:ring-blue-500 rounded"
							disabled={isSubmitting}
						/>
						<div>
							<div class="font-medium text-gray-900 text-sm">
								Count towards project word count
							</div>
							<div class="text-sm text-gray-600 mt-1">
								Check this if documents in this notebook should contribute to your project's total word count goal.
								Usually enabled for main content like chapters, but disabled for notes and research.
							</div>
						</div>
					</label>
				</div>

				<!-- Actions -->
				<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						onclick={handleClose}
						class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isSubmitting || !title.trim()}
					>
						{isSubmitting ? 'Creating...' : 'Create Notebook'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
