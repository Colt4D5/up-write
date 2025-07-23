<script lang="ts">
	import {
		Users,
		UserPlus,
		Search,
		MessageCircle,
		Heart,
		Trophy,
		Calendar,
		Target,
		Clock,
		Medal,
		Plus,
		X,
		Check,
		UserMinus,
		Settings
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils';
	import CreateChallengeModal from '$lib/components/CreateChallengeModal.svelte';
	import PrivacySettingsModal from '$lib/components/PrivacySettingsModal.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State management
	let activeTab = $state<'feed' | 'friends' | 'challenges' | 'discover'>('feed');
	let searchQuery = $state('');
	let showAddFriendModal = $state(false);
	let showCreateChallengeModal = $state(false);
	let showPrivacySettingsModal = $state(false);
	let newFriendUsername = $state('');
	let privacySettings = $state({});

	// Get profile image URL with fallback
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};

	// Format achievement/post time
	const formatTimeAgo = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return 'Just now';
	};

	// Get post icon based on type
	const getPostIcon = (type: string) => {
		switch (type) {
			case 'achievement': return Trophy;
			case 'milestone': return Target;
			case 'project_update': return Users;
			case 'challenge': return Medal;
			default: return MessageCircle;
		}
	};

	// Get challenge type display
	const getChallengeTypeDisplay = (type: string, goalValue: number) => {
		switch (type) {
			case 'word_count': return `${goalValue.toLocaleString()} words`;
			case 'daily_streak': return `${goalValue} days`;
			case 'time_based': return `${goalValue} minutes`;
			default: return `Goal: ${goalValue}`;
		}
	};

	// Filter friends based on search
	const filteredFriends = $derived.by(() => {
		if (!searchQuery) return data.friends;
		const query = searchQuery.toLowerCase();
		return data.friends.filter(friend => 
			friend.username.toLowerCase().includes(query) ||
			friend.displayName?.toLowerCase().includes(query)
		);
	});

	function openAddFriendModal() {
		showAddFriendModal = true;
		newFriendUsername = '';
	}

	function closeAddFriendModal() {
		showAddFriendModal = false;
		newFriendUsername = '';
	}

	function openCreateChallengeModal() {
		showCreateChallengeModal = true;
	}

	function closeCreateChallengeModal() {
		showCreateChallengeModal = false;
	}

	function onChallengeCreated(challenge: any) {
		// Add the new challenge to the data
		data.challenges = [challenge, ...data.challenges];
	}

	function openPrivacySettingsModal() {
		showPrivacySettingsModal = true;
	}

	function closePrivacySettingsModal() {
		showPrivacySettingsModal = false;
	}

	function onPrivacySettingsUpdated(settings: any) {
		privacySettings = settings;
	}

	// Load initial privacy settings
	$effect(() => {
		if (data.user) {
			fetch('/api/privacy/settings')
				.then(response => response.json())
				.then(settings => {
					privacySettings = settings;
				})
				.catch(console.error);
		}
	});
</script>

<svelte:head>
	<title>Friends - WriterBuddy</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Friends</h1>
			<p class="text-gray-600">Connect with fellow writers and stay motivated together</p>
		</div>
		<div class="flex items-center space-x-3">
			<button
				onclick={openAddFriendModal}
				class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				<UserPlus class="h-4 w-4 mr-2" />
				Add Friend
			</button>
			<button 
				class="p-2 text-gray-400 hover:text-gray-600 rounded-md"
				onclick={openPrivacySettingsModal}
				title="Privacy Settings"
			>
				<Settings class="h-5 w-5" />
			</button>
		</div>
	</div>

	<!-- Tabs -->
	<div class="border-b border-gray-200 mb-6">
		<nav class="-mb-px flex space-x-8">
			<button
				onclick={() => activeTab = 'feed'}
				class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'feed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Activity Feed
			</button>
			<button
				onclick={() => activeTab = 'friends'}
				class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'friends' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Friends ({data.friends.length})
			</button>
			<button
				onclick={() => activeTab = 'challenges'}
				class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'challenges' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Challenges ({data.challenges.length})
			</button>
		</nav>
	</div>

	<!-- Friend Requests Notification -->
	{#if data.receivedRequests.length > 0}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<div class="flex items-center">
				<UserPlus class="h-5 w-5 text-blue-600 mr-3" />
				<div class="flex-1">
					<h3 class="text-sm font-medium text-blue-900">
						You have {data.receivedRequests.length} pending friend request{data.receivedRequests.length === 1 ? '' : 's'}
					</h3>
					<div class="mt-2 space-y-2">
						{#each data.receivedRequests as request}
							<div class="flex items-center justify-between bg-white rounded p-3">
								<div class="flex items-center space-x-3">
									<img
										src={getProfileImageUrl(request.profileImage)}
										alt={request.displayName || request.username}
										class="h-8 w-8 rounded-full object-cover"
									/>
									<div>
										<p class="text-sm font-medium text-gray-900">
											{request.displayName || request.username}
										</p>
										<p class="text-xs text-gray-500">@{request.username}</p>
									</div>
								</div>
								<div class="flex space-x-2">
									<form method="POST" action="?/acceptFriendRequest" use:enhance>
										<input type="hidden" name="friendshipId" value={request.friendshipId} />
										<button
											type="submit"
											class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
										>
											<Check class="h-3 w-3 mr-1" />
											Accept
										</button>
									</form>
									<form method="POST" action="?/declineFriendRequest" use:enhance>
										<input type="hidden" name="friendshipId" value={request.friendshipId} />
										<button
											type="submit"
											class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
										>
											<X class="h-3 w-3 mr-1" />
											Decline
										</button>
									</form>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Tab Content -->
	<div class="space-y-6">
		<!-- Activity Feed -->
		{#if activeTab === 'feed'}
			<div class="space-y-6">
				{#if data.socialFeed.length === 0}
					<div class="text-center py-12">
						<Users class="h-16 w-16 text-gray-300 mx-auto mb-4" />
						{#if data.friends.length === 0}
							<h3 class="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
							<p class="text-gray-500 mb-4">Add some friends to see their writing activity here!</p>
							<button
								onclick={openAddFriendModal}
								class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
							>
								<UserPlus class="h-4 w-4 mr-2" />
								Add Your First Friend
							</button>
						{:else}
							<h3 class="text-lg font-medium text-gray-900 mb-2">There is currently no activity</h3>
							<p class="text-gray-500 mb-4">Your friends haven't shared any writing updates recently. Encourage them to start writing!</p>
							<button
								onclick={openAddFriendModal}
								class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
							>
								<UserPlus class="h-4 w-4 mr-2" />
								Add More Friends
							</button>
						{/if}
					</div>
				{:else}
					{#each data.socialFeed as post}
            {@const PostIcon = getPostIcon(post.type)}
						<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div class="flex items-start space-x-3">
								<img
									src={getProfileImageUrl(post.authorProfileImage)}
									alt={post.authorDisplayName || post.authorUsername}
									class="h-10 w-10 rounded-full object-cover"
								/>
								<div class="flex-1 min-w-0">
									<div class="flex items-center space-x-2">
										<PostIcon class="h-4 w-4 text-gray-400" />
										<p class="text-sm font-medium text-gray-900">
											{post.authorDisplayName || post.authorUsername}
										</p>
										<span class="text-sm text-gray-500">•</span>
										<span class="text-sm text-gray-500">
											{formatTimeAgo(new Date(post.createdAt))}
										</span>
									</div>
									<h3 class="text-lg font-medium text-gray-900 mt-1">{post.title}</h3>
									{#if post.content}
										<p class="text-gray-700 mt-2">{post.content}</p>
									{/if}
									{#if post.metadata}
										{@const metadata = JSON.parse(post.metadata)}
										<div class="bg-gray-50 rounded-lg p-3 mt-3">
											{#if metadata.wordCount}
												<p class="text-sm text-gray-600">
													<strong>{metadata.wordCount.toLocaleString()}</strong> words written
												</p>
											{/if}
											{#if metadata.projectTitle}
												<p class="text-sm text-gray-600">
													Project: <strong>{metadata.projectTitle}</strong>
												</p>
											{/if}
										</div>
									{/if}
								</div>
							</div>
							
							<!-- Post Actions -->
							<div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
								<div class="flex items-center space-x-4">
									<form method="POST" action="?/likePost" use:enhance>
										<input type="hidden" name="postId" value={post.id} />
										<button
											type="submit"
											class="flex items-center space-x-1 text-sm {post.isLikedByUser ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}"
										>
											<Heart class="h-4 w-4 {post.isLikedByUser ? 'fill-current' : ''}" />
											<span>{post.likesCount}</span>
										</button>
									</form>
									<button class="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
										<MessageCircle class="h-4 w-4" />
										<span>{post.commentsCount}</span>
									</button>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/if}

		<!-- Friends List -->
		{#if activeTab === 'friends'}
			<div class="space-y-6">
				<!-- Search Bar -->
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						bind:value={searchQuery}
						type="text"
						placeholder="Search friends..."
						class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<!-- Friends Grid -->
				{#if filteredFriends.length === 0}
					<div class="text-center py-8">
						{#if data.friends.length === 0}
							<Users class="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h3 class="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
							<p class="text-gray-500 mb-4">Start building your writing community!</p>
						{:else}
							<p class="text-gray-500">No friends match your search.</p>
						{/if}
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each filteredFriends as friend}
							<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div class="flex items-center space-x-4">
									<img
										src={getProfileImageUrl(friend.profileImage)}
										alt={friend.displayName || friend.username}
										class="h-12 w-12 rounded-full object-cover"
									/>
									<div class="flex-1 min-w-0">
										<h3 class="text-lg font-medium text-gray-900 truncate">
											{friend.displayName || friend.username}
										</h3>
										<p class="text-sm text-gray-500">@{friend.username}</p>
										<div class="flex items-center mt-1">
											{#if friend.friendshipStatus === 'dnd'}
												<!-- Do Not Disturb - Red filled circle -->
												<div class="h-2 w-2 bg-red-400 rounded-full mr-2"></div>
											{:else if friend.isOnline}
												<!-- Online - Green filled circle -->
												<div class="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
											{:else}
												<!-- Offline - Empty gray circle -->
												<div class="h-2 w-2 border border-gray-300 rounded-full mr-2"></div>
											{/if}
											<span class="text-xs text-gray-500">
												{friend.friendshipStatus === 'dnd' ? 'Do Not Disturb' : (friend.isOnline ? 'Online' : 'Offline')}
											</span>
										</div>
									</div>
									<div class="flex-shrink-0">
										<form method="POST" action="?/removeFriend" use:enhance>
											<input type="hidden" name="friendshipId" value={friend.friendshipId} />
											<button
												type="submit"
												class="p-2 text-gray-400 hover:text-red-600 rounded-md"
												title="Remove friend"
											>
												<UserMinus class="h-4 w-4" />
											</button>
										</form>
									</div>
								</div>
								
								<div class="mt-4 pt-4 border-t border-gray-100">
									<p class="text-sm text-gray-600">
										Friends since {formatDate(new Date(friend.createdAt))}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Challenges -->
		{#if activeTab === 'challenges'}
			<div class="space-y-6">
				<!-- Header with create button -->
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-900">Writing Challenges</h2>
					<button
						onclick={openCreateChallengeModal}
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
					>
						<Plus class="h-4 w-4 mr-2" />
						Create Challenge
					</button>
				</div>

				{#if data.challenges.length === 0}
					<div class="text-center py-12">
						<Trophy class="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">No challenges available</h3>
						<p class="text-gray-500">Create your first writing challenge or wait for friends to create some!</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{#each data.challenges as challenge}
							<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<div class="flex items-center space-x-2 mb-2">
											<Trophy class="h-5 w-5 text-yellow-500" />
											<h3 class="text-lg font-medium text-gray-900">{challenge.title}</h3>
										</div>
										{#if challenge.description}
											<p class="text-gray-600 mb-3">{challenge.description}</p>
										{/if}
										<div class="space-y-2 text-sm text-gray-500">
											<div class="flex items-center space-x-2">
												<Target class="h-4 w-4" />
												<span>{getChallengeTypeDisplay(challenge.type, challenge.goalValue)}</span>
											</div>
											<div class="flex items-center space-x-2">
												<Calendar class="h-4 w-4" />
												<span>
													{formatDate(new Date(challenge.startDate))}
													{#if challenge.endDate}
														- {formatDate(new Date(challenge.endDate))}
													{/if}
												</span>
											</div>
											<div class="flex items-center space-x-2">
												<Users class="h-4 w-4" />
												<span>{challenge.participantsCount} participant{challenge.participantsCount === 1 ? '' : 's'}</span>
											</div>
										</div>
									</div>
								</div>
								
								<div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
									<p class="text-sm text-gray-600">
										by <strong>{challenge.creatorDisplayName || challenge.creatorUsername}</strong>
									</p>
									{#if !challenge.isParticipating}
										<form method="POST" action="?/joinChallenge" use:enhance>
											<input type="hidden" name="challengeId" value={challenge.id} />
											<button
												type="submit"
												class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
											>
												<Plus class="h-3 w-3 mr-1" />
												Join
											</button>
										</form>
									{:else}
										<span class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md">
											<Check class="h-3 w-3 mr-1" />
											Joined
										</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Add Friend Modal -->
{#if showAddFriendModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-medium text-gray-900">Add Friend</h3>
					<button 
						class="text-gray-400 hover:text-gray-600"
						onclick={closeAddFriendModal}
					>
						<X class="h-5 w-5" />
					</button>
				</div>
				
				<form method="POST" action="?/sendFriendRequest" use:enhance class="space-y-4">
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700 mb-1">
							Username
						</label>
						<input 
							id="username"
							name="username"
							type="text" 
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter username..."
							bind:value={newFriendUsername}
							required
						/>
					</div>
					
					<div class="flex justify-end gap-3 pt-4">
						<button 
							type="button"
							onclick={closeAddFriendModal}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancel
						</button>
						<button 
							type="submit"
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
							disabled={!newFriendUsername.trim()}
						>
							Send Request
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Create Challenge Modal -->
<CreateChallengeModal 
	bind:isOpen={showCreateChallengeModal} 
	onClose={closeCreateChallengeModal}
	onCreate={onChallengeCreated}
/>

<!-- Privacy Settings Modal -->
<PrivacySettingsModal 
	bind:isOpen={showPrivacySettingsModal} 
	onClose={closePrivacySettingsModal}
	{privacySettings}
	onUpdate={onPrivacySettingsUpdated}
/>
