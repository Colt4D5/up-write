<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	
	let { children, data } = $props();

	const validPathnames = ['/login', '/', '', '/logout'];
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<Header {data} />

	<!-- Main Content with Advanced Page Transitions -->
	<main class="flex-1 relative overflow-hidden {validPathnames.includes(page.url.pathname) ? (page.url.pathname === '/' && !data?.user ? '' : '') : 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'}">
		<PageTransition>
			{@render children()}
		</PageTransition>
	</main>

	<!-- Footer - Show when user is logged in OR on landing page -->
	{#if data.user || (page.url.pathname === '/' && !data?.user)}
		<Footer />
	{/if}
</div>
