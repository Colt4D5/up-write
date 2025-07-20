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

	interface Props {
		content?: string;
		placeholder?: string;
		onUpdate?: (content: string) => void;
		onAnalyze?: (content: string) => void;
		readonly?: boolean;
		class?: string;
		projectId?: string; // Add project ID for session tracking
	}

	let {
		content = '',
		placeholder = 'Start writing...',
		onUpdate,
		onAnalyze,
		readonly = false,
		class: className = '',
		projectId
	}: Props = $props();

	let editor: Editor | null = $state<Editor | null>(null);
	let element: HTMLElement | null = $state<HTMLElement | null>(null);
	let showSuggestions = $state(false);
	let isAnalyzing = $state(false);
	let sessionTracker: WritingSessionTracker | null = $state(null);
	
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

	// Track the last content we set to prevent loops
	let lastSetContent = $state('');

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
				CharacterCount
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
		</div>
	{/if}
</div>

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
</style>
