/**
 * TipTap Editor Adapter
 *
 * This adapter wraps the TipTap editor to conform to the unified editor interface.
 */

import type { EditorAdapter, EditorFeatures } from "../../core/types";
import { DEFAULT_FEATURES } from "../../core/types";

// Check if TipTap is available
function checkTipTapAvailable(): boolean {
  try {
    require("@tiptap/react");
    return true;
  } catch {
    return false;
  }
}

// TipTap features
const TIPTAP_FEATURES: EditorFeatures = {
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
  embeds: false,
  // Tables
  tables: true,
  tableResize: true,
  // Advanced
  emoji: true,
  mentions: false, // Can be added with extension
  hashtags: false, // Can be added with extension
  markdown: false, // Can be added with extension
  // UI
  fullscreen: true,
  print: true,
  characterCount: true,
  // History
  undoRedo: true,
  // Collaboration
  collaboration: false, // Requires Y.js integration
  comments: false,
};

/**
 * TipTap Editor Adapter
 */
export const TipTapAdapter: EditorAdapter = {
  type: "tiptap",
  name: "TipTap",
  description:
    "A headless, framework-agnostic rich text editor built on ProseMirror. Highly customizable with excellent TypeScript support.",

  isAvailable: checkTipTapAvailable,

  getComponent: () => {
    // Dynamic import to avoid bundling if not used
    const { TipTapEditorComponent } = require("./TipTapEditorComponent");
    return TipTapEditorComponent;
  },

  getSupportedFeatures: () => TIPTAP_FEATURES,
};

export default TipTapAdapter;
