/**
 * Slate.js Editor Adapter
 *
 * This adapter wraps the Slate.js editor to conform to the unified editor interface.
 * Slate is a completely customizable framework for building rich text editors.
 */

import type { EditorAdapter, EditorFeatures } from "../../core/types";
import { DEFAULT_FEATURES } from "../../core/types";

// Check if Slate is available
function checkSlateAvailable(): boolean {
  try {
    require("slate");
    require("slate-react");
    return true;
  } catch {
    return false;
  }
}

// Slate.js features
const SLATE_FEATURES: EditorFeatures = {
  ...DEFAULT_FEATURES,
  // Text formatting
  bold: true,
  italic: true,
  underline: true,
  strikethrough: true,
  subscript: true,
  superscript: true,
  code: true,
  codeBlock: true,
  codeHighlighting: true,
  // Font styling
  fontFamily: true,
  fontSize: true,
  textColor: true,
  backgroundColor: true,
  lineHeight: true,
  // Alignment & Structure
  textAlign: true,
  indent: true,
  headings: true,
  blockquote: true,
  horizontalRule: true,
  // Lists
  bulletList: true,
  orderedList: true,
  nestedLists: true,
  // Links & Media
  links: true,
  images: true,
  videos: true,
  embeds: true,
  // Tables
  tables: true,
  tableResize: false, // Requires custom implementation
  // Advanced
  emoji: true,
  mentions: true, // Slate has good mention support
  hashtags: true,
  markdown: true, // Can be added with plugins
  // UI
  fullscreen: true,
  print: true,
  characterCount: true,
  // History
  undoRedo: true,
  // Collaboration
  collaboration: false, // Can be added with plugins
  comments: false,
};

/**
 * Slate.js Editor Adapter
 */
export const SlateAdapter: EditorAdapter = {
  type: "slate",
  name: "Slate.js",
  description:
    "A completely customizable framework for building rich text editors. Provides full control over rendering and behavior.",

  isAvailable: checkSlateAvailable,

  getComponent: () => {
    // Dynamic import to avoid bundling if not used
    const { SlateEditorComponent } = require("./SlateEditorComponent");
    return SlateEditorComponent;
  },

  getSupportedFeatures: () => SLATE_FEATURES,
};

export default SlateAdapter;
