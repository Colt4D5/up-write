<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Book, Target } from 'lucide-svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

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
</script>

<svelte:head>
	<title>New Project - WriterBuddy</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<a href="/projects" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
			<ArrowLeft class="h-4 w-4 mr-1" />
			Back to Projects
		</a>
		<h1 class="text-2xl font-bold text-gray-900">Create New Project</h1>
		<p class="text-gray-600 mt-1">Start your next writing project and organize your ideas</p>
	</div>

	<!-- Form -->
	<form method="POST" use:enhance class="space-y-6">
		{#if form?.error}
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
						value={form?.title || ''}
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
						value={form?.description || ''}
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
						value={form?.genre || ''}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Select a genre...</option>
						{#each genres as genre}
							<option value={genre}>{genre}</option>
						{/each}
					</select>
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
						value={form?.targetWordCount || ''}
						min="1"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="e.g., 80000"
					/>
					<p class="text-sm text-gray-500 mt-1">
						Optional: Set a word count goal for your project (typical novel: 70,000-100,000 words)
					</p>
				</div>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex items-center justify-between">
			<a href="/projects" class="text-gray-600 hover:text-gray-900">Cancel</a>
			<button
				type="submit"
				class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
			>
				<Book class="h-4 w-4" />
				<span>Create Project</span>
			</button>
		</div>
	</form>
</div>
