<script lang="ts">
	import { onMount } from 'svelte';

  let grid: HTMLDivElement;

	interface ActivityData {
		date: string;
		words: number;
		sessions: number;
		level: number; // 0-4 for different intensity levels
	}

	let { activityData = [] }: { activityData: ActivityData[] } = $props();

	// Generate grid for last 365 days
	let gridData = $state<ActivityData[]>([]);
	let months = $state<{ name: string; startCol: number }[]>([]);
	let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	// Tooltip state
	let hoveredData = $state<ActivityData | null>(null);
	let tooltipPosition = $state({ x: 0, y: 0 });

	onMount(() => {
		generateGridData();
	});

	function generateGridData() {
		const today = new Date();
		const oneYearAgo = new Date(today);
		oneYearAgo.setFullYear(today.getFullYear() - 1);
		
		// Start from the Sunday of the week containing oneYearAgo
		const startDate = new Date(oneYearAgo);
		const dayOfWeek = startDate.getDay();
		startDate.setDate(startDate.getDate() - dayOfWeek);
		
		const data: ActivityData[] = [];
		const monthsData: { name: string; startCol: number }[] = [];
		const seenMonths = new Set<number>();
		
		// Generate 53 weeks worth of data (371 days)
		for (let week = 0; week < 53; week++) {
			for (let day = 0; day < 7; day++) {
				const currentDate = new Date(startDate);
				currentDate.setDate(startDate.getDate() + (week * 7) + day);
				
				// Stop if we've gone past today
				if (currentDate > today) break;
				
				const dateStr = currentDate.toISOString().split('T')[0];
				const monthKey = currentDate.getFullYear() * 12 + currentDate.getMonth();
				
				// Add month marker when we encounter a new month for the first time
				if (!seenMonths.has(monthKey)) {
					seenMonths.add(monthKey);
					monthsData.push({
						name: currentDate.toLocaleDateString('en', { month: 'short' }),
						startCol: week
					});
				}
				
				// Find activity for this date
				const activity = activityData.find(a => a.date === dateStr);
				const words = activity?.words || 0;
				const sessions = activity?.sessions || 0;
				
				// Calculate intensity level (0-4)
				let level = 0;
				if (words > 0) {
					if (words < 100) level = 1;
					else if (words < 500) level = 2;
					else if (words < 1000) level = 3;
					else level = 4;
				}
				
				data.push({
					date: dateStr,
					words,
					sessions,
					level
				});
			}
		}
		
		gridData = data;
		months = monthsData;
	}

	function getActivityColor(level: number): string {
		switch (level) {
			case 0: return 'bg-gray-100 hover:bg-gray-200';
			case 1: return 'bg-green-200 hover:bg-green-300';
			case 2: return 'bg-green-400 hover:bg-green-500';
			case 3: return 'bg-green-600 hover:bg-green-700';
			case 4: return 'bg-green-800 hover:bg-green-900';
			default: return 'bg-gray-100 hover:bg-gray-200';
		}
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en', { 
			weekday: 'short', 
			year: 'numeric', 
			month: 'short', 
			day: 'numeric' 
		});
	}

	function handleCellHover(event: MouseEvent, data: ActivityData) {
		hoveredData = data;
    const gridOffset = {
      x: grid.getBoundingClientRect().left,
      y: grid.getBoundingClientRect().top
    };
		tooltipPosition = {
			x: event.clientX - gridOffset.x,
			y: event.clientY - gridOffset.y
		};
	}

	function handleCellLeave() {
		hoveredData = null;
	}

	// Calculate total activity for the year
	let totalWords = $derived(activityData.reduce((sum, day) => sum + day.words, 0));
	let totalSessions = $derived(activityData.reduce((sum, day) => sum + day.sessions, 0));
	let activeDays = $derived(activityData.filter(day => day.words > 0).length);
</script>

<div class="w-full" bind:this={grid}>
	<!-- Header with stats -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 mb-1">Writing Activity</h3>
			<div class="flex flex-wrap gap-4 text-sm text-gray-600">
				<span><strong>{totalWords.toLocaleString()}</strong> words this year</span>
				<span><strong>{totalSessions}</strong> writing sessions</span>
				<span><strong>{activeDays}</strong> active days</span>
			</div>
		</div>
		<div class="flex items-center space-x-2 text-xs text-gray-500">
			<span>Less</span>
			<div class="flex space-x-1">
				<div class="w-3 h-3 rounded-sm bg-gray-100"></div>
				<div class="w-3 h-3 rounded-sm bg-green-200"></div>
				<div class="w-3 h-3 rounded-sm bg-green-400"></div>
				<div class="w-3 h-3 rounded-sm bg-green-600"></div>
				<div class="w-3 h-3 rounded-sm bg-green-800"></div>
			</div>
			<span>More</span>
		</div>
	</div>

	<!-- Activity Grid -->
	<div class="relative overflow-x-auto">
		<div class="inline-block min-w-full">
			<!-- Month labels -->
			<div class="relative mb-2 pl-12 h-4">
				{#each months as month}
					<div 
						class="absolute text-xs text-gray-500"
						style="left: {48 + (month.startCol * 16)}px;"
					>
						{month.name}
					</div>
				{/each}
			</div>

			<div class="flex items-start">
				<!-- Weekday labels -->
				<div class="flex flex-col mr-3 w-10 pt-1">
					<div class="text-xs text-gray-500 h-3 flex items-center justify-end pr-1">Mon</div>
					<div class="h-3"></div>
					<div class="text-xs text-gray-500 h-3 flex items-center justify-end pr-1">Wed</div>
					<div class="h-3"></div>
					<div class="text-xs text-gray-500 h-3 flex items-center justify-end pr-1">Fri</div>
					<div class="h-3"></div>
					<div class="h-3"></div>
				</div>

				<!-- Activity cells -->
				<div class="flex gap-1">
					{#each Array.from({length: Math.ceil(gridData.length / 7)}) as _, week}
						<div class="flex flex-col gap-1">
							{#each Array.from({length: 7}) as _, day}
								{@const index = week * 7 + day}
								{#if index < gridData.length}
									{@const dayData = gridData[index]}
									<div
										class="w-3 h-3 rounded-sm cursor-pointer transition-colors duration-150 {getActivityColor(dayData.level)}"
										onmouseenter={(e) => handleCellHover(e, dayData)}
										onmouseleave={handleCellLeave}
										role="button"
										tabindex="0"
										aria-label="Writing activity for {formatDate(dayData.date)}: {dayData.words} words"
									></div>
								{:else}
									<div class="w-3 h-3"></div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Tooltip -->
	{#if hoveredData}
		<div 
			class="fixed z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg pointer-events-none whitespace-nowrap"
			style="left: {tooltipPosition.x + 50}px; top: {tooltipPosition.y + 45}px;"
		>
			<div class="font-medium">{formatDate(hoveredData.date)}</div>
			<div>
				{#if hoveredData.words === 0}
					No writing activity
				{:else}
					{hoveredData.words} words, {hoveredData.sessions} session{hoveredData.sessions === 1 ? '' : 's'}
				{/if}
			</div>
		</div>
	{/if}
</div>
