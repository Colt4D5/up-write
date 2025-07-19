<script lang="ts">
	import { enhance } from '$app/forms';
	import { User, Mail, Hash, Calendar, Save, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-svelte';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData & { username?: string; displayName?: string; email?: string; age?: number } } = $props();

	let isSubmitting = $state(false);
	let isChangingPassword = $state(false);
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);
</script>

<svelte:head>
	<title>Profile - WriterBuddy</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
		<p class="text-gray-600 mt-2">Manage your account information and preferences.</p>
	</div>

	{#if form?.success}
		<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
			<CheckCircle class="h-5 w-5 text-green-600" />
			<span class="text-green-800">{form.message}</span>
		</div>
	{/if}

	{#if form?.message && !form?.success}
		<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
			<AlertCircle class="h-5 w-5 text-red-600" />
			<span class="text-red-800">{form.message}</span>
		</div>
	{/if}

	<div class="bg-white shadow-lg rounded-lg">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
			<p class="text-sm text-gray-600 mt-1">Update your personal details below.</p>
		</div>

		<form 
			method="POST" 
			action="?/updateProfile"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
			class="p-6 space-y-6"
		>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Username -->
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						<User class="h-4 w-4 inline mr-1" />
						Username
					</label>
					<input
						type="text"
						id="username"
						name="username"
						value={form?.username !== undefined ? form.username : data.user.username}
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						placeholder="Enter your username"
					/>
					<p class="text-xs text-gray-500 mt-1">3-31 characters, lowercase letters, numbers, underscores, and hyphens only</p>
				</div>

				<!-- Display Name -->
				<div>
					<label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
						<User class="h-4 w-4 inline mr-1" />
						Display Name
					</label>
					<input
						type="text"
						id="displayName"
						name="displayName"
						value={form?.displayName ?? data.user.displayName ?? ''}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						placeholder="Enter your display name"
					/>
					<p class="text-xs text-gray-500 mt-1">Optional - how your name appears to others</p>
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
						<Mail class="h-4 w-4 inline mr-1" />
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={form?.email ?? data.user.email ?? ''}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						placeholder="Enter your email address"
					/>
					<p class="text-xs text-gray-500 mt-1">Optional - for account recovery and notifications</p>
				</div>

				<!-- Age -->
				<div>
					<label for="age" class="block text-sm font-medium text-gray-700 mb-2">
						<Hash class="h-4 w-4 inline mr-1" />
						Age
					</label>
					<input
						type="number"
						id="age"
						name="age"
						value={form?.age ?? data.user.age ?? ''}
						min="1"
						max="150"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						placeholder="Enter your age"
					/>
					<p class="text-xs text-gray-500 mt-1">Optional - helps us provide age-appropriate content</p>
				</div>
			</div>

			<!-- Account Information (Read-only) -->
			<div class="pt-6 border-t border-gray-200">
				<h3 class="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							<Hash class="h-4 w-4 inline mr-1" />
							User ID
						</label>
						<div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 font-mono text-sm">
							{data.user.id}
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							<Calendar class="h-4 w-4 inline mr-1" />
							Member Since
						</label>
						<div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600">
							{new Date(data.user.createdAt).toLocaleDateString('en-US', { 
								year: 'numeric', 
								month: 'long', 
								day: 'numeric' 
							})}
						</div>
					</div>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-end pt-6 border-t border-gray-200">
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
				>
					{#if isSubmitting}
						<div class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
						Updating...
					{:else}
						<Save class="h-4 w-4 mr-2" />
						Update Profile
					{/if}
				</button>
			</div>
		</form>
	</div>

	<!-- Password Change Section -->
	<div class="mt-8 bg-white shadow-lg rounded-lg">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900">Change Password</h2>
			<p class="text-sm text-gray-600 mt-1">Update your account password for better security.</p>
		</div>
		<form 
			method="POST" 
			action="?/changePassword"
			use:enhance={() => {
				isChangingPassword = true;
				return async ({ update }) => {
					await update();
					isChangingPassword = false;
					// Reset password fields on success
					if (form?.passwordChanged) {
						const formElement = document.querySelector('form[action="?/changePassword"]');
						if (formElement) {
							(formElement as HTMLFormElement).reset();
						}
					}
				};
			}}
			class="p-6 space-y-6"
		>
			<div class="space-y-4">
				<!-- Current Password -->
				<div>
					<label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
						<Lock class="h-4 w-4 inline mr-1" />
						Current Password
					</label>
					<div class="relative">
						<input
							type={showCurrentPassword ? 'text' : 'password'}
							id="currentPassword"
							name="currentPassword"
							required
							class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							placeholder="Enter your current password"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => showCurrentPassword = !showCurrentPassword}
						>
							{#if showCurrentPassword}
								<EyeOff class="h-4 w-4 text-gray-400" />
							{:else}
								<Eye class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
					</div>
				</div>

				<!-- New Password -->
				<div>
					<label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
						<Lock class="h-4 w-4 inline mr-1" />
						New Password
					</label>
					<div class="relative">
						<input
							type={showNewPassword ? 'text' : 'password'}
							id="newPassword"
							name="newPassword"
							required
							class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							placeholder="Enter your new password"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => showNewPassword = !showNewPassword}
						>
							{#if showNewPassword}
								<EyeOff class="h-4 w-4 text-gray-400" />
							{:else}
								<Eye class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
					</div>
					<p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
				</div>

				<!-- Confirm New Password -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
						<Lock class="h-4 w-4 inline mr-1" />
						Confirm New Password
					</label>
					<div class="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							name="confirmPassword"
							required
							class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							placeholder="Confirm your new password"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => showConfirmPassword = !showConfirmPassword}
						>
							{#if showConfirmPassword}
								<EyeOff class="h-4 w-4 text-gray-400" />
							{:else}
								<Eye class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
					</div>
				</div>
			</div>

			<div class="flex justify-end">
				<button
					type="submit"
					disabled={isChangingPassword}
					class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
				>
					{#if isChangingPassword}
						<div class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
						Changing...
					{:else}
						<Lock class="h-4 w-4 mr-2" />
						Change Password
					{/if}
				</button>
			</div>
		</form>
	</div>

	<!-- Additional Settings Section -->
	<div class="mt-8 bg-white shadow-lg rounded-lg">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900">Danger Zone</h2>
			<p class="text-sm text-gray-600 mt-1">Irreversible and destructive actions.</p>
		</div>
		<div class="p-6">
			<div class="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
				<div>
					<h3 class="text-sm font-medium text-red-900">Delete Account</h3>
					<p class="text-sm text-red-600">Permanently delete your account and all projects, documents, and data. This action cannot be undone.</p>
				</div>
				<button 
					class="px-4 py-2 text-sm font-medium text-red-700 hover:text-red-800 border border-red-600 hover:border-red-700 rounded-md transition bg-white hover:bg-red-50"
					onclick={() => alert('Account deletion feature coming soon. Please contact support if you need to delete your account.')}
				>
					Delete Account
				</button>
			</div>
		</div>
	</div>
</div>
