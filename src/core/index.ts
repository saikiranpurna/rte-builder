/**
 * Core module exports
 */

// Types
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
} from './types'

export { DEFAULT_FEATURES } from './types'

// Registry
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
} from './registry'

// Presets
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
} from './presets'

export type { ToolbarPresetName } from './presets'
