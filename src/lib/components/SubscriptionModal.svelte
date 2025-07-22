<script lang="ts">
	import { Crown, Lock, Zap, Check, X } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	
	let { user, aiAccess, onClose } = $props();
	let isUpdating = $state(false);
	
	const tiers = [
		{
			id: 'free',
			name: 'Free',
			icon: Lock,
			color: 'gray',
			price: '$0',
			description: 'Basic writing tools',
			features: [
				'Up to 3 projects',
				'Basic document organization',
				'Word count tracking',
				'Export documents'
			],
			limitations: [
				'No AI assistance',
				'Limited storage'
			]
		},
		{
			id: 'premium',
			name: 'Premium',
			icon: Crown,
			color: 'purple',
			price: '$9.99/month',
			description: 'AI-powered writing assistance',
			features: [
				'Up to 10 projects',
				'AI writing suggestions',
				'Grammar & style checking',
				'Advanced analytics',
				'Priority support'
			],
			limitations: []
		},
		{
			id: 'pro',
			name: 'Pro',
			icon: Zap,
			color: 'yellow',
			price: '$19.99/month',
			description: 'Unlimited everything',
			features: [
				'Unlimited projects',
				'Advanced AI models',
				'Team collaboration',
				'Custom templates',
				'API access',
				'White-label options'
			],
			limitations: []
		}
	];
	
	async function updateSubscription(newTier: string) {
		if (isUpdating || newTier === user.subscriptionTier) return;
		
		isUpdating = true;
		try {
			const response = await fetch('/api/subscription', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					subscriptionTier: newTier
				})
			});
			
			if (response.ok) {
				await invalidateAll();
				if (onClose) onClose();
			} else {
				const error = await response.json();
				alert('Failed to update subscription: ' + (error.error || 'Unknown error'));
			}
		} catch (error) {
			console.error('Subscription update error:', error);
			alert('Failed to update subscription. Please try again.');
		} finally {
			isUpdating = false;
		}
	}
	
	function getButtonClass(tier: any, isCurrentTier: boolean) {
		const baseClasses = "w-full py-2 px-4 rounded-lg font-medium transition-colors";
		
		if (isCurrentTier) {
			return `${baseClasses} bg-green-100 text-green-800 border border-green-300 cursor-default`;
		}
		
		if (tier.id === 'free') {
			return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300`;
		} else if (tier.id === 'premium') {
			return `${baseClasses} bg-purple-600 text-white hover:bg-purple-700 border border-purple-600`;
		} else {
			return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700 border border-yellow-600`;
		}
	}
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
	<div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
		<div class="p-6 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold text-gray-900">Subscription Plans</h2>
					<p class="text-gray-600 mt-1">Choose the plan that works best for you</p>
				</div>
				{#if onClose}
					<button 
						onclick={onClose}
						class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
					>
						<X class="h-5 w-5" />
					</button>
				{/if}
			</div>
		</div>
		
		<div class="p-6">
			<!-- Current Status -->
			<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<div class="flex items-center space-x-3">
					<div class="p-2 bg-blue-100 rounded-full">
						{#if user.subscriptionTier === 'free'}
							<Lock class="h-5 w-5 text-blue-600" />
						{:else if user.subscriptionTier === 'premium'}
							<Crown class="h-5 w-5 text-blue-600" />
						{:else}
							<Zap class="h-5 w-5 text-blue-600" />
						{/if}
					</div>
					<div>
						<h3 class="font-semibold text-blue-900">
							Current Plan: {tiers.find(t => t.id === user.subscriptionTier)?.name || 'Unknown'}
						</h3>
						<p class="text-blue-700 text-sm">
							AI Access: {aiAccess.hasAccess ? 'Enabled' : 'Disabled'}
							{#if aiAccess.reason}
								- {aiAccess.reason === 'free_tier' ? 'Upgrade required' : 'Contact support'}
							{/if}
						</p>
					</div>
				</div>
			</div>
			
			<!-- Plans Grid -->
			<div class="grid md:grid-cols-3 gap-6">
				{#each tiers as tier}
					{@const Icon = tier.icon}
					{@const isCurrentTier = user.subscriptionTier === tier.id}
					
					<div class="border border-gray-200 rounded-xl p-6 relative {isCurrentTier ? 'ring-2 ring-green-500 border-green-500' : ''}">
						{#if isCurrentTier}
							<div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
								<span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
									Current Plan
								</span>
							</div>
						{/if}
						
						<div class="text-center mb-6">
							<div class="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 {tier.color === 'gray' ? 'bg-gray-100' : tier.color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'}">
								<Icon class="h-6 w-6 {tier.color === 'gray' ? 'text-gray-600' : tier.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'}" />
							</div>
							<h3 class="text-xl font-bold text-gray-900">{tier.name}</h3>
							<p class="text-3xl font-bold {tier.color === 'gray' ? 'text-gray-900' : tier.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'} mt-2">
								{tier.price}
							</p>
							<p class="text-gray-600 mt-2">{tier.description}</p>
						</div>
						
						<div class="space-y-3 mb-6">
							{#each tier.features as feature}
								<div class="flex items-center space-x-2">
									<Check class="h-4 w-4 text-green-500 flex-shrink-0" />
									<span class="text-sm text-gray-700">{feature}</span>
								</div>
							{/each}
							{#each tier.limitations as limitation}
								<div class="flex items-center space-x-2">
									<X class="h-4 w-4 text-red-500 flex-shrink-0" />
									<span class="text-sm text-gray-500">{limitation}</span>
								</div>
							{/each}
						</div>
						
						<button 
							onclick={() => updateSubscription(tier.id)}
							disabled={isUpdating || isCurrentTier}
							class={getButtonClass(tier, isCurrentTier)}
						>
							{#if isCurrentTier}
								Current Plan
							{:else if isUpdating}
								Updating...
							{:else if tier.id === 'free'}
								Downgrade to Free
							{:else}
								Upgrade to {tier.name}
							{/if}
						</button>
					</div>
				{/each}
			</div>
			
			<!-- Note about testing -->
			<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<p class="text-sm text-yellow-800">
					<strong>Note:</strong> This is a demo environment. Plan changes are for testing purposes only and don't involve real payments.
				</p>
			</div>
		</div>
	</div>
</div>
