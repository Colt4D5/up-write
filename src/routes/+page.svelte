<script lang="ts">
	import { 
		BookOpen, 
		PenTool, 
		Users, 
		Target, 
		BarChart3, 
		Lightbulb, 
		CheckCircle, 
		Star,
		ArrowRight,
		Zap,
		Shield,
		Clock,
		Sparkles,
		TrendingUp,
		Award,
		Heart,
		Coffee,
		Feather
	} from 'lucide-svelte';
	import { fade, fly, scale, blur } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Animation states
	let heroVisible = $state(false);
	let featuresVisible = $state(false);
	let benefitsVisible = $state(false);
	let testimonialsVisible = $state(false);
	let statsVisible = $state(false);
	let ctaVisible = $state(false);

	// Intersection Observer for scroll animations
	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const target = entry.target;
					if (target.id === 'hero') heroVisible = true;
					if (target.id === 'features') featuresVisible = true;
					if (target.id === 'benefits') benefitsVisible = true;
					if (target.id === 'testimonials') testimonialsVisible = true;
					if (target.id === 'stats') statsVisible = true;
					if (target.id === 'cta') ctaVisible = true;
				}
			});
		}, { threshold: 0.1 });

		// Observe all sections
		document.querySelectorAll('section[id]').forEach((section) => {
			observer.observe(section);
		});

		// Hero is immediately visible
		heroVisible = true;

		return () => observer.disconnect();
	});

	const features = [
		{
			icon: BookOpen,
			title: 'Organized Projects',
			description: 'Keep your novels, short stories, and articles organized with our intuitive project management system.',
			color: 'from-blue-500 to-blue-600'
		},
		{
			icon: PenTool,
			title: 'Rich Text Editor',
			description: 'Write with a beautiful, distraction-free editor that supports formatting, comments, and real-time collaboration.',
			color: 'from-purple-500 to-purple-600'
		},
		{
			icon: Target,
			title: 'Goal Tracking',
			description: 'Set writing goals, track your daily word count, and stay motivated with detailed progress analytics.',
			color: 'from-green-500 to-green-600'
		},
		{
			icon: BarChart3,
			title: 'Writing Analytics',
			description: 'Get insights into your writing habits, productivity patterns, and track your improvement over time.',
			color: 'from-orange-500 to-orange-600'
		},
		{
			icon: Users,
			title: 'Writing Community',
			description: 'Connect with fellow writers, share progress, and get feedback on your work from a supportive community.',
			color: 'from-pink-500 to-pink-600'
		},
		{
			icon: Lightbulb,
			title: 'AI-Powered Suggestions',
			description: 'Get intelligent writing suggestions, overcome writer\'s block, and improve your craft with AI assistance.',
			color: 'from-yellow-500 to-yellow-600'
		}
	];

	const benefits = [
		{ text: 'Stay organized with project notebooks for chapters, characters, plot points, and research', icon: BookOpen },
		{ text: 'Track your writing progress with detailed word count analytics', icon: BarChart3 },
		{ text: 'Set and achieve daily, weekly, and monthly writing goals', icon: Target },
		{ text: 'Get AI-powered writing suggestions and feedback', icon: Sparkles },
		{ text: 'Connect with other writers and build a supportive network', icon: Heart },
		{ text: 'Write anywhere with our responsive, cloud-synced platform', icon: Coffee }
	];

	const testimonials = [
		{
			name: 'Sarah M.',
			role: 'Romance Novelist',
			content: 'Writer Buddy helped me finish my first novel! The goal tracking kept me motivated, and the community feedback was invaluable.',
			rating: 5,
			avatar: '💝',
			bgGradient: 'from-pink-100 to-rose-100'
		},
		{
			name: 'David K.',
			role: 'Freelance Writer',
			content: 'The analytics feature showed me when I\'m most productive. I\'ve increased my daily word count by 40% since joining!',
			rating: 5,
			avatar: '📊',
			bgGradient: 'from-blue-100 to-indigo-100'
		},
		{
			name: 'Emma L.',
			role: 'Fantasy Author',
			content: 'The character and plot notebooks are game-changers. I can keep all my world-building organized in one place.',
			rating: 5,
			avatar: '🏰',
			bgGradient: 'from-purple-100 to-violet-100'
		}
	];

	const stats = [
		{ value: '15,000+', label: 'Active Writers', icon: Users, delay: 0 },
		{ value: '12M+', label: 'Words Written', icon: Feather, delay: 100 },
		{ value: '2,400+', label: 'Books Completed', icon: Award, delay: 200 },
		{ value: '99%', label: 'Satisfaction Rate', icon: Heart, delay: 300 }
	];
</script>

<svelte:head>
	<title>Writer Buddy - Your Complete Writing Companion</title>
	<meta name="description" content="The all-in-one platform for writers. Track your progress, organize your projects, get AI-powered suggestions, and connect with a community of writers." />
</svelte:head>

<!-- Hero Section -->
<section id="hero" class="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 overflow-hidden">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			{#if heroVisible}
				<div in:fly={{ y: 50, duration: 800, delay: 200 }}>
					<div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
						<Sparkles class="h-4 w-4" />
						<span>✨ Transform your writing journey today</span>
					</div>
				</div>
				
				<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight" in:fly={{ y: 50, duration: 800, delay: 400 }}>
					Your Complete
					<span class="relative">
						<span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
							Writing Companion
						</span>
						<div class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-lg opacity-75 animate-pulse"></div>
					</span>
				</h1>
				
				<p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed" in:fly={{ y: 50, duration: 800, delay: 600 }}>
					Stay organized, track your progress, get AI-powered insights, and connect with fellow writers. 
					Everything you need to turn your writing dreams into <span class="text-purple-600 font-semibold">reality</span>.
				</p>
				
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" in:fly={{ y: 50, duration: 800, delay: 800 }}>
					<a href="/login" class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center space-x-2 text-lg transform hover:scale-105 hover:shadow-2xl">
						<span>Start Writing Today</span>
						<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
						<div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
					</a>
					<a href="#features" class="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105">
						<span class="group-hover:text-gray-900">Learn More</span>
					</a>
				</div>
				
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-500" in:fade={{ duration: 800, delay: 1000 }}>
					<div class="flex items-center space-x-2">
						<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span>Free to get started</span>
					</div>
					<div class="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
					<div class="flex items-center space-x-2">
						<Shield class="h-4 w-4 text-green-500" />
						<span>No credit card required</span>
					</div>
					<div class="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
					<div class="flex items-center space-x-2">
						<Clock class="h-4 w-4 text-green-500" />
						<span>2 minute setup</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Floating elements -->
	<div class="absolute top-20 left-10 animate-bounce" style="animation-delay: 0.5s;">
		<div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
			<PenTool class="h-4 w-4 text-blue-600" />
		</div>
	</div>
	<div class="absolute top-40 right-20 animate-bounce" style="animation-delay: 1.5s;">
		<div class="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
			<Sparkles class="h-5 w-5 text-purple-600" />
		</div>
	</div>
	<div class="absolute bottom-20 left-20 animate-bounce" style="animation-delay: 2.5s;">
		<div class="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center">
			<Heart class="h-3 w-3 text-pink-600" />
		</div>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="py-20 bg-gradient-to-b from-white to-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if featuresVisible}
			<div class="text-center mb-16" in:fly={{ y: 50, duration: 800 }}>
				<div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
					<Zap class="h-4 w-4" />
					<span>Powerful Features</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything You Need to Write Better</h2>
				<p class="text-lg text-gray-600 max-w-2xl mx-auto">
					From first draft to published work, Writer Buddy provides all the tools and support you need.
				</p>
			</div>
		{/if}
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each features as feature, i}
				{#if featuresVisible}
					<div 
						class="group relative p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
						in:fly={{ y: 80, duration: 800, delay: i * 100 }}
					>
						<!-- Gradient background on hover -->
						<div class="absolute inset-0 bg-gradient-to-br {feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500"></div>
						
						<div class="relative">
							<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br {feature.color} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
								<feature.icon class="h-8 w-8" />
							</div>
							<h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">{feature.title}</h3>
							<p class="text-gray-600 leading-relaxed group-hover:text-gray-700">{feature.description}</p>
						</div>
						
						<!-- Decorative corner accent -->
						<div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br {feature.color} opacity-10 rounded-2xl transform rotate-45 translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-300"></div>
					</div>
				{/if}
			{/each}
		</div>

		{#if featuresVisible}
			<div class="text-center mt-16" in:fade={{ duration: 800, delay: 800 }}>
				<div class="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full">
					<div class="flex -space-x-2">
						<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white flex items-center justify-center">
							<span class="text-white text-xs font-bold">AI</span>
						</div>
						<div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
							<TrendingUp class="h-4 w-4 text-white" />
						</div>
						<div class="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full border-2 border-white flex items-center justify-center">
							<Users class="h-4 w-4 text-white" />
						</div>
					</div>
					<span class="text-gray-700 font-medium">Join 15,000+ writers already creating amazing content</span>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Benefits Section -->
<section id="benefits" class="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
	<!-- Background decoration -->
	<div class="absolute top-0 left-0 w-full h-full">
		<div class="absolute top-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
		<div class="absolute bottom-10 left-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div>
				{#if benefitsVisible}
					<div in:fly={{ x: -50, duration: 800 }}>
						<div class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
							<CheckCircle class="h-4 w-4" />
							<span>Why Choose Writer Buddy</span>
						</div>
						<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Why Writers Choose 
							<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Writer Buddy</span>
						</h2>
						<p class="text-lg text-gray-600 mb-8">
							Join thousands of writers who have transformed their writing process and achieved their publishing goals.
						</p>
					</div>
					
					<div class="space-y-6">
						{#each benefits as benefit, i}
							<div 
								class="flex items-start space-x-4 p-4 bg-white/80 backdrop-blur rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
								in:fly={{ x: -50, duration: 600, delay: 200 + (i * 100) }}
							>
								<div class="flex-shrink-0">
									<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
										<benefit.icon class="h-6 w-6 text-white" />
									</div>
								</div>
								<p class="text-gray-700 font-medium leading-relaxed">{benefit.text}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			
			<div class="relative">
				{#if benefitsVisible}
					<div class="relative" in:fly={{ x: 50, duration: 800, delay: 300 }}>
						<!-- Main dashboard mockup -->
						<div class="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
							<div class="flex items-center space-x-4 mb-8">
								<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
									<BarChart3 class="h-8 w-8 text-white" />
								</div>
								<div>
									<h3 class="text-xl font-bold text-gray-900">Writing Progress</h3>
									<p class="text-gray-600">Your weekly stats</p>
								</div>
								<div class="ml-auto">
									<div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
								</div>
							</div>
							
							<div class="space-y-6">
								<div class="flex justify-between items-center">
									<span class="text-gray-600 font-medium">Daily Goal</span>
									<div class="flex items-center space-x-2">
										<span class="font-bold text-gray-900">500 words</span>
										<Target class="h-4 w-4 text-blue-500" />
									</div>
								</div>
								
								<div class="flex justify-between items-center">
									<span class="text-gray-600 font-medium">This Week</span>
									<div class="flex items-center space-x-2">
										<span class="font-bold text-green-600">4,200 words</span>
										<TrendingUp class="h-4 w-4 text-green-500" />
									</div>
								</div>
								
								<div class="space-y-2">
									<div class="flex justify-between items-center text-sm">
										<span class="text-gray-500">Progress</span>
										<span class="text-gray-700 font-semibold">84%</span>
									</div>
									<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
										<div 
											class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
											style="width: 84%"
											in:scale={{ duration: 1000, delay: 800 }}
										></div>
									</div>
									<p class="text-sm text-gray-500 mt-2">🔥 On fire! Keep up the great work!</p>
								</div>

								<!-- Mini achievement badges -->
								<div class="flex space-x-2 pt-4 border-t border-gray-100">
									<div class="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
										<Award class="h-3 w-3 text-yellow-600" />
										<span class="text-xs font-medium text-yellow-800">7 Day Streak</span>
									</div>
									<div class="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
										<Zap class="h-3 w-3 text-blue-600" />
										<span class="text-xs font-medium text-blue-800">Goal Master</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Floating stat cards -->
						<div 
							class="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
							in:scale={{ duration: 600, delay: 1000 }}
						>
							<div class="flex items-center space-x-2">
								<Sparkles class="h-5 w-5" />
								<div>
									<div class="text-sm opacity-90">Today</div>
									<div class="font-bold">847 words</div>
								</div>
							</div>
						</div>

						<div 
							class="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300"
							in:scale={{ duration: 600, delay: 1200 }}
						>
							<div class="flex items-center space-x-2">
								<Heart class="h-5 w-5" />
								<div>
									<div class="text-sm opacity-90">Community</div>
									<div class="font-bold">+12 likes</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section id="testimonials" class="py-20 bg-white relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if testimonialsVisible}
			<div class="text-center mb-16" in:fly={{ y: 50, duration: 800 }}>
				<div class="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
					<Star class="h-4 w-4" />
					<span>Writer Success Stories</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Writers Say About Us</h2>
				<p class="text-lg text-gray-600">Join a community of successful writers achieving their dreams</p>
			</div>
		{/if}
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each testimonials as testimonial, i}
				{#if testimonialsVisible}
					<div 
						class="group relative bg-gradient-to-br {testimonial.bgGradient} border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
						in:fly={{ y: 80, duration: 800, delay: i * 150 }}
					>
						<!-- Avatar -->
						<div class="flex items-center mb-6">
							<div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
								{testimonial.avatar}
							</div>
							<div class="ml-4">
								<div class="font-bold text-gray-900">{testimonial.name}</div>
								<div class="text-gray-600 text-sm">{testimonial.role}</div>
							</div>
						</div>

						<!-- Rating -->
						<div class="flex mb-6">
							{#each Array(testimonial.rating) as _, starIndex}
								<Star class="h-5 w-5 text-yellow-400 fill-current" />
							{/each}
						</div>
						
						<!-- Quote -->
						<blockquote class="text-gray-700 mb-6 leading-relaxed font-medium relative">
							<span class="text-4xl text-gray-300 absolute -top-2 -left-1 font-serif">"</span>
							<span class="relative z-10">{testimonial.content}</span>
							<span class="text-4xl text-gray-300 absolute -bottom-4 -right-1 font-serif">"</span>
						</blockquote>

						<!-- Decorative element -->
						<div class="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
							<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg transform rotate-12"></div>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		{#if testimonialsVisible}
			<!-- Trust indicators -->
			<div class="text-center mt-16" in:fade={{ duration: 800, delay: 600 }}>
				<div class="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 bg-gray-50 px-8 py-6 rounded-2xl">
					<div class="flex items-center space-x-2">
						<div class="flex -space-x-1">
							{#each Array(5) as _, i}
								<Star class="h-5 w-5 text-yellow-400 fill-current" />
							{/each}
						</div>
						<span class="font-semibold text-gray-900">4.9/5 rating</span>
					</div>
					<div class="w-px h-8 bg-gray-300 hidden sm:block"></div>
					<div class="text-gray-600">
						<span class="font-semibold text-gray-900">2,000+</span> reviews from happy writers
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Stats Section -->
<section id="stats" class="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
	<!-- Animated background -->
	<div class="absolute inset-0">
		<div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
		<div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if statsVisible}
			<div class="text-center mb-16" in:fly={{ y: 50, duration: 800 }}>
				<div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
					<TrendingUp class="h-4 w-4" />
					<span>Growing Community</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-bold mb-4">Trusted by Writers Worldwide</h2>
				<p class="text-lg text-white/90">Join our thriving community of successful writers</p>
			</div>
		{/if}
		
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			{#each stats as stat, i}
				{#if statsVisible}
					<div 
						class="text-center group"
						in:fly={{ y: 80, duration: 800, delay: stat.delay }}
					>
						<div class="relative mb-4">
							<div class="w-20 h-20 mx-auto bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
								<stat.icon class="h-10 w-10 text-white" />
							</div>
							<!-- Pulse ring -->
							<div class="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-white/20 animate-ping opacity-20"></div>
						</div>
						
						<div 
							class="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
							in:scale={{ duration: 1000, delay: stat.delay + 200 }}
						>
							{stat.value}
						</div>
						<div class="text-white/90 font-medium">{stat.label}</div>
						
						<!-- Achievement indicator -->
						{#if i === 0}
							<div class="inline-flex items-center space-x-1 bg-green-500/30 text-green-100 px-2 py-1 rounded-full text-xs font-medium mt-2">
								<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span>+50 today</span>
							</div>
						{:else if i === 1}
							<div class="inline-flex items-center space-x-1 bg-yellow-500/30 text-yellow-100 px-2 py-1 rounded-full text-xs font-medium mt-2">
								<Feather class="h-3 w-3" />
								<span>and growing</span>
							</div>
						{:else if i === 2}
							<div class="inline-flex items-center space-x-1 bg-purple-500/30 text-purple-100 px-2 py-1 rounded-full text-xs font-medium mt-2">
								<Award class="h-3 w-3" />
								<span>published</span>
							</div>
						{:else}
							<div class="inline-flex items-center space-x-1 bg-pink-500/30 text-pink-100 px-2 py-1 rounded-full text-xs font-medium mt-2">
								<Heart class="h-3 w-3" />
								<span>love us</span>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>

		{#if statsVisible}
			<!-- Bottom CTA in stats -->
			<div class="text-center mt-16" in:fade={{ duration: 800, delay: 1000 }}>
				<div class="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white/10 backdrop-blur border border-white/20 px-8 py-6 rounded-2xl">
					<div class="flex items-center space-x-3">
						<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
							<Sparkles class="h-6 w-6 text-white" />
						</div>
						<div class="text-left">
							<div class="font-semibold text-white">Ready to join them?</div>
							<div class="text-white/80 text-sm">Start your writing journey today</div>
						</div>
					</div>
					<a href="/login" class="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
						Get Started Free
					</a>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section id="cta" class="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
	<!-- Animated background elements -->
	<div class="absolute inset-0">
		<div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-purple-900/95"></div>
		<!-- Floating orbs -->
		<div class="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
		
		<!-- Grid pattern -->
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPHN2Zz4=')] opacity-30"></div>
	</div>

	<div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if ctaVisible}
			<div class="text-center">
				<!-- Badge -->
				<div in:fly={{ y: 50, duration: 800 }}>
					<div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8">
						<Sparkles class="h-4 w-4 text-yellow-400" />
						<span>Limited Time: Free Premium Features for Early Adopters</span>
						<Zap class="h-4 w-4 text-yellow-400" />
					</div>
				</div>

				<!-- Main heading -->
				<div in:fly={{ y: 50, duration: 800, delay: 200 }}>
					<h2 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
						Ready to Transform 
						<span class="relative">
							<span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
								Your Writing?
							</span>
							<!-- Underline decoration -->
							<div class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-60"></div>
						</span>
					</h2>
				</div>

				<div in:fly={{ y: 50, duration: 800, delay: 400 }}>
					<p class="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Join thousands of writers who have already discovered the power of 
						<span class="text-blue-400 font-semibold">organized</span>, 
						<span class="text-purple-400 font-semibold">goal-driven</span> writing.
					</p>
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12" in:fly={{ y: 50, duration: 800, delay: 600 }}>
					<a href="/login" class="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
						<Zap class="h-6 w-6 group-hover:animate-pulse" />
						<span>Start Your Free Account</span>
						<ArrowRight class="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
						<!-- Glow effect -->
						<div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 rounded-2xl blur transition-opacity duration-300"></div>
					</a>
					
					<div class="text-center">
						<div class="text-gray-400 text-sm mb-2">or</div>
						<a href="#features" class="group text-gray-300 hover:text-white font-semibold flex items-center space-x-2 transition-colors duration-300">
							<span class="underline underline-offset-4 decoration-2 decoration-gray-600 group-hover:decoration-white">Learn more about features</span>
							<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
						</a>
					</div>
				</div>
				
				<!-- Trust indicators -->
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto" in:fade={{ duration: 800, delay: 800 }}>
					<div class="flex flex-col items-center space-y-2 p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10">
						<Shield class="h-8 w-8 text-green-400" />
						<span class="font-semibold text-white">Secure & Private</span>
						<span class="text-gray-400 text-sm">Your data is protected</span>
					</div>
					<div class="flex flex-col items-center space-y-2 p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10">
						<Clock class="h-8 w-8 text-blue-400" />
						<span class="font-semibold text-white">Quick Setup</span>
						<span class="text-gray-400 text-sm">Ready in 2 minutes</span>
					</div>
					<div class="flex flex-col items-center space-y-2 p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10">
						<CheckCircle class="h-8 w-8 text-purple-400" />
						<span class="font-semibold text-white">No Credit Card</span>
						<span class="text-gray-400 text-sm">Free to get started</span>
					</div>
				</div>

				<!-- Social proof -->
				<div class="mt-12" in:fade={{ duration: 800, delay: 1000 }}>
					<p class="text-gray-400 mb-4">Trusted by writers at</p>
					<div class="flex justify-center items-center space-x-8 opacity-60">
						<!-- Placeholder for company logos -->
						<div class="flex items-center space-x-2 text-gray-500">
							<BookOpen class="h-6 w-6" />
							<span class="font-semibold">Publishers</span>
						</div>
						<div class="w-px h-6 bg-gray-600"></div>
						<div class="flex items-center space-x-2 text-gray-500">
							<Users class="h-6 w-6" />
							<span class="font-semibold">Writing Groups</span>
						</div>
						<div class="w-px h-6 bg-gray-600"></div>
						<div class="flex items-center space-x-2 text-gray-500">
							<Award class="h-6 w-6" />
							<span class="font-semibold">Authors</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Decorative elements -->
	<div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
</section>
