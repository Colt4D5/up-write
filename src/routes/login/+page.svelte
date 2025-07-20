<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	const auths = {
		hasFacebookLogin: false,
		hasXLogin: false,
		hasInstagramLogin: false,
		hasTikTokLogin: false
	};

	let { form }: { form: ActionData } = $props();
	let isLogin = $state(true);
</script>

<div class="min-h-screen flex">
	<!-- Left side - Image -->
	<div class="flex-1 relative overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-blue-900">
			<!-- Beach/Ocean pattern overlay -->
			<div class={`absolute inset-0 bg-[url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]/20`}></div>
		</div>
		<div class="absolute inset-0 flex items-center justify-center p-12">
			<div class="text-white max-w-md">
				<h1 class="text-5xl font-bold mb-4">Hello World.</h1>
				<p class="text-gray-200 text-lg leading-relaxed">
					Welcome to Writer Buddy - your intelligent writing companion. Create, collaborate, and craft amazing content with AI assistance.
				</p>
			</div>
		</div>
	</div>

	<!-- Right side - Form -->
	<div class="flex-1 bg-gray-50 flex items-center justify-center p-8">
		<div class="w-full max-w-md">
			<div class="mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-2">
					{isLogin ? 'Login' : 'Register'}
				</h2>
				<p class="text-gray-600">
					{isLogin ? "Don't have an account?" : "Already have an account?"}
					<button 
						type="button"
						class="text-blue-600 hover:text-blue-700 font-medium ml-1"
						onclick={() => isLogin = !isLogin}
					>
						{isLogin ? 'Create your account' : 'Sign in'},
					</button>
					it takes less than a minute.
				</p>
			</div>

			<form method="post" action={isLogin ? "?/login" : "?/register"} use:enhance class="space-y-6">
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
						<input
							type="checkbox"
							id="terms"
							name="terms"
							class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
						/>
						<label for="terms" class="ml-2 block text-sm text-gray-600">
							I accept <a href="/terms" class="text-blue-600 hover:text-blue-700">terms and conditions</a> & <a href="/privacy" class="text-blue-600 hover:text-blue-700">privacy policy</a>
						</label>
					</div>
				{/if}

				<button 
					type="submit"
					class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
				>
					{isLogin ? 'LOGIN' : 'LOGIN'}
				</button>

				{#if form?.message}
					<div class="text-red-600 text-sm text-center mt-4">
						{form.message}
					</div>
				{/if}

				{#if auths?.hasFacebookLogin || auths?.hasXLogin || auths?.hasInstagramLogin || auths?.hasTikTokLogin}
					<div class="text-center">
						<p class="text-gray-600 text-sm mb-4">Login with social media</p>
						<div class="flex space-x-4 justify-center">
							<button type="button" aria-label="Login with Facebook" class="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
								<svg fill="#ffffff" width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
									<path d="M21.95 5.005l-3.306-.004c-3.206 0-5.277 2.124-5.277 5.415v2.495H10.05v4.515h3.317l-.004 9.575h4.641l.004-9.575h3.806l-.003-4.514h-3.803v-2.117c0-1.018.241-1.533 1.566-1.533l2.366-.001.01-4.256z"/>
								</svg>
							</button>
							<button type="button" aria-label="Login with X" class="flex items-center justify-center w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-md transition">
								<svg fill="#ffffff	" role="img" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<title>X</title>
									<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
								</svg>
							</button>
							<button type="button" aria-label="Login with TikTok" class="flex items-center justify-center w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-md transition">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
								</svg>
							</button>
							<button type="button" class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md transition" aria-label="Login with Instagram">
								<svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
									<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
										<g id="Dribbble-Light-Preview" transform="translate(-340.000000, -7439.000000)" fill="#ffffff">
											<g id="icons" transform="translate(56.000000, 160.000000)">
												<path d="M289.869652,7279.12273 C288.241769,7279.19618 286.830805,7279.5942 285.691486,7280.72871 C284.548187,7281.86918 284.155147,7283.28558 284.081514,7284.89653 C284.035742,7285.90201 283.768077,7293.49818 284.544207,7295.49028 C285.067597,7296.83422 286.098457,7297.86749 287.454694,7298.39256 C288.087538,7298.63872 288.809936,7298.80547 289.869652,7298.85411 C298.730467,7299.25511 302.015089,7299.03674 303.400182,7295.49028 C303.645956,7294.859 303.815113,7294.1374 303.86188,7293.08031 C304.26686,7284.19677 303.796207,7282.27117 302.251908,7280.72871 C301.027016,7279.50685 299.5862,7278.67508 289.869652,7279.12273 M289.951245,7297.06748 C288.981083,7297.0238 288.454707,7296.86201 288.103459,7296.72603 C287.219865,7296.3826 286.556174,7295.72155 286.214876,7294.84312 C285.623823,7293.32944 285.819846,7286.14023 285.872583,7284.97693 C285.924325,7283.83745 286.155174,7282.79624 286.959165,7281.99226 C287.954203,7280.99968 289.239792,7280.51332 297.993144,7280.90837 C299.135448,7280.95998 300.179243,7281.19026 300.985224,7281.99226 C301.980262,7282.98483 302.473801,7284.28014 302.071806,7292.99991 C302.028024,7293.96767 301.865833,7294.49274 301.729513,7294.84312 C300.829003,7297.15085 298.757333,7297.47145 289.951245,7297.06748 M298.089663,7283.68956 C298.089663,7284.34665 298.623998,7284.88065 299.283709,7284.88065 C299.943419,7284.88065 300.47875,7284.34665 300.47875,7283.68956 C300.47875,7283.03248 299.943419,7282.49847 299.283709,7282.49847 C298.623998,7282.49847 298.089663,7283.03248 298.089663,7283.68956 M288.862673,7288.98792 C288.862673,7291.80286 291.150266,7294.08479 293.972194,7294.08479 C296.794123,7294.08479 299.081716,7291.80286 299.081716,7288.98792 C299.081716,7286.17298 296.794123,7283.89205 293.972194,7283.89205 C291.150266,7283.89205 288.862673,7286.17298 288.862673,7288.98792 M290.655732,7288.98792 C290.655732,7287.16159 292.140329,7285.67967 293.972194,7285.67967 C295.80406,7285.67967 297.288657,7287.16159 297.288657,7288.98792 C297.288657,7290.81525 295.80406,7292.29716 293.972194,7292.29716 C292.140329,7292.29716 290.655732,7290.81525 290.655732,7288.98792" id="instagram-[#167]"></path>
											</g>
										</g>
									</g>
								</svg>
							</button>
						</div>
					</div>
				{/if}
			</form>
		</div>
	</div>
</div>
