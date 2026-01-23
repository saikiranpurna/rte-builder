/**
 * Core types for the RTE Builder - Editor Agnostic
 * These types define the common interface that all editor adapters must implement
 */

// ============================================================================
// EDITOR TYPES
// ============================================================================

/** Supported editor types */
export type EditorType = 'tiptap' | 'slate' | 'lexical' | 'quill' | 'draft'

/** Editor configuration that applies to all editors */
export interface BaseEditorConfig {
  /** Initial HTML content */
  initialContent?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether the editor is editable */
  editable?: boolean
  /** Auto-focus on mount */
  autoFocus?: boolean
  /** Custom attributes for the editor element */
  attributes?: Record<string, string>
}

/** Media file for image/video insertion */
export interface MediaFile {
  /** File URL */
  url: string
  /** File name */
  name?: string
  /** File type/MIME type */
  type?: string
  /** Alt text for images */
  alt?: string
  /** Title attribute */
  title?: string
  /** Width */
  width?: number
  /** Height */
  height?: number
}

// ============================================================================
// TOOLBAR TYPES
// ============================================================================

/** All available toolbar button types */
export type ToolbarButtonType =
  // Text formatting
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'codeBlock'
  | 'subscript'
  | 'superscript'
  | 'clearFormatting'
  // Font & Colors
  | 'fontFamily'
  | 'fontSize'
  | 'lineHeight'
  | 'textColor'
  | 'backgroundColor'
  // Alignment & Indentation
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'indent'
  | 'outdent'
  // Lists
  | 'bulletList'
  | 'orderedList'
  // Headings
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  // Blocks
  | 'blockquote'
  | 'horizontalRule'
  // Links & Media
  | 'link'
  | 'unlink'
  | 'image'
  | 'video'
  | 'table'
  | 'emoji'
  // Actions
  | 'undo'
  | 'redo'
  | 'fullscreen'
  | 'print'
  // Special
  | 'separator'

/** Toolbar preset names */
export type ToolbarPreset = 'full' | 'medium' | 'simple' | 'minimal'

/** Toolbar configuration */
export interface ToolbarConfig {
  /** Preset to use, or custom buttons array */
  preset?: ToolbarPreset
  /** Custom buttons array (overrides preset) */
  buttons?: ToolbarButtonType[]
  /** Whether toolbar is sticky */
  sticky?: boolean
  /** Sticky offset in pixels */
  stickyOffset?: number
}

// ============================================================================
// EDITOR PROPS & REF TYPES
// ============================================================================

/** Props for the unified RichTextEditor component */
export interface UnifiedEditorProps {
  /** Which editor to use */
  editor?: EditorType
  /** Initial content (HTML string) */
  value?: string
  /** Callback when content changes */
  onChange?: (content: string) => void
  /** Callback when editor loses focus */
  onBlur?: () => void
  /** Callback when editor gains focus */
  onFocus?: () => void
  /** Placeholder text */
  placeholder?: string
  /** Editor height in pixels */
  height?: number
  /** Minimum height in pixels */
  minHeight?: number
  /** Maximum height in pixels */
  maxHeight?: number
  /** Whether the editor is disabled */
  disabled?: boolean
  /** Whether the editor is read-only */
  readOnly?: boolean
  /** Character limit (-1 for no limit) */
  charCounterMax?: number
  /** Show character counter */
  showCharCounter?: boolean
  /** Toolbar preset or custom config */
  toolbar?: ToolbarPreset | ToolbarConfig
  /** Custom toolbar buttons (shorthand for toolbar.buttons) */
  toolbarButtons?: ToolbarButtonType[]
  /** Additional className */
  className?: string
  /** Callback for custom image picker */
  onMediaPickerImage?: () => Promise<MediaFile | null>
  /** Callback for custom video picker */
  onMediaPickerVideo?: () => Promise<MediaFile | null>
  /** Enable syntax highlighting for code blocks */
  enableCodeHighlight?: boolean
  /** Default language for code blocks */
  defaultCodeLanguage?: string
  /** Additional editor-specific config */
  editorConfig?: Record<string, unknown>
}

/** Methods exposed via ref */
export interface UnifiedEditorRef {
  /** Get the current HTML content */
  getContent: () => string
  /** Get content as plain text */
  getText: () => string
  /** Get content as JSON (if supported) */
  getJSON: () => unknown
  /** Set the HTML content */
  setContent: (content: string) => void
  /** Focus the editor */
  focus: () => void
  /** Blur the editor */
  blur: () => void
  /** Insert HTML at cursor position */
  insertHTML: (html: string) => void
  /** Insert text at cursor position */
  insertText: (text: string) => void
  /** Clear all content */
  clear: () => void
  /** Check if content is empty */
  isEmpty: () => boolean
  /** Get character count */
  getCharacterCount: () => number
  /** Get word count */
  getWordCount: () => number
  /** Check if editor is in fullscreen mode */
  isFullscreen: () => boolean
  /** Toggle fullscreen mode */
  toggleFullscreen: () => void
  /** Print the content */
  print: () => void
  /** Undo last action */
  undo: () => void
  /** Redo last undone action */
  redo: () => void
  /** Check if can undo */
  canUndo: () => boolean
  /** Check if can redo */
  canRedo: () => boolean
  /** Get the native editor instance */
  getNativeEditor: () => unknown
  /** Get the editor type */
  getEditorType: () => EditorType
}

// ============================================================================
// EDITOR ADAPTER INTERFACE
// ============================================================================

/**
 * Abstract interface that all editor adapters must implement.
 * This ensures consistency across different editor implementations.
 */
export interface EditorAdapter {
  /** The type of editor this adapter handles */
  readonly type: EditorType

  /** Human-readable name */
  readonly name: string

  /** Description of the editor */
  readonly description: string

  /** Whether this adapter is available (dependencies installed) */
  isAvailable: () => boolean

  /** Get the React component for this editor */
  getComponent: () => React.ComponentType<AdapterComponentProps>

  /** Get supported features */
  getSupportedFeatures: () => EditorFeatures
}

/** Props passed to adapter components */
export interface AdapterComponentProps {
  value: string
  onChange: (content: string) => void
  onBlur?: () => void
  onFocus?: () => void
  placeholder?: string
  height?: number
  minHeight?: number
  maxHeight?: number
  disabled?: boolean
  readOnly?: boolean
  charCounterMax?: number
  showCharCounter?: boolean
  toolbarButtons: ToolbarButtonType[]
  className?: string
  onMediaPickerImage?: () => Promise<MediaFile | null>
  onMediaPickerVideo?: () => Promise<MediaFile | null>
  enableCodeHighlight?: boolean
  defaultCodeLanguage?: string
  editorConfig?: Record<string, unknown>
  /** Ref forwarding */
  editorRef?: React.Ref<AdapterEditorRef>
}

/** Ref methods that adapters must expose */
export interface AdapterEditorRef {
  getContent: () => string
  getText: () => string
  getJSON: () => unknown
  setContent: (content: string) => void
  focus: () => void
  blur: () => void
  insertHTML: (html: string) => void
  insertText: (text: string) => void
  clear: () => void
  isEmpty: () => boolean
  getCharacterCount: () => number
  getWordCount: () => number
  isFullscreen: () => boolean
  toggleFullscreen: () => void
  print: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  getNativeEditor: () => unknown
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/** Features that an editor may or may not support */
export interface EditorFeatures {
  // Text formatting
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  subscript: boolean
  superscript: boolean
  code: boolean
  codeBlock: boolean
  codeHighlighting: boolean

  // Font styling
  fontFamily: boolean
  fontSize: boolean
  textColor: boolean
  backgroundColor: boolean
  lineHeight: boolean

  // Alignment & Structure
  textAlign: boolean
  indent: boolean
  headings: boolean
  blockquote: boolean
  horizontalRule: boolean

  // Lists
  bulletList: boolean
  orderedList: boolean
  nestedLists: boolean

  // Links & Media
  links: boolean
  images: boolean
  videos: boolean
  embeds: boolean

  // Tables
  tables: boolean
  tableResize: boolean

  // Advanced
  emoji: boolean
  mentions: boolean
  hashtags: boolean
  markdown: boolean

  // UI
  fullscreen: boolean
  print: boolean
  characterCount: boolean

  // History
  undoRedo: boolean

  // Collaboration
  collaboration: boolean
  comments: boolean
}

/** Default feature set - all false */
export const DEFAULT_FEATURES: EditorFeatures = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  subscript: false,
  superscript: false,
  code: false,
  codeBlock: false,
  codeHighlighting: false,
  fontFamily: false,
  fontSize: false,
  textColor: false,
  backgroundColor: false,
  lineHeight: false,
  textAlign: false,
  indent: false,
  headings: false,
  blockquote: false,
  horizontalRule: false,
  bulletList: false,
  orderedList: false,
  nestedLists: false,
  links: false,
  images: false,
  videos: false,
  embeds: false,
  tables: false,
  tableResize: false,
  emoji: false,
  mentions: false,
  hashtags: false,
  markdown: false,
  fullscreen: false,
  print: false,
  characterCount: false,
  undoRedo: false,
  collaboration: false,
  comments: false,
}
