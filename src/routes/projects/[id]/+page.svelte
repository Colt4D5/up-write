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
		Search
	} from 'lucide-svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import AiSuggestions from '$lib/components/AiSuggestions.svelte';
	import { formatDate, countWords } from '$lib/utils';
	import type { PageData } from './$types';
	import type { AiAnalysisResult } from '$lib/types';

	let { data }: { data: PageData } = $props();
	
	let selectedDocument = $state<any>(null);
	let documentContent = $state('');
	let aiAnalysis = $state<AiAnalysisResult | null>(null);
	let isAnalyzing = $state(false);
	let expandedNotebooks = $state<Set<string>>(new Set());
	let searchQuery = $state('');

	// Auto-select first document if available
	$effect(() => {
		if (data.notebooks && !selectedDocument) {
			for (const notebook of data.notebooks) {
				if (notebook.documents && notebook.documents.length > 0) {
					selectedDocument = notebook.documents[0];
					documentContent = selectedDocument.content || '';
					break;
				}
			}
		}
	});

	function toggleNotebook(notebookId: string) {
		if (expandedNotebooks.has(notebookId)) {
			expandedNotebooks.delete(notebookId);
		} else {
			expandedNotebooks.add(notebookId);
		}
		expandedNotebooks = new Set(expandedNotebooks);
	}

	function selectDocument(document: any) {
		if (selectedDocument?.id !== document.id) {
			selectedDocument = document;
			documentContent = document.content || '';
			aiAnalysis = null;
		}
	}

	async function handleContentUpdate(content: string) {
		documentContent = content;
		
		// Auto-save functionality would go here
		// For now, we'll just update the local state
		if (selectedDocument) {
			selectedDocument.content = content;
			selectedDocument.wordCount = countWords(content);
		}
	}

	async function handleAnalyzeText(text: string) {
		if (!text.trim()) return;
		
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
			}
		} catch (error) {
			console.error('Analysis error:', error);
		} finally {
			isAnalyzing = false;
		}
	}

	function handleAcceptSuggestion(index: number) {
		if (!aiAnalysis || !aiAnalysis.suggestions[index]) return;
		
		const suggestion = aiAnalysis.suggestions[index];
		if (suggestion.suggestedText) {
			// This would implement the actual text replacement in the editor
			console.log('Accept suggestion:', suggestion);
		}
	}

	function handleDismissSuggestion(index: number) {
		if (!aiAnalysis) return;
		
		aiAnalysis.suggestions.splice(index, 1);
		aiAnalysis = { ...aiAnalysis };
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

<svelte:head>
	<title>{data.project.title} - WriterBuddy</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<div class="w-80 bg-white border-r border-gray-200 flex flex-col">
		<!-- Project Header -->
		<div class="p-4 border-b border-gray-200">
			<div class="flex items-center justify-between mb-2">
				<h1 class="text-lg font-semibold text-gray-900 truncate" title={data.project.title}>
					{data.project.title}
				</h1>
				<button class="p-1 text-gray-400 hover:text-gray-600 rounded">
					<Settings class="h-4 w-4" />
				</button>
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
							on:click={() => toggleNotebook(notebook.id)}
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
							</div>
							
							<div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
								<span class="text-xs text-gray-500">
									{notebook.documents?.length || 0}
								</span>
								<span class="p-1 hover:bg-gray-200 rounded cursor-pointer" title="Add document" >
									<Plus class="h-3 w-3" />
								</span>
							</div>
						</button>

						<!-- Documents -->
						{#if expandedNotebooks.has(notebook.id) && notebook.documents}
							<div class="ml-6 space-y-1">
								{#each notebook.documents as document}
									<button
										type="button"
										on:click={() => selectDocument(document)}
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
			<button class="w-full flex items-center justify-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-dashed border-gray-300">
				<Plus class="h-4 w-4" />
				<span class="text-sm">Add Notebook</span>
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
						<div>
							<h2 class="text-xl font-semibold text-gray-900">{selectedDocument.title}</h2>
							<div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
								<span>{selectedDocument.wordCount || 0} words</span>
								<span>Last updated {formatDate(new Date(selectedDocument.updatedAt))}</span>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<button class="p-2 text-gray-400 hover:text-gray-600 rounded">
								<MoreVertical class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				<!-- Editor Area -->
				<div class="flex-1 p-4">
					<RichTextEditor
						content={documentContent}
						onUpdate={handleContentUpdate}
						onAnalyze={handleAnalyzeText}
						placeholder="Start writing your story..."
						class="h-full"
					/>
				</div>
			{:else}
				<!-- Empty State -->
				<div class="flex-1 flex items-center justify-center">
					<div class="text-center">
						<BookOpen class="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">Select a document to start writing</h3>
						<p class="text-gray-500">Choose a document from the sidebar or create a new one to begin.</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- AI Suggestions Panel -->
		<div class="w-96 border-l border-gray-200 bg-gray-50 overflow-y-auto">
			<div class="p-4">
				<AiSuggestions
					analysis={aiAnalysis}
					isLoading={isAnalyzing}
					onAcceptSuggestion={handleAcceptSuggestion}
					onDismissSuggestion={handleDismissSuggestion}
				/>
			</div>
		</div>
	</div>
</div>
