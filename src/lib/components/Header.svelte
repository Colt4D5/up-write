<script lang="ts">
	import { page } from '$app/state';
	import { BookOpen, PenTool, User, Settings, Home, LogOut, Users, Crown, BarChart3 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import SubscriptionModal from './SubscriptionModal.svelte';

  const { data } = $props();
	let showSubscriptionModal = $state(false);

	// Get profile image URL with fallback to default
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};

	// Get tier display info
	const getTierInfo = (tier: string) => {
		switch (tier) {
			case 'premium':
				return { name: 'Premium', color: 'text-purple-600' };
			case 'pro':
				return { name: 'Pro', color: 'text-yellow-600' };
			default:
				return { name: 'Free', color: 'text-gray-600' };
		}
	};
</script>

{#if page.url.pathname === '/' && !data?.user}
  <!-- Landing Page Header -->
  <nav class="bg-white shadow-sm border-b fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2 hover-lift transition-transform">
            <PenTool class="h-8 w-8 text-blue-600" />
            <span class="text-xl font-bold text-gray-900">Writer Buddy</span>
          </a>
        </div>
        
        <div class="flex items-center space-x-4">
          <a href="#features" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Features</a>
          <a href="/login" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium hover-lift">
            Sign In
          </a>
        </div>
      </div>
    </div>
  </nav>
{:else if page.url.pathname !== '/login' && page.url.pathname !== '/' && page.url.pathname !== '/logout'}
  <!-- Navigation Header -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/dashboard" class="flex items-center space-x-2 hover-lift transition-transform">
            <PenTool class="h-8 w-8 text-blue-600" />
            <span class="text-xl font-bold text-gray-900">WriterBuddy</span>
          </a>
        </div>
        
        <div class="flex items-center space-x-4">
          <a href="/dashboard" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover-lift">
            <Home class="h-4 w-4" />
            <span>Dashboard</span>
          </a>
          <a href="/projects" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover-lift">
            <BookOpen class="h-4 w-4" />
            <span>Projects</span>
          </a>
          <a href="/analytics" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover-lift">
            <BarChart3 class="h-4 w-4" />
            <span>Analytics</span>
          </a>
          <a href="/friends" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover-lift">
            <Users class="h-4 w-4" />
            <span>Friends</span>
          </a>
          
          <!-- Subscription Settings -->
          {#if data?.user}
            {@const tierInfo = getTierInfo(data.user.subscriptionTier)}
            <button 
              onclick={() => showSubscriptionModal = true}
              data-subscription-trigger
              class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover-lift"
            >
              <Crown class="h-4 w-4" />
              <span class={tierInfo.color}>{tierInfo.name}</span>
            </button>
          {/if}
          
          <a href="/profile" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover-lift">
            {#if data?.user?.profileImage}
              <img 
                src={getProfileImageUrl(data.user.profileImage)} 
                alt="Profile" 
                class="h-6 w-6 rounded-full object-cover transition-transform duration-200 hover:scale-110"
              />
            {:else}
              <User class="h-4 w-4" />
            {/if}
            <span>Profile</span>
          </a>
          <form method="POST" action="/logout" use:enhance>
            <button type="submit" class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover-lift">
              <LogOut class="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </nav>
{/if}

<!-- Subscription Modal -->
{#if showSubscriptionModal && data?.user}
  <SubscriptionModal 
    user={data.user} 
    aiAccess={data.aiAccess} 
    onClose={() => showSubscriptionModal = false} 
  />
{/if}