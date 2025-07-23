<script lang="ts">
	import { BookOpen, TrendingUp, Target, Calendar, Award, Clock, BarChart3, Flame } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { formatWordCount } from '$lib/utils';
	import ActivityGrid from '$lib/components/ActivityGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Calculate productivity metrics
	let productivityScore = $derived(Math.min(100, Math.round(
		(data.analytics.currentStreak * 10) +
		(data.stats.weeklyWords / 100) +
		(data.analytics.totalProjectsCompleted * 20)
	)));
</script>

<svelte:head>
	<title>Analytics - WriterBuddy</title>
</svelte:head>

<div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
	<!-- Header -->
	<div 
		class="bg-white rounded-lg shadow p-6 hover-lift"
		in:fly={{ y: 20, duration: 400, delay: 0 }}
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<div class="p-3 bg-purple-100 rounded-lg">
					<BarChart3 class="h-8 w-8 text-purple-600" />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Writing Analytics</h1>
					<p class="text-gray-600 mt-1">Deep insights into your writing journey</p>
				</div>
			</div>
			<div class="text-right">
				<div class="text-3xl font-bold text-purple-600">{productivityScore}</div>
				<div class="text-sm text-gray-500">Productivity Score</div>
			</div>
		</div>
	</div>

	<!-- Key Metrics -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 100 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-orange-100 rounded-lg">
					<Flame class="h-6 w-6 text-orange-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Current Streak</p>
					<p class="text-2xl font-semibold text-gray-900">{data.analytics.currentStreak}</p>
					<p class="text-xs text-gray-500">days</p>
				</div>
			</div>
		</div>

		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 150 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-yellow-100 rounded-lg">
					<Award class="h-6 w-6 text-yellow-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Longest Streak</p>
					<p class="text-2xl font-semibold text-gray-900">{data.analytics.longestStreak}</p>
					<p class="text-xs text-gray-500">days</p>
				</div>
			</div>
		</div>

		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 200 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-green-100 rounded-lg">
					<Target class="h-6 w-6 text-green-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Avg Words/Project</p>
					<p class="text-2xl font-semibold text-gray-900">{formatWordCount(data.analytics.averageWordsPerProject)}</p>
				</div>
			</div>
		</div>

		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 250 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-blue-100 rounded-lg">
					<Clock class="h-6 w-6 text-blue-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Total Time</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats.totalTime}h</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Activity Grid (Main Feature) -->
	<div 
		class="bg-white rounded-lg shadow p-6 hover-lift"
		in:fly={{ y: 20, duration: 400, delay: 300 }}
	>
		<ActivityGrid activityData={data.activityData} />
	</div>

	<!-- Project Analytics -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Project Status Breakdown -->
		<div 
			class="bg-white rounded-lg shadow hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 350 }}
		>
			<div class="p-6 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">Project Status</h2>
			</div>
			<div class="p-6">
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
							<span class="text-gray-700">Completed</span>
						</div>
						<span class="font-medium">{data.analytics.totalProjectsCompleted}</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
							<span class="text-gray-700">In Progress</span>
						</div>
						<span class="font-medium">{data.analytics.totalProjectsInProgress}</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<div class="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
							<span class="text-gray-700">Draft</span>
						</div>
						<span class="font-medium">{data.projects.filter(p => p.status === 'draft').length}</span>
					</div>
				</div>

				{#if data.projects.length > 0}
					<div class="mt-6 pt-4 border-t border-gray-200">
						<div class="text-sm text-gray-600 mb-2">Completion Rate</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div 
								class="bg-green-500 h-2 rounded-full transition-all duration-500"
								style="width: {(data.analytics.totalProjectsCompleted / data.projects.length) * 100}%"
							></div>
						</div>
						<div class="text-xs text-gray-500 mt-1">
							{Math.round((data.analytics.totalProjectsCompleted / data.projects.length) * 100)}% completed
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Top Projects by Word Count -->
		<div 
			class="bg-white rounded-lg shadow hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 400 }}
		>
			<div class="p-6 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">Top Projects</h2>
			</div>
			<div class="p-6">
				{#if data.projects.length > 0}
					<div class="space-y-4">
						{#each data.projects
							.sort((a, b) => (b.currentWordCount || 0) - (a.currentWordCount || 0))
							.slice(0, 5) as project, i}
							<div class="flex items-center justify-between">
								<div class="flex items-center flex-1 min-w-0">
									<div class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-3 flex-shrink-0">
										<span class="text-xs font-medium text-blue-600">#{i + 1}</span>
									</div>
									<div class="min-w-0 flex-1">
										<h3 class="font-medium text-gray-900 truncate">{project.title}</h3>
										<p class="text-sm text-gray-500">{project.genre || 'No genre'}</p>
									</div>
								</div>
								<div class="text-right ml-4 flex-shrink-0">
									<p class="font-medium text-gray-900">{formatWordCount(project.currentWordCount || 0)}</p>
									<p class="text-xs text-gray-500">{(project.currentWordCount || 0).toLocaleString()} words</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8">
						<BookOpen class="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p class="text-gray-500">No projects yet. Start writing to see analytics!</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Weekly Performance -->
	<div 
		class="bg-white rounded-lg shadow p-6 hover-lift"
		in:fly={{ y: 20, duration: 400, delay: 450 }}
	>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="text-center">
				<div class="text-3xl font-bold text-blue-600 mb-2">{formatWordCount(data.stats.totalWords)}</div>
				<div class="text-sm text-gray-600">Total Words Written</div>
				<div class="text-xs text-gray-500 mt-1">{data.stats.totalWords.toLocaleString()} words</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-green-600 mb-2">{formatWordCount(data.stats.weeklyWords)}</div>
				<div class="text-sm text-gray-600">This Week</div>
				<div class="text-xs text-gray-500 mt-1">{data.stats.weeklyWords.toLocaleString()} words</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-purple-600 mb-2">{data.stats.projectCount}</div>
				<div class="text-sm text-gray-600">Active Projects</div>
			</div>
		</div>
	</div>
</div>
