<script lang="ts">
	import { PlusCircle, BookOpen, Calendar, Target, MoreVertical } from 'lucide-svelte';
	import { formatDate, getProjectStatusColor } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Projects - WriterBuddy</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">My Projects</h1>
			<p class="text-gray-600 mt-1">Manage and organize your writing projects</p>
		</div>
		<a href="/projects/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
			<PlusCircle class="h-4 w-4" />
			<span>New Project</span>
		</a>
	</div>

	{#if data.projects && data.projects.length > 0}
		<!-- Projects Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.projects as project}
				<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
					<div class="p-6">
						<div class="flex items-start justify-between mb-4">
							<div class="flex items-center space-x-2">
								<BookOpen class="h-5 w-5 text-blue-600" />
								<span class="px-2 py-1 text-xs font-medium rounded-full {getProjectStatusColor(project.status)} bg-gray-100">
									{project.status}
								</span>
							</div>
							<button class="text-gray-400 hover:text-gray-600">
								<MoreVertical class="h-4 w-4" />
							</button>
						</div>

						<h3 class="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
						
						{#if project.description}
							<p class="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
						{/if}

						<div class="space-y-2 mb-4">
							{#if project.genre}
								<div class="flex items-center text-sm text-gray-500">
									<span class="font-medium">Genre:</span>
									<span class="ml-1">{project.genre}</span>
								</div>
							{/if}
							
							{#if project.targetWordCount}
								<div class="flex items-center text-sm text-gray-500">
									<Target class="h-3 w-3 mr-1" />
									<span>Target: {project.targetWordCount.toLocaleString()} words</span>
								</div>
							{/if}

							<div class="flex items-center text-sm text-gray-500">
								<Calendar class="h-3 w-3 mr-1" />
								<span>Updated {formatDate(new Date(project.updatedAt))}</span>
							</div>
						</div>

						<div class="flex items-center justify-between pt-4 border-t border-gray-200">
							<a href="/projects/{project.id}" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
								Open Project
							</a>
							<span class="text-xs text-gray-400">
								Created {formatDate(new Date(project.createdAt))}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="text-center py-12">
			<BookOpen class="h-16 w-16 text-gray-300 mx-auto mb-4" />
			<h3 class="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
			<p class="text-gray-500 mb-8 max-w-md mx-auto">
				Start your writing journey by creating your first project. Organize your chapters, 
				characters, and notes all in one place.
			</p>
			<a href="/projects/new" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
				<PlusCircle class="h-5 w-5" />
				<span>Create Your First Project</span>
			</a>
		</div>
	{/if}
</div>
