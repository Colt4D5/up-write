<script lang="ts">
	import { 
		HelpCircle, 
		BookOpen, 
		Users, 
		Settings, 
		MessageCircle, 
		ChevronDown,
		Mail,
		ExternalLink,
		Search,
		Lightbulb
	} from 'lucide-svelte';
	
	let activeSection = $state<string | null>(null);
	let searchQuery = $state('');

	const faqData = [
		{
			category: 'Getting Started',
			questions: [
				{
					id: 'account-setup',
					question: 'How do I create an account?',
					answer: 'To create an account, click the "Sign Up" button on the homepage and fill out the registration form with your email, username, and password. You\'ll receive a confirmation email to verify your account.'
				},
				{
					id: 'first-project',
					question: 'How do I create my first project?',
					answer: 'After logging in, go to your dashboard and click "New Project". Give your project a title, description, and choose your privacy settings. You can then start adding documents and begin writing!'
				},
				{
					id: 'navigation',
					question: 'How do I navigate the platform?',
					answer: 'Use the main navigation bar to access your Dashboard, Projects, Friends, and Analytics. The sidebar in projects shows all your documents and notebooks for easy organization.'
				}
			]
		},
		{
			category: 'Writing Features',
			questions: [
				{
					id: 'ai-suggestions',
					question: 'How do AI suggestions work?',
					answer: 'Our AI analyzes your writing style and content to provide contextual suggestions for plot development, character insights, and writing improvements. You can enable/disable suggestions in your project settings.'
				},
				{
					id: 'word-count-tracking',
					question: 'How is my word count tracked?',
					answer: 'Word counts are automatically tracked as you write. You can view daily, weekly, and monthly progress in your analytics dashboard. Set daily goals to stay motivated!'
				},
				{
					id: 'document-organization',
					question: 'How do I organize my documents?',
					answer: 'Create notebooks to group related documents within a project. You can drag and drop to reorder, use folders for chapters, and add tags for easy searching.'
				}
			]
		},
		{
			category: 'Friends & Community',
			questions: [
				{
					id: 'add-friends',
					question: 'How do I add friends?',
					answer: 'Go to the Friends page and click "Add Friend". Enter their username and send a friend request. Once accepted, you\'ll be able to see their activity and participate in challenges together.'
				},
				{
					id: 'privacy-settings',
					question: 'Can I control what friends see?',
					answer: 'Yes! You have full control over your privacy. Adjust what information is shared with friends in Privacy Settings, including your writing progress, online status, and project details.'
				},
				{
					id: 'challenges',
					question: 'How do writing challenges work?',
					answer: 'Create or join writing challenges with friends. Set goals for word count, daily streaks, or timed writing sessions. Track progress together and celebrate achievements!'
				}
			]
		},
		{
			category: 'Account & Settings',
			questions: [
				{
					id: 'profile-customization',
					question: 'How do I customize my profile?',
					answer: 'Visit your Profile page to update your display name, bio, profile picture, and writing preferences. You can also set your availability status and notification preferences.'
				},
				{
					id: 'data-export',
					question: 'Can I export my writing?',
					answer: 'Yes! You can export individual documents or entire projects in various formats (PDF, DOCX, TXT). Go to Project Settings and click "Export" to download your work.'
				},
				{
					id: 'account-deletion',
					question: 'How do I delete my account?',
					answer: 'Account deletion can be requested through Account Settings > Delete Account. This action is permanent and will remove all your projects, documents, and data.'
				}
			]
		},
		{
			category: 'Technical Support',
			questions: [
				{
					id: 'sync-issues',
					question: 'My changes aren\'t syncing properly',
					answer: 'If changes aren\'t syncing, try refreshing the page. Check your internet connection and ensure you\'re logged in. Contact support if the issue persists.'
				},
				{
					id: 'browser-compatibility',
					question: 'Which browsers are supported?',
					answer: 'WriterBuddy works best on modern browsers like Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
				},
				{
					id: 'mobile-access',
					question: 'Can I use WriterBuddy on mobile?',
					answer: 'Yes! WriterBuddy is responsive and works on mobile devices. While the full feature set is optimized for desktop, you can write and sync on mobile browsers.'
				}
			]
		}
	];

	const filteredFAQ = $derived.by(() => {
		if (!searchQuery) return faqData;
		
		const query = searchQuery.toLowerCase();
		return faqData.map(category => ({
			...category,
			questions: category.questions.filter(q => 
				q.question.toLowerCase().includes(query) || 
				q.answer.toLowerCase().includes(query)
			)
		})).filter(category => category.questions.length > 0);
	});

	function toggleSection(sectionId: string) {
		activeSection = activeSection === sectionId ? null : sectionId;
	}
</script>

<svelte:head>
	<title>Help & Support - WriterBuddy</title>
	<meta name="description" content="Get help with WriterBuddy. Find answers to common questions, tutorials, and contact support." />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<!-- Header -->
	<div class="text-center mb-12">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			Find answers to common questions, learn how to use WriterBuddy effectively, 
			and get the support you need to focus on your writing.
		</p>
	</div>

	<!-- Search Bar -->
	<div class="max-w-2xl mx-auto mb-12">
		<div class="relative">
			<Search class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
			<input
				bind:value={searchQuery}
				type="text"
				placeholder="Search for help topics..."
				class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="grid md:grid-cols-4 gap-6 mb-16">
		<a 
			href="#getting-started" 
			class="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 text-center transition-colors group"
		>
			<BookOpen class="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
			<h3 class="font-semibold text-gray-900 mb-2">Getting Started</h3>
			<p class="text-sm text-gray-600">New to WriterBuddy? Start here</p>
		</a>

		<a 
			href="#writing-features" 
			class="bg-green-50 hover:bg-green-100 rounded-lg p-6 text-center transition-colors group"
		>
			<Lightbulb class="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
			<h3 class="font-semibold text-gray-900 mb-2">Writing Features</h3>
			<p class="text-sm text-gray-600">Learn about AI and tools</p>
		</a>

		<a 
			href="#community" 
			class="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 text-center transition-colors group"
		>
			<Users class="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
			<h3 class="font-semibold text-gray-900 mb-2">Friends & Community</h3>
			<p class="text-sm text-gray-600">Connect with other writers</p>
		</a>

		<a 
			href="#contact" 
			class="bg-orange-50 hover:bg-orange-100 rounded-lg p-6 text-center transition-colors group"
		>
			<MessageCircle class="h-8 w-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
			<h3 class="font-semibold text-gray-900 mb-2">Contact Support</h3>
			<p class="text-sm text-gray-600">Get personalized help</p>
		</a>
	</div>

	<!-- FAQ Section -->
	<div class="mb-16">
		<h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
		
		{#if filteredFAQ.length === 0}
			<div class="text-center py-8">
				<HelpCircle class="h-16 w-16 text-gray-300 mx-auto mb-4" />
				<p class="text-gray-500">No results found for "{searchQuery}". Try searching for something else.</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each filteredFAQ as category}
					<div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
						<div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
							<h3 class="text-lg font-semibold text-gray-900">{category.category}</h3>
						</div>
						<div class="divide-y divide-gray-200">
							{#each category.questions as faq}
								<div class="px-6 py-4">
									<button
										onclick={() => toggleSection(faq.id)}
										class="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded"
									>
										<span class="text-lg font-medium text-gray-900 pr-4">{faq.question}</span>
										<ChevronDown 
											class="h-5 w-5 text-gray-500 transform transition-transform {activeSection === faq.id ? 'rotate-180' : ''}" 
										/>
									</button>
									{#if activeSection === faq.id}
										<div class="mt-4 text-gray-700 leading-relaxed">
											{faq.answer}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Contact Section -->
	<div id="contact" class="bg-gray-50 rounded-xl p-8 mb-12">
		<h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Still Need Help?</h2>
		
		<div class="grid md:grid-cols-2 gap-8">
			<div class="bg-white rounded-lg p-6 border border-gray-200">
				<div class="flex items-center mb-4">
					<Mail class="h-6 w-6 text-blue-600 mr-3" />
					<h3 class="text-lg font-semibold text-gray-900">Email Support</h3>
				</div>
				<p class="text-gray-600 mb-4">
					Get detailed help via email. We typically respond within 24 hours.
				</p>
				<a 
					href="mailto:support@writerbuddy.com"
					class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
				>
					support@writerbuddy.com
					<ExternalLink class="h-4 w-4 ml-1" />
				</a>
			</div>

			<div class="bg-white rounded-lg p-6 border border-gray-200">
				<div class="flex items-center mb-4">
					<MessageCircle class="h-6 w-6 text-green-600 mr-3" />
					<h3 class="text-lg font-semibold text-gray-900">Live Chat</h3>
				</div>
				<p class="text-gray-600 mb-4">
					Chat with our support team in real-time during business hours (9 AM - 6 PM EST).
				</p>
				<button class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
					Start Chat
					<MessageCircle class="h-4 w-4 ml-2" />
				</button>
			</div>
		</div>
	</div>

	<!-- Resources Section -->
	<div class="text-center">
		<h2 class="text-2xl font-bold text-gray-900 mb-8">Additional Resources</h2>
		<div class="grid md:grid-cols-3 gap-6">
			<a 
				href="/tutorials"
				class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
			>
				<BookOpen class="h-8 w-8 text-blue-600 mx-auto mb-3" />
				<h3 class="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
				<p class="text-sm text-gray-600">Step-by-step guides to get the most out of WriterBuddy</p>
			</a>

			<a 
				href="/community"
				class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
			>
				<Users class="h-8 w-8 text-purple-600 mx-auto mb-3" />
				<h3 class="font-semibold text-gray-900 mb-2">Community Forum</h3>
				<p class="text-sm text-gray-600">Connect with other writers and share tips</p>
			</a>

			<a 
				href="/updates"
				class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
			>
				<Settings class="h-8 w-8 text-gray-600 mx-auto mb-3" />
				<h3 class="font-semibold text-gray-900 mb-2">What's New</h3>
				<p class="text-sm text-gray-600">Latest features and platform updates</p>
			</a>
		</div>
	</div>
</div>
