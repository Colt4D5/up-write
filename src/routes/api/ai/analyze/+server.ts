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

		const analysis = await AiWritingService.analyzeText(text);
		return json(analysis);
	} catch (error) {
		console.error('AI analysis error:', error);
		return json({ error: 'Analysis failed' }, { status: 500 });
	}
};
