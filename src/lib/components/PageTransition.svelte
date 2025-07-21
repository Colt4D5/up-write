<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import { cubicOut, quintOut } from 'svelte/easing';
	import { page } from '$app/state';
	
	let { children } = $props();
	
	// Define transition types for different route patterns
	const getTransitionConfig = (pathname: string) => {
		// Auth pages (login, logout) - slide from right
		if (pathname.includes('/login') || pathname.includes('/logout')) {
			return {
				in: { transition: fly, props: { x: 300, duration: 400, easing: quintOut } },
				out: { transition: fly, props: { x: -100, duration: 200, easing: cubicOut } }
			};
		}
		
		// Dashboard and main pages - fade with slight upward movement
		if (pathname.includes('/dashboard') || pathname.includes('/profile') || pathname.includes('/friends')) {
			return {
				in: { transition: fly, props: { y: 20, duration: 350, easing: cubicOut } },
				out: { transition: fade, props: { duration: 150, easing: cubicOut } }
			};
		}
		
		// Project pages - slide from bottom
		if (pathname.includes('/projects')) {
			return {
				in: { transition: fly, props: { y: 50, duration: 400, easing: quintOut } },
				out: { transition: fly, props: { y: -20, duration: 200, easing: cubicOut } }
			};
		}
		
		// Default transition - simple fade
		return {
			in: { transition: fade, props: { duration: 300, easing: cubicOut } },
			out: { transition: fade, props: { duration: 200, easing: cubicOut } }
		};
	};
	
	let currentPath = $state(page.url.pathname);
	let transitionConfig = $derived(getTransitionConfig(currentPath));
	
	$effect(() => {
		currentPath = page.url.pathname;
	});
</script>

{#key currentPath}
	<div 
		class="w-full h-full"
		in:transitionConfig.in.transition={transitionConfig.in.props}
		out:transitionConfig.out.transition={transitionConfig.out.props}
	>
		{@render children()}
	</div>
{/key}
