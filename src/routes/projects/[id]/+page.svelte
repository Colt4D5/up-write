<script lang="ts">
	import { 
		Folder, 
		FolderOpen,
		FileText, 
		Plus, 
		Users,
		BookOpen,
		Settings,
		MoreVertical,
		ChevronRight,
		ChevronDown,
		Search,
		X,
		Save,
		Check,
		AlertCircle,
		ChevronLeft,
		PanelLeftClose,
		PanelLeftOpen,
		PanelRightClose,
		PanelRightOpen,
		Target,
		Hash,
		Eye
	} from 'lucide-svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import AiSuggestions from '$lib/components/AiSuggestions.svelte';
	import InlineAiSuggestions from '$lib/components/InlineAiSuggestions.svelte';
	import SuggestionDetailModal from '$lib/components/SuggestionDetailModal.svelte';
	import CreateNotebookModal from '$lib/components/CreateNotebookModal.svelte';
	import { formatDate, countWords } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import type { AiAnalysisResult } from '$lib/types';

	let { data }: { data: PageData } = $props();
	
	let selectedDocument = $state<any>(null);
	let documentContent = $state('');
	let aiAnalysis = $state<AiAnalysisResult | null>(null);
	let isAnalyzing = $state(false);
	let expandedNotebooks = $state<Set<string>>(new Set());
	let searchQuery = $state('');
	
	// Inline AI suggestions state
	let showInlineSuggestions = $state(true);
	let showSuggestionLegend = $state(false);
	let selectedSuggestion = $state<AiAnalysisResult['suggestions'][0] | null>(null);
	let showSuggestionModal = $state(false);
	
	// Sidebar visibility state
	let leftSidebarVisible = $state(true);
	let rightSidebarVisible = $state(false); // Hide AI sidebar by default
	
	// New document creation modal state
	let showCreateDocModal = $state(false);
	let newDocName = $state('');
	let newDocCategory = $state('');
	let newDocDescription = $state('');
	let isCreatingDocument = $state(false);

	// New notebook creation modal state
	let showCreateNotebookModal = $state(false);
	let isCreatingNotebook = $state(false);

	// Document save state
	let hasUnsavedChanges = $state(false);
	let isSaving = $state(false);
	let lastSaved = $state<Date | null>(null);
	let saveStatus = $state<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
	let autosaveEnabled = $state(true); // This could be a user preference
	let autosaveTimeout: ReturnType<typeof setTimeout> | null = null;

	const AUTOSAVE_DELAY = 3000; // 3 seconds of inactivity

	// Auto-select first document if available
	$effect(() => {
		if (data.notebooks && !selectedDocument) {
			for (const notebook of data.notebooks) {
				if (notebook.documents && notebook.documents.length > 0) {
					const firstDoc = notebook.documents[0];
					selectedDocument = firstDoc;
					documentContent = firstDoc.content || '';
					hasUnsavedChanges = false;
					saveStatus = 'saved';
					lastSaved = firstDoc.updatedAt ? new Date(firstDoc.updatedAt) : null;
					break;
				}
			}
		}
	});

	// Cleanup autosave timeout on component unmount
	$effect(() => {
		return () => {
			if (autosaveTimeout) {
				clearTimeout(autosaveTimeout);
			}
		};
	});

	function toggleNotebook(notebookId: string) {
		if (expandedNotebooks.has(notebookId)) {
			expandedNotebooks.delete(notebookId);
		} else {
			expandedNotebooks.add(notebookId);
		}
		expandedNotebooks = new Set(expandedNotebooks);
	}

	function openCreateDocModal(notebookId?: string, notebookType?: string) {
		if (notebookId && notebookType) {
			// Quick creation from notebook + button
			newDocCategory = notebookId;
		} else {
			// General creation - set default to first notebook
			newDocCategory = data.notebooks?.[0]?.id || '';
		}
		newDocName = '';
		newDocDescription = '';
		showCreateDocModal = true;
	}

	function closeCreateDocModal() {
		showCreateDocModal = false;
		newDocName = '';
		newDocCategory = '';
		newDocDescription = '';
	}

	function toggleLeftSidebar() {
		leftSidebarVisible = !leftSidebarVisible;
	}

	function toggleRightSidebar() {
		rightSidebarVisible = !rightSidebarVisible;
	}

	async function createDocument() {
		if (!newDocName.trim() || !newDocCategory) return;

		isCreatingDocument = true;
		try {
			const response = await fetch(`/api/projects/${data.project.id}/documents`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					notebookId: newDocCategory,
					title: newDocName.trim(),
					content: '',
					description: newDocDescription.trim() || undefined
				})
			});

			if (response.ok) {
				const newDocument = await response.json();
				
				// Refresh the data
				await invalidateAll();
				
				// Auto-select the new document
				selectedDocument = newDocument;
				documentContent = newDocument.content || '';
				hasUnsavedChanges = false;
				lastSaved = new Date();
				saveStatus = 'saved';
				
				// Ensure the notebook is expanded
				const notebook = data.notebooks?.find(nb => nb.id === newDocCategory);
				if (notebook) {
					expandedNotebooks.add(notebook.id);
					expandedNotebooks = new Set(expandedNotebooks);
				}
				
				closeCreateDocModal();
			} else {
				const error = await response.json();
				alert('Failed to create document: ' + (error.message || 'Unknown error'));
			}
		} catch (error) {
			console.error('Create document error:', error);
			alert('Failed to create document. Please try again.');
		} finally {
			isCreatingDocument = false;
		}
	}

	async function saveDocument(showFeedback = true) {
		if (!selectedDocument || isSaving) return false;

		isSaving = true;
		saveStatus = 'saving';
		
		try {
			const response = await fetch(`/api/documents/${selectedDocument.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: selectedDocument.title,
					content: documentContent
				})
			});

			if (response.ok) {
				const updatedDocument = await response.json();
				
				// Update the selected document with the response (including new wordCount)
				selectedDocument = { ...selectedDocument, ...updatedDocument };
				hasUnsavedChanges = false;
				lastSaved = new Date();
				saveStatus = 'saved';
				
				// Update the document in the notebooks data without triggering reactivity loops
				if (data.notebooks) {
					for (const notebook of data.notebooks) {
						if (notebook.documents) {
							const docIndex = notebook.documents.findIndex(doc => doc.id === selectedDocument.id);
							if (docIndex !== -1) {
								notebook.documents[docIndex] = { ...notebook.documents[docIndex], ...updatedDocument };
								break;
							}
						}
					}
				}
				
				return true;
			} else {
				saveStatus = 'error';
				if (showFeedback) {
					const error = await response.json();
					alert('Failed to save document: ' + (error.message || 'Unknown error'));
				}
				return false;
			}
		} catch (error) {
			console.error('Save document error:', error);
			saveStatus = 'error';
			if (showFeedback) {
				alert('Failed to save document. Please try again.');
			}
			return false;
		} finally {
			isSaving = false;
		}
	}

	function openCreateNotebookModal() {
		showCreateNotebookModal = true;
	}

	function closeCreateNotebookModal() {
		showCreateNotebookModal = false;
	}

	async function createNotebook(notebookData: { title: string; type: any; contributesToWordCount: boolean }) {
		isCreatingNotebook = true;
		
		try {
			const response = await fetch('/api/notebooks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					projectId: data.project.id,
					title: notebookData.title,
					type: notebookData.type,
					contributesToWordCount: notebookData.contributesToWordCount
				})
			});

			if (response.ok) {
				// Refresh the data to show the new notebook
				await invalidateAll();
				closeCreateNotebookModal();
			} else {
				const error = await response.json();
				alert('Failed to create notebook: ' + (error.error || 'Unknown error'));
			}
		} catch (error) {
			console.error('Create notebook error:', error);
			alert('Failed to create notebook. Please try again.');
		} finally {
			isCreatingNotebook = false;
		}
	}

	async function triggerAutosave() {
		if (autosaveEnabled && hasUnsavedChanges && selectedDocument) {
			await saveDocument(false); // Don't show error alerts for autosave
		}
	}

	// Handle escape key to close modal and Ctrl+S to save
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showCreateDocModal) {
			closeCreateDocModal();
		}
		
		// Handle Ctrl+S (or Cmd+S on Mac) to save
		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			if (selectedDocument && hasUnsavedChanges) {
				saveDocument();
			}
		}
	}

	function selectDocument(document: any) {
		// Only change if it's actually a different document
		if (selectedDocument?.id === document.id) return;
		
		// Clear any pending autosave for the previous document
		if (autosaveTimeout) {
			clearTimeout(autosaveTimeout);
			autosaveTimeout = null;
		}
		
		// Update selected document and content
		selectedDocument = document;
		documentContent = document.content || '';
		aiAnalysis = null;
		hasUnsavedChanges = false;
		saveStatus = 'saved';
		lastSaved = document.updatedAt ? new Date(document.updatedAt) : null;
	}

	async function handleContentUpdate(content: string) {
		// Only proceed if content actually changed and we have a selected document
		if (content === documentContent || !selectedDocument) return;
		
		documentContent = content;
		
		// Mark as having unsaved changes
		hasUnsavedChanges = true;
		saveStatus = 'unsaved';
		
		// Update the document's local word count for display (don't modify the original object)
		const wordCount = countWords(content);
		selectedDocument = { ...selectedDocument, wordCount };
		
		// Clear existing autosave timeout
		if (autosaveTimeout) {
			clearTimeout(autosaveTimeout);
		}
		
		// Set new autosave timeout
		if (autosaveEnabled) {
			autosaveTimeout = setTimeout(triggerAutosave, AUTOSAVE_DELAY);
		}
	}

	async function handleAnalyzeText(text: string) {
		if (!text.trim()) return;
		
		// Check if user has AI access
		if (!data.aiAccess.hasAccess) {
			// Show upgrade message
			alert(getAiAccessMessage());
			return;
		}
		
		isAnalyzing = true;
		try {
			const response = await fetch('/api/ai/analyze', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text })
			});

			if (response.ok) {
				aiAnalysis = await response.json();
			} else {
				const error = await response.json();
				if (response.status === 403) {
					// Handle AI access denied
					alert(error.message || 'AI features are not available for your account');
				} else {
					console.error('Analysis error:', error);
				}
			}
		} catch (error) {
			console.error('Analysis error:', error);
		} finally {
			isAnalyzing = false;
		}
	}

	async function handleInlineAnalyze(text: string) {
		if (!text.trim()) return [];
		
		// Check if user has AI access
		if (!data.aiAccess.hasAccess) {
			return [];
		}
		
		try {
			const response = await fetch('/api/ai/inline-suggestions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text })
			});

			if (response.ok) {
				return await response.json();
			} else {
				console.error('Inline analysis error:', await response.text());
				return [];
			}
		} catch (error) {
			console.error('Inline analysis error:', error);
			return [];
		}
	}

	function getAiAccessMessage(): string {
		switch (data.aiAccess.reason) {
			case 'no_api_key':
				return 'AI features are currently unavailable. Please contact support.';
			case 'free_tier':
				return 'AI writing assistance is available with Premium and Pro plans. Upgrade your account to access advanced writing suggestions, grammar checking, and style improvements.';
			case 'subscription_expired':
				return 'Your subscription has expired. Please renew your Premium or Pro plan to continue using AI features.';
			case 'access_disabled':
				return 'AI features have been disabled for your account. Contact support if you believe this is an error.';
			default:
				return 'AI features are currently unavailable.';
		}
	}

	function getTierDisplayName(tier: string): string {
		switch (tier) {
			case 'free': return 'Free';
			case 'premium': return 'Premium';
			case 'pro': return 'Pro';
			default: return 'Unknown';
		}
	}

	function handleAcceptSuggestion(index: number) {
		if (!aiAnalysis || !aiAnalysis.suggestions[index]) return;
		
		const suggestion = aiAnalysis.suggestions[index];
		if (suggestion.suggestedText && selectedDocument) {
			// Replace the text in the document content
			const { startPosition, endPosition, suggestedText } = suggestion;
			const beforeText = documentContent.substring(0, startPosition);
			const afterText = documentContent.substring(endPosition);
			const newContent = beforeText + suggestedText + afterText;
			
			// Update the content
			handleContentUpdate(newContent);
			
			// Remove the accepted suggestion from the analysis
			aiAnalysis.suggestions.splice(index, 1);
			aiAnalysis = { ...aiAnalysis };
		}
	}

	function handleDismissSuggestion(index: number) {
		if (!aiAnalysis) return;
		
		aiAnalysis.suggestions.splice(index, 1);
		aiAnalysis = { ...aiAnalysis };
	}

	function handleSuggestionClick(suggestionIndex: number) {
		if (!aiAnalysis || !aiAnalysis.suggestions[suggestionIndex]) return;
		
		selectedSuggestion = aiAnalysis.suggestions[suggestionIndex];
		showSuggestionModal = true;
	}

	function handleToggleSuggestionLegend() {
		showSuggestionLegend = !showSuggestionLegend;
	}

	function handleCloseSuggestionModal() {
		showSuggestionModal = false;
		selectedSuggestion = null;
	}

	function handleAcceptModalSuggestion() {
		if (!selectedSuggestion || !aiAnalysis) return;
		
		const index = aiAnalysis.suggestions.findIndex(s => s === selectedSuggestion);
		if (index !== -1) {
			handleAcceptSuggestion(index);
		}
		handleCloseSuggestionModal();
	}

	function handleDismissModalSuggestion() {
		if (!selectedSuggestion || !aiAnalysis) return;
		
		const index = aiAnalysis.suggestions.findIndex(s => s === selectedSuggestion);
		if (index !== -1) {
			handleDismissSuggestion(index);
		}
		handleCloseSuggestionModal();
	}

	async function toggleNotebookWordCountContribution(notebookId: string, currentValue: boolean) {
		try {
			const response = await fetch(`/api/notebooks/${notebookId}/word-count`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					contributesToWordCount: !currentValue
				})
			});

			if (response.ok) {
				// Update the local data
				await invalidateAll();
			} else {
				const error = await response.json();
				alert('Failed to update word count setting: ' + (error.message || 'Unknown error'));
			}
		} catch (error) {
			console.error('Toggle word count error:', error);
			alert('Failed to update word count setting. Please try again.');
		}
	}

	// Filter notebooks based on search
	let filteredNotebooks = $derived.by(() => {
		return data.notebooks?.filter(notebook => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return notebook.title.toLowerCase().includes(query) ||
				notebook.documents?.some(doc => doc.title.toLowerCase().includes(query));
		}) || [];
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>{data.project.title} - WriterBuddy</title>
</svelte:head>

<div class="flex bg-gray-50">
	<!-- Sidebar -->
	<div>
		<div class="bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative {leftSidebarVisible ? 'w-80' : 'w-16'}">
			{#if leftSidebarVisible}
				<!-- Full Sidebar Content -->
				<div class="p-4 border-b border-gray-200">
					<div class="flex items-center justify-between mb-2">
						<h1 class="text-lg font-semibold text-gray-900 truncate" title={data.project.title}>
							{data.project.title}
						</h1>
						<div class="flex items-center space-x-2">
							<button
								class="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
								onclick={() => openCreateDocModal()}
								title="New Document"
							>
								<Plus class="h-4 w-4" />
							</button>
						</div>
					</div>
		
					{#if data.project.description}
						<p class="text-sm text-gray-600 line-clamp-2" title={data.project.description}>
							{data.project.description}
						</p>
					{/if}
					<div class="flex items-center justify-between mt-3 text-xs text-gray-500">
						<span>{data.project.genre || 'No genre'}</span>
						{#if data.project.targetWordCount}
							<span>Target: {data.project.targetWordCount.toLocaleString()} words</span>
						{/if}
					</div>
		
					<!-- Current Word Count Display -->
					{#if data.notebooks}
						{@const contributingNotebooks = data.notebooks.filter(nb => nb.contributesToWordCount)}
						{@const currentWordCount = contributingNotebooks.reduce((total, notebook) =>
							total + (notebook.documents?.reduce((sum, doc) => sum + (doc.wordCount || 0), 0) || 0), 0
						)}
						{#if contributingNotebooks.length > 0}
							<div class="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										<Target class="h-4 w-4 text-blue-600" />
										<span class="text-sm font-medium text-blue-900">
											Current: {currentWordCount.toLocaleString()} words
										</span>
									</div>
									{#if data.project.targetWordCount}
										<span class="text-xs text-blue-700">
											{Math.round((currentWordCount / data.project.targetWordCount) * 100)}%
										</span>
									{/if}
								</div>
								<div class="mt-1 text-xs text-blue-600">
									From: {contributingNotebooks.map(nb => nb.title).join(', ')}
								</div>
							</div>
						{:else}
							<div class="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
								<div class="flex items-center space-x-2">
									<Hash class="h-4 w-4 text-gray-400" />
									<span class="text-sm text-gray-600">
										No notebooks contributing to word count
									</span>
								</div>
							</div>
						{/if}
					{/if}
				</div>
				<!-- Search -->
				<div class="p-3 border-b border-gray-200">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<input
							bind:value={searchQuery}
							type="text"
							placeholder="Search notebooks and documents..."
							class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
				<!-- Notebooks Tree -->
				<div class="flex-1 overflow-y-auto">
					<div class="p-3 space-y-1">
						{#each filteredNotebooks as notebook}
							<div>
								<!-- Notebook Header -->
								<button
									type="button"
									onclick={() => toggleNotebook(notebook.id)}
									class="w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 group"
								>
									<div class="flex items-center space-x-2 min-w-0 flex-1">
										{#if expandedNotebooks.has(notebook.id)}
											<ChevronDown class="h-4 w-4 text-gray-400" />
											<FolderOpen class="h-4 w-4 text-blue-500" />
										{:else}
											<ChevronRight class="h-4 w-4 text-gray-400" />
											<Folder class="h-4 w-4 text-blue-500" />
										{/if}
										<span class="font-medium text-gray-900 truncate">{notebook.title}</span>
										{#if (notebook.documents?.length || 0) > 0}
											<span class="text-xs text-gray-400 font-normal ml-1">
												({notebook.documents?.length || 0})
											</span>
										{/if}
										<!-- Word Count Contribution Indicator -->
										{#if notebook.contributesToWordCount}
											<div
												class="flex-shrink-0 p-1 bg-green-100 text-green-600 rounded"
												title="Contributes to project word count"
											>
												<Target class="h-3 w-3" />
											</div>
										{:else}
											<div
												class="flex-shrink-0 p-1 bg-gray-100 text-gray-400 rounded"
												title="Does not contribute to project word count"
											>
												<Hash class="h-3 w-3" />
											</div>
										{/if}
									</div>
		
									<div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
										<!-- Toggle Word Count Contribution -->
										<div
											class="p-1 hover:bg-gray-200 rounded cursor-pointer"
											title={notebook.contributesToWordCount ? "Remove from word count" : "Include in word count"}
											onclick={(e) => {
												e.stopPropagation();
												toggleNotebookWordCountContribution(notebook.id, notebook.contributesToWordCount);
											}}
											role="button"
											tabindex="0"
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													e.stopPropagation();
													toggleNotebookWordCountContribution(notebook.id, notebook.contributesToWordCount);
												}
											}}
										>
											{#if notebook.contributesToWordCount}
												<Target class="h-3 w-3 text-green-600" />
											{:else}
												<Hash class="h-3 w-3 text-gray-400" />
											{/if}
										</div>
		
										<div
											class="p-1 hover:bg-gray-200 rounded cursor-pointer"
											title="Add document"
											onclick={(e) => {
												e.stopPropagation();
												openCreateDocModal(notebook.id, notebook.type);
											}}
											role="button"
											tabindex="0"
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													e.stopPropagation();
													openCreateDocModal(notebook.id, notebook.type);
												}
											}}
										>
											<Plus class="h-3 w-3" />
										</div>
									</div>
								</button>
								<!-- Documents -->
								{#if expandedNotebooks.has(notebook.id) && notebook.documents}
									<div class="ml-6 space-y-1">
										{#each notebook.documents as document}
											<button
												type="button"
												onclick={() => selectDocument(document)}
												class="w-full flex items-center space-x-2 p-2 text-left rounded-md hover:bg-gray-100 {selectedDocument?.id === document.id ? 'bg-blue-50 border border-blue-200' : ''}"
											>
												<FileText class="h-4 w-4 text-gray-400 flex-shrink-0" />
												<div class="min-w-0 flex-1">
													<div class="font-medium text-gray-900 truncate text-sm">
														{document.title}
													</div>
													<div class="text-xs text-gray-500">
														{document.wordCount || 0} words •
														{formatDate(new Date(document.updatedAt))}
													</div>
												</div>
											</button>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
				<!-- Add Notebook Button -->
				<div class="p-3 border-t border-gray-200">
					<button
						onclick={openCreateNotebookModal}
						class="w-full flex items-center justify-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-dashed border-gray-300"
					>
						<Plus class="h-4 w-4" />
						<span class="text-sm">Add Notebook</span>
					</button>
				</div>
			{:else}
				<!-- Collapsed Sidebar - Icon Only View -->
				<div class="flex flex-col items-center py-4 space-y-3 flex-1">
					<!-- Project Icon -->
					<div class="p-2 bg-blue-50 rounded-lg">
						<BookOpen class="h-5 w-5 text-blue-600" />
					</div>
		
					<!-- Divider -->
					<div class="w-8 h-px bg-gray-200"></div>
		
					<!-- New Document Button -->
					<button
						class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
						onclick={() => openCreateDocModal()}
						title="New Document"
					>
						<Plus class="h-5 w-5" />
					</button>
		
					<!-- Search Icon -->
					<button
						class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
						title="Search (expand to use)"
					>
						<Search class="h-5 w-5" />
					</button>
		
					<!-- Notebooks -->
					{#each filteredNotebooks.slice(0, 3) as notebook}
						<button
							class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg relative"
							title={notebook.title}
						>
							<Folder class="h-5 w-5" />
							{#if (notebook.documents?.length || 0) > 0}
								<span class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
									{notebook.documents?.length}
								</span>
							{/if}
							<!-- Word count contribution indicator -->
							{#if notebook.contributesToWordCount}
								<div class="absolute -bottom-1 -left-1 bg-green-100 text-green-600 rounded-full p-0.5">
									<Target class="h-2 w-2" />
								</div>
							{/if}
						</button>
					{/each}
		
					<!-- More indicator if there are more notebooks -->
					{#if filteredNotebooks.length > 3}
						<button
							class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
							title={`${filteredNotebooks.length - 3} more notebooks`}
						>
							<MoreVertical class="h-5 w-5" />
						</button>
					{/if}
				</div>
			{/if}
		
			<!-- Toggle Button -->
			<button
				class="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm z-10"
				onclick={toggleLeftSidebar}
				title={leftSidebarVisible ? 'Collapse sidebar' : 'Expand sidebar'}
			>
				{#if leftSidebarVisible}
					<PanelLeftClose class="h-4 w-4" />
				{:else}
					<PanelLeftOpen class="h-4 w-4" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="flex-1 flex">
		<!-- Editor -->
		<div class="flex-1 flex flex-col">
			{#if selectedDocument}
				<!-- Document Header -->
				<div class="bg-white border-b border-gray-200 p-4">
					<div class="flex items-center justify-between">
						<div class="flex-1 min-w-0">
							<h2 class="text-xl font-semibold text-gray-900">{selectedDocument.title}</h2>
							<div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
								<span>{selectedDocument.wordCount || 0} words</span>
								<span>Last updated {formatDate(new Date(selectedDocument.updatedAt))}</span>
								
								<!-- Save Status -->
								<div class="flex items-center space-x-2">
									{#if saveStatus === 'saving'}
										<div class="flex items-center space-x-1 text-blue-600">
											<div class="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
											<span class="text-xs">Saving...</span>
										</div>
									{:else if saveStatus === 'saved'}
										<div class="flex items-center space-x-1 text-green-600">
											<Check class="h-3 w-3" />
											<span class="text-xs">
												{lastSaved ? `Saved ${formatDate(lastSaved)}` : 'Saved'}
											</span>
										</div>
									{:else if saveStatus === 'unsaved'}
										<div class="flex items-center space-x-1 text-orange-600">
											<div class="h-2 w-2 bg-orange-500 rounded-full"></div>
											<span class="text-xs">Unsaved changes</span>
										</div>
									{:else if saveStatus === 'error'}
										<div class="flex items-center space-x-1 text-red-600">
											<AlertCircle class="h-3 w-3" />
											<span class="text-xs">Save failed</span>
										</div>
									{/if}
								</div>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<!-- Toggle Inline Suggestions -->
							{#if data.aiAccess.hasAccess && aiAnalysis && aiAnalysis.suggestions.length > 0}
								<button
									onclick={() => showInlineSuggestions = !showInlineSuggestions}
									class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium border rounded-md transition-colors {showInlineSuggestions ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}"
									title={showInlineSuggestions ? 'Switch to editor view' : 'Show inline suggestions'}
								>
									<Eye class="h-3 w-3" />
									<span>{showInlineSuggestions ? 'Editor' : 'Suggestions'}</span>
								</button>
							{:else if !data.aiAccess.hasAccess}
								<!-- No AI access message -->
								<div class="px-3 py-1.5 text-sm text-gray-500 italic">
									AI features unavailable
								</div>
							{/if}
							
							<!-- Save Button -->
							<button 
								class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								onclick={() => saveDocument()}
								disabled={isSaving || !hasUnsavedChanges}
								title={hasUnsavedChanges ? 'Save document (Ctrl+S)' : 'No unsaved changes'}
							>
								<Save class="h-3 w-3" />
								<span>{isSaving ? 'Saving...' : 'Save'}</span>
							</button>
							
							<button class="p-2 text-gray-400 hover:text-gray-600 rounded">
								<MoreVertical class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				<!-- Editor Area -->
				<div class="flex-1 p-4 relative">
					{#if showInlineSuggestions && data.aiAccess.hasAccess && aiAnalysis && aiAnalysis.suggestions.length > 0}
						<!-- Inline AI Suggestions View -->
						<div class="h-full border border-gray-300 rounded-lg p-4 bg-white overflow-y-auto">
							<div class="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
								<div class="flex items-center space-x-2">
									<Eye class="h-4 w-4 text-blue-600" />
									<span class="font-medium text-blue-900">Suggestion Preview Mode</span>
								</div>
								<p class="mt-1 text-blue-800">
									Click on underlined text to see detailed suggestions. Switch to Editor mode to make changes.
								</p>
							</div>
							<InlineAiSuggestions 
								analysis={aiAnalysis}
								content={documentContent}
								onSuggestionClick={handleSuggestionClick}
								showLegend={showSuggestionLegend}
								onToggleLegend={handleToggleSuggestionLegend}
							/>
						</div>
					{:else}
						<!-- Regular Rich Text Editor -->
						<RichTextEditor
							content={documentContent}
							onUpdate={handleContentUpdate}
							onAnalyze={data.aiAccess.hasAccess ? handleAnalyzeText : undefined}
							onInlineAnalyze={data.aiAccess.hasAccess ? handleInlineAnalyze : undefined}
							placeholder="Start writing your story..."
							class="h-full"
							projectId={data.project.id}
						/>
					{/if}
				</div>
			{:else}
				<!-- Empty State -->
				<div class="flex-1 flex items-center justify-center">
					<div class="text-center">
						<BookOpen class="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">Select a document to start writing</h3>
						<p class="text-gray-500 mb-6">Choose a document from the sidebar or create a new one to begin.</p>
						<button 
							class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
							onclick={() => openCreateDocModal()}
						>
							<Plus class="h-4 w-4" />
							<span>Create New Document</span>
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- AI Suggestions Panel -->
		{#if rightSidebarVisible}
			<div class="w-96 border-l border-gray-200 bg-gray-50 overflow-y-auto">
				<!-- AI Panel Header -->
				<div class="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
					<h3 class="font-medium text-gray-900">AI Writing Assistant</h3>
					<button 
						class="p-1 text-gray-400 hover:text-gray-600 rounded"
						onclick={toggleRightSidebar}
						title="Hide AI assistant"
					>
						<PanelRightClose class="h-4 w-4" />
					</button>
				</div>
				
				<div class="p-4">
					{#if !data.aiAccess.hasAccess}
						<!-- AI Access Restricted Notice -->
						<div class="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
							<div class="flex items-start space-x-3">
								{#if data.aiAccess.reason === 'free_tier'}
									<Settings class="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
									<div>
										<h4 class="text-lg font-semibold text-gray-900 mb-2">Unlock AI Writing Assistant</h4>
										<p class="text-gray-700 mb-3">
											Get intelligent writing suggestions, grammar checking, and style improvements with Premium or Pro.
										</p>
										<div class="space-y-2 text-sm text-gray-600 mb-4">
											<div class="flex items-center space-x-2">
												<Check class="h-4 w-4 text-green-500" />
												<span>Grammar & spelling corrections</span>
											</div>
											<div class="flex items-center space-x-2">
												<Check class="h-4 w-4 text-green-500" />
												<span>Style & clarity improvements</span>
											</div>
											<div class="flex items-center space-x-2">
												<Check class="h-4 w-4 text-green-500" />
												<span>Real-time writing feedback</span>
											</div>
											<div class="flex items-center space-x-2">
												<Check class="h-4 w-4 text-green-500" />
												<span>Advanced sentence structure analysis</span>
											</div>
										</div>
										<p class="text-sm text-gray-600">
											Click on your tier name in the header to manage your subscription and upgrade.
										</p>
									</div>
								{:else if data.aiAccess.reason === 'no_api_key'}
									<AlertCircle class="h-6 w-6 text-orange-600 mt-0.5 flex-shrink-0" />
									<div>
										<h4 class="text-lg font-semibold text-gray-900 mb-2">AI Features Unavailable</h4>
										<p class="text-gray-700">
											AI writing assistance is temporarily unavailable. Please contact support for assistance.
										</p>
									</div>
								{:else}
									<Settings class="h-6 w-6 text-gray-600 mt-0.5 flex-shrink-0" />
									<div>
										<h4 class="text-lg font-semibold text-gray-900 mb-2">AI Access Restricted</h4>
										<p class="text-gray-700">
											{getAiAccessMessage()}
										</p>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Regular AI features for users with access -->
						{#if aiAnalysis && aiAnalysis.suggestions.length > 0}
							<!-- Inline Suggestions Notice -->
							<div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<div class="flex items-start space-x-2">
									<Eye class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
									<div class="text-sm">
										<p class="text-blue-900 font-medium">Inline Suggestions Active</p>
										<p class="text-blue-700 mt-1">
											Click underlined text in your document to see detailed suggestions, or view them all here.
										</p>
									</div>
								</div>
							</div>
						{/if}
					{/if}
					
					{#if data.aiAccess.hasAccess}
						<AiSuggestions
							analysis={aiAnalysis}
							isLoading={isAnalyzing}
							onAcceptSuggestion={handleAcceptSuggestion}
							onDismissSuggestion={handleDismissSuggestion}
						/>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Collapsed AI Panel - Show toggle button on the right edge -->
			<div class="w-8 border-l border-gray-200 bg-gray-50 relative">
				<button 
					class="absolute top-4 -left-4 bg-white border border-gray-200 rounded-l-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm z-10"
					onclick={toggleRightSidebar}
					title="Show AI assistant"
				>
					<PanelRightOpen class="h-4 w-4" />
				</button>
				
				{#if aiAnalysis && aiAnalysis.suggestions.length > 0}
					<!-- Suggestion count indicator -->
					<div class="absolute top-12 -left-4 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-sm">
						{aiAnalysis.suggestions.length}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Floating Action Button (Mobile) -->
	<button 
		class="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
		onclick={() => openCreateDocModal()}
		title="New Document"
	>
		<Plus class="h-6 w-6" />
	</button>
</div>

<!-- Document Creation Modal -->
{#if showCreateDocModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-medium text-gray-900">Create New Document</h3>
					<button 
						class="text-gray-400 hover:text-gray-600"
						onclick={closeCreateDocModal}
					>
						<X class="h-5 w-5" />
					</button>
				</div>
				
				<div class="space-y-4">
					<div>
						<label for="document-name" class="block text-sm font-medium text-gray-700 mb-1">
							Document Name
						</label>
						<input 
							id="document-name"
							type="text" 
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter document name..."
							bind:value={newDocName}
						/>
					</div>
					
					<div>
						<label for="document-notebook" class="block text-sm font-medium text-gray-700 mb-1">
							Notebook
						</label>
						<select 
							id="document-notebook"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
							bind:value={newDocCategory}
						>
							<option value="" disabled>Select a notebook</option>
							{#each data.notebooks || [] as notebook}
								<option value={notebook.id}>{notebook.title}</option>
							{/each}
						</select>
					</div>
					
					<div>
						<label for="document-description" class="block text-sm font-medium text-gray-700 mb-1">
							Description (optional)
						</label>
						<textarea 
							id="document-description"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							rows="3"
							placeholder="Brief description..."
							bind:value={newDocDescription}
						></textarea>
					</div>
				</div>
				
				<div class="flex justify-end gap-3 mt-6">
					<button 
						onclick={closeCreateDocModal}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						disabled={isCreatingDocument}
					>
						Cancel
					</button>
					<button 
						onclick={createDocument}
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isCreatingDocument || !newDocName.trim() || !newDocCategory}
					>
						{isCreatingDocument ? 'Creating...' : 'Create Document'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Notebook Creation Modal -->
<CreateNotebookModal
	visible={showCreateNotebookModal}
	onClose={closeCreateNotebookModal}
	onSubmit={createNotebook}
	isSubmitting={isCreatingNotebook}
/>

<!-- Suggestion Detail Modal -->
<SuggestionDetailModal
	visible={showSuggestionModal}
	suggestion={selectedSuggestion}
	onClose={handleCloseSuggestionModal}
	onAccept={handleAcceptModalSuggestion}
	onDismiss={handleDismissModalSuggestion}
/>
