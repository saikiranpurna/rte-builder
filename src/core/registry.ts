/**
 * Editor Registry - Manages available editor adapters
 *
 * This module provides a central registry for editor adapters.
 * It allows dynamic registration of editors and automatic selection
 * based on availability.
 */

import type { EditorAdapter, EditorType, EditorFeatures } from './types'

// Registry to store all registered adapters
const adapters = new Map<EditorType, EditorAdapter>()

// Default editor preference order
const defaultPreferenceOrder: EditorType[] = ['tiptap', 'slate', 'lexical', 'quill', 'draft']

/**
 * Register an editor adapter
 * @param adapter The adapter to register
 */
export function registerAdapter(adapter: EditorAdapter): void {
  adapters.set(adapter.type, adapter)
}

/**
 * Unregister an editor adapter
 * @param type The editor type to unregister
 */
export function unregisterAdapter(type: EditorType): void {
  adapters.delete(type)
}

/**
 * Get an adapter by type
 * @param type The editor type
 * @returns The adapter or undefined
 */
export function getAdapter(type: EditorType): EditorAdapter | undefined {
  return adapters.get(type)
}

/**
 * Get all registered adapters
 * @returns Array of all registered adapters
 */
export function getAllAdapters(): EditorAdapter[] {
  return Array.from(adapters.values())
}

/**
 * Get all available adapters (ones with dependencies installed)
 * @returns Array of available adapters
 */
export function getAvailableAdapters(): EditorAdapter[] {
  return getAllAdapters().filter(adapter => adapter.isAvailable())
}

/**
 * Check if an editor type is available
 * @param type The editor type to check
 * @returns Whether the editor is available
 */
export function isEditorAvailable(type: EditorType): boolean {
  const adapter = adapters.get(type)
  return adapter?.isAvailable() ?? false
}

/**
 * Get the best available editor based on preference order
 * @param preferenceOrder Custom preference order (optional)
 * @returns The best available adapter or undefined
 */
export function getBestAvailableEditor(
  preferenceOrder: EditorType[] = defaultPreferenceOrder
): EditorAdapter | undefined {
  for (const type of preferenceOrder) {
    const adapter = adapters.get(type)
    if (adapter?.isAvailable()) {
      return adapter
    }
  }

  // Fallback: return any available adapter
  return getAvailableAdapters()[0]
}

/**
 * Get the default editor (first available in preference order)
 * @returns The default editor type or undefined
 */
export function getDefaultEditorType(): EditorType | undefined {
  const adapter = getBestAvailableEditor()
  return adapter?.type
}

/**
 * Get features supported by an editor
 * @param type The editor type
 * @returns The features object or undefined
 */
export function getEditorFeatures(type: EditorType): EditorFeatures | undefined {
  const adapter = adapters.get(type)
  return adapter?.getSupportedFeatures()
}

/**
 * Compare features between two editors
 * @param type1 First editor type
 * @param type2 Second editor type
 * @returns Object with features and their support status
 */
export function compareEditorFeatures(
  type1: EditorType,
  type2: EditorType
): Record<keyof EditorFeatures, { [key in EditorType]?: boolean }> | undefined {
  const features1 = getEditorFeatures(type1)
  const features2 = getEditorFeatures(type2)

  if (!features1 || !features2) return undefined

  const result: Record<keyof EditorFeatures, { [key in EditorType]?: boolean }> = {} as any

  for (const key of Object.keys(features1) as (keyof EditorFeatures)[]) {
    result[key] = {
      [type1]: features1[key],
      [type2]: features2[key],
    }
  }

  return result
}

/**
 * Get registry statistics
 * @returns Statistics about registered adapters
 */
export function getRegistryStats(): {
  total: number
  available: number
  unavailable: number
  editors: { type: EditorType; available: boolean; name: string }[]
} {
  const allAdapters = getAllAdapters()
  const availableAdapters = getAvailableAdapters()

  return {
    total: allAdapters.length,
    available: availableAdapters.length,
    unavailable: allAdapters.length - availableAdapters.length,
    editors: allAdapters.map(adapter => ({
      type: adapter.type,
      available: adapter.isAvailable(),
      name: adapter.name,
    })),
  }
}

// Export the registry for advanced use cases
export const EditorRegistry = {
  register: registerAdapter,
  unregister: unregisterAdapter,
  get: getAdapter,
  getAll: getAllAdapters,
  getAvailable: getAvailableAdapters,
  isAvailable: isEditorAvailable,
  getBest: getBestAvailableEditor,
  getDefault: getDefaultEditorType,
  getFeatures: getEditorFeatures,
  compareFeatures: compareEditorFeatures,
  getStats: getRegistryStats,
}

export default EditorRegistry
