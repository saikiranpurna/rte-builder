// Main component export
export { RichTextEditor } from './components/RichTextEditor'

// Type exports
export type {
  EditorProps,
  EditorRef,
  MediaFile,
  ToolbarButton,
  ToolbarConfig,
} from './types'

// Custom extension exports (if users want to extend further)
export { FontSize } from './extensions/FontSize'
export { LineHeight } from './extensions/LineHeight'
export { Video } from './extensions/Video'

// Import styles
import './styles/editor.css'
