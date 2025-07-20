<script lang="ts">
	import { 
		TrendingUp, 
		Calendar,
		Clock,
		Target,
		BookOpen,
		Award,
		BarChart3,
		Flame,
		X,
		Lock
	} from 'lucide-svelte';
	import { formatDate } from '$lib/utils';

	// Props
	let { 
		friend, 
		isOpen = $bindable(false),
		onClose
	}: { 
		friend: any; 
		isOpen: boolean;
		onClose: () => void;
	} = $props();

	// State
	let analytics = $state<any>(null);
	let isLoading = $state(false);
	let activeTab = $state<'stats' | 'projects'>('stats');

	// Get profile image URL with fallback
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};

	// Format writing time
	const formatWritingTime = (minutes: number) => {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return `${hours}h ${remainingMinutes}m`;
	};

	// Load analytics when modal opens
	$effect(() => {
		if (isOpen && friend && !analytics) {
			loadAnalytics();
		}
	});

	async function loadAnalytics() {
		if (!friend) return;
		
		isLoading = true;
		try {
			const response = await fetch(`/api/friends/analytics?friendId=${friend.id}`);
			if (response.ok) {
				analytics = await response.json();
			}
		} catch (error) {
			console.error('Failed to load analytics:', error);
		} finally {
			isLoading = false;
		}
	}

	// Chart data for daily writing
	const chartData = $derived.by(() => {
		if (!analytics?.dailyStats) return [];
		
		return analytics.dailyStats
			.slice(0, 14) // Last 14 days
			.reverse()
			.map((stat: any) => ({
				date: stat.date,
				words: stat.wordsWritten,
				time: stat.timeSpent,
			}));
	});

	// Get max values for chart scaling
	const maxWords = $derived.by(() => {
		if (!chartData.length) return 1;
		return Math.max(...chartData.map((d: any) => d.words), 1);
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex items-center space-x-4">
					<img
						src={getProfileImageUrl(friend?.profileImage)}
						alt={friend?.displayName || friend?.username}
						class="h-12 w-12 rounded-full object-cover"
					/>
					<div>
						<h2 class="text-xl font-semibold text-gray-900">
							{friend?.displayName || friend?.username}
						</h2>
						<p class="text-sm text-gray-500">@{friend?.username}</p>
					</div>
				</div>
				<button
					onclick={onClose}
					class="text-gray-400 hover:text-gray-600"
				>
					<X class="h-6 w-6" />
				</button>
			</div>

			{#if isLoading}
				<div class="flex items-center justify-center py-12">
					<div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
				</div>
			{:else if analytics}
				<!-- Tabs -->
				<div class="border-b border-gray-200">
					<nav class="flex px-6">
						{#if analytics.canViewStats}
							<button
								onclick={() => activeTab = 'stats'}
								class="py-3 px-4 border-b-2 font-medium text-sm {activeTab === 'stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
							>
								Writing Stats
							</button>
						{/if}
						{#if analytics.canViewProjects}
							<button
								onclick={() => activeTab = 'projects'}
								class="py-3 px-4 border-b-2 font-medium text-sm {activeTab === 'projects' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
							>
								Projects
							</button>
						{/if}
					</nav>
				</div>

				<!-- Content -->
				<div class="p-6 max-h-[60vh] overflow-y-auto">
					{#if activeTab === 'stats' && analytics.canViewStats}
						<div class="space-y-6">
							<!-- Overview Stats -->
							<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<div class="bg-blue-50 rounded-lg p-4">
									<div class="flex items-center">
										<TrendingUp class="h-8 w-8 text-blue-600" />
										<div class="ml-3">
											<p class="text-sm font-medium text-blue-900">Total Words</p>
											<p class="text-2xl font-semibold text-blue-600">
												{analytics.overallStats?.totalWords?.toLocaleString() || '0'}
											</p>
										</div>
									</div>
								</div>

								<div class="bg-green-50 rounded-lg p-4">
									<div class="flex items-center">
										<Clock class="h-8 w-8 text-green-600" />
										<div class="ml-3">
											<p class="text-sm font-medium text-green-900">Total Time</p>
											<p class="text-2xl font-semibold text-green-600">
												{formatWritingTime(analytics.overallStats?.totalTime || 0)}
											</p>
										</div>
									</div>
								</div>

								<div class="bg-purple-50 rounded-lg p-4">
									<div class="flex items-center">
										<Calendar class="h-8 w-8 text-purple-600" />
										<div class="ml-3">
											<p class="text-sm font-medium text-purple-900">Sessions</p>
											<p class="text-2xl font-semibold text-purple-600">
												{analytics.overallStats?.totalSessions || 0}
											</p>
										</div>
									</div>
								</div>

								<div class="bg-orange-50 rounded-lg p-4">
									<div class="flex items-center">
										<Flame class="h-8 w-8 text-orange-600" />
										<div class="ml-3">
											<p class="text-sm font-medium text-orange-900">Streak</p>
											<p class="text-2xl font-semibold text-orange-600">
												{analytics.streaks?.current || 0}d
											</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Writing Activity Chart -->
							<div class="bg-white border border-gray-200 rounded-lg p-6">
								<h3 class="text-lg font-medium text-gray-900 mb-4">Last 14 Days</h3>
								{#if chartData.length > 0}
									<div class="space-y-4">
										<!-- Chart -->
										<div class="flex items-end space-x-2 h-32">
											{#each chartData as day}
												<div class="flex-1 flex flex-col items-center">
													<div class="w-full bg-gray-200 rounded-t relative" style="height: 80px;">
														{#if day.words > 0}
															<div 
																class="bg-blue-500 rounded-t absolute bottom-0 w-full transition-all duration-300"
																style="height: {(day.words / maxWords) * 80}px;"
																title="{day.words} words"
															></div>
														{/if}
													</div>
													<p class="text-xs text-gray-500 mt-2">
														{new Date(day.date).getDate()}
													</p>
												</div>
											{/each}
										</div>
										
										<!-- Legend -->
										<div class="flex items-center justify-center space-x-6 text-sm text-gray-600">
											<div class="flex items-center">
												<div class="w-3 h-3 bg-blue-500 rounded mr-2"></div>
												<span>Words Written</span>
											</div>
										</div>
									</div>
								{:else}
									<p class="text-gray-500 text-center py-8">No recent activity data</p>
								{/if}
							</div>

							<!-- Streak Information -->
							<div class="bg-white border border-gray-200 rounded-lg p-6">
								<h3 class="text-lg font-medium text-gray-900 mb-4">Writing Streaks</h3>
								<div class="grid grid-cols-2 gap-4">
									<div class="text-center">
										<div class="text-3xl font-bold text-orange-600 mb-1">
											{analytics.streaks?.current || 0}
										</div>
										<p class="text-sm text-gray-600">Current Streak (days)</p>
									</div>
									<div class="text-center">
										<div class="text-3xl font-bold text-green-600 mb-1">
											{analytics.streaks?.longest || 0}
										</div>
										<p class="text-sm text-gray-600">Longest Streak (days)</p>
									</div>
								</div>
							</div>
						</div>
					{:else if activeTab === 'projects' && analytics.canViewProjects}
						<div class="space-y-4">
							{#if analytics.projects && analytics.projects.length > 0}
								{#each analytics.projects as project}
									<div class="bg-white border border-gray-200 rounded-lg p-4">
										<div class="flex items-start justify-between">
											<div class="flex-1">
												<h4 class="font-medium text-gray-900">{project.title}</h4>
												<div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
													{#if project.genre}
														<span>{project.genre}</span>
													{/if}
													<span class="capitalize">{project.status}</span>
													<span>{formatDate(new Date(project.createdAt))}</span>
												</div>
												{#if project.targetWordCount}
													<div class="mt-2">
														<div class="flex items-center text-sm text-gray-600">
															<Target class="h-4 w-4 mr-1" />
															<span>Target: {project.targetWordCount.toLocaleString()} words</span>
														</div>
													</div>
												{/if}
											</div>
											<BookOpen class="h-5 w-5 text-gray-400" />
										</div>
									</div>
								{/each}
							{:else}
								<div class="text-center py-8">
									<BookOpen class="h-16 w-16 text-gray-300 mx-auto mb-4" />
									<p class="text-gray-500">No projects to display</p>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Permission denied states -->
						<div class="text-center py-12">
							<Lock class="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h3 class="text-lg font-medium text-gray-900 mb-2">Private Information</h3>
							<p class="text-gray-500">
								{#if !analytics.canViewStats && !analytics.canViewProjects}
									This user hasn't shared their writing information with friends.
								{:else if !analytics.canViewStats}
									This user hasn't shared their writing statistics.
								{:else}
									This user hasn't shared their projects.
								{/if}
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="p-6 text-center">
					<p class="text-gray-500">Failed to load analytics. Please try again.</p>
					<button
						onclick={loadAnalytics}
						class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
