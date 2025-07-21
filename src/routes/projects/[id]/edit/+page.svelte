<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Book, Target, Save, Trash2, Check, X, Loader2 } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { formatDate } from '$lib/utils';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const genres = [
		'Fiction',
		'Non-Fiction',
		'Fantasy',
		'Science Fiction',
		'Mystery',
		'Romance',
		'Thriller',
		'Historical Fiction',
		'Literary Fiction',
		'Young Adult',
		'Memoir',
		'Biography',
		'Self-Help',
		'Poetry',
		'Other'
	];

	const statuses = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'published', label: 'Published' }
	];

	// Form state
	let isSubmitting = $state(false);
	let saveMessage = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let formElement = $state<HTMLFormElement>();

	// Use form data if available (from validation errors), otherwise use project data
	const currentTitle = $derived(form?.title ?? data.project.title);
	const currentDescription = $derived(form?.description ?? data.project.description ?? '');
	const currentGenre = $derived(form?.genre ?? data.project.genre ?? '');
	const currentTargetWordCount = $derived(form?.targetWordCount ?? data.project.targetWordCount?.toString() ?? '');
	const currentStatus = $derived(form?.status ?? data.project.status);

	// Auto-hide success messages after 5 seconds
	$effect(() => {
		if (saveMessage && saveMessage.type === 'success') {
			const timer = setTimeout(() => {
				saveMessage = null;
			}, 5000);
			
			return () => clearTimeout(timer);
		}
	});

	async function handleAsyncSave(formData: FormData) {
		isSubmitting = true;
		saveMessage = null;

		console.log('handleAsyncSave called with:', Array.from(formData.entries()));

		try {
			const response = await fetch(`/projects/${data.project.id}/edit`, {
				method: 'POST',
				body: formData
			});

			console.log('Response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('HTTP Error Response:', errorText);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('API Response:', result);

			if (result.success) {
				saveMessage = {
					type: 'success',
					text: result.message || 'Project updated successfully!'
				};
				// Update the project data in place
				if (result.project) {
					data.project = { ...data.project, ...result.project };
				}
			} else {
				saveMessage = {
					type: 'error',
					text: result.error || 'Failed to update project. Please try again.'
				};
			}
		} catch (error) {
			console.error('Save error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Please check your connection and try again.';
			saveMessage = {
				type: 'error',
				text: `Network error: ${errorMessage}`
			};
		} finally {
			isSubmitting = false;
		}
	}

	function clearMessage() {
		saveMessage = null;
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Ctrl+S or Cmd+S to save
		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			if (!isSubmitting && formElement) {
				const formData = new FormData(formElement);
				console.log('Ctrl+S save triggered');
				console.log('Form data entries:', Array.from(formData.entries()));
				handleAsyncSave(formData);
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Edit {data.project.title} - WriterBuddy</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<a href="/projects/{data.project.id}" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
			<ArrowLeft class="h-4 w-4 mr-1" />
			Back to Project
		</a>
		<h1 class="text-2xl font-bold text-gray-900">Edit Project</h1>
		<p class="text-gray-600 mt-1">Update your project details and settings</p>
		<p class="text-gray-500 text-sm mt-1">💡 Tip: Press <kbd class="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+S</kbd> to save quickly</p>
	</div>

	<!-- Project Info Card -->
	<div class="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
			<div class="flex items-center space-x-2">
				<span class="text-gray-500">Created:</span>
				<span class="text-gray-900 font-medium">{formatDate(new Date(data.project.createdAt))}</span>
			</div>
			<div class="flex items-center space-x-2">
				<span class="text-gray-500">Last Updated:</span>
				<span class="text-gray-900 font-medium">{formatDate(new Date(data.project.updatedAt))}</span>
			</div>
		</div>
	</div>

	<!-- Form -->
	<form 
		bind:this={formElement}
		method="POST" 
		use:enhance={({ formData, cancel }) => {
			// Cancel the default form submission for async handling
			cancel();
			// Handle it asynchronously instead
			handleAsyncSave(formData);
			return async () => {
				// This return function won't be called since we cancelled
			};
		}} 
		class="space-y-6"
	>
		<!-- Save Message Display -->
		{#if saveMessage}
			<div class="fixed top-4 right-4 z-50 max-w-md">
				<div class="flex items-center p-4 rounded-lg shadow-lg {saveMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
					{#if saveMessage.type === 'success'}
						<Check class="h-5 w-5 text-green-600 mr-3" />
						<span class="text-green-800 text-sm">{saveMessage.text}</span>
					{:else}
						<X class="h-5 w-5 text-red-600 mr-3" />
						<span class="text-red-800 text-sm">{saveMessage.text}</span>
					{/if}
					<button 
						type="button" 
						onclick={clearMessage}
						class="ml-auto text-gray-400 hover:text-gray-600"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			</div>
		{/if}

		{#if form?.error && !saveMessage}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<p class="text-red-800 text-sm">{form.error}</p>
			</div>
		{/if}

		<div class="bg-white shadow rounded-lg p-6">
			<div class="space-y-6">
				<!-- Project Title -->
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
						Project Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={currentTitle}
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter your project title..."
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="4"
						value={currentDescription}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Describe your project, plot, or main ideas..."
					></textarea>
					<p class="text-sm text-gray-500 mt-1">Optional: A brief description of your project</p>
				</div>

				<!-- Genre -->
				<div>
					<label for="genre" class="block text-sm font-medium text-gray-700 mb-2">
						Genre
					</label>
					<select
						id="genre"
						name="genre"
						value={currentGenre}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Select a genre...</option>
						{#each genres as genre}
							<option value={genre}>{genre}</option>
						{/each}
					</select>
				</div>

				<!-- Status -->
				<div>
					<label for="status" class="block text-sm font-medium text-gray-700 mb-2">
						Project Status
					</label>
					<select
						id="status"
						name="status"
						value={currentStatus}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{#each statuses as status}
							<option value={status.value}>{status.label}</option>
						{/each}
					</select>
					<p class="text-sm text-gray-500 mt-1">Track your project's progress</p>
				</div>

				<!-- Target Word Count -->
				<div>
					<label for="targetWordCount" class="block text-sm font-medium text-gray-700 mb-2">
						<div class="flex items-center space-x-1">
							<Target class="h-4 w-4" />
							<span>Target Word Count</span>
						</div>
					</label>
					<input
						type="number"
						id="targetWordCount"
						name="targetWordCount"
						value={currentTargetWordCount}
						min="1"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="e.g., 80000"
					/>
					<p class="text-sm text-gray-500 mt-1">
						Optional: Update your word count goal (typical novel: 70,000-100,000 words)
					</p>
				</div>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<a href="/projects/{data.project.id}" class="text-gray-600 hover:text-gray-900">Cancel</a>
				<a 
					href="/projects" 
					class="text-gray-600 hover:text-gray-900 text-sm"
				>
					← All Projects
				</a>
			</div>
			<button
				type="submit"
				disabled={isSubmitting}
				class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isSubmitting}
					<Loader2 class="h-4 w-4 animate-spin" />
					<span>Saving...</span>
				{:else}
					<Save class="h-4 w-4" />
					<span>Save Changes</span>
				{/if}
			</button>
		</div>
	</form>

	<!-- Danger Zone -->
	<div class="mt-12 border-t pt-8">
		<div class="bg-red-50 border border-red-200 rounded-lg p-6">
			<h3 class="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
			<p class="text-red-700 text-sm mb-4">
				Deleting a project is permanent and cannot be undone. All associated documents, characters, and notes will be lost.
			</p>
			<a 
				href="/projects"
				class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
				onclick={(e) => {
					if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
						e.preventDefault();
					}
				}}
			>
				<Trash2 class="h-4 w-4 mr-2" />
				Delete Project
			</a>
		</div>
	</div>
</div>
