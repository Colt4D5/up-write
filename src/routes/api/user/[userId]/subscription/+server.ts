import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { subscriptionTier, aiAccessEnabled } = await request.json();
		
		// For now, allow users to change their own subscription for testing
		// In production, this would be restricted to admin users or payment webhooks
		const userId = params.userId || locals.user.id;
		
		// Validate subscription tier
		const validTiers = ['free', 'premium', 'pro'];
		if (subscriptionTier && !validTiers.includes(subscriptionTier)) {
			return json({ error: 'Invalid subscription tier' }, { status: 400 });
		}

		const updateData: any = {
			updatedAt: new Date()
		};

		if (subscriptionTier) {
			updateData.subscriptionTier = subscriptionTier;
			// Auto-enable AI access for premium/pro, disable for free
			updateData.aiAccessEnabled = subscriptionTier !== 'free';
			updateData.subscriptionStatus = 'active';
			
			// Set expiration date for testing (30 days from now for paid tiers)
			if (subscriptionTier !== 'free') {
				updateData.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
			} else {
				updateData.subscriptionExpiresAt = null;
			}
		}

		if (typeof aiAccessEnabled === 'boolean') {
			updateData.aiAccessEnabled = aiAccessEnabled;
		}

		const [updatedUser] = await db
			.update(user)
			.set(updateData)
			.where(eq(user.id, userId))
			.returning();

		if (!updatedUser) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({
			message: 'Subscription updated successfully',
			user: {
				id: updatedUser.id,
				subscriptionTier: updatedUser.subscriptionTier,
				subscriptionStatus: updatedUser.subscriptionStatus,
				subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
				aiAccessEnabled: updatedUser.aiAccessEnabled
			}
		});
	} catch (error) {
		console.error('Update subscription error:', error);
		return json({ error: 'Failed to update subscription' }, { status: 500 });
	}
};
