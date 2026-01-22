import { useState, useRef } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { EditorRef, MediaFile } from 'rte-builder'

export default function AllFeatures() {
  const editorRef = useRef<EditorRef>(null)
  const [content, setContent] = useState(`
<h1>Welcome to RTE Builder!</h1>
<p>This editor showcases all available features. Try everything!</p>

<h2>Text Formatting</h2>
<p><strong>Bold text</strong>, <em>italic text</em>, <u>underline</u>, <s>strikethrough</s></p>
<p>Subscript: H<sub>2</sub>O | Superscript: E=mc<sup>2</sup></p>

<h2>Lists</h2>
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>
<ol>
  <li>Numbered item 1</li>
  <li>Numbered item 2</li>
</ol>

<blockquote>This is a blockquote. Great for highlighting important information!</blockquote>

<h2>Code</h2>
<p>Inline code: <code>const x = 10;</code></p>

<p>Try inserting images, videos, tables, and more using the toolbar!</p>
  `)

  const handleMediaPicker = async (type: 'image' | 'video'): Promise<MediaFile | null> => {
    const url = prompt(`Enter ${type} URL:`)
    return url ? { url, name: `Demo ${type}` } : null
  }

  return (
    <div className="demo-section">
      <h2>✨ All Features Showcase</h2>
      <p>A comprehensive demo with all features enabled and ready to test.</p>

      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        onMediaPickerImage={() => handleMediaPicker('image')}
        onMediaPickerVideo={() => handleMediaPicker('video')}
        placeholder="Start creating amazing content..."
        height={600}
        showCharCounter
        charCounterMax={10000}
        toolbarPreset="full"
        enableCodeHighlight
      />

      <div className="demo-actions">
        <button className="btn-primary" onClick={() => editorRef.current?.focus()}>
          Focus Editor
        </button>
        <button className="btn-secondary" onClick={() => alert(editorRef.current?.getContent())}>
          Get HTML
        </button>
        <button className="btn-danger" onClick={() => editorRef.current?.clear()}>
          Clear All
        </button>
      </div>

      <h3>Complete Feature List</h3>
      <div className="demo-grid">
        <div>
          <h4>Text Formatting</h4>
          <ul className="feature-list">
            <li>Bold, Italic, Underline, Strike</li>
            <li>Subscript, Superscript</li>
            <li>Font Family (10+ fonts)</li>
            <li>Font Size (8px - 96px)</li>
            <li>Text Color</li>
            <li>Background Color</li>
            <li>Clear Formatting</li>
          </ul>
        </div>

        <div>
          <h4>Paragraph & Structure</h4>
          <ul className="feature-list">
            <li>Headings (H1-H6)</li>
            <li>Text Alignment</li>
            <li>Bullet Lists</li>
            <li>Numbered Lists</li>
            <li>Blockquotes</li>
            <li>Horizontal Rules</li>
          </ul>
        </div>

        <div>
          <h4>Media & Links</h4>
          <ul className="feature-list">
            <li>Images</li>
            <li>Videos</li>
            <li>Links</li>
            <li>Tables (resizable)</li>
            <li>Custom Media Picker</li>
          </ul>
        </div>

        <div>
          <h4>Code & Advanced</h4>
          <ul className="feature-list">
            <li>Inline Code</li>
            <li>Code Blocks</li>
            <li>Syntax Highlighting (190+ langs)</li>
            <li>Character Counter</li>
            <li>Undo/Redo</li>
            <li>Drag & Drop</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
