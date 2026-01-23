import { useState } from "react";
import {
  UnifiedEditor,
  getAvailableAdapters,
  getEditorFeatures,
} from "rte-builder";
import type { EditorType, UnifiedEditorRef } from "rte-builder";

export default function EditorComparison() {
  const [content, setContent] = useState<Record<EditorType, string>>({
    tiptap:
      "<p>This is <strong>TipTap</strong> editor - ProseMirror-based, highly extensible</p>",
    slate:
      "<p>This is <strong>Slate.js</strong> editor - Completely customizable framework</p>",
    lexical:
      "<p>This is <strong>Lexical</strong> editor - Meta's modern editor framework</p>",
    quill: "",
    draft: "",
  });

  const [selectedEditor, setSelectedEditor] = useState<EditorType>("tiptap");

  const editors: {
    type: EditorType;
    name: string;
    description: string;
    available: boolean;
  }[] = [
    {
      type: "tiptap",
      name: "TipTap",
      description:
        "ProseMirror-based, highly extensible with great TypeScript support",
      available: true,
    },
    {
      type: "slate",
      name: "Slate.js",
      description:
        "Completely customizable framework for building rich text editors",
      available: true,
    },
    {
      type: "lexical",
      name: "Lexical",
      description:
        "Meta's modern, extensible text editor with excellent performance",
      available: true,
    },
  ];

  const handleContentChange =
    (editorType: EditorType) => (newContent: string) => {
      setContent((prev) => ({ ...prev, [editorType]: newContent }));
    };

  return (
    <div className="demo-page">
      <h2>🔄 Editor Comparison</h2>
      <p>
        Compare the three included editor backends. Each editor provides the
        same unified API but with different underlying implementations.
      </p>

      {/* Editor Selection Tabs */}
      <div className="editor-tabs" style={{ marginBottom: "20px" }}>
        {editors.map((editor) => (
          <button
            key={editor.type}
            onClick={() => setSelectedEditor(editor.type)}
            className={selectedEditor === editor.type ? "active" : ""}
            style={{
              padding: "10px 20px",
              margin: "0 5px",
              border:
                selectedEditor === editor.type
                  ? "2px solid #3b82f6"
                  : "1px solid #ddd",
              borderRadius: "8px",
              background: selectedEditor === editor.type ? "#eff6ff" : "#fff",
              cursor: "pointer",
              fontWeight: selectedEditor === editor.type ? "bold" : "normal",
            }}
          >
            {editor.name}
          </button>
        ))}
      </div>

      {/* Selected Editor Info */}
      <div
        style={{
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <strong>{editors.find((e) => e.type === selectedEditor)?.name}</strong>
        <p style={{ margin: "5px 0 0", color: "#64748b" }}>
          {editors.find((e) => e.type === selectedEditor)?.description}
        </p>
      </div>

      {/* Editor Instance */}
      <div className="demo-editor-container">
        <UnifiedEditor
          key={selectedEditor} // Force remount when switching editors
          editor={selectedEditor}
          value={content[selectedEditor]}
          onChange={handleContentChange(selectedEditor)}
          toolbar="medium"
          height={350}
          showCharCounter
          placeholder={`Start typing in ${selectedEditor}...`}
        />
      </div>

      {/* Feature Comparison Table */}
      <div style={{ marginTop: "30px" }}>
        <h3>Feature Comparison</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #e2e8f0",
                }}
              >
                Feature
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                TipTap
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                Slate.js
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                Lexical
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: "Bold/Italic/Underline", key: "bold" },
              { feature: "Headings", key: "headings" },
              { feature: "Lists", key: "bulletList" },
              { feature: "Tables", key: "tables" },
              { feature: "Code Highlighting", key: "codeHighlighting" },
              { feature: "Images", key: "images" },
              { feature: "Videos", key: "videos" },
              { feature: "Links", key: "links" },
              { feature: "Emoji", key: "emoji" },
              { feature: "Undo/Redo", key: "undoRedo" },
              { feature: "Fullscreen", key: "fullscreen" },
              { feature: "Mentions", key: "mentions" },
              { feature: "Collaboration", key: "collaboration" },
            ].map(({ feature, key }) => (
              <tr key={key}>
                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                  {feature}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {getFeatureSupport("tiptap", key) ? "✅" : "❌"}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {getFeatureSupport("slate", key) ? "✅" : "❌"}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {getFeatureSupport("lexical", key) ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: "30px" }}>
        <h3>Usage Code</h3>
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

// Use TipTap (default)
<UnifiedEditor
  editor="tiptap"
  value={content}
  onChange={setContent}
/>

// Use Slate.js
<UnifiedEditor
  editor="slate"
  value={content}
  onChange={setContent}
/>

// Use Lexical
<UnifiedEditor
  editor="lexical"
  value={content}
  onChange={setContent}
/>`}
        </pre>
      </div>
    </div>
  );
}

// Helper to get feature support
function getFeatureSupport(editor: string, feature: string): boolean {
  const features: Record<string, Record<string, boolean>> = {
    tiptap: {
      bold: true,
      headings: true,
      bulletList: true,
      tables: true,
      codeHighlighting: true,
      images: true,
      videos: true,
      links: true,
      emoji: true,
      undoRedo: true,
      fullscreen: true,
      mentions: false,
      collaboration: false,
    },
    slate: {
      bold: true,
      headings: true,
      bulletList: true,
      tables: true,
      codeHighlighting: true,
      images: true,
      videos: true,
      links: true,
      emoji: true,
      undoRedo: true,
      fullscreen: true,
      mentions: true,
      collaboration: false,
    },
    lexical: {
      bold: true,
      headings: true,
      bulletList: true,
      tables: true,
      codeHighlighting: true,
      images: true,
      videos: true,
      links: true,
      emoji: true,
      undoRedo: true,
      fullscreen: true,
      mentions: true,
      collaboration: true,
    },
  };
  return features[editor]?.[feature] ?? false;
}
