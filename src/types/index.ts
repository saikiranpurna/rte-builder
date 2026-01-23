import type { Editor } from '@tiptap/react'

export interface EditorProps {
  /** Initial content for the editor (HTML string) */
  value?: string
  /** Callback when content changes */
  onChange?: (content: string) => void
  /** Callback when editor is blurred */
  onBlur?: () => void
  /** Callback when editor is focused */
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
  /** Character limit */
  charCounterMax?: number
  /** Show character counter */
  showCharCounter?: boolean
  /** Toolbar preset - 'full' | 'medium' | 'simple' */
  toolbarPreset?: 'full' | 'medium' | 'simple'
  /** Custom toolbar buttons override */
  toolbarButtons?: ToolbarButton[]
  /** Additional className for the container */
  className?: string
  /** Custom configuration options */
  config?: Record<string, unknown>
  /** Callback for custom media picker (images) */
  onMediaPickerImage?: () => Promise<MediaFile | null>
  /** Callback for custom media picker (videos) */
  onMediaPickerVideo?: () => Promise<MediaFile | null>
  /** Enable syntax highlighting for code blocks */
  enableCodeHighlight?: boolean
  /** Default language for code blocks */
  defaultCodeLanguage?: string
}

export interface EditorRef {
  /** Get the current HTML content */
  getContent: () => string
  /** Set the HTML content */
  setContent: (html: string) => void
  /** Focus the editor */
  focus: () => void
  /** Get the TipTap editor instance */
  getEditor: () => Editor | null
  /** Insert HTML at cursor */
  insertHTML: (html: string) => void
  /** Clear all content */
  clear: () => void
  /** Check if editor is in fullscreen mode */
  isFullscreen: () => boolean
  /** Toggle fullscreen mode */
  toggleFullscreen: () => void
  /** Print the content */
  print: () => void
}

export interface MediaFile {
  /** File URL */
  url: string
  /** File name */
  name?: string
  /** File type/MIME type */
  type?: string
  /** Alt text for images */
  alt?: string
}

export type ToolbarButton =
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

export interface ToolbarConfig {
  full: ToolbarButton[]
  medium: ToolbarButton[]
  simple: ToolbarButton[]
}
