/**
 * Slate.js Adapter Exports
 */

export { SlateAdapter } from './SlateAdapter'
export { SlateEditorComponent } from './SlateEditorComponent'
export { SlateToolbar } from './SlateToolbar'

// Auto-register the adapter
import { registerAdapter } from '../../core/registry'
import { SlateAdapter } from './SlateAdapter'

// Only register if Slate is available
if (SlateAdapter.isAvailable()) {
  registerAdapter(SlateAdapter)
}
