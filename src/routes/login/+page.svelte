<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { Sparkles, BookOpen, PenTool } from 'lucide-svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let isLogin = $state(true);
</script>

<!-- Main container with gradient background matching landing page -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
	<!-- Animated background elements matching landing page -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
	</div>

	<div class="min-h-screen flex relative z-10">
		<!-- Left side - Welcome content -->
		<div class="flex-1 flex items-center justify-center p-12" transition:fly={{ x: -50, duration: 600, delay: 0 }}>
			<div class="max-w-md">
				<div class="mb-8" in:fade={{ duration: 800, delay: 200 }}>
					<div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
						<Sparkles class="h-4 w-4" />
						<span>✨ Your writing journey starts here</span>
					</div>
					<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
						Welcome to 
						<span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Writer Buddy
						</span>
					</h1>
					<p class="text-gray-600 text-lg leading-relaxed">
						Your intelligent writing companion. Create, organize, and craft amazing content with AI assistance and powerful analytics.
					</p>
				</div>
				
				<div class="space-y-4" in:fade={{ duration: 800, delay: 400 }}>
					<div class="flex items-center space-x-3 text-gray-700">
						<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
							<BookOpen class="h-4 w-4 text-white" />
						</div>
						<span>Organize projects and track progress</span>
					</div>
					<div class="flex items-center space-x-3 text-gray-700">
						<div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
							<PenTool class="h-4 w-4 text-white" />
						</div>
						<span>AI-powered writing suggestions</span>
					</div>
					<div class="flex items-center space-x-3 text-gray-700">
						<div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
							<Sparkles class="h-4 w-4 text-white" />
						</div>
						<span>Connect with writing community</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Right side - Form -->
		<div class="flex-1 flex items-center justify-center p-8" in:fly={{ x: 50, duration: 600, delay: 200 }}>
			<div class="w-full max-w-md">
				<!-- Back to Home Button -->
				<div class="mb-6" in:fade={{ duration: 400, delay: 450 }}>
					<a 
						href="/" 
						class="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors group"
					>
						<svg class="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
						</svg>
						Back to Home
					</a>
				</div>

				<!-- Login/Register Form Card -->
				<div class="bg-white rounded-2xl shadow-xl p-8 hover-lift" in:fade={{ duration: 400, delay: 500 }}>
					<div class="mb-8">
						<h2 class="text-3xl font-bold text-gray-900 mb-2">
							{isLogin ? 'Welcome Back' : 'Create Account'}
						</h2>
						<p class="text-gray-600">
							{isLogin ? "Don't have an account?" : "Already have an account?"}
							<button 
								type="button"
								class="text-purple-600 hover:text-purple-700 font-medium ml-1 transition-colors"
								onclick={() => isLogin = !isLogin}
							>
								{isLogin ? 'Create one now' : 'Sign in instead'}
							</button>
						</p>
					</div>

					<form method="post" action={isLogin ? "?/login" : "?/register"} use:enhance class="space-y-6">
						{#if !isLogin}
							<div>
								<label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
								<input 
									type="email" 
									id="email" 
									name="email" 
									class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:border-gray-400" 
									placeholder="Enter your email address" 
									required
								/>
							</div>
						{/if}

						<div>
							<label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
								{isLogin ? 'Username' : 'Full Name'}
							</label>
							<input 
								type="text" 
								id="username" 
								name="username" 
								class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:border-gray-400" 
								placeholder={isLogin ? "Enter your username" : "Enter your full name"} 
								required
							/>
						</div>

						{#if !isLogin}
							<div>
								<label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
								<div class="flex">
									<select class="px-4 py-3 border border-r-0 border-gray-300 rounded-l-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-gray-400 transition">
										<option>+91</option>
										<option>+1</option>
										<option>+44</option>
									</select>
									<input 
										type="tel" 
										id="phone"
										name="phone" 
										class="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:border-gray-400" 
										placeholder="Enter phone number" 
										required
									/>
								</div>
							</div>
						{/if}

						<div>
							<label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
							<input 
								type="password" 
								id="password" 
								name="password" 
								class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:border-gray-400" 
								placeholder="Enter your password" 
								required
							/>
						</div>

						{#if !isLogin}
							<div class="flex items-start space-x-3">
								<input type="checkbox" id="terms" name="terms" class="mt-1 h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded transition" required />
								<label for="terms" class="text-sm text-gray-600 leading-relaxed">
									I agree to the <a href="/terms" class="text-purple-600 hover:text-purple-700 font-medium">Terms of Service</a> and <a href="/privacy" class="text-purple-600 hover:text-purple-700 font-medium">Privacy Policy</a>
								</label>
							</div>
						{/if}

						<button type="submit" class="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
							<span class="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
							<div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
						</button>

						{#if form?.message}
							<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
								{form.message}
							</div>
						{/if}
					</form>

					{#if isLogin}
						<div class="mt-6 text-center">
							<a href="/forgot-password" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">
								Forgot your password?
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
