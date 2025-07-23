<script lang="ts">
	import { enhance } from '$app/forms';
	import { User, Mail, Hash, Calendar, Save, AlertCircle, CheckCircle, Lock, Eye, EyeOff, Camera, Cake, Crown, Zap, X, BarChart3, Home, BookOpen } from 'lucide-svelte';
	import { calculateAge, formatBirthday } from '$lib/utils';
	import SubscriptionModal from '$lib/components/SubscriptionModal.svelte';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { 
		data: any; 
		form: any;
	} = $props();

	let isSubmitting = $state(false);
	let isChangingPassword = $state(false);
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isUploadingAvatar = $state(false);
	let showSubscriptionModal = $state(false);

	// Get profile image URL with fallback to default
	const getProfileImageUrl = (profileImage: string | null) => {
		return profileImage || '/default-avatar.svg';
	};

	function getTierDisplayName(tier: string): string {
		switch (tier) {
			case 'free': return 'Free';
			case 'premium': return 'Premium';
			case 'pro': return 'Pro';
			default: return 'Free';
		}
	}

	function getTierIcon(tier: string) {
		switch (tier) {
			case 'premium': return Crown;
			case 'pro': return Zap;
			default: return Lock;
		}
	}

	function getTierColor(tier: string): string {
		switch (tier) {
			case 'premium': return 'text-purple-600 bg-purple-100';
			case 'pro': return 'text-yellow-600 bg-yellow-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	// Create reactive form values that properly handle successful submissions
	let formUsername = $derived(
		(form && !form.success && form.username !== undefined) ? form.username : data?.user?.username ?? ''
	);
	let formDisplayName = $derived(
		(form && !form.success && form.displayName !== undefined) ? form.displayName : data?.user?.displayName ?? ''
	);
	let formEmail = $derived(
		(form && !form.success && form.email !== undefined) ? form.email : data?.user?.email ?? ''
	);
	let formBirthday = $derived(
		(form && !form.success && form.birthday !== undefined) ? form.birthday : data?.user?.birthday ?? ''
	);

	// Add this derived variable for TierIcon
	let TierIcon = $derived(getTierIcon(data?.user?.subscriptionTier || 'free'));
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

	<!-- Profile Avatar Section -->
	<div class="bg-white shadow-lg rounded-lg mb-8">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900">Profile Picture</h2>
			<p class="text-sm text-gray-600 mt-1">Upload a profile picture to personalize your account.</p>
		</div>
		
		<div class="p-6">
			<div class="flex items-center space-x-6">
				<!-- Current Avatar -->
				<div class="relative">
					<img 
						src={getProfileImageUrl(data?.user?.profileImage || null)} 
						alt="Profile" 
						class="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100"
					/>
				</div>
				
				<!-- Upload Form -->
				<form 
					method="POST" 
					action="?/uploadAvatar" 
					enctype="multipart/form-data"
					use:enhance={() => {
						isUploadingAvatar = true;
						return async ({ update }) => {
							await update();
							isUploadingAvatar = false;
						};
					}}
					class="flex-1"
				>
					<div class="flex flex-col space-y-3">
						<div class="flex items-center space-x-3">
							<label for="avatar" class="cursor-pointer">
								<input
									type="file"
									id="avatar"
									name="avatar"
									accept="image/*"
									class="sr-only"
									disabled={isUploadingAvatar}
								/>
								<span class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
									<Camera class="h-4 w-4 mr-2" />
									Choose Image
								</span>
							</label>
							
							<button
								type="submit"
								disabled={isUploadingAvatar}
								class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isUploadingAvatar}
									<div class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									Uploading...
								{:else}
									<Save class="h-4 w-4 mr-2" />
									Upload
								{/if}
							</button>
						</div>
						
						<p class="text-xs text-gray-500">
							Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB.
						</p>
					</div>
				</form>
			</div>
		</div>
	</div>

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
						value={formUsername}
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
						value={formDisplayName}
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
						value={formEmail}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						placeholder="Enter your email address"
					/>
					<p class="text-xs text-gray-500 mt-1">Optional - for account recovery and notifications</p>
				</div>

				<!-- Birthday -->
				<div>
					<label for="birthday" class="block text-sm font-medium text-gray-700 mb-2">
						<Cake class="h-4 w-4 inline mr-1" />
						Birthday
					</label>
					<input
						type="date"
						id="birthday"
						name="birthday"
						value={formBirthday}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
					/>
					<div class="text-xs text-gray-500 mt-1 space-y-1">
						<p>Optional - helps us provide age-appropriate content</p>
						{#if data?.user?.birthday}
							{@const age = calculateAge(data.user.birthday)}
							{#if age !== null}
								<p class="text-gray-700">
									<strong>Current age:</strong> {age} years old
									{#if formatBirthday(data.user.birthday)}
										(Born: {formatBirthday(data.user.birthday)})
									{/if}
								</p>
							{/if}
						{/if}
					</div>
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
							{data?.user?.id || 'N/A'}
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							<Calendar class="h-4 w-4 inline mr-1" />
							Member Since
						</label>
						<div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600">
							{data?.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString('en-US', { 
								year: 'numeric', 
								month: 'long', 
								day: 'numeric' 
							}) : 'N/A'}
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

	<!-- Quick Actions Section -->
	<div class="mt-8 bg-white shadow-lg rounded-lg">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900">Quick Actions</h2>
			<p class="text-gray-600 mt-1">Quickly access your writing tools and insights.</p>
		</div>
		<div class="p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<!-- Analytics -->
				<a 
					href="/analytics" 
					class="group flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md hover-lift"
				>
					<div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
						<BarChart3 class="h-5 w-5 text-blue-600" />
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="text-sm font-semibold text-gray-900 group-hover:text-blue-900">Analytics</h3>
						<p class="text-xs text-gray-500 group-hover:text-blue-700">View your writing insights</p>
					</div>
				</a>

				<!-- Dashboard -->
				<a 
					href="/dashboard" 
					class="group flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-md hover-lift"
				>
					<div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
						<Home class="h-5 w-5 text-green-600" />
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="text-sm font-semibold text-gray-900 group-hover:text-green-900">Dashboard</h3>
						<p class="text-xs text-gray-500 group-hover:text-green-700">Your writing overview</p>
					</div>
				</a>

				<!-- Projects -->
				<a 
					href="/projects" 
					class="group flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-all duration-200 hover:shadow-md hover-lift"
				>
					<div class="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
						<BookOpen class="h-5 w-5 text-purple-600" />
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="text-sm font-semibold text-gray-900 group-hover:text-purple-900">Projects</h3>
						<p class="text-xs text-gray-500 group-hover:text-purple-700">Manage your writing</p>
					</div>
				</a>
			</div>
		</div>
	</div>

	<!-- Subscription Management Section -->
	<div class="mt-8 bg-white shadow-lg rounded-lg">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900">Subscription Plan</h2>
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<!-- See script change below -->
					<div class="p-3 rounded-lg {getTierColor(data?.user?.subscriptionTier || 'free')}">
						<TierIcon class="h-6 w-6" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							{getTierDisplayName(data?.user?.subscriptionTier || 'free')} Plan
						</h3>
						<p class="text-sm text-gray-600">
							{#if data?.user?.subscriptionTier === 'free'}
								You're currently on our free plan. Upgrade to unlock premium features!
							{:else if data?.user?.subscriptionTier === 'premium'}
								You have access to AI writing assistance and advanced features.
							{:else if data?.user?.subscriptionTier === 'pro'}
								You have unlimited access to all WriterBuddy features.
							{:else}
								You're currently on our free plan.
							{/if}
						</p>
						{#if data?.user?.subscriptionStatus}
							<p class="text-xs text-gray-500 mt-1">
								Status: {data.user.subscriptionStatus}
								{#if data?.user?.subscriptionExpiresAt}
									• Next billing: {new Date(data.user.subscriptionExpiresAt).toLocaleDateString()}
								{/if}
							</p>
						{/if}
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<button
						onclick={() => showSubscriptionModal = true}
						class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
					>
						{#if data?.user?.subscriptionTier === 'free'}
							<Crown class="h-4 w-4 mr-2" />
							Upgrade Plan
						{:else}
							<Crown class="h-4 w-4 mr-2" />
							Manage Plan
						{/if}
					</button>
					{#if data?.user?.subscriptionTier !== 'free'}
						<button
							onclick={() => alert('Contact support to cancel your subscription')}
							class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
						>
							<X class="h-4 w-4 mr-2" />
							Cancel Plan
						</button>
					{/if}
				</div>
			</div>

			<!-- Feature Comparison -->
			{#if data?.user?.subscriptionTier === 'free'}
				<div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h4 class="text-sm font-semibold text-blue-900 mb-2">Unlock Premium Features</h4>
					<ul class="text-sm text-blue-800 space-y-1">
						<li class="flex items-center space-x-2">
							<CheckCircle class="h-4 w-4 text-blue-600" />
							<span>AI writing suggestions and grammar checking</span>
						</li>
						<li class="flex items-center space-x-2">
							<CheckCircle class="h-4 w-4 text-blue-600" />
							<span>Unlimited projects and documents</span>
						</li>
						<li class="flex items-center space-x-2">
							<CheckCircle class="h-4 w-4 text-blue-600" />
							<span>Advanced analytics and progress tracking</span>
						</li>
						<li class="flex items-center space-x-2">
							<CheckCircle class="h-4 w-4 text-blue-600" />
							<span>Priority support and exclusive features</span>
						</li>
					</ul>
				</div>
			{/if}
		</div>
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

<!-- Subscription Modal -->
{#if showSubscriptionModal}
	<SubscriptionModal 
		user={data?.user} 
		aiAccess={data?.aiAccess}
		onClose={() => showSubscriptionModal = false}
	/>
{/if}
