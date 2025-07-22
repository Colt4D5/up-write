<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FixedUpgradeBanner from '$lib/components/FixedUpgradeBanner.svelte';
	import SubscriptionModal from '$lib/components/SubscriptionModal.svelte';
	
	let { children, data } = $props();

	let showSubscriptionModal = $state(false);

	const validPathnames = ['/login', '/', '', '/logout'];
</script>

<div class="min-h-screen bg-gray-50 flex flex-col {data.user?.subscriptionTier === 'free' || !data.user?.subscriptionTier ? 'pb-16' : ''}">
	<Header {data} />

	<!-- Main Content with Advanced Page Transitions -->
	<main class="max-w-7xl w-full mx-auto flex-1 relative overflow-hidden {validPathnames.includes(page.url.pathname) ? (page.url.pathname === '/' && !data?.user ? '' : '') : 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'}">
		{@render children()}
	</main>

	<!-- Footer - Show when user is logged in OR on landing page -->
	{#if data.user || (page.url.pathname === '/' && !data?.user)}
		<Footer />
	{/if}

	<!-- Fixed Upgrade Banner - Show for logged-in free users on all pages -->
	{#if data.user}
		<FixedUpgradeBanner 
			userTier={data.user.subscriptionTier || 'free'} 
			onUpgrade={() => showSubscriptionModal = true} 
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
