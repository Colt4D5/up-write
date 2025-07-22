<script lang="ts">
	import { 
		Trophy,
		Target,
		Calendar,
		Clock,
		Users,
		X,
		Plus
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	// Props
	let { 
		isOpen = $bindable(false),
		onClose,
		onCreate
	}: { 
		isOpen: boolean;
		onClose: () => void;
		onCreate?: (challenge: any) => void;
	} = $props();

	// Form state
	let title = $state('');
	let description = $state('');
	let type = $state<'word_count' | 'daily_streak' | 'time_based'>('word_count');
	let goalValue = $state<number>(1000);
	let duration = $state<number | null>(7);
	let isPublic = $state(false);
	let startDate = $state('');
	let endDate = $state('');
	let isCreating = $state(false);

	// Initialize dates
	$effect(() => {
		if (isOpen && !startDate) {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			startDate = tomorrow.toISOString().split('T')[0];
			
			const weekFromTomorrow = new Date(tomorrow);
			weekFromTomorrow.setDate(weekFromTomorrow.getDate() + 7);
			endDate = weekFromTomorrow.toISOString().split('T')[0];
		}
	});

	// Challenge types
	const challengeTypes = [
		{
			value: 'word_count' as const,
			label: 'Word Count Challenge',
			description: 'Write a specific number of words',
			placeholder: 'e.g., 1000',
			unit: 'words'
		},
		{
			value: 'daily_streak' as const,
			label: 'Daily Writing Streak',
			description: 'Write every day for a number of days',
			placeholder: 'e.g., 7',
			unit: 'days'
		},
		{
			value: 'time_based' as const,
			label: 'Time-Based Challenge',
			description: 'Write for a specific amount of time',
			placeholder: 'e.g., 60',
			unit: 'minutes per day'
		}
	];

	// Get current challenge type info
	const currentType = $derived(challengeTypes.find(t => t.value === type) || challengeTypes[0]);

	// Update goal value when type changes
	$effect(() => {
		switch (type) {
			case 'word_count':
				goalValue = 1000;
				break;
			case 'daily_streak':
				goalValue = 7;
				break;
			case 'time_based':
				goalValue = 60;
				break;
		}
	});

	async function handleSubmit() {
		if (!title.trim() || !goalValue || !startDate) return;

		isCreating = true;
		try {
			const response = await fetch('/api/challenges', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim() || null,
					type,
					goalValue,
					duration,
					isPublic,
					startDate,
					endDate: endDate || null,
				})
			});

			if (response.ok) {
				const newChallenge = await response.json();
				onCreate?.(newChallenge);
				resetForm();
				onClose();
			} else {
				const error = await response.json();
				alert('Failed to create challenge: ' + (error.message || 'Unknown error'));
			}
		} catch (error) {
			console.error('Create challenge error:', error);
			alert('Failed to create challenge. Please try again.');
		} finally {
			isCreating = false;
		}
	}

	function resetForm() {
		title = '';
		description = '';
		type = 'word_count';
		goalValue = 1000;
		duration = 7;
		isPublic = false;
		startDate = '';
		endDate = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex items-center space-x-2">
					<Trophy class="h-6 w-6 text-yellow-500" />
					<h2 class="text-xl font-semibold text-gray-900">Create Writing Challenge</h2>
				</div>
				<button
					onclick={onClose}
					class="text-gray-400 hover:text-gray-600"
				>
					<X class="h-6 w-6" />
				</button>
			</div>

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
				<!-- Basic Info -->
				<div class="space-y-4">
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
							Challenge Title
						</label>
						<input 
							id="title"
							type="text" 
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter challenge title..."
							bind:value={title}
							required
						/>
					</div>
					
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
							Description (optional)
						</label>
						<textarea 
							id="description"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							rows="3"
							placeholder="Describe your challenge..."
							bind:value={description}
						></textarea>
					</div>
				</div>

				<!-- Challenge Type -->
				<div>
					<label for="challenge-type-word_count" class="block text-sm font-medium text-gray-700 mb-3">
						Challenge Type
					</label>
					<div class="space-y-3">
						{#each challengeTypes as challengeType}
							<label class="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {type === challengeType.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
								<input
									id={"challenge-type-" + challengeType.value}
									type="radio"
									name="type"
									value={challengeType.value}
									bind:group={type}
									class="mt-1 text-blue-600 focus:ring-blue-500"
								/>
								<div class="flex-1">
									<h4 class="font-medium text-gray-900">{challengeType.label}</h4>
									<p class="text-sm text-gray-500">{challengeType.description}</p>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Goal Value -->
				<div>
					<label for="goalValue" class="block text-sm font-medium text-gray-700 mb-1">
						Goal ({currentType.unit})
					</label>
					<input 
						id="goalValue"
						type="number" 
						min="1"
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						placeholder={currentType.placeholder}
						bind:value={goalValue}
						required
					/>
				</div>

				<!-- Duration -->
				<div>
					<label for="duration-input" class="block text-sm font-medium text-gray-700 mb-1">
						Duration (optional)
					</label>
					<div class="space-y-2">
						<label class="flex items-center space-x-2">
							<input
								type="radio"
								name="durationOption"
								value="custom"
								checked={duration !== null}
								onchange={() => duration = 7}
								class="text-blue-600 focus:ring-blue-500"
								id="duration-custom-radio"
							/>
							<span class="text-sm text-gray-700">Set duration</span>
						</label>
						{#if duration !== null}
							<input 
								id="duration-input"
								type="number" 
								min="1"
								class="ml-6 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Days"
								bind:value={duration}
							/>
						{/if}
						<label class="flex items-center space-x-2">
							<input
								type="radio"
								name="durationOption"
								value="indefinite"
								checked={duration === null}
								onchange={() => duration = null}
								class="text-blue-600 focus:ring-blue-500"
								id="duration-indefinite-radio"
							/>
							<span class="text-sm text-gray-700">No end date</span>
						</label>
					</div>
				</div>

				<!-- Dates -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
							Start Date
						</label>
						<input 
							id="startDate"
							type="date" 
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							bind:value={startDate}
							required
						/>
					</div>

					{#if duration}
						<div>
							<label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
								End Date
							</label>
							<input 
								id="endDate"
								type="date" 
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								bind:value={endDate}
							/>
						</div>
					{/if}
				</div>

				<!-- Visibility -->
				<div>
					<label class="flex items-center space-x-2">
						<input
							type="checkbox"
							bind:checked={isPublic}
							class="text-blue-600 focus:ring-blue-500 rounded"
						/>
						<span class="text-sm font-medium text-gray-700">Make this challenge public</span>
					</label>
					<p class="text-sm text-gray-500 mt-1">
						{isPublic ? 'Anyone can discover and join this challenge' : 'Only your friends can see and join this challenge'}
					</p>
				</div>
			</form>

			<!-- Footer -->
			<div class="flex justify-end gap-3 p-6 border-t border-gray-200">
				<button 
					type="button"
					onclick={onClose}
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					disabled={isCreating}
				>
					Cancel
				</button>
				<button 
					onclick={handleSubmit}
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isCreating || !title.trim() || !goalValue || !startDate}
				>
					{#if isCreating}
						<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
						Creating...
					{:else}
						<Plus class="h-4 w-4 mr-2" />
						Create Challenge
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
