import { useState, useRef } from "react";
import { UnifiedEditor } from "rte-builder";
import type { UnifiedEditorRef, EditorType } from "rte-builder";

export default function BasicDemo() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState(
    "<p>Hello! Start typing to test the editor...</p>",
  );
  const [output, setOutput] = useState("");
  const [selectedEditor, setSelectedEditor] = useState<EditorType>("tiptap");

  const handleGetContent = () => {
    const html = editorRef.current?.getContent();
    setOutput(html || "");
  };

  const handleSetContent = () => {
    const newContent =
      "<h1>New Content</h1><p>This content was set programmatically!</p>";
    editorRef.current?.setContent(newContent);
  };

  const handleClear = () => {
    editorRef.current?.clear();
  };

  const handleFocus = () => {
    editorRef.current?.focus();
  };

  return (
    <div className="demo-section">
      <h2>🚀 Basic Usage</h2>
      <p>
        A simple editor with default settings. Test all basic text formatting
        features, lists, links, and more.
      </p>

      {/* Editor Selection */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Select Editor:
        </label>
        <select
          value={selectedEditor}
          onChange={(e) => setSelectedEditor(e.target.value as EditorType)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
        >
          <option value="tiptap">TipTap (ProseMirror)</option>
          <option value="slate">Slate.js</option>
          <option value="lexical">Lexical (Meta)</option>
        </select>
      </div>

      <h3>
        Interactive Editor -{" "}
        {selectedEditor.charAt(0).toUpperCase() + selectedEditor.slice(1)}
      </h3>
      <UnifiedEditor
        key={selectedEditor} // Force remount when switching
        ref={editorRef}
        editor={selectedEditor}
        value={content}
        onChange={setContent}
        placeholder="Start typing..."
        height={400}
        toolbar="full"
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
        <li>Emoji picker</li>
        <li>Fullscreen mode</li>
        <li>Print</li>
      </ul>

      <h3>Code Example</h3>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "15px",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        {`import { UnifiedEditor } from 'rte-builder'

function MyEditor() {
  const [content, setContent] = useState('')

  return (
    <UnifiedEditor
      editor="${selectedEditor}"  // tiptap | slate | lexical
      value={content}
      onChange={setContent}
      toolbar="full"
      height={400}
    />
  )
}`}
      </pre>
    </div>
  );
}
