<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FixedUpgradeBanner from '$lib/components/FixedUpgradeBanner.svelte';
	import SubscriptionModal from '$lib/components/SubscriptionModal.svelte';
	import { browser } from '$app/environment';
	
	let { children, data } = $props();

	let showSubscriptionModal = $state(false);
	let bannerDismissed = $state(false);

	const validPathnames = ['/login', '/', ''];
	const DISMISSAL_KEY = 'fixed-upgrade-banner-dismissed';
	const DISMISSAL_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

	// Check if banner was dismissed from localStorage
	$effect(() => {
		if (browser) {
			const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
			if (dismissedAt) {
				const dismissedTime = parseInt(dismissedAt);
				const now = Date.now();
				
				// If less than 2 days have passed, banner is dismissed
				bannerDismissed = now - dismissedTime < DISMISSAL_DURATION;
			}
		}
	});

	// Calculate if banner should show (and thus pb-16 is needed)
	const shouldShowBanner = $derived(() => {
		// Don't show if user is not logged in
		if (!data.user) return false;
		
		// Don't show if user is not on free tier
		if (data.user.subscriptionTier && data.user.subscriptionTier !== 'free') return false;
		
		// Don't show if banner was dismissed
		if (bannerDismissed) return false;
		
		return true;
	});
</script>

<div class="min-h-screen bg-gray-50 flex flex-col {shouldShowBanner() ? 'pb-16' : ''}">
	<Header {data} />

	<!-- Main Content with Advanced Page Transitions -->
	<main
		class="w-full mx-auto flex-1 relative overflow-hidden
			{data.user && !validPathnames.includes(page.url.pathname)
				? 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'
				: ''}"
	>
		{@render children()}
	</main>

	<!-- Footer - Show when user is logged in OR on landing page -->
	{#if data.user || (page.url.pathname === '/' && !data?.user)}
		<Footer />
	{/if}

	<!-- Fixed Upgrade Banner - Show for logged-in free users on all pages -->
	{#if shouldShowBanner()}
		<FixedUpgradeBanner 
			userTier={data.user?.subscriptionTier || 'free'} 
			onUpgrade={() => showSubscriptionModal = true}
			onDismiss={() => {
				bannerDismissed = true;
			}}
		/>
	{/if}
</div>

<!-- Subscription Modal -->
{#if showSubscriptionModal}
	<SubscriptionModal 
		user={data?.user} 
		aiAccess={data?.aiAccess}
		onClose={() => showSubscriptionModal = false}
	/>
{/if}
