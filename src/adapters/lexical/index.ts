/**
 * Lexical Adapter Exports
 */

export { LexicalAdapter } from './LexicalAdapter'
export { LexicalEditorComponent } from './LexicalEditorComponent'
export { LexicalToolbar } from './LexicalToolbar'

// Auto-register the adapter
import { registerAdapter } from '../../core/registry'
import { LexicalAdapter } from './LexicalAdapter'

// Only register if Lexical is available
if (LexicalAdapter.isAvailable()) {
  registerAdapter(LexicalAdapter)
}
