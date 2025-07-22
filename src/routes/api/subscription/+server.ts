import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { subscriptionTier } = await request.json();
		
		// Validate subscription tier
		const validTiers = ['free', 'premium', 'pro'];
		if (!subscriptionTier || !validTiers.includes(subscriptionTier)) {
			return json({ error: 'Invalid subscription tier' }, { status: 400 });
		}

		const updateData: any = {
			subscriptionTier,
			subscriptionStatus: 'active',
			// Auto-enable AI access for premium/pro, disable for free
			aiAccessEnabled: subscriptionTier !== 'free',
			updatedAt: new Date()
		};
		
		// Set expiration date for testing (30 days from now for paid tiers)
		if (subscriptionTier !== 'free') {
			updateData.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
		} else {
			updateData.subscriptionExpiresAt = null;
		}

		const [updatedUser] = await db
			.update(user)
			.set(updateData)
			.where(eq(user.id, locals.user.id))
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
