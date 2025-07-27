<script lang="ts">
	import { onMount } from 'svelte';
	import { BarChart, DollarSign, Zap, TrendingUp, Settings } from 'lucide-svelte';
	
	interface UsageStats {
		dailyRequests: number;
		weeklyRequests: number;
		monthlyRequests: number;
		estimatedCost: number;
		localAnalysisCount: number;
		aiAnalysisCount: number;
		cacheHitRate: number;
	}

	let stats: UsageStats = $state({
		dailyRequests: 0,
		weeklyRequests: 0,
		monthlyRequests: 0,
		estimatedCost: 0,
		localAnalysisCount: 0,
		aiAnalysisCount: 0,
		cacheHitRate: 0
	});

	let userTier: 'free' | 'premium' | 'pro' = $state('free');
	let showDetails = $state(false);

	// Mock data - in production, fetch from your analytics API
	onMount(() => {
		stats = {
			dailyRequests: 12,
			weeklyRequests: 78,
			monthlyRequests: 294,
			estimatedCost: 0.47, // in dollars
			localAnalysisCount: 156,
			aiAnalysisCount: 23,
			cacheHitRate: 67
		};
		userTier = 'premium';
	});

	function getTierLimit() {
		switch (userTier) {
			case 'free': return 5;
			case 'premium': return 50;
			case 'pro': return 200;
		}
	}

	function getTierColor() {
		switch (userTier) {
			case 'free': return 'text-gray-600';
			case 'premium': return 'text-blue-600';
			case 'pro': return 'text-purple-600';
		}
	}

	function getCostSavings() {
		// Calculate how much money saved by using local analysis
		const totalAnalyses = stats.localAnalysisCount + stats.aiAnalysisCount;
		if (totalAnalyses === 0) return 0;
		
		const avgWordsPerAnalysis = 150; // rough estimate
		const costPerAIAnalysis = (avgWordsPerAnalysis * 1.3 / 1000) * 0.2; // cents
		const savedCents = stats.localAnalysisCount * costPerAIAnalysis;
		return savedCents / 100; // convert to dollars
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center space-x-3">
			<div class="p-2 bg-blue-100 rounded-lg">
				<BarChart class="h-5 w-5 text-blue-600" />
			</div>
			<div>
				<h3 class="text-lg font-semibold text-gray-900">AI Usage & Cost Monitor</h3>
				<p class="text-sm text-gray-500">Track your writing analysis usage and costs</p>
			</div>
		</div>
		
		<button 
			onclick={() => showDetails = !showDetails}
			class="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
		>
			<Settings class="h-4 w-4" />
			<span>{showDetails ? 'Hide' : 'Show'} Details</span>
		</button>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
		<div class="bg-green-50 rounded-lg p-4">
			<div class="flex items-center space-x-2">
				<DollarSign class="h-5 w-5 text-green-600" />
				<span class="text-sm font-medium text-green-900">Estimated Cost</span>
			</div>
			<div class="mt-2">
				<div class="text-2xl font-bold text-green-900">${stats.estimatedCost.toFixed(2)}</div>
				<div class="text-sm text-green-700">this month</div>
			</div>
		</div>

		<div class="bg-blue-50 rounded-lg p-4">
			<div class="flex items-center space-x-2">
				<Zap class="h-5 w-5 text-blue-600" />
				<span class="text-sm font-medium text-blue-900">Daily Usage</span>
			</div>
			<div class="mt-2">
				<div class="text-2xl font-bold text-blue-900">
					{stats.dailyRequests}/{getTierLimit()}
				</div>
				<div class="text-sm text-blue-700">requests today</div>
			</div>
		</div>

		<div class="bg-purple-50 rounded-lg p-4">
			<div class="flex items-center space-x-2">
				<TrendingUp class="h-5 w-5 text-purple-600" />
				<span class="text-sm font-medium text-purple-900">Cost Savings</span>
			</div>
			<div class="mt-2">
				<div class="text-2xl font-bold text-purple-900">${getCostSavings().toFixed(2)}</div>
				<div class="text-sm text-purple-700">saved this month</div>
			</div>
		</div>
	</div>

	<!-- Usage Progress Bar -->
	<div class="mb-6">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-gray-700">Daily Limit</span>
			<span class="text-sm {getTierColor()} font-medium capitalize">{userTier} Plan</span>
		</div>
		<div class="w-full bg-gray-200 rounded-full h-2">
			<div 
				class="bg-blue-600 h-2 rounded-full transition-all duration-300"
				style="width: {Math.min((stats.dailyRequests / getTierLimit()) * 100, 100)}%"
			></div>
		</div>
		<div class="flex justify-between text-xs text-gray-500 mt-1">
			<span>{stats.dailyRequests} used</span>
			<span>{getTierLimit() - stats.dailyRequests} remaining</span>
		</div>
	</div>

	{#if showDetails}
		<!-- Detailed Stats -->
		<div class="border-t border-gray-200 pt-6">
			<h4 class="text-md font-semibold text-gray-900 mb-4">Analysis Breakdown</h4>
			
			<div class="grid grid-cols-2 gap-4 mb-6">
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="text-sm text-gray-600">Local Analysis</div>
					<div class="text-xl font-bold text-gray-900">{stats.localAnalysisCount}</div>
					<div class="text-xs text-gray-500">Free pattern matching</div>
				</div>
				
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="text-sm text-gray-600">AI Analysis</div>
					<div class="text-xl font-bold text-gray-900">{stats.aiAnalysisCount}</div>
					<div class="text-xs text-gray-500">OpenAI API calls</div>
				</div>
			</div>

			<!-- Cache Performance -->
			<div class="bg-gray-50 rounded-lg p-4 mb-4">
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm font-medium text-gray-700">Cache Hit Rate</span>
					<span class="text-sm font-bold text-green-600">{stats.cacheHitRate}%</span>
				</div>
				<div class="w-full bg-gray-200 rounded-full h-2">
					<div 
						class="bg-green-500 h-2 rounded-full"
						style="width: {stats.cacheHitRate}%"
					></div>
				</div>
				<div class="text-xs text-gray-500 mt-1">
					Higher cache hit rate = lower costs
				</div>
			</div>

			<!-- Cost Optimization Tips -->
			<div class="bg-blue-50 rounded-lg p-4">
				<h5 class="text-sm font-semibold text-blue-900 mb-2">💡 Cost Optimization Tips</h5>
				<ul class="text-sm text-blue-800 space-y-1">
					<li>• Wait a few seconds before expecting analysis (debouncing saves money)</li>
					<li>• Local patterns catch {Math.round((stats.localAnalysisCount / (stats.localAnalysisCount + stats.aiAnalysisCount)) * 100)}% of issues for free</li>
					<li>• Cache hit rate of {stats.cacheHitRate}% reduces redundant API calls</li>
					{#if userTier === 'free'}
						<li>• Upgrade to Premium for AI-powered suggestions</li>
					{:else if userTier === 'premium'}
						<li>• Pro plan offers unlimited daily requests</li>
					{/if}
				</ul>
			</div>
		</div>
	{/if}
</div>

<style>
	.grid {
		display: grid;
	}
</style>
