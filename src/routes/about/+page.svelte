<script lang="ts">
	import { Users, Target, Heart, Shield, Zap, Globe, PenTool, BookOpen, Sparkles, Star, Award, ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let heroVisible = $state(false);
	let featuresVisible = $state(false);

	onMount(() => {
		setTimeout(() => heroVisible = true, 100);
		setTimeout(() => featuresVisible = true, 500);
	});
</script>

<svelte:head>
	<title>About - WriterBuddy</title>
	<meta name="description" content="Learn about WriterBuddy - Your AI-powered writing companion for creative writers, novelists, and storytellers." />
</svelte:head>

<!-- Animated Background Elements -->
<div class="fixed inset-0 overflow-hidden pointer-events-none">
	<div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
	<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
</div>

<div class="relative z-10">
	<!-- Hero Section -->
	<div class="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-24">
		<div class="text-center max-w-5xl mx-auto transform transition-all duration-1000 {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}">
			<!-- Floating Icon -->
			<div class="relative mb-8">
				<div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl animate-bounce" style="animation-duration: 3s;">
					<PenTool class="h-12 w-12 text-white" />
				</div>
				<div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
					<Sparkles class="h-4 w-4 text-yellow-900" />
				</div>
			</div>

			<h1 class="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
				About<br />
				<span class="text-5xl md:text-7xl">WriterBuddy</span>
			</h1>
			
			<p class="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
				Your <span class="font-semibold text-blue-600">AI-powered writing companion</span> designed to help 
				<span class="font-semibold text-purple-600">creative writers</span>, 
				<span class="font-semibold text-pink-600">novelists</span>, and 
				<span class="font-semibold text-green-600">storytellers</span> 
				bring their ideas to life with intelligent suggestions, progress tracking, and a supportive community.
			</p>

			<!-- Stats Row -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
				<div class="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
					<div class="text-4xl font-bold text-blue-600 mb-2">50K+</div>
					<div class="text-gray-600 font-medium">Writers Worldwide</div>
				</div>
				<div class="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style="animation-delay: 200ms;">
					<div class="text-4xl font-bold text-purple-600 mb-2">2M+</div>
					<div class="text-gray-600 font-medium">Words Written Daily</div>
				</div>
				<div class="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style="animation-delay: 400ms;">
					<div class="text-4xl font-bold text-pink-600 mb-2">98%</div>
					<div class="text-gray-600 font-medium">User Satisfaction</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Mission Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 shadow-2xl overflow-hidden">
			<!-- Decorative elements -->
			<div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full -mr-32 -mt-32"></div>
			<div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200/40 to-transparent rounded-full -ml-32 -mb-32"></div>
			
			<div class="relative text-center">
				<div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8">
					<Target class="h-10 w-10 text-white" />
				</div>
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Mission</h2>
				<p class="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
					To <span class="font-semibold text-blue-600">empower writers</span> of all levels by providing 
					<span class="font-semibold text-purple-600">intelligent tools</span>, 
					<span class="font-semibold text-pink-600">meaningful connections</span>, 
					and the <span class="font-semibold text-green-600">motivation</span> needed to turn creative ideas into finished works. 
					We believe <span class="font-bold text-gray-900">every story deserves to be told</span>, and 
					<span class="font-bold text-gray-900">every writer deserves the support to tell it</span>.
				</p>
			</div>
		</div>
	</div>

	<!-- Features Grid -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="text-center mb-16">
			<h2 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
				What Makes WriterBuddy Special
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Discover the powerful features that make writing more enjoyable, productive, and rewarding
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-1000 {featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}">
			<!-- Feature 1 -->
			<div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
				<div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="relative z-10">
					<div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
						<Zap class="h-10 w-10 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">AI-Powered Suggestions</h3>
					<p class="text-gray-600 leading-relaxed">
						Get intelligent writing suggestions, plot ideas, and character development insights 
						tailored to your unique writing style.
					</p>
				</div>
			</div>

			<!-- Feature 2 -->
			<div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden" style="animation-delay: 100ms;">
				<div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="relative z-10">
					<div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
						<Target class="h-10 w-10 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Progress Tracking</h3>
					<p class="text-gray-600 leading-relaxed">
						Monitor your writing goals, track daily word counts, and celebrate milestones 
						with visual progress indicators and achievement badges.
					</p>
				</div>
			</div>

			<!-- Feature 3 -->
			<div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden" style="animation-delay: 200ms;">
				<div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="relative z-10">
					<div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
						<Users class="h-10 w-10 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Writing Community</h3>
					<p class="text-gray-600 leading-relaxed">
						Connect with fellow writers, share your progress, participate in challenges, 
						and find motivation through a supportive community.
					</p>
				</div>
			</div>

			<!-- Feature 4 -->
			<div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden" style="animation-delay: 300ms;">
				<div class="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="relative z-10">
					<div class="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
						<Heart class="h-10 w-10 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors">Motivation & Support</h3>
					<p class="text-gray-600 leading-relaxed">
						Stay motivated with personalized encouragement, writing streaks, 
						and a community that celebrates your achievements.
					</p>
				</div>
			</div>

			<!-- Feature 5 -->
			<div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden" style="animation-delay: 400ms;">
				<div class="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="relative z-10">
					<div class="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
						<Shield class="h-10 w-10 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">Privacy Focused</h3>
					<p class="text-gray-600 leading-relaxed">
						Your creative work is sacred. We prioritize your privacy and give you 
						full control over who sees your writing and progress.
					</p>
				</div>
			</div>

			<!-- Feature 6 -->
			<div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden" style="animation-delay: 500ms;">
				<div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="relative z-10">
					<div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
						<Globe class="h-10 w-10 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">Cross-Platform</h3>
					<p class="text-gray-600 leading-relaxed">
						Write wherever inspiration strikes. Access your projects and progress 
						from any device with seamless synchronization.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Story Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="relative">
			<!-- Decorative quote mark -->
			<div class="absolute -top-8 -left-8 text-9xl font-serif text-blue-100 select-none">"</div>
			
			<div class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 md:p-16 shadow-2xl text-white relative overflow-hidden">
				<!-- Decorative elements -->
				<div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
				<div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
				
				<div class="relative z-10">
					<div class="flex items-center mb-8">
						<BookOpen class="h-8 w-8 text-blue-400 mr-4" />
						<h2 class="text-4xl md:text-5xl font-bold">Our Story</h2>
					</div>
					
					<div class="space-y-8 text-lg md:text-xl leading-relaxed font-light">
						<p class="text-gray-100">
							WriterBuddy was born from the understanding that writing can be both 
							<span class="font-semibold text-blue-300">incredibly rewarding</span> 
							and <span class="font-semibold text-purple-300">frustratingly challenging</span>. 
							As writers ourselves, we experienced the loneliness of staring at a blank page, 
							the struggle to maintain motivation, and the difficulty of getting constructive feedback on our work.
						</p>
						<p class="text-gray-100">
							We envisioned a platform that would combine the <span class="font-semibold text-pink-300">power of artificial intelligence</span> 
							with the <span class="font-semibold text-green-300">warmth of human community</span>. 
							A place where writers could find both the technical tools they need and the emotional support 
							that makes the difference between giving up and pushing through.
						</p>
						<p class="text-gray-100">
							Today, WriterBuddy serves <span class="font-bold text-yellow-300">thousands of writers worldwide</span>, 
							from first-time novelists to published authors, all united by their passion for storytelling 
							and their commitment to improving their craft.
						</p>
					</div>

					<!-- Achievement badges -->
					<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
						<div class="text-center">
							<div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
								<Award class="h-8 w-8 text-white" />
							</div>
							<div class="text-sm text-gray-300">Award Winning</div>
						</div>
						<div class="text-center">
							<div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
								<Star class="h-8 w-8 text-white" />
							</div>
							<div class="text-sm text-gray-300">5-Star Rated</div>
						</div>
						<div class="text-center">
							<div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
								<Users class="h-8 w-8 text-white" />
							</div>
							<div class="text-sm text-gray-300">Global Community</div>
						</div>
						<div class="text-center">
							<div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
								<Zap class="h-8 w-8 text-white" />
							</div>
							<div class="text-sm text-gray-300">AI Powered</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Values Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
				Our Values
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				The principles that guide everything we do at WriterBuddy
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="group bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
				<div class="flex items-center mb-6">
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
						<Sparkles class="h-6 w-6 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Creativity First</h3>
				</div>
				<p class="text-gray-700 leading-relaxed text-lg">
					We believe in nurturing and celebrating creativity in all its forms. 
					Every feature we build is designed to enhance, not replace, your creative process.
				</p>
			</div>

			<div class="group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
				<div class="flex items-center mb-6">
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
						<Users class="h-6 w-6 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Community Over Competition</h3>
				</div>
				<p class="text-gray-700 leading-relaxed text-lg">
					Writing doesn't have to be a solitary journey. We foster a supportive environment 
					where writers lift each other up rather than compete.
				</p>
			</div>

			<div class="group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
				<div class="flex items-center mb-6">
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
						<Shield class="h-6 w-6 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Privacy & Respect</h3>
				</div>
				<p class="text-gray-700 leading-relaxed text-lg">
					Your creative work is personal and valuable. We respect your privacy and 
					give you complete control over your content and data.
				</p>
			</div>

			<div class="group bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
				<div class="flex items-center mb-6">
					<div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
						<Zap class="h-6 w-6 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Continuous Innovation</h3>
				</div>
				<p class="text-gray-700 leading-relaxed text-lg">
					We're constantly evolving our platform based on user feedback and the latest 
					advances in AI to provide you with the best writing experience possible.
				</p>
			</div>
		</div>
	</div>

	<!-- CTA Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 shadow-2xl text-white text-center overflow-hidden">
			<!-- Animated background elements -->
			<div class="absolute inset-0">
				<div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -mt-32 -ml-32 animate-pulse"></div>
				<div class="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mb-32 -mr-32 animate-pulse" style="animation-delay: 2s;"></div>
				<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
			</div>
			
			<div class="relative z-10">
				<div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8">
					<Sparkles class="h-10 w-10 text-white animate-pulse" />
				</div>
				
				<h2 class="text-4xl md:text-6xl font-bold mb-6">
					Ready to Start Your<br />
					<span class="text-yellow-300">Writing Journey?</span>
				</h2>
				
				<p class="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto font-light">
					Join <span class="font-semibold text-yellow-300">thousands of writers</span> who are already using WriterBuddy 
					to bring their stories to life and achieve their creative goals.
				</p>
				
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a 
						href="/dashboard"
						class="group inline-flex items-center px-8 py-4 text-xl font-bold text-purple-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
					>
						Get Started Today
						<ArrowRight class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
					</a>
					
					<div class="text-white/80 text-sm">
						✨ Free to start • No credit card required • Join in 30 seconds
					</div>
				</div>
				
				<!-- Social proof -->
				<div class="flex justify-center items-center space-x-8 mt-12 opacity-80">
					<div class="text-center">
						<div class="text-2xl font-bold">50K+</div>
						<div class="text-sm">Happy Writers</div>
					</div>
					<div class="w-px h-12 bg-white/30"></div>
					<div class="text-center">
						<div class="text-2xl font-bold">⭐ 4.9</div>
						<div class="text-sm">User Rating</div>
					</div>
					<div class="w-px h-12 bg-white/30"></div>
					<div class="text-center">
						<div class="text-2xl font-bold">2M+</div>
						<div class="text-sm">Words Written</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
