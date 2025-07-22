<script lang="ts">
	import { Crown, X, Check, ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { userTier, onUpgrade }: { userTier: string; onUpgrade?: () => void } = $props();
	
	let showBanner = $state(false);
	let isVisible = $state(false);
	
	const DISMISSAL_KEY = 'fixed-upgrade-banner-dismissed';
	const DISMISSAL_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

	onMount(() => {
		// Only show banner for free tier users
		if (userTier !== 'free') {
			return;
		}

		// Check if banner was recently dismissed
		const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
		if (dismissedAt) {
			const dismissedTime = parseInt(dismissedAt);
			const now = Date.now();
			
			// If less than 2 days have passed, don't show the banner
			if (now - dismissedTime < DISMISSAL_DURATION) {
				return;
			}
		}

		// Show the banner with a slight delay for better UX
		setTimeout(() => {
			showBanner = true;
			// Add another small delay for the slide-in animation
			setTimeout(() => {
				isVisible = true;
			}, 50);
		}, 2000); // Show after 2 seconds on page load
		
		// For development: Add global function to reset dismissal
		if (typeof window !== 'undefined') {
			(window as any).resetFixedUpgradeBanner = () => {
				localStorage.removeItem(DISMISSAL_KEY);
				console.log('Fixed upgrade banner dismissal reset');
			};
		}
	});

	function dismissBanner() {
		isVisible = false;
		
		// Wait for animation to complete before hiding
		setTimeout(() => {
			showBanner = false;
			// Store dismissal timestamp
			localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
		}, 300);
	}

	function handleUpgrade() {
		if (onUpgrade) {
			onUpgrade();
		}
		// Don't dismiss immediately - let the user see the modal
	}

	const features = [
		'AI Writing Assistant',
		'Unlimited Projects',
		'Advanced Analytics'
	];
</script>

{#if showBanner}
	<div 
		class="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl border-t border-white/20 transition-all duration-300 {isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0'}"
	>
		<!-- Background Pattern -->
		<div class="absolute inset-0 bg-black/10">
			<div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='8' cy='8' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
		</div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
			<div class="flex items-center justify-between">
				<!-- Left Content -->
				<div class="flex items-center space-x-3 flex-1 min-w-0">
					<!-- Icon -->
					<div class="flex-shrink-0 p-2 bg-white/20 rounded-full">
						<Crown class="h-5 w-5 text-yellow-300" />
					</div>
					
					<!-- Text Content -->
					<div class="flex-1 min-w-0">
						<div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
							<h3 class="text-sm sm:text-base font-semibold">
								Upgrade to Premium
							</h3>
							
							<!-- Feature Highlights -->
							<div class="hidden md:flex items-center space-x-3 text-xs">
								{#each features as feature, i}
									<div class="flex items-center space-x-1">
										<Check class="h-3 w-3 text-green-300" />
										<span class="text-blue-100">{feature}</span>
									</div>
									{#if i < features.length - 1}
										<span class="text-blue-200">•</span>
									{/if}
								{/each}
							</div>
							
							<!-- Mobile features -->
							<p class="md:hidden text-xs text-blue-100">
								AI assistance, unlimited projects & more
							</p>
						</div>
					</div>
				</div>
				
				<!-- Right Actions -->
				<div class="flex items-center space-x-2 flex-shrink-0">
					<!-- Upgrade Button -->
					<button
						onclick={handleUpgrade}
						class="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white text-purple-700 rounded-md font-medium text-xs sm:text-sm hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
					>
						<Crown class="h-3 w-3 sm:h-4 sm:w-4" />
						<span class="hidden sm:inline">Upgrade</span>
						<span class="sm:hidden">Go</span>
						<ArrowRight class="h-3 w-3" />
					</button>
					
					<!-- Dismiss Button -->
					<button
						onclick={dismissBanner}
						class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors"
						title="Dismiss for 2 days"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
		
		<!-- Subtle shimmer effect -->
		<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 transform translate-x-full" style="animation: shimmer 4s infinite;"></div>
	</div>
{/if}

<style>
	@keyframes shimmer {
		0% {
			transform: translateX(-100%) skewX(-12deg);
		}
		100% {
			transform: translateX(200%) skewX(-12deg);
		}
	}
</style>
