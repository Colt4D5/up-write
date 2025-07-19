import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DocumentService } from '$lib/server/services';
import { getUserFromEvent } from '$lib/server/auth';

export const PATCH: RequestHandler = async (event) => {
	const user = await getUserFromEvent(event);
	if (!user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const documentId = event.params.id;
	if (!documentId) {
		return json({ message: 'Document ID is required' }, { status: 400 });
	}

	try {
		const body = await event.request.json();
		const { title, content } = body;

		// Get the document first to check if it exists
		const existingDocument = await DocumentService.getDocument(documentId);
		if (!existingDocument) {
			return json({ message: 'Document not found' }, { status: 404 });
		}

		// Update the document
		const updatedDocument = await DocumentService.updateDocument(documentId, {
			title: title?.trim(),
			content,
			wordCount: content ? content.split(/\s+/).filter((word: string) => word.length > 0).length : 0
		});

		return json(updatedDocument);
	} catch (error) {
		console.error('Error updating document:', error);
		return json({ message: 'Failed to update document' }, { status: 500 });
	}
};
