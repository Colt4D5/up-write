<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import { TextStyle } from '@tiptap/extension-text-style';
	import Color from '@tiptap/extension-color';
	import Highlight from '@tiptap/extension-highlight';
	import CharacterCount from '@tiptap/extension-character-count';
	import { 
		Bold, 
		Italic, 
		Underline as UnderlineIcon, 
		List, 
		ListOrdered,
		Quote,
		Undo,
		Redo,
		Eye,
		Lightbulb
	} from 'lucide-svelte';
	import { debounce } from '$lib/utils';
	import { WritingSessionTracker } from '$lib/writing-session-tracker';
	import { Mark, mergeAttributes } from '@tiptap/core';
	import { hybridAnalysis, hasSignificantChange } from '$lib/utils/localAnalysis';

	// Custom suggestion mark extension
	const SuggestionMark = Mark.create({
		name: 'suggestionMark',
		
		addOptions() {
			return {
				HTMLAttributes: {},
			}
		},

		parseHTML() {
			return [
				{
					tag: 'span[data-suggestion-index]',
				},
			]
		},

		renderHTML({ HTMLAttributes }) {
			return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
		},

		addAttributes() {
			return {
				class: {
					default: null,
				},
				'data-suggestion-index': {
					default: null,
				},
			}
		},
	});

	interface Props {
		content?: string;
		placeholder?: string;
		onUpdate?: (content: string) => void;
		onAnalyze?: (content: string) => void;
		onInlineAnalyze?: (content: string) => Promise<any>; // For inline AI suggestions
		readonly?: boolean;
		class?: string;
		projectId?: string; // Add project ID for session tracking
	}

	let {
		content = '',
		placeholder = 'Start writing...',
		onUpdate,
		onAnalyze,
		onInlineAnalyze,
		readonly = false,
		class: className = '',
		projectId
	}: Props = $props();

	let editor: Editor | null = $state<Editor | null>(null);
	let element: HTMLElement | null = $state<HTMLElement | null>(null);
	let showSuggestions = $state(false);
	let isAnalyzing = $state(false);
	let sessionTracker: WritingSessionTracker | null = $state(null);
	
	// Inline suggestions state
	let inlineSuggestions = $state<Array<{
		from: number;
		to: number;
		text: string;
		suggestion: string;
		type: 'grammar' | 'style' | 'clarity';
	}>>([]);
	let isInlineAnalyzing = $state(false);
	let hoveredSuggestion = $state<number | null>(null);
	let tooltipPosition = $state<{ x: number; y: number } | null>(null);
	let lastAnalyzedContent = $state('');
	
	// Reactive counters that update when editor content changes
	let characterCount = $state(0);
	let wordCount = $state(0);

	// Debounced functions
	const debouncedUpdate = onUpdate ? debounce(onUpdate, 500) : null;
	const debouncedAnalyze = onAnalyze ? debounce((content: string) => {
		if (content.trim().length > 0) {
			isAnalyzing = true;
			onAnalyze(content);
		}
	}, 2000) : null;

	// Debounced inline analysis
	const debouncedInlineAnalyze = onInlineAnalyze ? debounce(async (content: string) => {
		if (content.trim().length > 20) {
			isInlineAnalyzing = true;
			try {
				const suggestions = await onInlineAnalyze(content);
				inlineSuggestions = suggestions || [];
				applyInlineSuggestions();
			} catch (error) {
				console.error('Inline analysis failed:', error);
			} finally {
				isInlineAnalyzing = false;
			}
		}
	}, 3000) : null;

	// Default inline analysis function that calls the API
	const defaultInlineAnalyze = async (text: string) => {
		try {
			const response = await fetch('/api/ai/inline-suggestions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text }),
			});

			if (response.ok) {
				return await response.json();
			}
			return [];
		} catch (error) {
			console.error('Inline analysis error:', error);
			return [];
		}
	};

	// Use provided inline analyze function or default
	const inlineAnalyzeFunction = onInlineAnalyze || defaultInlineAnalyze;

	// Create debounced version that uses hybrid analysis for cost efficiency
	const debouncedInlineAnalyzeActual = debounce(async (content: string) => {
		if (content.trim().length > 20) {
			// Smart analysis - only analyze if significant changes using our utility function
			if (!hasSignificantChange(lastAnalyzedContent, content)) {
				return; // Skip if changes aren't significant enough
			}
			
			isInlineAnalyzing = true;
			try {
				// Use hybrid analysis: local patterns first, then AI only if needed
				const suggestions = await hybridAnalysis(content, onInlineAnalyze);
				inlineSuggestions = suggestions || [];
				lastAnalyzedContent = content;
				applyInlineSuggestions();
			} catch (error) {
				console.error('Hybrid analysis failed:', error);
			} finally {
				isInlineAnalyzing = false;
			}
		}
	}, 5000); // Increased to 5 seconds for better cost efficiency

	// Track the last content we set to prevent loops
	let lastSetContent = $state('');

	// Function to apply inline suggestions as decorations
	function applyInlineSuggestions() {
		if (!editor || !inlineSuggestions.length) return;
		
		// We'll need to add class names to spans in the HTML
		// For now, let's just update the DOM directly as a workaround
		setTimeout(() => {
			const editorElement = editor?.view.dom;
			if (!editorElement) return;

			// Remove existing suggestion marks
			const existingMarks = editorElement.querySelectorAll('.suggestion-grammar, .suggestion-style, .suggestion-clarity');
			existingMarks.forEach(mark => {
				const parent = mark.parentNode;
				if (parent) {
					parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
				}
			});

			// Apply new suggestions by wrapping text in spans
			const textContent = editor?.getText() || '';
			let htmlContent = editor?.getHTML() || '';

			inlineSuggestions.forEach((suggestion, index) => {
				const beforeText = textContent.substring(0, suggestion.from);
				const suggestionText = textContent.substring(suggestion.from, suggestion.to);
				const afterText = textContent.substring(suggestion.to);

				// Create a span with the appropriate class and data attribute
				const spanClass = `suggestion-${suggestion.type}`;
				const spanElement = `<span class="${spanClass}" data-suggestion-index="${index}">${suggestionText}</span>`;
				
				// Replace the text in HTML (this is a simplified approach)
				const regex = new RegExp(escapeRegExp(suggestionText), 'g');
				htmlContent = htmlContent.replace(regex, spanElement);
			});

			// Update editor content without triggering onUpdate
			if (htmlContent !== editor?.getHTML()) {
				editor?.commands.setContent(htmlContent, { emitUpdate: false });
			}
		}, 50);
	}

	// Helper function to escape regex special characters
	function escapeRegExp(string: string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	// Function to handle suggestion hover
	function handleSuggestionHover(event: MouseEvent, suggestionIndex: number) {
		hoveredSuggestion = suggestionIndex;
		tooltipPosition = { x: event.clientX, y: event.clientY };
	}

	// Function to apply a suggestion
	function applySuggestion(suggestionIndex: number) {
		if (!editor || !inlineSuggestions[suggestionIndex]) return;
		
		const suggestion = inlineSuggestions[suggestionIndex];
		editor.commands.setTextSelection({ from: suggestion.from, to: suggestion.to });
		editor.commands.insertContent(suggestion.suggestion);
		
		// Remove the applied suggestion
		inlineSuggestions = inlineSuggestions.filter((_, index) => index !== suggestionIndex);
		hoveredSuggestion = null;
		tooltipPosition = null;
	}

	onMount(() => {
		// Initialize session tracker if projectId is provided
		if (projectId && !readonly) {
			sessionTracker = new WritingSessionTracker(projectId);
		}

		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [1, 2, 3]
					}
				}),
				Underline,
				TextStyle,
				Color,
				Highlight.configure({
					multicolor: true
				}),
				CharacterCount,
				SuggestionMark
			],
			content: content || '', // Ensure content is never undefined
			editable: !readonly,
			onTransaction: () => {
				// Force re-render
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				const text = editor.getText();
				
				// Update reactive counters
				if (editor.storage.characterCount) {
					characterCount = editor.storage.characterCount.characters();
					wordCount = editor.storage.characterCount.words();
				} else {
					characterCount = text.length;
					wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
				}
				
				// Start session tracking when user starts writing
				if (sessionTracker && !sessionTracker.active && wordCount > 0) {
					sessionTracker.start(wordCount);
				}
				
				// Update session activity
				if (sessionTracker && sessionTracker.active) {
					sessionTracker.updateActivity(wordCount);
				}
				
				// Only call update if content actually changed and it's not from us setting it
				if (debouncedUpdate && html !== lastSetContent && html !== content) {
					lastSetContent = html; // Track what we're about to send up
					debouncedUpdate(html);
				}
				
				if (debouncedAnalyze && text.trim().length > 50) {
					debouncedAnalyze(text);
				}

				// Trigger inline analysis
				if (text.trim().length > 20) {
					debouncedInlineAnalyzeActual(text);
				}
			},
			onFocus: () => {
				// Start session when editor gets focus (if not already started)
				if (sessionTracker && !sessionTracker.active && wordCount > 0) {
					sessionTracker.start(wordCount);
				}
			}
		});

		// Set initial lastSetContent
		lastSetContent = content || '';
		
		// Initialize counters
		if (editor && editor.storage.characterCount) {
			characterCount = editor.storage.characterCount.characters();
			wordCount = editor.storage.characterCount.words();
		} else if (editor) {
			const text = editor.getText();
			characterCount = text.length;
			wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
		}

		// Add event listeners for suggestion interactions
		const editorElement = editor.view.dom;
		
		editorElement.addEventListener('mouseover', (event) => {
			const target = event.target as HTMLElement;
			const suggestionIndex = target.getAttribute('data-suggestion-index');
			if (suggestionIndex !== null) {
				handleSuggestionHover(event as MouseEvent, parseInt(suggestionIndex));
			}
		});

		editorElement.addEventListener('mouseout', (event) => {
			const target = event.target as HTMLElement;
			const suggestionIndex = target.getAttribute('data-suggestion-index');
			if (suggestionIndex !== null) {
				hoveredSuggestion = null;
				tooltipPosition = null;
			}
		});

		editorElement.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			const suggestionIndex = target.getAttribute('data-suggestion-index');
			if (suggestionIndex !== null) {
				event.preventDefault();
				handleSuggestionHover(event as MouseEvent, parseInt(suggestionIndex));
			}
		});
	});

	onDestroy(() => {
		// Clean up session tracker
		if (sessionTracker) {
			sessionTracker.destroy();
			sessionTracker = null;
		}
		
		if (!editor) return;
		editor.destroy();
	});

	// React to content prop changes
	$effect(() => {
		if (!editor) return;
		
		const currentContent = editor.getHTML();
		
		// Only update if content actually changed and it's not from user typing
		if (content !== currentContent && content !== lastSetContent) {
			lastSetContent = content || '';
			editor.commands.setContent(content || '', { emitUpdate: false });
			
			// Update counters immediately
			const text = editor.getText();
			if (editor.storage.characterCount) {
				characterCount = editor.storage.characterCount.characters();
				wordCount = editor.storage.characterCount.words();
			} else {
				characterCount = text.length;
				wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
			}
			
			// If content is empty, ensure counters are 0
			if (!content || content.trim() === '' || content === '<p></p>') {
				characterCount = 0;
				wordCount = 0;
			}
		}
	});

	function toggleBold() {
		if (!editor) return;
		editor.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		if (!editor) return;
		editor.chain().focus().toggleItalic().run();
	}

	function toggleUnderline() {
		if (!editor) return;
		editor.chain().focus().toggleUnderline().run();
	}

	function toggleBulletList() {
		if (!editor) return;
		editor.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		if (!editor) return;
		editor.chain().focus().toggleOrderedList().run();
	}

	function toggleBlockquote() {
		if (!editor) return;
		editor.chain().focus().toggleBlockquote().run();
	}

	function undo() {
		if (!editor) return;
		editor.chain().focus().undo().run();
	}

	function redo() {
		if (!editor) return;
		editor.chain().focus().redo().run();
	}

	function togglePreview() {
		if (!editor) return;
		editor.setEditable(!editor.isEditable);
	}

	function analyzeNow() {
		if (!editor || isAnalyzing) return;
		if (onAnalyze) {
			const text = editor.getText();
			if (text.trim().length > 0) {
				isAnalyzing = true;
				onAnalyze(text);
			}
		}
	}

	// Update editor content when prop changes, but avoid loops
	$effect(() => {
		if (editor && content !== undefined && content !== null) {
			const currentContent = editor.getHTML();
			// Only update if the content is genuinely different
			if (content !== currentContent && content !== lastSetContent) {
				lastSetContent = content;
				editor.commands.setContent(content, { emitUpdate: false }); // don't emit update
			}
		}
	});

	// Stop analyzing when we get new suggestions
	$effect(() => {
		if (showSuggestions) {
			isAnalyzing = false;
		}
	});
</script>

<div class="border border-gray-300 rounded-lg overflow-hidden {className}">
	{#if !readonly}
		<!-- Toolbar -->
		<div class="bg-gray-50 border-b border-gray-200 p-2 flex items-center space-x-1">
			<div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
				<button
					type="button"
					onclick={toggleBold}
					class="p-1.5 rounded hover:bg-gray-200 {editor?.isActive('bold') ? 'bg-gray-200' : ''}"
					title="Bold"
				>
					<Bold class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={toggleItalic}
					class="p-1.5 rounded hover:bg-gray-200 {editor?.isActive('italic') ? 'bg-gray-200' : ''}"
					title="Italic"
				>
					<Italic class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={toggleUnderline}
					class="p-1.5 rounded hover:bg-gray-200 {editor?.isActive('underline') ? 'bg-gray-200' : ''}"
					title="Underline"
				>
					<UnderlineIcon class="h-4 w-4" />
				</button>
			</div>

			<div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
				<button
					type="button"
					onclick={toggleBulletList}
					class="p-1.5 rounded hover:bg-gray-200 {editor?.isActive('bulletList') ? 'bg-gray-200' : ''}"
					title="Bullet List"
				>
					<List class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={toggleOrderedList}
					class="p-1.5 rounded hover:bg-gray-200 {editor?.isActive('orderedList') ? 'bg-gray-200' : ''}"
					title="Numbered List"
				>
					<ListOrdered class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={toggleBlockquote}
					class="p-1.5 rounded hover:bg-gray-200 {editor?.isActive('blockquote') ? 'bg-gray-200' : ''}"
					title="Quote"
				>
					<Quote class="h-4 w-4" />
				</button>
			</div>

			<div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
				<button
					type="button"
					onclick={undo}
					class="p-1.5 rounded hover:bg-gray-200"
					title="Undo"
					disabled={!editor?.can().undo()}
				>
					<Undo class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={redo}
					class="p-1.5 rounded hover:bg-gray-200"
					title="Redo"
					disabled={!editor?.can().redo()}
				>
					<Redo class="h-4 w-4" />
				</button>
			</div>

			{#if onAnalyze}
				<div class="flex items-center space-x-1 ml-auto">
					<button
						type="button"
						onclick={analyzeNow}
						disabled={isAnalyzing}
						class="flex items-center space-x-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
						title="Analyze Writing"
					>
						{#if isAnalyzing}
							<div class="animate-spin rounded-full h-3 w-3 border-b border-blue-700"></div>
						{:else}
							<Lightbulb class="h-3 w-3" />
						{/if}
						<span>{isAnalyzing ? 'Analyzing...' : 'AI Analysis'}</span>
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Editor -->
	<div 
		bind:this={element}
		class="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
		style="white-space: pre-wrap;"
	></div>

	{#if !readonly}
		<!-- Status Bar -->
		<div class="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
			<div>
				{characterCount} characters, {wordCount} words
			</div>
			{#if isAnalyzing}
				<div class="flex items-center space-x-1 text-blue-600">
					<div class="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
					<span>Analyzing your writing...</span>
				</div>
			{/if}
			{#if isInlineAnalyzing}
				<div class="flex items-center space-x-1 text-green-600">
					<div class="animate-pulse h-2 w-2 bg-green-600 rounded-full"></div>
					<span>Checking for suggestions...</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Inline Suggestion Tooltip -->
{#if hoveredSuggestion !== null && tooltipPosition && inlineSuggestions[hoveredSuggestion]}
	<div 
		class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs"
		style="left: {tooltipPosition.x}px; top: {tooltipPosition.y - 10}px; transform: translateY(-100%);"
	>
		<div class="text-sm">
			<div class="font-medium text-gray-800 mb-1">
				{inlineSuggestions[hoveredSuggestion].type === 'grammar' ? '📝' : 
				 inlineSuggestions[hoveredSuggestion].type === 'style' ? '✨' : '💡'} 
				{inlineSuggestions[hoveredSuggestion].type === 'grammar' ? 'Grammar' : 
				 inlineSuggestions[hoveredSuggestion].type === 'style' ? 'Style' : 'Clarity'}
			</div>
			<div class="text-gray-600 mb-2">
				{inlineSuggestions[hoveredSuggestion].suggestion}
			</div>
			<button
				onclick={() => applySuggestion(hoveredSuggestion!)}
				class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
			>
				Apply
			</button>
			<button
				onclick={() => { hoveredSuggestion = null; tooltipPosition = null; }}
				class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 ml-1"
			>
				Dismiss
			</button>
		</div>
	</div>
{/if}

<style>
	:global(.ProseMirror) {
		outline: none;
		padding: 1rem;
		min-height: 400px;
	}

	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}

	:global(.ProseMirror blockquote) {
		border-left: 4px solid #e5e7eb;
		padding-left: 1rem;
		margin-left: 0;
		font-style: italic;
	}

	:global(.ProseMirror ul, .ProseMirror ol) {
		padding-left: 1.5rem;
	}

	:global(.ProseMirror h1) {
		font-size: 1.5rem;
		font-weight: bold;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror h2) {
		font-size: 1.25rem;
		font-weight: bold;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror h3) {
		font-size: 1.125rem;
		font-weight: bold;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror p) {
		margin-bottom: 1rem;
	}

	:global(.ProseMirror p:last-child) {
		margin-bottom: 0;
	}

	/* Inline suggestion styles */
	:global(.suggestion-grammar) {
		border-bottom: 2px dotted #ef4444;
		cursor: pointer;
		position: relative;
	}

	:global(.suggestion-style) {
		border-bottom: 2px dotted #f59e0b;
		cursor: pointer;
		position: relative;
	}

	:global(.suggestion-clarity) {
		border-bottom: 2px dotted #3b82f6;
		cursor: pointer;
		position: relative;
	}

	:global(.suggestion-grammar:hover),
	:global(.suggestion-style:hover),
	:global(.suggestion-clarity:hover) {
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>
