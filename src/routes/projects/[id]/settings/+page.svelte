<script lang="ts">
	import { ArrowLeft, Settings, Edit, Trash2, BookOpen, Users, Bell, Database } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Settings - {data.project.title} - WriterBuddy</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<a href="/projects/{data.project.id}" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
			<ArrowLeft class="h-4 w-4 mr-1" />
			Back to Project
		</a>
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Project Settings</h1>
				<p class="text-gray-600 mt-1">Manage settings and preferences for "{data.project.title}"</p>
			</div>
			<a 
				href="/projects/{data.project.id}/edit" 
				class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
			>
				<Edit class="h-4 w-4" />
				<span>Edit Project</span>
			</a>
		</div>
	</div>

	<!-- Settings Sections -->
	<div class="space-y-6">
		<!-- Project Details -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<BookOpen class="h-5 w-5 text-gray-500" />
					<h3 class="text-lg font-medium text-gray-900">Project Details</h3>
				</div>
			</div>
			<div class="p-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<dt class="text-sm font-medium text-gray-500">Title</dt>
						<dd class="text-base text-gray-900 mt-1">{data.project.title}</dd>
					</div>
					{#if data.project.description}
						<div>
							<dt class="text-sm font-medium text-gray-500">Description</dt>
							<dd class="text-base text-gray-900 mt-1">{data.project.description}</dd>
						</div>
					{/if}
					{#if data.project.genre}
						<div>
							<dt class="text-sm font-medium text-gray-500">Genre</dt>
							<dd class="text-base text-gray-900 mt-1">{data.project.genre}</dd>
						</div>
					{/if}
					<div>
						<dt class="text-sm font-medium text-gray-500">Status</dt>
						<dd class="text-base text-gray-900 mt-1 capitalize">{data.project.status}</dd>
					</div>
					{#if data.project.targetWordCount}
						<div>
							<dt class="text-sm font-medium text-gray-500">Target Word Count</dt>
							<dd class="text-base text-gray-900 mt-1">{data.project.targetWordCount.toLocaleString()} words</dd>
						</div>
					{/if}
					<div>
						<dt class="text-sm font-medium text-gray-500">Created</dt>
						<dd class="text-base text-gray-900 mt-1">{formatDate(new Date(data.project.createdAt))}</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Last Updated</dt>
						<dd class="text-base text-gray-900 mt-1">{formatDate(new Date(data.project.updatedAt))}</dd>
					</div>
				</div>
				<div class="mt-6 pt-6 border-t border-gray-200">
					<a 
						href="/projects/{data.project.id}/edit" 
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<Edit class="h-4 w-4 mr-2" />
						Edit Project Details
					</a>
				</div>
			</div>
		</div>

		<!-- Collaboration (Placeholder) -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<Users class="h-5 w-5 text-gray-500" />
					<h3 class="text-lg font-medium text-gray-900">Collaboration</h3>
				</div>
			</div>
			<div class="p-6">
				<p class="text-gray-600 text-sm mb-4">
					Collaboration features are coming soon! You'll be able to invite co-authors, share drafts, and collaborate in real-time.
				</p>
				<button 
					disabled
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
				>
					<Users class="h-4 w-4 mr-2" />
					Manage Collaborators (Coming Soon)
				</button>
			</div>
		</div>

		<!-- Notifications (Placeholder) -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<Bell class="h-5 w-5 text-gray-500" />
					<h3 class="text-lg font-medium text-gray-900">Notifications</h3>
				</div>
			</div>
			<div class="p-6">
				<p class="text-gray-600 text-sm mb-4">
					Configure how you'd like to receive notifications about this project.
				</p>
				<div class="space-y-4">
					<label class="flex items-center">
						<input type="checkbox" disabled class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200/50">
						<span class="ml-2 text-sm text-gray-700">Email notifications for project milestones (Coming Soon)</span>
					</label>
					<label class="flex items-center">
						<input type="checkbox" disabled class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200/50">
						<span class="ml-2 text-sm text-gray-700">Daily writing reminders (Coming Soon)</span>
					</label>
				</div>
			</div>
		</div>

		<!-- Export & Backup (Placeholder) -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<Database class="h-5 w-5 text-gray-500" />
					<h3 class="text-lg font-medium text-gray-900">Export & Backup</h3>
				</div>
			</div>
			<div class="p-6">
				<p class="text-gray-600 text-sm mb-4">
					Export your project data or create backups to keep your work safe.
				</p>
				<div class="flex flex-wrap gap-3">
					<button 
						disabled
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
					>
						Export as PDF (Coming Soon)
					</button>
					<button 
						disabled
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
					>
						Export as DOCX (Coming Soon)
					</button>
					<button 
						disabled
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
					>
						Create Backup (Coming Soon)
					</button>
				</div>
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="bg-white shadow rounded-lg border-l-4 border-red-500">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<Trash2 class="h-5 w-5 text-red-500" />
					<h3 class="text-lg font-medium text-red-900">Danger Zone</h3>
				</div>
			</div>
			<div class="p-6">
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
</div>
