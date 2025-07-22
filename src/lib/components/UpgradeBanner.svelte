<script lang="ts">
	import { Crown, X, Check, ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { userTier, onUpgrade }: { userTier: string; onUpgrade?: () => void } = $props();
	
	let showBanner = $state(false);
	let isVisible = $state(false);
	
	const DISMISSAL_KEY = 'upgrade-banner-dismissed';
	const DISMISSAL_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

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
			
			// If less than 3 days have passed, don't show the banner
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
		}, 1000);
		
		// For development: Add global function to reset dismissal
		if (typeof window !== 'undefined') {
			(window as any).resetUpgradeBanner = () => {
				localStorage.removeItem(DISMISSAL_KEY);
				console.log('Upgrade banner dismissal reset');
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

	const premiumFeatures = [
		'AI Writing Assistant',
		'Advanced Analytics',
		'Unlimited Projects',
		'Priority Support'
	];

	const proFeatures = [
		'Everything in Premium',
		'Collaboration Tools',
		'Advanced Export Options',
		'Custom Integrations'
	];
</script>

{#if showBanner}
	<div 
		class="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg rounded-lg transition-all duration-300 {isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'}"
	>
		<!-- Background Pattern -->
		<div class="absolute inset-0 bg-black/10">
			<div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
		</div>
		
		<div class="relative px-4 sm:px-6 py-4">
			<div class="flex items-start sm:items-center justify-between flex-col sm:flex-row space-y-3 sm:space-y-0">
				<!-- Main Content -->
				<div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
					<!-- Icon -->
					<div class="flex-shrink-0 p-2 bg-white/20 rounded-full">
						<Crown class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />
					</div>
					
					<!-- Text Content -->
					<div class="flex-1 min-w-0">
						<h3 class="text-base sm:text-lg font-semibold mb-1">
							Unlock Your Writing Potential
						</h3>
						<p class="text-blue-100 text-xs sm:text-sm mb-2">
							Get AI writing assistance, advanced analytics, and unlimited projects with Premium or Pro.
						</p>
						
						<!-- Feature Highlights - Desktop Only -->
						<div class="hidden lg:flex items-center space-x-4 text-xs">
							{#each premiumFeatures.slice(0, 3) as feature}
								<div class="flex items-center space-x-1">
									<Check class="h-3 w-3 text-green-300" />
									<span class="text-blue-100">{feature}</span>
								</div>
							{/each}
							<span class="text-blue-200">and more...</span>
						</div>
					</div>
				</div>
				
				<!-- Actions -->
				<div class="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3">
					<!-- Upgrade Button -->
					<button
						onclick={handleUpgrade}
						class="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white text-purple-700 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
					>
						<Crown class="h-4 w-4" />
						<span>Upgrade Now</span>
						<ArrowRight class="h-3 w-3 sm:h-4 sm:w-4" />
					</button>
					
					<!-- Dismiss Button -->
					<button
						onclick={dismissBanner}
						class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
						title="Dismiss for 3 days"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			</div>
			
			<!-- Mobile Features List -->
			<div class="sm:hidden mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs ml-11">
				{#each premiumFeatures.slice(0, 2) as feature}
					<div class="flex items-center space-x-1">
						<Check class="h-3 w-3 text-green-300 flex-shrink-0" />
						<span class="text-blue-100">{feature}</span>
					</div>
				{/each}
				<span class="text-blue-200">+ more features</span>
			</div>
		</div>
		
		<!-- Pulse Animation -->
		<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full animate-pulse" style="animation: shimmer 3s infinite;"></div>
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
