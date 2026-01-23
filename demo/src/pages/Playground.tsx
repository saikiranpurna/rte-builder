import { useState, useRef } from "react";
import { RichTextEditor, EditorRef } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";

type PlaygroundTab = "interactive" | "presets" | "features" | "themes";

const sampleContent = {
  rich: `<h2>Welcome to the Playground!</h2>
<p>This is a <strong>fully interactive</strong> demo where you can explore all the features of RTE Builder.</p>
<ul>
  <li>Test different toolbar presets</li>
  <li>Adjust settings in real-time</li>
  <li>View the HTML output</li>
</ul>
<blockquote><p>Try out all the formatting options above! 🎉</p></blockquote>`,

  minimal: `<p>A clean, minimal editor for simple text input.</p>`,

  article: `<h1>The Future of Web Development</h1>
<p>Web development continues to evolve at a rapid pace. With new frameworks and tools emerging regularly, developers have more options than ever before.</p>
<h2>Key Trends</h2>
<ol>
  <li><strong>AI Integration</strong> - Artificial intelligence is becoming a core part of development workflows</li>
  <li><strong>Edge Computing</strong> - Running code closer to users for better performance</li>
  <li><strong>Web Components</strong> - Building reusable, framework-agnostic components</li>
</ol>
<p>The landscape will continue to shift, but the fundamentals of good software engineering remain constant.</p>`,

  code: `<h2>Code Documentation</h2>
<p>Here's how to use the API:</p>
<pre><code>const editor = useRef&lt;EditorRef&gt;(null);
editor.current?.insertHTML('&lt;p&gt;Hello World&lt;/p&gt;');</code></pre>
<p>For more details, check the <a href="#">API documentation</a>.</p>`,
};

export default function Playground() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("interactive");

  return (
    <div className="page playground-full-page">
      <div className="playground-hero">
        <div className="playground-hero-content">
          <span className="playground-hero-badge">🎮 Interactive</span>
          <h1>Playground</h1>
          <p>
            Experiment with all editor configurations, presets, and features. No
            setup required.
          </p>
        </div>
      </div>

      <div className="playground-tabs">
        <button
          className={`playground-tab ${activeTab === "interactive" ? "active" : ""}`}
          onClick={() => setActiveTab("interactive")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Interactive Editor
        </button>
        <button
          className={`playground-tab ${activeTab === "presets" ? "active" : ""}`}
          onClick={() => setActiveTab("presets")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Preset Comparison
        </button>
        <button
          className={`playground-tab ${activeTab === "features" ? "active" : ""}`}
          onClick={() => setActiveTab("features")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          Feature Showcase
        </button>
        <button
          className={`playground-tab ${activeTab === "themes" ? "active" : ""}`}
          onClick={() => setActiveTab("themes")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          Use Cases
        </button>
      </div>

      <div className="playground-content">
        {activeTab === "interactive" && (
          <InteractiveEditor sampleContent={sampleContent.rich} />
        )}
        {activeTab === "presets" && (
          <PresetComparison sampleContent={sampleContent.minimal} />
        )}
        {activeTab === "features" && <FeatureShowcase />}
        {activeTab === "themes" && <UseCases sampleContent={sampleContent} />}
      </div>
    </div>
  );
}

// ============================================
// Interactive Editor Tab
// ============================================
function InteractiveEditor({ sampleContent }: { sampleContent: string }) {
  const [content, setContent] = useState(sampleContent);
  const [preset, setPreset] = useState<"simple" | "medium" | "full">("full");
  const [height, setHeight] = useState(350);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showCharCounter, setShowCharCounter] = useState(false);
  const [charLimit, setCharLimit] = useState(500);
  const [placeholder, setPlaceholder] = useState("Start typing...");
  const [outputMode, setOutputMode] = useState<"html" | "preview">("html");
  const editorRef = useRef<EditorRef>(null);

  const textContent = content.replace(/<[^>]*>/g, "");
  const stats = {
    chars: textContent.length,
    words: textContent.trim().split(/\s+/).filter(Boolean).length,
    paragraphs: (content.match(/<p>/g) || []).length,
  };

  const generatedCode = `<RichTextEditor
  value={content}
  onChange={setContent}
  toolbarPreset="${preset}"
  height={${height}}
  readOnly={${readOnly}}
  disabled={${disabled}}
  placeholder="${placeholder}"${
    showCharCounter
      ? `
  showCharCounter={true}
  charCounterMax={${charLimit}}`
      : ""
  }
/>`;

  return (
    <div className="interactive-editor-layout">
      {/* Control Panel */}
      <aside className="control-panel">
        <div className="control-section">
          <h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Editor Settings
          </h3>

          <div className="control-group">
            <label>Toolbar Preset</label>
            <div className="button-group">
              {(["simple", "medium", "full"] as const).map((p) => (
                <button
                  key={p}
                  className={`btn-option ${preset === p ? "active" : ""}`}
                  onClick={() => setPreset(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Height: {height}px</label>
            <input
              type="range"
              min="150"
              max="600"
              step="25"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <div className="control-group">
            <label>Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="control-group">
            <div className="toggle-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={readOnly}
                  onChange={(e) => setReadOnly(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                Read Only
              </label>
            </div>
            <div className="toggle-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                Disabled
              </label>
            </div>
            <div className="toggle-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showCharCounter}
                  onChange={(e) => setShowCharCounter(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                Character Counter
              </label>
            </div>
          </div>

          {showCharCounter && (
            <div className="control-group">
              <label>Character Limit: {charLimit}</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={charLimit}
                onChange={(e) => setCharLimit(Number(e.target.value))}
                className="range-slider"
              />
            </div>
          )}
        </div>

        <div className="control-section">
          <h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Statistics
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.chars}</span>
              <span className="stat-label">Characters</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.words}</span>
              <span className="stat-label">Words</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.paragraphs}</span>
              <span className="stat-label">Paragraphs</span>
            </div>
          </div>
        </div>

        <div className="control-section">
          <h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Quick Actions
          </h3>
          <div className="action-grid">
            <button
              className="action-btn"
              onClick={() => editorRef.current?.focus()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Focus
            </button>
            <button
              className="action-btn"
              onClick={() => editorRef.current?.clear()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear
            </button>
            <button
              className="action-btn"
              onClick={() =>
                editorRef.current?.insertHTML(
                  "<p>✨ <strong>Inserted!</strong></p>",
                )
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Insert
            </button>
            <button
              className="action-btn"
              onClick={() => {
                const output = editorRef.current?.getContent() || content;
                navigator.clipboard.writeText(output);
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
            <button
              className="action-btn"
              onClick={() => editorRef.current?.toggleFullscreen()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              Fullscreen
            </button>
            <button
              className="action-btn"
              onClick={() => editorRef.current?.print()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print
            </button>
          </div>
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="editor-main">
        <div className="editor-wrapper">
          <RichTextEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            toolbarPreset={preset}
            height={height}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            showCharCounter={showCharCounter}
            charCounterMax={showCharCounter ? charLimit : undefined}
          />
        </div>

        <div className="output-panel">
          <div className="output-header">
            <div className="output-tabs">
              <button
                className={`output-tab ${outputMode === "html" ? "active" : ""}`}
                onClick={() => setOutputMode("html")}
              >
                HTML Output
              </button>
              <button
                className={`output-tab ${outputMode === "preview" ? "active" : ""}`}
                onClick={() => setOutputMode("preview")}
              >
                Preview
              </button>
            </div>
          </div>

          {outputMode === "html" ? (
            <pre className="output-code">{content}</pre>
          ) : (
            <div
              className="output-preview"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        <div className="generated-code-section">
          <h4>Generated Component Code</h4>
          <CodeBlock
            code={generatedCode}
            language="tsx"
            showLineNumbers={false}
          />
        </div>
      </main>
    </div>
  );
}

// ============================================
// Preset Comparison Tab
// ============================================
function PresetComparison({ sampleContent }: { sampleContent: string }) {
  const [contents, setContents] = useState({
    simple: sampleContent,
    medium: sampleContent,
    full: sampleContent,
  });

  return (
    <div className="preset-comparison">
      <div className="comparison-header">
        <h2>Toolbar Preset Comparison</h2>
        <p>
          Compare all three toolbar presets side by side. Each preset is
          designed for different use cases.
        </p>
      </div>

      <div className="preset-grid">
        <div className="preset-card">
          <div className="preset-card-header">
            <h3>Simple</h3>
            <span className="preset-badge simple">Minimal</span>
          </div>
          <p className="preset-description">
            Basic formatting only. Perfect for comments, short inputs, and
            simple text fields.
          </p>
          <div className="preset-features">
            <span>Bold</span>
            <span>Italic</span>
            <span>Links</span>
            <span>Lists</span>
          </div>
          <div className="preset-editor">
            <RichTextEditor
              value={contents.simple}
              onChange={(v) => setContents((prev) => ({ ...prev, simple: v }))}
              toolbarPreset="simple"
              height={200}
              placeholder="Simple editor..."
            />
          </div>
        </div>

        <div className="preset-card">
          <div className="preset-card-header">
            <h3>Medium</h3>
            <span className="preset-badge medium">Balanced</span>
          </div>
          <p className="preset-description">
            Extended formatting with headings and blocks. Great for blog posts
            and articles.
          </p>
          <div className="preset-features">
            <span>Headings</span>
            <span>Blockquote</span>
            <span>Code</span>
            <span>Alignment</span>
          </div>
          <div className="preset-editor">
            <RichTextEditor
              value={contents.medium}
              onChange={(v) => setContents((prev) => ({ ...prev, medium: v }))}
              toolbarPreset="medium"
              height={200}
              placeholder="Medium editor..."
            />
          </div>
        </div>

        <div className="preset-card">
          <div className="preset-card-header">
            <h3>Full</h3>
            <span className="preset-badge full">Complete</span>
          </div>
          <p className="preset-description">
            All features enabled. Ideal for CMS, documentation, and rich content
            editing.
          </p>
          <div className="preset-features">
            <span>Tables</span>
            <span>Media</span>
            <span>Colors</span>
            <span>Full Suite</span>
          </div>
          <div className="preset-editor">
            <RichTextEditor
              value={contents.full}
              onChange={(v) => setContents((prev) => ({ ...prev, full: v }))}
              toolbarPreset="full"
              height={200}
              placeholder="Full editor..."
            />
          </div>
        </div>
      </div>

      <div className="preset-code-examples">
        <h3>Implementation</h3>
        <div className="code-examples-grid">
          <CodeBlock
            code={`<RichTextEditor
  toolbarPreset="simple"
  // Perfect for: comments, quick inputs
/>`}
            language="tsx"
            filename="simple-preset.tsx"
            showLineNumbers={false}
          />
          <CodeBlock
            code={`<RichTextEditor
  toolbarPreset="medium"
  // Perfect for: blog posts, articles
/>`}
            language="tsx"
            filename="medium-preset.tsx"
            showLineNumbers={false}
          />
          <CodeBlock
            code={`<RichTextEditor
  toolbarPreset="full"
  // Perfect for: CMS, documentation
/>`}
            language="tsx"
            filename="full-preset.tsx"
            showLineNumbers={false}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Feature Showcase Tab
// ============================================
function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState<string>("ref-methods");
  const editorRef = useRef<EditorRef>(null);
  const [demoContent, setDemoContent] = useState(
    "<p>Edit this content to test features...</p>",
  );
  const [lastAction, setLastAction] = useState<string>("");

  const features = [
    { id: "ref-methods", label: "Ref Methods", icon: "⚡" },
    { id: "readonly", label: "Read-Only Mode", icon: "🔒" },
    { id: "char-counter", label: "Character Counter", icon: "🔢" },
    { id: "fullscreen", label: "Fullscreen", icon: "🖥️" },
  ];

  const executeAction = (action: string, callback: () => void) => {
    callback();
    setLastAction(action);
    setTimeout(() => setLastAction(""), 2000);
  };

  return (
    <div className="feature-showcase">
      <div className="feature-header">
        <h2>Feature Showcase</h2>
        <p>Explore individual features and capabilities of the editor</p>
      </div>

      <div className="feature-nav">
        {features.map((f) => (
          <button
            key={f.id}
            className={`feature-nav-btn ${activeFeature === f.id ? "active" : ""}`}
            onClick={() => setActiveFeature(f.id)}
          >
            <span className="feature-icon">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      <div className="feature-content">
        {activeFeature === "ref-methods" && (
          <div className="feature-demo">
            <div className="feature-info">
              <h3>Editor Ref Methods</h3>
              <p>
                Access powerful imperative methods through the editor ref. These
                methods allow you to programmatically control the editor.
              </p>

              <div className="method-buttons">
                <button
                  className="method-btn"
                  onClick={() =>
                    executeAction("getContent()", () => {
                      const html = editorRef.current?.getContent();
                      console.log("Content:", html);
                      alert(`Content length: ${html?.length || 0} characters`);
                    })
                  }
                >
                  getContent()
                </button>
                <button
                  className="method-btn"
                  onClick={() =>
                    executeAction("setContent()", () => {
                      editorRef.current?.setContent(
                        "<h2>Content Reset!</h2><p>This content was set programmatically.</p>",
                      );
                    })
                  }
                >
                  setContent()
                </button>
                <button
                  className="method-btn"
                  onClick={() =>
                    executeAction("insertHTML()", () => {
                      editorRef.current?.insertHTML(
                        "<p><strong>🚀 Inserted at cursor!</strong></p>",
                      );
                    })
                  }
                >
                  insertHTML()
                </button>
                <button
                  className="method-btn"
                  onClick={() =>
                    executeAction("clear()", () => {
                      editorRef.current?.clear();
                    })
                  }
                >
                  clear()
                </button>
                <button
                  className="method-btn"
                  onClick={() =>
                    executeAction("focus()", () => {
                      editorRef.current?.focus();
                    })
                  }
                >
                  focus()
                </button>
              </div>

              {lastAction && (
                <div className="action-feedback">
                  <span className="action-label">Executed:</span>
                  <code>{lastAction}</code>
                </div>
              )}
            </div>

            <div className="feature-editor">
              <RichTextEditor
                ref={editorRef}
                value={demoContent}
                onChange={setDemoContent}
                toolbarPreset="medium"
                height={250}
              />
            </div>

            <CodeBlock
              code={`const editorRef = useRef<EditorRef>(null);

// Get content
const html = editorRef.current?.getContent();

// Set content
editorRef.current?.setContent('<p>New content</p>');

// Insert at cursor
editorRef.current?.insertHTML('<strong>Inserted</strong>');

// Clear all content
editorRef.current?.clear();

// Focus the editor
editorRef.current?.focus();`}
              language="tsx"
              filename="ref-methods.tsx"
            />
          </div>
        )}

        {activeFeature === "readonly" && (
          <div className="feature-demo">
            <ReadOnlyDemo />
          </div>
        )}

        {activeFeature === "char-counter" && (
          <div className="feature-demo">
            <CharCounterDemo />
          </div>
        )}

        {activeFeature === "fullscreen" && (
          <div className="feature-demo">
            <FullscreenDemo />
          </div>
        )}
      </div>
    </div>
  );
}

function ReadOnlyDemo() {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const content =
    "<h3>Protected Content</h3><p>This content demonstrates <strong>read-only</strong> and <strong>disabled</strong> modes.</p><ul><li>Toggle the switches to see the difference</li><li>Read-only: Content visible, toolbar hidden</li><li>Disabled: Grayed out, no interaction</li></ul>";

  return (
    <>
      <div className="feature-info">
        <h3>Read-Only & Disabled Modes</h3>
        <p>Control editor interactivity with readOnly and disabled props.</p>

        <div className="toggle-controls">
          <label className="toggle-label large">
            <input
              type="checkbox"
              checked={isReadOnly}
              onChange={(e) => setIsReadOnly(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            Read Only
          </label>
          <label className="toggle-label large">
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            Disabled
          </label>
        </div>
      </div>

      <div className="feature-editor">
        <RichTextEditor
          value={content}
          readOnly={isReadOnly}
          disabled={isDisabled}
          toolbarPreset="medium"
          height={200}
        />
      </div>

      <CodeBlock
        code={`<RichTextEditor
  value={content}
  readOnly={${isReadOnly}}  // Hides toolbar, content not editable
  disabled={${isDisabled}} // Grays out entire editor
/>`}
        language="tsx"
        showLineNumbers={false}
      />
    </>
  );
}

function CharCounterDemo() {
  const [content, setContent] = useState(
    "<p>Start typing to see the character counter in action...</p>",
  );
  const [maxChars, setMaxChars] = useState(200);

  return (
    <>
      <div className="feature-info">
        <h3>Character Counter</h3>
        <p>Display a character count with optional maximum limit.</p>

        <div className="control-group">
          <label>Maximum Characters: {maxChars}</label>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={maxChars}
            onChange={(e) => setMaxChars(Number(e.target.value))}
            className="range-slider"
          />
        </div>
      </div>

      <div className="feature-editor">
        <RichTextEditor
          value={content}
          onChange={setContent}
          toolbarPreset="simple"
          height={180}
          showCharCounter
          charCounterMax={maxChars}
        />
      </div>

      <CodeBlock
        code={`<RichTextEditor
  value={content}
  onChange={setContent}
  showCharCounter={true}
  charCounterMax={${maxChars}}
/>`}
        language="tsx"
        showLineNumbers={false}
      />
    </>
  );
}

function FullscreenDemo() {
  const editorRef = useRef<EditorRef>(null);
  const [content, setContent] = useState(
    "<h2>Fullscreen Mode</h2><p>Click the button below or use the fullscreen button in the toolbar to enter fullscreen mode.</p><p>This is great for focused writing sessions!</p>",
  );

  return (
    <>
      <div className="feature-info">
        <h3>Fullscreen Mode</h3>
        <p>Enable distraction-free writing with fullscreen mode.</p>

        <button
          className="action-btn large"
          onClick={() => editorRef.current?.toggleFullscreen()}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
          Toggle Fullscreen
        </button>
      </div>

      <div className="feature-editor">
        <RichTextEditor
          ref={editorRef}
          value={content}
          onChange={setContent}
          toolbarPreset="full"
          height={250}
        />
      </div>

      <CodeBlock
        code={`const editorRef = useRef<EditorRef>(null);

// Toggle fullscreen programmatically
editorRef.current?.toggleFullscreen();

// Check if in fullscreen mode
const isFs = editorRef.current?.isFullscreen();`}
        language="tsx"
        showLineNumbers={false}
      />
    </>
  );
}

// ============================================
// Use Cases Tab
// ============================================
function UseCases({
  sampleContent,
}: {
  sampleContent: Record<string, string>;
}) {
  const cases = [
    {
      id: "blog",
      title: "Blog Post Editor",
      description:
        "Full-featured editor for creating rich blog content with media support.",
      preset: "full" as const,
      height: 300,
      content: sampleContent.article,
    },
    {
      id: "comments",
      title: "Comment System",
      description:
        "Lightweight editor for user comments with basic formatting.",
      preset: "simple" as const,
      height: 150,
      content: "<p>Write your comment here...</p>",
    },
    {
      id: "docs",
      title: "Documentation",
      description:
        "Technical documentation with code blocks and structured content.",
      preset: "medium" as const,
      height: 250,
      content: sampleContent.code,
    },
    {
      id: "email",
      title: "Email Composer",
      description: "Email-friendly editor with clean HTML output.",
      preset: "medium" as const,
      height: 200,
      content:
        "<p>Hi there,</p><p>Thanks for reaching out! I wanted to follow up on our conversation...</p><p>Best regards</p>",
    },
  ];

  const [activeCase, setActiveCase] = useState(cases[0]);
  const [caseContent, setCaseContent] = useState(activeCase.content);

  const handleCaseChange = (caseItem: (typeof cases)[0]) => {
    setActiveCase(caseItem);
    setCaseContent(caseItem.content);
  };

  return (
    <div className="use-cases">
      <div className="use-cases-header">
        <h2>Real-World Use Cases</h2>
        <p>See how RTE Builder adapts to different application needs</p>
      </div>

      <div className="use-cases-nav">
        {cases.map((c) => (
          <button
            key={c.id}
            className={`use-case-btn ${activeCase.id === c.id ? "active" : ""}`}
            onClick={() => handleCaseChange(c)}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="use-case-content">
        <div className="use-case-info">
          <h3>{activeCase.title}</h3>
          <p>{activeCase.description}</p>
          <div className="use-case-meta">
            <span className={`preset-badge ${activeCase.preset}`}>
              {activeCase.preset} preset
            </span>
            <span className="height-badge">{activeCase.height}px height</span>
          </div>
        </div>

        <div className="use-case-editor">
          <RichTextEditor
            key={activeCase.id}
            value={caseContent}
            onChange={setCaseContent}
            toolbarPreset={activeCase.preset}
            height={activeCase.height}
          />
        </div>

        <CodeBlock
          code={`<RichTextEditor
  value={content}
  onChange={setContent}
  toolbarPreset="${activeCase.preset}"
  height={${activeCase.height}}
  placeholder="Write your ${activeCase.title.toLowerCase()}..."
/>`}
          language="tsx"
          filename={`${activeCase.id}-editor.tsx`}
          showLineNumbers={false}
        />
      </div>
    </div>
  );
}
