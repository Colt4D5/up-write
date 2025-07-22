import { json, type RequestHandler } from '@sveltejs/kit';
import { AiWritingService } from '$lib/server/ai';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { text } = await request.json();
		
		if (!text || typeof text !== 'string') {
			return json({ error: 'Text is required' }, { status: 400 });
		}

		// Check if user has AI access
		const accessInfo = AiWritingService.getAccessInfo(locals.user);
		if (!accessInfo.hasAccess) {
			return json({ 
				error: 'AI features not available',
				reason: accessInfo.reason,
				tier: accessInfo.tier,
				message: accessInfo.reason === 'no_api_key' 
					? 'AI features are currently unavailable'
					: accessInfo.reason === 'free_tier'
					? 'Upgrade to Premium or Pro to access AI writing assistance'
					: 'AI features are not available for your account'
			}, { status: 403 });
		}

		const analysis = await AiWritingService.analyzeText(text, locals.user);
		return json(analysis);
	} catch (error) {
		console.error('AI analysis error:', error);
		return json({ error: 'Analysis failed' }, { status: 500 });
	}
};
