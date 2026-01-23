/**
 * Lexical Editor Adapter
 *
 * This adapter wraps Meta's Lexical editor to conform to the unified editor interface.
 * Lexical is a modern, extensible text editor framework with excellent performance.
 */

import type { EditorAdapter, EditorFeatures } from "../../core/types";
import { DEFAULT_FEATURES } from "../../core/types";

// Check if Lexical is available
function checkLexicalAvailable(): boolean {
  try {
    require("lexical");
    require("@lexical/react/LexicalComposer");
    return true;
  } catch {
    return false;
  }
}

// Lexical features
const LEXICAL_FEATURES: EditorFeatures = {
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
  lineHeight: false, // Requires custom plugin
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
  mentions: true, // Excellent mention support
  hashtags: true,
  markdown: true, // Native markdown support
  // UI
  fullscreen: true,
  print: true,
  characterCount: true,
  // History
  undoRedo: true,
  // Collaboration
  collaboration: true, // Built-in Yjs support
  comments: false,
};

/**
 * Lexical Editor Adapter
 */
export const LexicalAdapter: EditorAdapter = {
  type: "lexical",
  name: "Lexical",
  description:
    "Meta's modern, extensible text editor framework with excellent performance and built-in collaboration support.",

  isAvailable: checkLexicalAvailable,

  getComponent: () => {
    // Dynamic import to avoid bundling if not used
    const { LexicalEditorComponent } = require("./LexicalEditorComponent");
    return LexicalEditorComponent;
  },

  getSupportedFeatures: () => LEXICAL_FEATURES,
};

export default LexicalAdapter;
