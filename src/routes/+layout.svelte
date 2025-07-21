<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	let { children, data } = $props();

	const validPathnames = ['/login', '/', '', '/logout'];
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<Header {data} />

	<!-- Main Content -->
	<main class="flex-1 {validPathnames.includes(page.url.pathname) ? '' : 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'}">
		{@render children()}
	</main>

	<!-- Footer - Only show when user is logged in -->
	{#if data.user}
		<Footer />
	{/if}
</div>
