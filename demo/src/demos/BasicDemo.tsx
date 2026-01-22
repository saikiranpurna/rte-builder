import { useState, useRef } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'

export default function BasicDemo() {
  const editorRef = useRef<EditorRef>(null)
  const [content, setContent] = useState('<p>Hello! Start typing to test the basic editor...</p>')
  const [output, setOutput] = useState('')

  const handleGetContent = () => {
    const html = editorRef.current?.getContent()
    setOutput(html || '')
  }

  const handleSetContent = () => {
    const newContent = '<h1>New Content</h1><p>This content was set programmatically!</p>'
    editorRef.current?.setContent(newContent)
  }

  const handleClear = () => {
    editorRef.current?.clear()
  }

  const handleFocus = () => {
    editorRef.current?.focus()
  }

  return (
    <div className="demo-section">
      <h2>🚀 Basic Usage</h2>
      <p>
        A simple editor with default settings. Test all basic text formatting features, lists, links,
        and more.
      </p>

      <h3>Interactive Editor</h3>
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        placeholder="Start typing..."
        height={400}
        toolbarPreset="full"
      />

      <div className="demo-actions">
        <button className="btn-primary" onClick={handleGetContent}>
          Get HTML Content
        </button>
        <button className="btn-secondary" onClick={handleSetContent}>
          Set New Content
        </button>
        <button className="btn-info" onClick={handleFocus}>
          Focus Editor
        </button>
        <button className="btn-danger" onClick={handleClear}>
          Clear Content
        </button>
      </div>

      {output && (
        <div className="output-preview">
          <h4>HTML Output:</h4>
          <pre>{output}</pre>
        </div>
      )}

      <h3>Features to Test</h3>
      <ul className="feature-list">
        <li>Text formatting: Bold, Italic, Underline, Strike</li>
        <li>Font family and size selection</li>
        <li>Text and background colors</li>
        <li>Text alignment (left, center, right, justify)</li>
        <li>Bullet and numbered lists</li>
        <li>Headings (H1-H6)</li>
        <li>Blockquotes</li>
        <li>Links</li>
        <li>Images and videos</li>
        <li>Tables</li>
        <li>Code blocks with syntax highlighting</li>
        <li>Undo/Redo</li>
      </ul>
    </div>
  )
}
