<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { BookOpen, PenTool, User, Settings, Home, LogOut, Users } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	
	let { children, data } = $props();

	// Get profile image URL with fallback to default
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};
</script>

<div class="min-h-screen bg-gray-50">
	{#if page.url.pathname !== '/login' && page.url.pathname !== '/' && page.url.pathname !== '/logout'}
		<!-- Navigation Header -->
		<nav class="bg-white shadow-sm border-b">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center">
						<a href="/dashboard" class="flex items-center space-x-2">
							<PenTool class="h-8 w-8 text-blue-600" />
							<span class="text-xl font-bold text-gray-900">WriterBuddy</span>
						</a>
					</div>
					
					<div class="flex items-center space-x-4">
						<a href="/dashboard" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
							<Home class="h-4 w-4" />
							<span>Dashboard</span>
						</a>
						<a href="/projects" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
							<BookOpen class="h-4 w-4" />
							<span>Projects</span>
						</a>
						<a href="/friends" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
							<Users class="h-4 w-4" />
							<span>Friends</span>
						</a>
						<a href="/profile" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
							{#if data?.user?.profileImage}
								<img 
									src={getProfileImageUrl(data.user.profileImage)} 
									alt="Profile" 
									class="h-6 w-6 rounded-full object-cover"
								/>
							{:else}
								<User class="h-4 w-4" />
							{/if}
							<span>Profile</span>
						</a>
						<form method="POST" action="/logout" use:enhance>
							<button type="submit" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
								<LogOut class="h-4 w-4" />
								<span>Logout</span>
							</button>
						</form>
					</div>
				</div>
			</div>
		</nav>
	{/if}

	<!-- Main Content -->
	<main class="{page.url.pathname === '/login' || page.url.pathname === '' || page.url.pathname === '/logout' ? '' : 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'}">
		{@render children()}
	</main>
</div>
