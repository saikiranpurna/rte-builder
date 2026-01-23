/**
 * Toolbar Presets - Predefined toolbar configurations
 */

import type { ToolbarButtonType } from './types'

/** Full toolbar with all features */
export const fullToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'separator',
  'subscript',
  'superscript',
  'clearFormatting',
  'separator',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'textColor',
  'backgroundColor',
  'separator',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify',
  'separator',
  'indent',
  'outdent',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'heading1',
  'heading2',
  'heading3',
  'blockquote',
  'separator',
  'link',
  'unlink',
  'image',
  'video',
  'table',
  'emoji',
  'separator',
  'codeBlock',
  'horizontalRule',
  'separator',
  'undo',
  'redo',
  'separator',
  'fullscreen',
  'print',
]

/** Medium toolbar for standard editing */
export const mediumToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'separator',
  'fontFamily',
  'fontSize',
  'textColor',
  'backgroundColor',
  'separator',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'heading1',
  'heading2',
  'heading3',
  'separator',
  'link',
  'image',
  'table',
  'emoji',
  'separator',
  'undo',
  'redo',
  'fullscreen',
]

/** Simple toolbar for basic editing */
export const simpleToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'underline',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'link',
  'image',
  'separator',
  'undo',
  'redo',
]

/** Minimal toolbar for comments/notes */
export const minimalToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'separator',
  'link',
  'separator',
  'undo',
  'redo',
]

/** Code-focused toolbar for technical documentation */
export const codeToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'code',
  'separator',
  'heading1',
  'heading2',
  'heading3',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'link',
  'image',
  'separator',
  'codeBlock',
  'blockquote',
  'separator',
  'undo',
  'redo',
]

/** Blog/Article toolbar */
export const blogToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'separator',
  'fontSize',
  'textColor',
  'separator',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'heading1',
  'heading2',
  'heading3',
  'blockquote',
  'separator',
  'link',
  'image',
  'video',
  'separator',
  'horizontalRule',
  'separator',
  'undo',
  'redo',
  'fullscreen',
]

/** Email composition toolbar */
export const emailToolbar: ToolbarButtonType[] = [
  'bold',
  'italic',
  'underline',
  'separator',
  'fontFamily',
  'fontSize',
  'textColor',
  'separator',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'link',
  'image',
  'separator',
  'undo',
  'redo',
]

/** All preset configurations */
export const toolbarPresets = {
  full: fullToolbar,
  medium: mediumToolbar,
  simple: simpleToolbar,
  minimal: minimalToolbar,
  code: codeToolbar,
  blog: blogToolbar,
  email: emailToolbar,
} as const

export type ToolbarPresetName = keyof typeof toolbarPresets

/**
 * Get a toolbar preset by name
 * @param name The preset name
 * @returns The toolbar buttons array
 */
export function getToolbarPreset(name: ToolbarPresetName): ToolbarButtonType[] {
  return toolbarPresets[name] || toolbarPresets.full
}

/**
 * Create a custom toolbar from a preset with modifications
 * @param base Base preset name
 * @param options Modification options
 * @returns Modified toolbar buttons array
 */
export function customizeToolbar(
  base: ToolbarPresetName,
  options: {
    add?: ToolbarButtonType[]
    remove?: ToolbarButtonType[]
    insertBefore?: { button: ToolbarButtonType; items: ToolbarButtonType[] }
    insertAfter?: { button: ToolbarButtonType; items: ToolbarButtonType[] }
  }
): ToolbarButtonType[] {
  let toolbar = [...getToolbarPreset(base)]

  // Remove buttons
  if (options.remove) {
    toolbar = toolbar.filter(btn => !options.remove!.includes(btn))
  }

  // Insert before
  if (options.insertBefore) {
    const index = toolbar.indexOf(options.insertBefore.button)
    if (index !== -1) {
      toolbar.splice(index, 0, ...options.insertBefore.items)
    }
  }

  // Insert after
  if (options.insertAfter) {
    const index = toolbar.indexOf(options.insertAfter.button)
    if (index !== -1) {
      toolbar.splice(index + 1, 0, ...options.insertAfter.items)
    }
  }

  // Add at end
  if (options.add) {
    toolbar.push('separator', ...options.add)
  }

  return toolbar
}

export default toolbarPresets
