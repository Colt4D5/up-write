<script lang="ts">
	import { PlusCircle, BookOpen, Calendar, Target, MoreVertical, Edit, Trash2, Settings, AlertTriangle } from 'lucide-svelte';
	import { formatDate, getProjectStatusColor } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	
	let openMenuId = $state<string | null>(null);
	let deleteConfirmation = $state<{ isOpen: boolean; projectId: string; projectTitle: string }>({
		isOpen: false,
		projectId: '',
		projectTitle: ''
	});
	let isDeleting = $state(false);

	function toggleMenu(projectId: string) {
		openMenuId = openMenuId === projectId ? null : projectId;
	}

	function closeMenu() {
		openMenuId = null;
	}

	function handleDeleteProject(projectId: string, projectTitle: string) {
		deleteConfirmation = {
			isOpen: true,
			projectId,
			projectTitle
		};
		closeMenu();
	}

	function closeDeleteConfirmation() {
		deleteConfirmation.isOpen = false;
		deleteConfirmation.projectId = '';
		deleteConfirmation.projectTitle = '';
	}

	async function confirmDeleteProject() {
		if (!deleteConfirmation.projectId) return;
		
		isDeleting = true;
		try {
			const response = await fetch('/api/projects/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ projectId: deleteConfirmation.projectId })
			});

			if (response.ok) {
				// Refresh the projects list
				await invalidateAll();
				closeDeleteConfirmation();
			} else {
				const error = await response.json();
				alert('Failed to delete project: ' + (error.message || 'Unknown error'));
			}
		} catch (error) {
			console.error('Delete project error:', error);
			alert('Failed to delete project. Please try again.');
		} finally {
			isDeleting = false;
		}
	}

	// Close menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (!target.closest('.dropdown-menu') && !target.closest('.dropdown-button')) {
			closeMenu();
		}
	}

	// Handle escape key to close modal
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && deleteConfirmation.isOpen) {
			closeDeleteConfirmation();
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

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
							<div class="relative">
								<button 
									class="dropdown-button text-gray-400 hover:text-gray-600 p-1 rounded"
									onclick={() => toggleMenu(project.id)}
								>
									<MoreVertical class="h-4 w-4" />
								</button>
								
								{#if openMenuId === project.id}
									<div class="dropdown-menu absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
										<a 
											href="/projects/{project.id}/edit" 
											class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onclick={closeMenu}
										>
											<Edit class="h-4 w-4 mr-2" />
											Edit Project
										</a>
										<a 
											href="/projects/{project.id}/settings" 
											class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onclick={closeMenu}
										>
											<Settings class="h-4 w-4 mr-2" />
											Project Settings
										</a>
										<hr class="my-1 border-gray-200" />
										<button 
											class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
											onclick={() => handleDeleteProject(project.id, project.title)}
										>
											<Trash2 class="h-4 w-4 mr-2" />
											Delete Project
										</button>
									</div>
								{/if}
							</div>
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

<!-- Delete Confirmation Modal -->
{#if deleteConfirmation.isOpen}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<div class="flex items-center space-x-3 mb-4">
					<div class="flex-shrink-0">
						<AlertTriangle class="h-6 w-6 text-red-600" />
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Delete Project</h3>
					</div>
				</div>
				
				<p class="text-sm text-gray-600 mb-6">
					Are you sure you want to delete "<span class="font-medium">{deleteConfirmation.projectTitle}</span>"? 
					This action cannot be undone and will permanently remove the project and all its associated data.
				</p>
				
				<div class="flex items-center justify-end space-x-3">
					<button 
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						onclick={closeDeleteConfirmation}
						disabled={isDeleting}
					>
						Cancel
					</button>
					<button 
						class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
						onclick={confirmDeleteProject}
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete Project'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
