import { useState, useRef, useCallback } from "react";
import {
  RichTextEditor,
  EditorRef,
  UnifiedEditor,
  CommentsProvider,
  CommentsPanel,
  useComments,
  VersionHistoryProvider,
  VersionHistoryPanel,
  useVersionHistory,
  CollaborationProvider,
  PresenceIndicator,
} from "rte-builder";
import type {
  UnifiedEditorRef,
  CommentThread,
  CommentAuthor,
  Version,
  VersionAuthor,
  CollaborationUser,
  CollaborationStatus,
} from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";

type PlaygroundTab = "interactive" | "collaboration" | "comments" | "versions" | "presets";

const sampleContent = {
  rich: `<h2>Welcome to the Playground!</h2>
<p>This is a <strong>fully interactive</strong> demo where you can explore all the features of RTE Builder.</p>
<ul>
  <li>Test different toolbar presets</li>
  <li>Try collaborative editing features</li>
  <li>Explore comments and annotations</li>
  <li>Check out version history</li>
</ul>
<blockquote><p>Explore the new v2.0 features above!</p></blockquote>`,

  minimal: `<p>A clean, minimal editor for simple text input.</p>`,

  collaboration: `<p>Welcome to the collaborative editor! This document can be edited by multiple users simultaneously.</p>
<p>Try out the real-time collaboration features:</p>
<ul>
  <li>See presence indicators showing who's online</li>
  <li>Watch cursor positions in real-time</li>
  <li>Experience synchronized editing</li>
</ul>`,

  comments: `<p>Welcome to the comments demo!</p>
<p>This editor supports inline comments and annotations. Select any text and add a comment to start a discussion.</p>
<p>Features include threaded replies, reactions, and resolution tracking.</p>`,

  versions: `<p>This is the version history demo.</p>
<p>Make changes to this document and watch versions being tracked automatically. You can:</p>
<ul>
  <li>Save named versions manually</li>
  <li>Pin important versions</li>
  <li>Restore previous versions</li>
  <li>Compare differences</li>
</ul>`,
};

export default function Playground() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("interactive");

  const tabs = [
    { id: "interactive" as const, label: "Interactive Editor", icon: "play" },
    { id: "collaboration" as const, label: "Collaboration", icon: "users", badge: "v2.0" },
    { id: "comments" as const, label: "Comments", icon: "message", badge: "v2.1" },
    { id: "versions" as const, label: "Version History", icon: "history", badge: "v2.2" },
    { id: "presets" as const, label: "Presets", icon: "grid" },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "play":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        );
      case "users":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case "message":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case "history":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case "grid":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page playground-full-page">
      <div className="playground-hero">
        <div className="playground-hero-content">
          <span className="playground-hero-badge">Interactive Playground</span>
          <h1>Explore RTE Builder</h1>
          <p>
            Test all editor features including the new v2.0 collaboration, comments,
            and version history capabilities.
          </p>
        </div>
      </div>

      <div className="playground-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`playground-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {renderIcon(tab.icon)}
            <span>{tab.label}</span>
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>

      <div className="playground-content">
        {activeTab === "interactive" && <InteractiveEditor sampleContent={sampleContent.rich} />}
        {activeTab === "collaboration" && <CollaborationDemo />}
        {activeTab === "comments" && <CommentsDemo />}
        {activeTab === "versions" && <VersionHistoryDemo />}
        {activeTab === "presets" && <PresetComparison sampleContent={sampleContent.minimal} />}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
                <span className="toggle-switch"></span>
                Read Only
              </label>
            </div>
            <div className="toggle-row">
              <label className="toggle-label">
                <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
                <span className="toggle-switch"></span>
                Disabled
              </label>
            </div>
            <div className="toggle-row">
              <label className="toggle-label">
                <input type="checkbox" checked={showCharCounter} onChange={(e) => setShowCharCounter(e.target.checked)} />
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Quick Actions
          </h3>
          <div className="action-grid">
            <button className="action-btn" onClick={() => editorRef.current?.focus()}>
              Focus
            </button>
            <button className="action-btn" onClick={() => editorRef.current?.clear()}>
              Clear
            </button>
            <button className="action-btn" onClick={() => editorRef.current?.insertHTML("<p><strong>Inserted!</strong></p>")}>
              Insert
            </button>
            <button className="action-btn" onClick={() => navigator.clipboard.writeText(editorRef.current?.getContent() || content)}>
              Copy
            </button>
            <button className="action-btn" onClick={() => editorRef.current?.toggleFullscreen()}>
              Fullscreen
            </button>
            <button className="action-btn" onClick={() => editorRef.current?.print()}>
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
              <button className={`output-tab ${outputMode === "html" ? "active" : ""}`} onClick={() => setOutputMode("html")}>
                HTML Output
              </button>
              <button className={`output-tab ${outputMode === "preview" ? "active" : ""}`} onClick={() => setOutputMode("preview")}>
                Preview
              </button>
            </div>
          </div>

          {outputMode === "html" ? (
            <pre className="output-code">{content}</pre>
          ) : (
            <div className="output-preview" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>

        <div className="generated-code-section">
          <h4>Generated Component Code</h4>
          <CodeBlock code={generatedCode} language="tsx" showLineNumbers={false} />
        </div>
      </main>
    </div>
  );
}

// ============================================
// Collaboration Demo Tab
// ============================================
function CollaborationDemo() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState(sampleContent.collaboration);
  const [status, setStatus] = useState<CollaborationStatus>("disconnected");
  const [, setUsers] = useState<CollaborationUser[]>([]);

  const mockUsers: CollaborationUser[] = [
    { id: "1", name: "Alice Chen", color: "#3b82f6", isActive: true, lastActive: Date.now() },
    { id: "2", name: "Bob Smith", color: "#22c55e", isActive: true, lastActive: Date.now() },
    { id: "3", name: "Carol Davis", color: "#f59e0b", isActive: false, lastActive: Date.now() - 60000 },
  ];

  const handleConnect = () => setStatus("connected");
  const handleDisconnect = () => setStatus("disconnected");

  return (
    <div className="feature-demo-layout">
      <div className="feature-demo-header">
        <div className="feature-demo-info">
          <h2>Real-time Collaboration</h2>
          <p>
            Enable multiple users to edit documents simultaneously with presence indicators,
            cursor tracking, and synchronized content.
          </p>
          <div className="feature-badges">
            <span className="feature-badge new">v2.0 Feature</span>
            <span className="feature-badge">WebSocket Ready</span>
            <span className="feature-badge">CRDT Support</span>
          </div>
        </div>
      </div>

      <div className="demo-container collaboration-container">
        <CollaborationProvider
          config={{
            provider: "custom",
            roomId: "playground-room",
            user: { id: "current-user", name: "You", color: "#8b5cf6" },
          }}
          onStatusChange={setStatus}
          onUsersChange={setUsers}
        >
          <div className="collab-demo-wrapper">
            <div className="collab-header">
              <div className="collab-presence">
                <PresenceIndicator maxAvatars={5} />
                <div className="mock-users">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`mock-user-avatar ${user.isActive ? "active" : ""}`}
                      style={{ backgroundColor: user.color }}
                      title={`${user.name}${user.isActive ? " (active)" : " (away)"}`}
                    >
                      {user.name.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="collab-controls">
                <span className={`status-indicator status-${status}`}>
                  <span className="status-dot"></span>
                  {status}
                </span>
                {status === "disconnected" ? (
                  <button className="collab-btn connect" onClick={handleConnect}>
                    Connect
                  </button>
                ) : (
                  <button className="collab-btn disconnect" onClick={handleDisconnect}>
                    Disconnect
                  </button>
                )}
              </div>
            </div>

            <UnifiedEditor
              ref={editorRef}
              value={content}
              onChange={setContent}
              toolbar="full"
              height={300}
            />
          </div>
        </CollaborationProvider>
      </div>

      <div className="code-example">
        <h4>Implementation Example</h4>
        <CodeBlock
          code={`import { UnifiedEditor, CollaborationProvider, PresenceIndicator } from 'rte-builder'

function CollaborativeEditor() {
  return (
    <CollaborationProvider
      config={{
        provider: 'websocket',
        serverUrl: 'wss://your-server.com/collab',
        roomId: 'document-123',
        user: { id: 'user-1', name: 'John', color: '#3b82f6' },
        autoReconnect: true,
      }}
      onStatusChange={(status) => console.log('Status:', status)}
      onUsersChange={(users) => console.log('Active users:', users)}
    >
      <PresenceIndicator maxAvatars={5} />
      <UnifiedEditor value={content} onChange={setContent} toolbar="full" />
    </CollaborationProvider>
  )
}`}
          language="tsx"
          filename="CollaborativeEditor.tsx"
        />
      </div>
    </div>
  );
}

// ============================================
// Comments Demo Tab
// ============================================
const currentUser: CommentAuthor = {
  id: "user-1",
  name: "Demo User",
  avatar: undefined,
};

const initialThreads: CommentThread[] = [
  {
    id: "thread-1",
    range: { from: 0, to: 25, text: "Welcome to the comments" },
    comments: [
      {
        id: "comment-1",
        threadId: "thread-1",
        content: "This is a great introduction! Consider adding more examples.",
        author: { id: "user-2", name: "Alice Chen" },
        createdAt: Date.now() - 3600000,
        isEdited: false,
        reactions: [{ emoji: "👍", users: [{ id: "user-3", name: "Bob" }] }],
      },
      {
        id: "comment-2",
        threadId: "thread-1",
        content: "I agree! A video tutorial would be helpful too.",
        author: currentUser,
        createdAt: Date.now() - 1800000,
        isEdited: false,
      },
    ],
    status: "open",
    createdAt: Date.now() - 3600000,
  },
];

function AddCommentButton() {
  const { createThread, togglePanel, state } = useComments();

  const handleAddComment = () => {
    const mockRange = { from: 50, to: 80, text: "Selected text for comment" };
    createThread(mockRange, "This is a new comment on the selected text.");
    togglePanel(true);
  };

  return (
    <button className="add-comment-btn" onClick={handleAddComment}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="8" x2="12" y2="14"></line>
        <line x1="9" y1="11" x2="15" y2="11"></line>
      </svg>
      Add Comment ({state.threads.length})
    </button>
  );
}

function CommentsDemo() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState(sampleContent.comments);
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="feature-demo-layout">
      <div className="feature-demo-header">
        <div className="feature-demo-info">
          <h2>Comments & Annotations</h2>
          <p>
            Add inline comments and annotations to collaborate on document reviews.
            Features threaded discussions, reactions, and resolution tracking.
          </p>
          <div className="feature-badges">
            <span className="feature-badge new">v2.1 Feature</span>
            <span className="feature-badge">Threaded Replies</span>
            <span className="feature-badge">Reactions</span>
          </div>
        </div>
      </div>

      <div className="demo-container comments-container">
        <CommentsProvider
          config={{
            currentUser,
            allowResolve: true,
            allowDelete: true,
            allowEdit: true,
            allowReactions: true,
          }}
          initialThreads={initialThreads}
          onThreadsChange={(threads) => console.log("Threads updated:", threads)}
        >
          <div className="comments-demo-wrapper">
            <div className="comments-toolbar">
              <AddCommentButton />
              <button className="toggle-panel-btn" onClick={() => setShowPanel(!showPanel)}>
                {showPanel ? "Hide" : "Show"} Panel
              </button>
            </div>

            <div className="comments-layout">
              <div className="editor-area">
                <UnifiedEditor
                  ref={editorRef}
                  value={content}
                  onChange={setContent}
                  toolbar="medium"
                  height={300}
                />
              </div>

              {showPanel && (
                <div className="panel-area">
                  <CommentsPanel position="right" />
                </div>
              )}
            </div>
          </div>
        </CommentsProvider>
      </div>

      <div className="code-example">
        <h4>Implementation Example</h4>
        <CodeBlock
          code={`import { UnifiedEditor, CommentsProvider, CommentsPanel, useComments } from 'rte-builder'

function EditorWithComments() {
  return (
    <CommentsProvider
      config={{
        currentUser: { id: 'user-1', name: 'John Doe' },
        allowResolve: true,
        allowReactions: true,
        onSave: async (threads) => await saveToServer(threads),
      }}
      onThreadsChange={(threads) => console.log('Threads:', threads)}
    >
      <div style={{ display: 'flex' }}>
        <UnifiedEditor value={content} onChange={setContent} />
        <CommentsPanel position="right" />
      </div>
    </CommentsProvider>
  )
}`}
          language="tsx"
          filename="EditorWithComments.tsx"
        />
      </div>
    </div>
  );
}

// ============================================
// Version History Demo Tab
// ============================================
const versionUser: VersionAuthor = {
  id: "user-1",
  name: "Demo User",
};

const initialVersions: Version[] = [
  {
    id: "v-3",
    number: 3,
    title: "Added feature section",
    content: "<p>Updated content with new features...</p>",
    textContent: "Updated content with new features...",
    author: versionUser,
    createdAt: Date.now() - 1800000,
    wordCount: 50,
    characterCount: 250,
    isAutoSave: false,
    isPinned: true,
  },
  {
    id: "v-2",
    number: 2,
    content: "<p>Second draft of the document...</p>",
    textContent: "Second draft of the document...",
    author: { id: "user-2", name: "Alice Chen" },
    createdAt: Date.now() - 3600000,
    wordCount: 35,
    characterCount: 180,
    isAutoSave: true,
    isPinned: false,
  },
  {
    id: "v-1",
    number: 1,
    title: "Initial version",
    content: "<p>First version of the document.</p>",
    textContent: "First version of the document.",
    author: versionUser,
    createdAt: Date.now() - 7200000,
    wordCount: 20,
    characterCount: 100,
    isAutoSave: false,
    isPinned: false,
  },
];

function VersionControls() {
  const { state, createVersion, togglePanel, setAutoSave, getLatestVersion } = useVersionHistory();

  const handleSaveVersion = () => {
    createVersion("<p>Manually saved version</p>", undefined, { title: "Manual save", isAutoSave: false });
  };

  const latest = getLatestVersion();

  return (
    <div className="version-controls">
      <div className="version-info">
        <span className="version-count">{state.versions.length} versions</span>
        {latest && <span className="latest-version">Latest: {latest.title || `Version ${latest.number}`}</span>}
      </div>
      <div className="version-actions">
        <label className="autosave-toggle">
          <input type="checkbox" checked={state.autoSaveEnabled} onChange={(e) => setAutoSave(e.target.checked)} />
          <span className="toggle-switch small"></span>
          Auto-save
        </label>
        <button className="save-version-btn" onClick={handleSaveVersion}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Version
        </button>
        <button className="toggle-history-btn" onClick={() => togglePanel()}>
          {state.isPanelOpen ? "Hide" : "Show"} History
        </button>
      </div>
    </div>
  );
}

function VersionHistoryDemo() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState(sampleContent.versions);
  const [showPanel] = useState(true);

  const getCurrentContent = useCallback(
    () => ({
      html: editorRef.current?.getContent() || "",
      text: editorRef.current?.getText() || "",
      json: editorRef.current?.getJSON(),
    }),
    []
  );

  const handleRestore = useCallback((version: Version) => {
    setContent(version.content);
  }, []);

  return (
    <div className="feature-demo-layout">
      <div className="feature-demo-header">
        <div className="feature-demo-info">
          <h2>Version History</h2>
          <p>
            Track changes and restore previous versions of your documents.
            Includes auto-save, pinning, and version comparison.
          </p>
          <div className="feature-badges">
            <span className="feature-badge new">v2.2 Feature</span>
            <span className="feature-badge">Auto-save</span>
            <span className="feature-badge">Diff Comparison</span>
          </div>
        </div>
      </div>

      <div className="demo-container versions-container">
        <VersionHistoryProvider
          config={{
            currentUser: versionUser,
            autoSave: true,
            autoSaveInterval: 30000,
            maxVersions: 50,
            onRestore: handleRestore,
          }}
          initialVersions={initialVersions}
          getCurrentContent={getCurrentContent}
          onVersionsChange={(versions) => console.log("Versions updated:", versions)}
        >
          <div className="versions-demo-wrapper">
            <VersionControls />

            <div className="versions-layout">
              <div className="editor-area">
                <UnifiedEditor
                  ref={editorRef}
                  value={content}
                  onChange={setContent}
                  toolbar="medium"
                  height={300}
                />
              </div>

              {showPanel && (
                <div className="panel-area">
                  <VersionHistoryPanel position="right" />
                </div>
              )}
            </div>
          </div>
        </VersionHistoryProvider>
      </div>

      <div className="code-example">
        <h4>Implementation Example</h4>
        <CodeBlock
          code={`import { UnifiedEditor, VersionHistoryProvider, VersionHistoryPanel } from 'rte-builder'

function EditorWithHistory() {
  const editorRef = useRef(null)

  const getCurrentContent = useCallback(() => ({
    html: editorRef.current?.getContent() || '',
    text: editorRef.current?.getText() || '',
  }), [])

  return (
    <VersionHistoryProvider
      config={{
        currentUser: { id: 'user-1', name: 'John Doe' },
        autoSave: true,
        autoSaveInterval: 60000,
        onRestore: (version) => setContent(version.content),
      }}
      getCurrentContent={getCurrentContent}
    >
      <div style={{ display: 'flex' }}>
        <UnifiedEditor ref={editorRef} value={content} onChange={setContent} />
        <VersionHistoryPanel position="right" />
      </div>
    </VersionHistoryProvider>
  )
}`}
          language="tsx"
          filename="EditorWithHistory.tsx"
        />
      </div>
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

  const presets = [
    {
      id: "simple",
      name: "Simple",
      description: "Basic formatting for comments and quick inputs",
      features: ["Bold", "Italic", "Links", "Lists"],
      color: "#22c55e",
    },
    {
      id: "medium",
      name: "Medium",
      description: "Extended formatting for blog posts and articles",
      features: ["Headings", "Blockquote", "Code", "Alignment"],
      color: "#3b82f6",
    },
    {
      id: "full",
      name: "Full",
      description: "Complete feature set for CMS and documentation",
      features: ["Tables", "Media", "Colors", "All Features"],
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="preset-comparison">
      <div className="comparison-header">
        <h2>Toolbar Presets</h2>
        <p>Compare all three toolbar presets side by side. Each preset is designed for different use cases.</p>
      </div>

      <div className="preset-grid">
        {presets.map((preset) => (
          <div key={preset.id} className="preset-card">
            <div className="preset-card-header" style={{ borderColor: preset.color }}>
              <h3>{preset.name}</h3>
              <span className="preset-badge" style={{ backgroundColor: preset.color }}>
                {preset.id === "simple" ? "Minimal" : preset.id === "medium" ? "Balanced" : "Complete"}
              </span>
            </div>
            <p className="preset-description">{preset.description}</p>
            <div className="preset-features">
              {preset.features.map((feature) => (
                <span key={feature} className="preset-feature" style={{ borderColor: preset.color }}>
                  {feature}
                </span>
              ))}
            </div>
            <div className="preset-editor">
              <RichTextEditor
                value={contents[preset.id as keyof typeof contents]}
                onChange={(v) => setContents((prev) => ({ ...prev, [preset.id]: v }))}
                toolbarPreset={preset.id as "simple" | "medium" | "full"}
                height={200}
                placeholder={`${preset.name} editor...`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="preset-code-examples">
        <h3>Quick Implementation</h3>
        <div className="code-examples-grid">
          {presets.map((preset) => (
            <CodeBlock
              key={preset.id}
              code={`<RichTextEditor
  toolbarPreset="${preset.id}"
  // Perfect for: ${preset.description.toLowerCase()}
/>`}
              language="tsx"
              filename={`${preset.id}-preset.tsx`}
              showLineNumbers={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
