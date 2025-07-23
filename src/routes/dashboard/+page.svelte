<script lang="ts">
	import { BookOpen, PlusCircle, BarChart3, Clock, Target, TrendingUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { formatWordCount, formatDate } from '$lib/utils';
	import ActivityGrid from '$lib/components/ActivityGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Get profile image URL with fallback to default
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};

	const writingTips = [
		"<strong>Show, don't tell:</strong> Instead of saying 'She was angry,' describe her clenched fists, the way her voice trembled, or how she slammed the door. Let your readers feel the emotion through actions and details.",
		"<strong>Use active voice:</strong> Instead of 'The book was written by the author,' say 'The author wrote the book.' Active voice makes your writing more direct and engaging.",
		"<strong>Vary your sentence structure:</strong> Mix short and long sentences to create rhythm and keep your writing interesting. Avoid repetitive patterns.",
		"<strong>Read your writing out loud:</strong> Hearing your words can help you catch awkward phrasing, run-on sentences, and other issues that might not be obvious when reading silently.",
		"<strong>Edit ruthlessly:</strong> After writing, take a break and come back with fresh eyes. Cut unnecessary words, phrases, or even entire sections that don't serve your story or argument.",
		"<strong>Use strong verbs:</strong> Instead of relying on adverbs, choose strong, specific verbs that convey action and emotion. For example, instead of 'ran quickly,' use 'sprinted' or 'dashed.'",
		"<strong>Create compelling characters:</strong> Give your characters distinct personalities, motivations, and flaws. Make them relatable and complex to engage your readers.",
		"<strong>Build tension:</strong> Whether in fiction or non-fiction, create suspense by introducing conflicts, obstacles, or unanswered questions. Keep your readers wanting to know what happens next.",
		"<strong>Use descriptive language:</strong> Paint vivid pictures with your words. Use sensory details to immerse your readers in the setting, characters, and emotions.",
		"<strong>Write regularly:</strong> Establish a writing routine to build discipline and improve your skills. Consistent practice helps you develop your voice and style over time."
	];
	const randomTip = writingTips[Math.floor(Math.random() * writingTips.length)];
</script>

<svelte:head>
	<title>Dashboard - WriterBuddy</title>
</svelte:head>

<div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
	<!-- Welcome Header -->
	<div 
		class="bg-white rounded-lg shadow p-6 hover-lift"
		in:fly={{ y: 20, duration: 400, delay: 0 }}
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<img 
					src={getProfileImageUrl(data.user?.profileImage)} 
					alt="Profile" 
					class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200 scale-in"
				/>
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Welcome back, {data.user?.username}!</h1>
					<p class="text-gray-600 mt-1">Ready to continue your writing journey?</p>
				</div>
			</div>
			<a href="/projects/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 hover-lift">
				<PlusCircle class="h-4 w-4" />
				<span>New Project</span>
			</a>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 150 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-blue-100 rounded-lg">
					<BookOpen class="h-6 w-6 text-blue-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Active Projects</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats?.projectCount || 0}</p>
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
					<p class="text-sm font-medium text-gray-600">Total Words</p>
					<p class="text-2xl font-semibold text-gray-900">{formatWordCount(data.stats?.totalWords || 0)}</p>
					{#if data.stats?.totalWords}
						<p class="text-xs text-gray-500">{data.stats.totalWords.toLocaleString()} words</p>
					{/if}
				</div>
			</div>
		</div>

		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 250 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-purple-100 rounded-lg">
					<Clock class="h-6 w-6 text-purple-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Writing Time</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats?.totalTime || 0}h</p>
				</div>
			</div>
		</div>

		<div 
			class="bg-white rounded-lg shadow p-6 hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 300 }}
		>
			<div class="flex items-center">
				<div class="p-2 bg-orange-100 rounded-lg">
					<TrendingUp class="h-6 w-6 text-orange-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">This Week</p>
					<p class="text-2xl font-semibold text-gray-900">{formatWordCount(data.stats?.weeklyWords || 0)}</p>
					{#if data.stats?.weeklyWords}
						<p class="text-xs text-gray-500">{data.stats.weeklyWords.toLocaleString()} words</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Activity Grid -->
	<div 
		class="bg-white rounded-lg shadow p-6 hover-lift"
		in:fly={{ y: 20, duration: 400, delay: 350 }}
	>
		<ActivityGrid activityData={data.activityData} />
	</div>

	<!-- Recent Projects and Quick Actions -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Recent Projects -->
			<div 
				class="bg-white rounded-lg shadow hover-lift"
				in:fly={{ y: 20, duration: 400, delay: 400 }}
			>
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-gray-900">Recent Projects</h2>
						<a href="/projects" class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">View all</a>
					</div>
				</div>
			<div class="p-6">
				{#if data.recentProjects && data.recentProjects.length > 0}
					<div class="space-y-3">
						{#each data.recentProjects.slice(0, 5) as project}
							<div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div class="flex items-center space-x-3">
									<BookOpen class="h-5 w-5 text-gray-400" />
									<div>
										<h3 class="font-medium text-gray-900">{project.title}</h3>
										<p class="text-sm text-gray-500">{project.genre || 'No genre set'}</p>
									</div>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-gray-900">{project.status}</p>
									<p class="text-xs text-gray-500">Updated {formatDate(new Date(project.updatedAt))}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8">
						<BookOpen class="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p class="text-gray-500">No projects yet. Create your first project to get started!</p>
						<a href="/projects/new" class="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800">
							<PlusCircle class="h-4 w-4 mr-1" />
							Create Project
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Quick Actions -->
		<div 
			class="bg-white rounded-lg shadow hover-lift"
			in:fly={{ y: 20, duration: 400, delay: 450 }}
		>
			<div class="p-6 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
			</div>
			<div class="p-6">
				<div class="space-y-3">
					<a href="/projects/new" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover-lift">
						<PlusCircle class="h-5 w-5 text-blue-600 mr-3" />
						<div>
							<h3 class="font-medium text-gray-900">Start New Project</h3>
							<p class="text-sm text-gray-500">Begin writing your next masterpiece</p>
						</div>
					</a>

					{#if data.recentProjects && data.recentProjects.length > 0}
						<a href="/projects/{data.recentProjects[0].id}" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover-lift">
							<BookOpen class="h-5 w-5 text-green-600 mr-3" />
							<div>
								<h3 class="font-medium text-gray-900">Continue Writing</h3>
								<p class="text-sm text-gray-500">Resume work on "{data.recentProjects[0].title}"</p>
							</div>
						</a>
					{/if}

					<a href="/analytics" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover-lift">
						<BarChart3 class="h-5 w-5 text-purple-600 mr-3" />
						<div>
							<h3 class="font-medium text-gray-900">View Analytics</h3>
							<p class="text-sm text-gray-500">Track your writing progress and habits</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Writing Tips -->
	<div 
		class="bg-white rounded-lg shadow hover-lift"
		in:fly={{ y: 20, duration: 400, delay: 500 }}
	>
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-lg font-semibold text-gray-900">Today's Writing Tip</h2>
		</div>
		<div class="p-6">
			<div class="bg-blue-50 border-l-4 border-blue-400 p-4">
				<div class="flex">
					<div class="ml-3">
						<p class="text-sm text-blue-700">
							{@html randomTip}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
