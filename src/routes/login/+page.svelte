<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let isLogin = $state(true);
</script>

<div class="min-h-screen flex">
	<!-- Left side - Image -->
	<div class="flex-1 relative overflow-hidden" transition:fly={{ x: -50, duration: 600, delay: 0 }}>
		<div class="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-blue-900">
			<!-- Simplified pattern overlay -->
			<div class="absolute inset-0 opacity-10">
				<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
					<defs>
						<pattern id="pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
							<g fill="white" fill-opacity="0.1">
								<path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
							</g>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#pattern)"/>
				</svg>
			</div>
		</div>
		<div class="absolute inset-0 flex items-center justify-center p-12" in:fade={{ duration: 800, delay: 300 }}>
			<div class="text-white max-w-md">
				<h1 class="text-5xl font-bold mb-4">Hello World.</h1>
				<p class="text-gray-200 text-lg leading-relaxed">
					Welcome to Writer Buddy - your intelligent writing companion. Create, collaborate, and craft amazing content with AI assistance.
				</p>
			</div>
		</div>
	</div>

	<!-- Right side - Form -->
	<div class="flex-1 bg-gray-50 flex items-center justify-center p-8" in:fly={{ x: 50, duration: 600, delay: 200 }}>
		<div class="w-full max-w-md">
			<!-- Back to Home Button -->
			<div class="mb-6" in:fade={{ duration: 400, delay: 450 }}>
				<a 
					href="/" 
					class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
				>
					<svg class="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
					</svg>
					Back to Home
				</a>
			</div>

			<div class="mb-8" in:fade={{ duration: 400, delay: 500 }}>
				<h2 class="text-3xl font-bold text-gray-900 mb-2">
					{isLogin ? 'Login' : 'Register'}
				</h2>
				<p class="text-gray-600">
					{isLogin ? "Don't have an account?" : "Already have an account?"}
					<button 
						type="button"
						class="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors"
						onclick={() => isLogin = !isLogin}
					>
						{isLogin ? 'Create your account' : 'Sign in'},
					</button>
					it takes less than a minute.
				</p>
			</div>

			<form method="post" action={isLogin ? "?/login" : "?/register"} use:enhance class="space-y-6" in:fade={{ duration: 400, delay: 600 }}>
				{#if !isLogin}
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-1">EMAIL ID</label>
						<input 
							type="email" 
							id="email" 
							name="email" 
							class="w-full px-3 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
							placeholder="Enter your email" 
						/>
					</div>
				{/if}

				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-1">
						{isLogin ? 'USERNAME' : 'NAME'}
					</label>
					<input 
						type="text" 
						id="username" 
						name="username" 
						class="w-full px-3 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
						placeholder={isLogin ? "Enter your username" : "Enter your full name"} 
					/>
				</div>

				{#if !isLogin}
					<div>
						<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">PHONE NO</label>
						<div class="flex">
							<select class="px-3 py-3 border border-r-0 border-gray-300 rounded-l-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
								<option>+91</option>
								<option>+1</option>
								<option>+44</option>
							</select>
							<input 
								type="tel" 
								id="phone"
								name="phone" 
								class="flex-1 px-3 py-3 border border-gray-300 rounded-r-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
								placeholder="Enter phone number" 
							/>
						</div>
					</div>
				{/if}

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1">PASSWORD</label>
					<input 
						type="password" 
						id="password" 
						name="password" 
						class="w-full px-3 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
						placeholder="Enter your password" 
					/>
				</div>

				{#if !isLogin}
					<div class="flex items-center">
						<input type="checkbox" id="terms" name="terms" class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
						<label for="terms" class="ml-2 block text-sm text-gray-600">
							I accept <a href="/terms" class="text-blue-600 hover:text-blue-700">terms and conditions</a> & <a href="/privacy" class="text-blue-600 hover:text-blue-700">privacy policy</a>
						</label>
					</div>
				{/if}

				<button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
					{isLogin ? 'LOGIN' : 'REGISTER'}
				</button>

				{#if form?.message}
					<div class="text-red-600 text-sm text-center mt-4">
						{form.message}
					</div>
				{/if}
			</form>
		</div>
	</div>
</div>
