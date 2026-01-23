/**
 * RTE Builder - Universal Rich Text Editor Library
 *
 * A generic, adapter-based rich text editor that supports multiple editor backends:
 * - TipTap (default, included)
 * - Slate.js (included)
 * - Lexical (included)
 * - Quill (planned)
 * - Draft.js (planned)
 *
 * @example Basic Usage
 * ```tsx
 * import { RichTextEditor } from 'rte-builder'
 *
 * function App() {
 *   const [content, setContent] = useState('')
 *   return <RichTextEditor value={content} onChange={setContent} />
 * }
 * ```
 *
 * @example With Specific Editor
 * ```tsx
 * <RichTextEditor editor="tiptap" value={content} onChange={setContent} />
 * ```
 */

// ============================================================================
// MAIN COMPONENT EXPORTS
// ============================================================================

// The unified editor (recommended for most use cases)
export { UnifiedEditor } from "./components/UnifiedEditor";

// Legacy TipTap-specific editor (for backwards compatibility)
export { RichTextEditor } from "./components/RichTextEditor";

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Legacy types (backwards compatibility)
export type {
  EditorProps,
  EditorRef,
  MediaFile as LegacyMediaFile,
  ToolbarButton,
  ToolbarConfig as LegacyToolbarConfig,
} from "./types";

// Core types (new unified interface)
export type {
  EditorType,
  BaseEditorConfig,
  MediaFile,
  ToolbarButtonType,
  ToolbarPreset,
  ToolbarConfig,
  UnifiedEditorProps,
  UnifiedEditorRef,
  EditorAdapter,
  AdapterComponentProps,
  AdapterEditorRef,
  EditorFeatures,
} from "./core/types";

export { DEFAULT_FEATURES } from "./core/types";

// ============================================================================
// REGISTRY EXPORTS
// ============================================================================

export {
  registerAdapter,
  unregisterAdapter,
  getAdapter,
  getAllAdapters,
  getAvailableAdapters,
  isEditorAvailable,
  getBestAvailableEditor,
  getDefaultEditorType,
  getEditorFeatures,
  compareEditorFeatures,
  getRegistryStats,
  EditorRegistry,
} from "./core/registry";

// ============================================================================
// TOOLBAR PRESET EXPORTS
// ============================================================================

export {
  fullToolbar,
  mediumToolbar,
  simpleToolbar,
  minimalToolbar,
  codeToolbar,
  blogToolbar,
  emailToolbar,
  toolbarPresets,
  getToolbarPreset,
  customizeToolbar,
} from "./core/presets";

export type { ToolbarPresetName } from "./core/presets";

// ============================================================================
// ADAPTER EXPORTS
// ============================================================================

// TipTap adapter (included by default)
export { TipTapAdapter } from "./adapters/tiptap";
export { TipTapEditorComponent } from "./adapters/tiptap/TipTapEditorComponent";
export { TipTapToolbar } from "./adapters/tiptap/TipTapToolbar";

// Note: Slate.js and Lexical adapters are available but require additional
// dependencies to be installed. They are not exported by default to avoid
// bundling issues. Import them directly from their paths if needed:
// import { SlateAdapter } from 'rte-builder/adapters/slate/SlateAdapter'
// import { LexicalAdapter } from 'rte-builder/adapters/lexical/LexicalAdapter'

// ============================================================================
// EXTENSION EXPORTS
// ============================================================================

// Custom TipTap extensions (can be used independently)
export { FontSize } from "./extensions/FontSize";
export { LineHeight } from "./extensions/LineHeight";
export { Video } from "./extensions/Video";
export { Emoji, EMOJI_CATEGORIES } from "./extensions/Emoji";
export { Fullscreen } from "./extensions/Fullscreen";
export { Print } from "./extensions/Print";
export { Indent } from "./extensions/Indent";

// ============================================================================
// STYLES
// ============================================================================

// Import styles (they will be bundled with the library)
import "./styles/editor.css";
