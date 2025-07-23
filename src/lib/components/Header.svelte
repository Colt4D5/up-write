<script lang="ts">
	import { page } from '$app/state';
	import { BookOpen, PenTool, User, Settings, Home, LogOut, Users, Crown, Sparkles } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import SubscriptionModal from './SubscriptionModal.svelte';

  const { data } = $props();
	let showSubscriptionModal = $state(false);
	let showProfileMenu = $state(false);

	// Get profile image URL with fallback to default
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};

	// Get tier display info
	const getTierInfo = (tier: string) => {
		switch (tier) {
			case 'premium':
				return { 
					name: '✨ Premium',
					bgColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
					color: 'text-white',
					showUpgradeBadge: false
				};
			case 'pro':
				return { 
					name: '🔥 Pro',
					bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
					color: 'text-white',
					showUpgradeBadge: false
				};
			default:
				return { 
					name: '🚀 Upgrade Now',
					bgColor: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
					color: 'text-white',
					showUpgradeBadge: true
				};
		}
	};

	// Close profile menu when clicking outside
	function handleOutsideClick(event: MouseEvent) {
		if (showProfileMenu && !event.target?.closest('[data-profile-menu]')) {
			showProfileMenu = false;
		}
	}

	// Add event listener when component mounts
	$effect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleOutsideClick);
			return () => {
				document.removeEventListener('click', handleOutsideClick);
			};
		}
	});
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
      <div class="flex justify-between items-center h-16">
        
        <!-- Left: Logo -->
        <div class="flex items-center">
          <a href="/dashboard" class="flex items-center space-x-2 hover-lift transition-transform">
            <PenTool class="h-8 w-8 text-blue-600" />
            <span class="text-xl font-bold text-gray-900">WriterBuddy</span>
          </a>
        </div>
        
        <!-- Center: Main Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            href="/dashboard" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift {
              page.url.pathname === '/dashboard' || page.url.pathname === '/' 
                ? 'text-green-600 bg-green-50 border-b-2 border-green-600' 
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }"
          >
            <Home class="h-4 w-4" />
            <span>Dashboard</span>
          </a>
          <a 
            href="/projects" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift {
              page.url.pathname.startsWith('/projects') 
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }"
          >
            <BookOpen class="h-4 w-4" />
            <span>Projects</span>
          </a>
          <a 
            href="/friends" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift {
              page.url.pathname.startsWith('/friends') 
                ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600' 
                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
            }"
          >
            <Users class="h-4 w-4" />
            <span>Friends</span>
          </a>
        </div>
        
        <!-- Right: Upgrade Button + Profile Menu -->
        <div class="flex items-center space-x-4">
          <!-- Subscription Settings -->
          {#if data?.user}
            {@const tierInfo = getTierInfo(data.user.subscriptionTier)}
            <div class="relative group">
              <button 
                onclick={() => showSubscriptionModal = true}
                data-subscription-trigger
                class="relative group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover-lift {tierInfo.bgColor} {tierInfo.color} {tierInfo.showUpgradeBadge ? 'shadow-lg hover:shadow-xl upgrade-button-shimmer upgrade-gentle-pulse' : ''} overflow-hidden"
              >
                {#if tierInfo.showUpgradeBadge}
                  <!-- Free tier - make it enticing! -->
                  <div class="flex items-center space-x-2 relative z-10">
                    <div class="flex items-center space-x-1">
                      <Sparkles class="h-4 w-4 text-yellow-300 animate-pulse" />
                      <span class="font-bold tracking-wide">{tierInfo.name}</span>
                    </div>
                    <div class="flex items-center text-xs bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full font-bold animate-bounce" style="animation-duration: 2s;">
                      AI + More!
                    </div>
                  </div>
                  <!-- Animated glow effect on hover -->
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 rounded-lg blur-sm transition-opacity duration-300 -z-10"></div>
                  
                  <!-- Tooltip on hover -->
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                    <div class="text-center">
                      <div class="font-semibold text-yellow-300">✨ Unlock Premium Features</div>
                      <div class="mt-1">AI Writing Assistant • Unlimited Projects • Advanced Analytics</div>
                    </div>
                    <!-- Arrow pointing up -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                {:else}
                  <!-- Premium/Pro tiers - elegant display -->
                  <Crown class="h-4 w-4" />
                  <span>{tierInfo.name}</span>
                {/if}
              </button>
            </div>
          {/if}

          <!-- Profile Dropdown -->
          {#if data?.user}
            <div class="relative" data-profile-menu>
              <button 
                onclick={() => showProfileMenu = !showProfileMenu}
                class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-50 transition-all duration-200 hover-lift"
              >
                <img 
                  src={getProfileImageUrl(data.user.profileImage)} 
                  alt="Profile" 
                  class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 hover:ring-gray-300 transition-all duration-200"
                />
              </button>

              <!-- Dropdown Menu -->
              {#if showProfileMenu}
                <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <!-- User info header -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="flex items-center space-x-3">
                      <img 
                        src={getProfileImageUrl(data.user.profileImage)} 
                        alt="Profile" 
                        class="h-8 w-8 rounded-full object-cover"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {data.user.displayName || data.user.username}
                        </p>
                        <p class="text-xs text-gray-500 truncate">
                          {data.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Menu items -->
                  <a 
                    href="/profile" 
                    onclick={() => showProfileMenu = false}
                    class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User class="h-4 w-4" />
                    <span>View Profile</span>
                  </a>
                  
                  <form method="POST" action="/logout" use:enhance>
                    <button 
                      type="submit"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      onclick={() => showProfileMenu = false}
                    >
                      <LogOut class="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </form>
                </div>
              {/if}
            </div>
          {/if}
          
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