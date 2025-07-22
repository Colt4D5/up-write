import { env } from '$env/dynamic/private';
import type { User } from './db/schema';

export interface AiAccessInfo {
	hasAccess: boolean;
	reason?: 'no_api_key' | 'free_tier' | 'subscription_expired' | 'access_disabled';
	tier: string;
}

export class SubscriptionService {
	/**
	 * Check if a user has access to AI features
	 */
	static checkAiAccess(user: User): AiAccessInfo {
		// First check if OpenAI API key is configured
		if (!env.OPENAI_API_KEY) {
			return {
				hasAccess: false,
				reason: 'no_api_key',
				tier: user.subscriptionTier
			};
		}

		// Check if user has AI access explicitly disabled
		if (!user.aiAccessEnabled) {
			return {
				hasAccess: false,
				reason: 'access_disabled',
				tier: user.subscriptionTier
			};
		}

		// Check subscription tier - only premium and pro have AI access
		if (user.subscriptionTier === 'free') {
			return {
				hasAccess: false,
				reason: 'free_tier',
				tier: user.subscriptionTier
			};
		}

		// Check if subscription is active and not expired
		if (user.subscriptionStatus !== 'active') {
			return {
				hasAccess: false,
				reason: 'subscription_expired',
				tier: user.subscriptionTier
			};
		}

		// Check expiration date if set
		if (user.subscriptionExpiresAt && new Date() > user.subscriptionExpiresAt) {
			return {
				hasAccess: false,
				reason: 'subscription_expired',
				tier: user.subscriptionTier
			};
		}

		// User has access!
		return {
			hasAccess: true,
			tier: user.subscriptionTier
		};
	}

	/**
	 * Get user-friendly message for why AI access is not available
	 */
	static getAccessDeniedMessage(accessInfo: AiAccessInfo): string {
		switch (accessInfo.reason) {
			case 'no_api_key':
				return 'AI features are currently unavailable. Please contact support.';
			case 'free_tier':
				return 'AI writing assistance is available with Premium and Pro plans. Upgrade your account to access these features.';
			case 'subscription_expired':
				return 'Your subscription has expired. Please renew to continue using AI features.';
			case 'access_disabled':
				return 'AI features have been disabled for your account. Contact support if you believe this is an error.';
			default:
				return 'AI features are currently unavailable.';
		}
	}

	/**
	 * Get subscription tier display name
	 */
	static getTierDisplayName(tier: string): string {
		switch (tier) {
			case 'free':
				return 'Free';
			case 'premium':
				return 'Premium';
			case 'pro':
				return 'Pro';
			default:
				return 'Unknown';
		}
	}

	/**
	 * Get tier-specific limits and features
	 */
	static getTierFeatures(tier: string) {
		switch (tier) {
			case 'free':
				return {
					aiAccess: false,
					maxProjects: 3,
					maxDocuments: 10,
					storageLimit: '50MB',
					features: ['Basic writing tools', 'Document organization', 'Word count tracking']
				};
			case 'premium':
				return {
					aiAccess: true,
					maxProjects: 10,
					maxDocuments: 100,
					storageLimit: '500MB',
					features: ['AI writing assistance', 'Grammar suggestions', 'Style improvements', 'Advanced analytics']
				};
			case 'pro':
				return {
					aiAccess: true,
					maxProjects: -1, // unlimited
					maxDocuments: -1, // unlimited
					storageLimit: '5GB',
					features: ['All Premium features', 'Unlimited projects', 'Priority support', 'Advanced AI models']
				};
			default:
				return {
					aiAccess: false,
					maxProjects: 0,
					maxDocuments: 0,
					storageLimit: '0MB',
					features: []
				};
		}
	}
}
