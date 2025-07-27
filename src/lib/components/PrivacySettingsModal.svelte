<script lang="ts">
	import { 
		Settings,
		X,
		Eye,
		EyeOff,
		Users,
		Globe,
		Lock
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	// Props
	let { 
		isOpen = $bindable(false),
		onClose,
		privacySettings = {},
		onUpdate
	}: { 
		isOpen: boolean;
		onClose: () => void;
		privacySettings: any;
		onUpdate?: (settings: any) => void;
	} = $props();

	// Local state to manage settings
	let localSettings = $state({
		showWritingStats: privacySettings?.showWritingStats ?? true,
		showProjects: privacySettings?.showProjects ?? true,
		showStreaks: privacySettings?.showStreaks ?? true,
		showDailyGoals: privacySettings?.showDailyGoals ?? true,
		showTotalWords: privacySettings?.showTotalWords ?? true,
		allowChallengeInvites: privacySettings?.allowChallengeInvites ?? true,
		showOnlineStatus: privacySettings?.showOnlineStatus ?? true
	});

	let isSaving = $state(false);

	// Sync with props when they change
	$effect(() => {
		if (privacySettings) {
			localSettings = {
				showWritingStats: privacySettings.showWritingStats ?? true,
				showProjects: privacySettings.showProjects ?? true,
				showStreaks: privacySettings.showStreaks ?? true,
				showDailyGoals: privacySettings.showDailyGoals ?? true,
				showTotalWords: privacySettings.showTotalWords ?? true,
				allowChallengeInvites: privacySettings.allowChallengeInvites ?? true,
				showOnlineStatus: privacySettings.showOnlineStatus ?? true
			};
		}
	});

	const privacyOptions = [
		{
			key: 'showWritingStats' as keyof typeof localSettings,
			title: 'Writing Statistics',
			description: 'Allow friends to see your writing speed, session times, and productivity metrics',
			icon: 'stats'
		},
		{
			key: 'showProjects' as keyof typeof localSettings,
			title: 'Project Information',
			description: 'Show your project titles, descriptions, and progress to friends',
			icon: 'projects'
		},
		{
			key: 'showStreaks' as keyof typeof localSettings,
			title: 'Writing Streaks',
			description: 'Display your current and longest writing streaks',
			icon: 'streaks'
		},
		{
			key: 'showDailyGoals' as keyof typeof localSettings,
			title: 'Daily Goals',
			description: 'Share your daily writing goals and achievement status',
			icon: 'goals'
		},
		{
			key: 'showTotalWords' as keyof typeof localSettings,
			title: 'Total Word Count',
			description: 'Show your lifetime and monthly word count totals',
			icon: 'words'
		},
		{
			key: 'allowChallengeInvites' as keyof typeof localSettings,
			title: 'Challenge Invitations',
			description: 'Allow friends to invite you to writing challenges',
			icon: 'challenges'
		},
		{
			key: 'showOnlineStatus' as keyof typeof localSettings,
			title: 'Online Status',
			description: 'Show when you\'re actively writing or online',
			icon: 'status'
		}
	];

	async function handleSave() {
		isSaving = true;
		try {
			const response = await fetch('/api/privacy/settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(localSettings)
			});

			if (response.ok) {
				const updatedSettings = await response.json();
				onUpdate?.(updatedSettings);
				onClose();
			} else {
				const error = await response.json();
				alert('Failed to save privacy settings: ' + (error.message || 'Unknown error'));
			}
		} catch (error) {
			console.error('Save privacy settings error:', error);
			alert('Failed to save privacy settings. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	function getIcon(iconType: string) {
		const iconClass = "h-5 w-5";
		switch (iconType) {
			case 'stats': return Eye;
			case 'projects': return Users;
			case 'streaks': return Eye;
			case 'goals': return Eye;
			case 'words': return Eye;
			case 'challenges': return Users;
			case 'status': return Globe;
			default: return Eye;
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
					<Settings class="h-6 w-6 text-gray-600" />
					<h2 class="text-xl font-semibold text-gray-900">Privacy Settings</h2>
				</div>
				<button
					onclick={onClose}
					class="text-gray-400 hover:text-gray-600"
				>
					<X class="h-6 w-6" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-6 max-h-[60vh] overflow-y-auto">
				<p class="text-sm text-gray-600 mb-6">
					Control what information your friends can see about your writing activity. These settings only affect what friends can view - your data remains private to everyone else.
				</p>

				<div class="space-y-4">
					{#each privacyOptions as option}
						{@const IconComponent = getIcon(option.icon)}
						<div class="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
							<div class="flex-shrink-0 mt-0.5">
								<IconComponent class="h-5 w-5 text-gray-600" />
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between">
									<div>
										<h4 class="text-sm font-medium text-gray-900">{option.title}</h4>
										<p class="text-sm text-gray-500 mt-1">{option.description}</p>
									</div>
									<div class="flex-shrink-0 ml-4">
										<label class="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												class="sr-only"
												bind:checked={localSettings[option.key]}
											/>
											<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Quick presets -->
				<div class="mt-8 p-4 bg-gray-50 rounded-lg">
					<h4 class="text-sm font-medium text-gray-900 mb-3">Quick Presets</h4>
					<div class="flex flex-wrap gap-2">
						<button
							type="button"
							onclick={() => {
								Object.keys(localSettings).forEach(key => {
									localSettings[key as keyof typeof localSettings] = true;
								});
							}}
							class="px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
						>
							Share All
						</button>
						<button
							type="button"
							onclick={() => {
								Object.keys(localSettings).forEach(key => {
									localSettings[key as keyof typeof localSettings] = false;
								});
							}}
							class="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
						>
							Private All
						</button>
						<button
							type="button"
							onclick={() => {
								localSettings.showWritingStats = true;
								localSettings.showStreaks = true;
								localSettings.showTotalWords = true;
								localSettings.showProjects = false;
								localSettings.showDailyGoals = false;
								localSettings.allowChallengeInvites = true;
								localSettings.showOnlineStatus = true;
							}}
							class="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
						>
							Recommended
						</button>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="flex justify-end gap-3 p-6 border-t border-gray-200">
				<button 
					type="button"
					onclick={onClose}
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					disabled={isSaving}
				>
					Cancel
				</button>
				<button 
					onclick={handleSave}
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isSaving}
				>
					{#if isSaving}
						<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
						Saving...
					{:else}
						<Settings class="h-4 w-4 mr-2" />
						Save Settings
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
