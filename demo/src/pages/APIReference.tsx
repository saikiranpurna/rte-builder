import { PropsTable } from "../components/PropsTable";
import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";

const editorProps = [
  {
    name: "value",
    type: "string",
    default: "''",
    required: false,
    description:
      "The HTML content of the editor. Controlled component pattern.",
  },
  {
    name: "onChange",
    type: "(content: string) => void",
    default: "-",
    required: false,
    description:
      "Callback fired when content changes. Receives the new HTML string.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    required: false,
    description: "Editor height in pixels.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Start typing..."',
    required: false,
    description: "Placeholder text shown when editor is empty.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    required: false,
    description: "Whether the editor is disabled.",
  },
  {
    name: "readOnly",
    type: "boolean",
    default: "false",
    required: false,
    description: "Whether the editor is read-only.",
  },
  {
    name: "toolbarPreset",
    type: "'full' | 'medium' | 'simple'",
    default: "'full'",
    required: false,
    description: "Predefined toolbar configuration preset.",
  },
  {
    name: "toolbarButtons",
    type: "ToolbarButton[]",
    default: "-",
    required: false,
    description: "Custom toolbar buttons array for full control.",
  },
  {
    name: "showCharCounter",
    type: "boolean",
    default: "false",
    required: false,
    description: "Show character counter at the bottom of the editor.",
  },
  {
    name: "charCounterMax",
    type: "number",
    default: "-",
    required: false,
    description: "Maximum character limit. Works with showCharCounter.",
  },
  {
    name: "onMediaPickerImage",
    type: "() => Promise<MediaFile | null>",
    default: "-",
    required: false,
    description:
      "Custom handler for image picker. Return the selected image info.",
  },
  {
    name: "onMediaPickerVideo",
    type: "() => Promise<MediaFile | null>",
    default: "-",
    required: false,
    description:
      "Custom handler for video picker. Return the selected video info.",
  },
  {
    name: "onFocus",
    type: "() => void",
    default: "-",
    required: false,
    description: "Callback fired when the editor gains focus.",
  },
  {
    name: "onBlur",
    type: "() => void",
    default: "-",
    required: false,
    description: "Callback fired when the editor loses focus.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    required: false,
    description: "Additional CSS class for the editor container.",
  },
];

const editorRefMethods = [
  {
    name: "getContent",
    type: "() => string",
    default: "-",
    required: false,
    description: "Returns the current content as an HTML string.",
  },
  {
    name: "setContent",
    type: "(content: string) => void",
    default: "-",
    required: false,
    description: "Sets the editor content. Accepts HTML string.",
  },
  {
    name: "insertHTML",
    type: "(html: string) => void",
    default: "-",
    required: false,
    description: "Inserts HTML content at the current cursor position.",
  },
  {
    name: "clear",
    type: "() => void",
    default: "-",
    required: false,
    description: "Clears all content from the editor.",
  },
  {
    name: "focus",
    type: "() => void",
    default: "-",
    required: false,
    description: "Focuses the editor.",
  },
  {
    name: "getEditor",
    type: "() => Editor | null",
    default: "-",
    required: false,
    description:
      "Returns the underlying TipTap editor instance for advanced usage.",
  },
  {
    name: "isFullscreen",
    type: "() => boolean",
    default: "-",
    required: false,
    description: "Returns true if the editor is in fullscreen mode.",
  },
  {
    name: "toggleFullscreen",
    type: "() => void",
    default: "-",
    required: false,
    description: "Toggles fullscreen mode on/off.",
  },
  {
    name: "print",
    type: "() => void",
    default: "-",
    required: false,
    description: "Opens the print dialog for the editor content.",
  },
];

export default function APIReference() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>API Reference</h1>
        <p className="page-description">
          Complete reference for all props, methods, and types in RTE Builder.
        </p>
      </div>

      <section className="section">
        <h2>RichTextEditor Props</h2>
        <p>
          These are all the props accepted by the{" "}
          <code>&lt;RichTextEditor&gt;</code> component.
        </p>
        <PropsTable props={editorProps} />
      </section>

      <section className="section">
        <h2>EditorRef Methods</h2>
        <p>
          Access these methods via a ref. These allow imperative control over
          the editor.
        </p>

        <CodeBlock
          code={`import { useRef } from 'react'
import { RichTextEditor, EditorRef } from 'rte-builder'

function MyEditor() {
  const editorRef = useRef<EditorRef>(null)

  // Access methods via editorRef.current
  const handleSave = () => {
    const html = editorRef.current?.getContent()
    // ... save logic
  }

  const handleInsert = () => {
    editorRef.current?.insertHTML('<p>Inserted content</p>')
  }

  return <RichTextEditor ref={editorRef} ... />
}`}
          language="tsx"
          filename="EditorRef-example.tsx"
        />

        <PropsTable props={editorRefMethods} />
      </section>

      <section className="section">
        <h2>Types</h2>

        <h3>EditorRef</h3>
        <CodeBlock
          code={`interface EditorRef {
  getContent: () => string
  setContent: (content: string) => void
  insertHTML: (html: string) => void
  clear: () => void
  focus: () => void
  getEditor: () => Editor | null
  isFullscreen: () => boolean
  toggleFullscreen: () => void
  print: () => void
}`}
          language="tsx"
          filename="EditorRef.ts"
        />

        <h3>ToolbarButton</h3>
        <p>Union type of all available toolbar button identifiers:</p>
        <CodeBlock
          code={`type ToolbarButton =
  | 'bold' | 'italic' | 'underline' | 'strikethrough'
  | 'code' | 'subscript' | 'superscript'
  | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6'
  | 'bulletList' | 'orderedList'
  | 'blockquote' | 'codeBlock' | 'horizontalRule'
  | 'link' | 'image' | 'video' | 'table'
  | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify'
  | 'textColor' | 'highlight'
  | 'undo' | 'redo' | 'clearFormatting'`}
          language="tsx"
          filename="ToolbarButton.ts"
        />

        <h3>MediaFile</h3>
        <p>
          Return type for the <code>onMediaPickerImage</code> and{" "}
          <code>onMediaPickerVideo</code> handlers:
        </p>
        <CodeBlock
          code={`interface MediaFile {
  url: string           // The URL of the selected file
  alt?: string          // Alt text for images
  title?: string        // Title attribute
  width?: number        // Width in pixels
  height?: number       // Height in pixels
}`}
          language="tsx"
          filename="MediaFile.ts"
        />

        <h3>MediaType</h3>
        <CodeBlock
          code={`type MediaType = 'image' | 'video' | 'file'`}
          language="tsx"
          showLineNumbers={false}
        />
      </section>

      <section className="section">
        <h2>Media Picker Handlers</h2>
        <p>
          Implement custom media pickers by providing the{" "}
          <code>onMediaPickerImage</code> and <code>onMediaPickerVideo</code>{" "}
          props.
        </p>

        <Callout type="info" title="Async Handler">
          The handlers should be async functions that open your media picker and
          return the MediaFile object or null if cancelled.
        </Callout>

        <CodeBlock
          code={`import { RichTextEditor, MediaFile } from 'rte-builder'

async function handleImagePicker(): Promise<MediaFile | null> {
  // Open your custom image picker modal
  const selectedImage = await openImagePickerModal()
  
  if (!selectedImage) return null

  return {
    url: selectedImage.url,
    alt: selectedImage.name,
    width: selectedImage.width,
    height: selectedImage.height,
  }
}

async function handleVideoPicker(): Promise<MediaFile | null> {
  // Open your custom video picker modal
  const selectedVideo = await openVideoPickerModal()
  
  if (!selectedVideo) return null

  return {
    url: selectedVideo.url,
    title: selectedVideo.name,
  }
}

function EditorWithMediaPickers() {
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      onMediaPickerImage={handleImagePicker}
      onMediaPickerVideo={handleVideoPicker}
    />
  )
}`}
          language="tsx"
          filename="MediaPickers.tsx"
        />
      </section>

      <section className="section">
        <h2>Event Callbacks</h2>

        <h3>onFocus / onBlur</h3>
        <CodeBlock
          code={`<RichTextEditor
  value={content}
  onChange={setContent}
  onFocus={() => console.log('Editor focused')}
  onBlur={() => console.log('Editor blurred')}
/>`}
          language="tsx"
          showLineNumbers={false}
        />

        <h3>Tracking Changes</h3>
        <CodeBlock
          code={`function EditorWithTracking() {
  const [content, setContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const editorRef = useRef<EditorRef>(null)

  const handleChange = (newContent: string) => {
    setContent(newContent)
    setIsDirty(true)
  }

  return (
    <div>
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={handleChange}
      />
      <div className="status-bar">
        {isDirty && <span>Unsaved changes</span>}
      </div>
    </div>
  )
}`}
          language="tsx"
          filename="EditorWithTracking.tsx"
        />
      </section>

      <section className="section">
        <h2>Exports</h2>
        <p>
          All available exports from the <code>rte-builder</code> package:
        </p>

        <CodeBlock
          code={`// Components
export { RichTextEditor } from 'rte-builder'

// Types
export type { 
  EditorRef,
  EditorProps,
  ToolbarButton,
  MediaFile,
  MediaType,
} from 'rte-builder'`}
          language="tsx"
          showLineNumbers={false}
        />
      </section>
    </div>
  );
}
