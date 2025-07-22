import { AiWritingService } from '$lib/server/ai';
import { SubscriptionService } from '$lib/server/subscription';

export const load = async (event: { locals: any }) => {
	const user = event.locals.user;
	
	if (!user) {
		return {
			user: null
		};
	}

	// Get AI access information
	const aiAccessInfo = AiWritingService.getAccessInfo(user);
	const userTierFeatures = SubscriptionService.getTierFeatures(user.subscriptionTier);

	return {
		user: {
			id: user.id,
			username: user.username,
			email: user.email,
			displayName: user.displayName,
			profileImage: user.profileImage,
			subscriptionTier: user.subscriptionTier,
			subscriptionStatus: user.subscriptionStatus,
			subscriptionExpiresAt: user.subscriptionExpiresAt,
			aiAccessEnabled: user.aiAccessEnabled
		},
		aiAccess: aiAccessInfo,
		tierFeatures: userTierFeatures
	};
};
