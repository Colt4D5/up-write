<script lang="ts">
	import { enhance } from '$app/forms';
	import { LogOut, Loader2 } from 'lucide-svelte';
	
	let isLoggingOut = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<LogOut class="mx-auto h-12 w-12 text-gray-400" />
			<h2 class="mt-6 text-3xl font-extrabold text-gray-900">
				Logging out
			</h2>
			<p class="mt-2 text-sm text-gray-600">
				Please wait while we securely log you out...
			</p>
		</div>
		
		<form method="post" use:enhance={() => {
			isLoggingOut = true;
			return async ({ update }) => {
				await update();
				isLoggingOut = false;
			};
		}} class="mt-8 space-y-6">
			<div class="text-center">
				{#if isLoggingOut}
					<div class="flex items-center justify-center space-x-2">
						<Loader2 class="h-5 w-5 animate-spin text-blue-600" />
						<span class="text-sm text-gray-600">Logging out...</span>
					</div>
				{:else}
					<button
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
					>
						<LogOut class="h-4 w-4 mr-2" />
						Complete Logout
					</button>
				{/if}
			</div>
		</form>
		
		<!-- Auto-submit the form on page load -->
		<script>
			// Auto-submit the logout form when the page loads
			if (typeof window !== 'undefined') {
				setTimeout(() => {
					const form = document.querySelector('form');
					if (form) {
						form.requestSubmit();
					}
				}, 1000); // 1 second delay to show the logout page briefly
			}
		</script>
	</div>
</div>
