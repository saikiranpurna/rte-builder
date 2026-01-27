import { useState, useRef, useCallback } from "react";
import {
  UnifiedEditor,
  VersionHistoryProvider,
  VersionHistoryPanel,
  useVersionHistory,
} from "rte-builder";
import type { UnifiedEditorRef, Version, VersionAuthor } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";

// Mock current user
const currentUser: VersionAuthor = {
  id: "user-1",
  name: "John Doe",
};

// Mock initial versions for demo
const initialVersions: Version[] = [
  {
    id: "v-3",
    number: 3,
    title: "Added feature section",
    content: "<p>Updated content with features...</p>",
    textContent: "Updated content with features...",
    author: currentUser,
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
    author: { id: "user-2", name: "Jane Smith" },
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
    author: currentUser,
    createdAt: Date.now() - 7200000,
    wordCount: 20,
    characterCount: 100,
    isAutoSave: false,
    isPinned: false,
  },
];

function VersionControls() {
  const {
    state,
    createVersion,
    togglePanel,
    setAutoSave,
    getLatestVersion,
  } = useVersionHistory();

  const handleSaveVersion = () => {
    // In real implementation, get content from editor
    createVersion(
      "<p>Manually saved version</p>",
      undefined,
      { title: "Manual save", isAutoSave: false }
    );
  };

  const latest = getLatestVersion();

  return (
    <div className="version-controls">
      <div className="version-info">
        <span className="version-count">
          {state.versions.length} versions
        </span>
        {latest && (
          <span className="latest-version">
            Latest: {latest.title || `Version ${latest.number}`}
          </span>
        )}
      </div>
      <div className="version-actions">
        <label className="autosave-toggle">
          <input
            type="checkbox"
            checked={state.autoSaveEnabled}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          Auto-save
        </label>
        <button className="save-btn" onClick={handleSaveVersion}>
          Save Version
        </button>
        <button
          className="history-btn"
          onClick={() => togglePanel()}
        >
          {state.isPanelOpen ? "Hide" : "Show"} History
        </button>
      </div>
    </div>
  );
}

export default function VersionHistoryPage() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState(
    "<p>This is the current version of your document.</p><p>Make changes and they will be automatically saved as versions. You can also manually save versions with custom names.</p>"
  );
  const [showPanel] = useState(true);

  const getCurrentContent = useCallback(() => ({
    html: editorRef.current?.getContent() || "",
    text: editorRef.current?.getText() || "",
    json: editorRef.current?.getJSON(),
  }), []);

  const handleRestore = useCallback((version: Version) => {
    setContent(version.content);
  }, []);

  return (
    <div className="docs-page">
      <h1>Version History</h1>
      <p className="lead">
        Track changes and restore previous versions of your documents.
      </p>

      <h2>Features</h2>
      <ul>
        <li><strong>Auto-save</strong> - Automatically save versions at intervals</li>
        <li><strong>Manual Save</strong> - Save named versions at any time</li>
        <li><strong>Restore</strong> - Restore any previous version</li>
        <li><strong>Pin Versions</strong> - Pin important versions to prevent deletion</li>
        <li><strong>Compare</strong> - Compare differences between versions</li>
        <li><strong>Rename</strong> - Add meaningful names to versions</li>
      </ul>

      <h2>Basic Setup</h2>
      <CodeBlock language="tsx">{`import {
  UnifiedEditor,
  VersionHistoryProvider,
  VersionHistoryPanel
} from 'rte-builder'

function EditorWithHistory() {
  const editorRef = useRef(null)
  const [content, setContent] = useState('')

  const getCurrentContent = useCallback(() => ({
    html: editorRef.current?.getContent() || '',
    text: editorRef.current?.getText() || '',
    json: editorRef.current?.getJSON(),
  }), [])

  return (
    <VersionHistoryProvider
      config={{
        currentUser: {
          id: 'user-1',
          name: 'John Doe',
        },
        autoSave: true,
        autoSaveInterval: 60000, // 1 minute
        maxVersions: 100,
        onRestore: (version) => {
          setContent(version.content)
        },
        onSave: async (versions) => {
          // Persist versions to your backend
          await saveToServer(versions)
        },
        onLoad: async () => {
          // Load versions from your backend
          return await loadFromServer()
        },
      }}
      getCurrentContent={getCurrentContent}
      onVersionsChange={(versions) => console.log('Versions:', versions)}
    >
      <div style={{ display: 'flex', position: 'relative' }}>
        <UnifiedEditor
          ref={editorRef}
          value={content}
          onChange={setContent}
        />
        <VersionHistoryPanel position="right" />
      </div>
    </VersionHistoryProvider>
  )
}`}</CodeBlock>

      <h2>Live Demo</h2>
      <p>
        Make changes to the editor and watch versions being tracked. Try saving
        a manual version, pinning versions, and restoring previous content.
      </p>

      <div className="demo-container">
        <VersionHistoryProvider
          config={{
            currentUser,
            autoSave: true,
            autoSaveInterval: 30000,
            maxVersions: 50,
            onRestore: handleRestore,
          }}
          initialVersions={initialVersions}
          getCurrentContent={getCurrentContent}
          onVersionsChange={(versions) => console.log("Versions updated:", versions)}
        >
          <div className="version-demo">
            <VersionControls />

            <div className="version-layout">
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

      <h2>Configuration Options</h2>
      <table className="props-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>currentUser</code></td>
            <td><code>VersionAuthor</code></td>
            <td>Required</td>
            <td>Current user info for version attribution</td>
          </tr>
          <tr>
            <td><code>autoSave</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Enable automatic version saving</td>
          </tr>
          <tr>
            <td><code>autoSaveInterval</code></td>
            <td><code>number</code></td>
            <td><code>60000</code></td>
            <td>Auto-save interval in milliseconds</td>
          </tr>
          <tr>
            <td><code>maxVersions</code></td>
            <td><code>number</code></td>
            <td><code>100</code></td>
            <td>Maximum versions to keep</td>
          </tr>
          <tr>
            <td><code>onRestore</code></td>
            <td><code>(version) =&gt; void</code></td>
            <td>-</td>
            <td>Callback when a version is restored</td>
          </tr>
          <tr>
            <td><code>onSave</code></td>
            <td><code>(versions) =&gt; Promise</code></td>
            <td>-</td>
            <td>Callback to persist versions</td>
          </tr>
          <tr>
            <td><code>onLoad</code></td>
            <td><code>() =&gt; Promise</code></td>
            <td>-</td>
            <td>Callback to load versions</td>
          </tr>
        </tbody>
      </table>

      <h2>Using the Hook</h2>
      <CodeBlock language="tsx">{`import { useVersionHistory } from 'rte-builder'

function VersionManager() {
  const {
    state,
    createVersion,
    deleteVersion,
    restoreVersion,
    pinVersion,
    unpinVersion,
    compareVersions,
    togglePanel,
  } = useVersionHistory()

  // Create a new version
  const handleSave = () => {
    const version = createVersion(
      '<p>Content</p>',
      jsonContent,
      { title: 'My save point', isAutoSave: false }
    )
    console.log('Saved version:', version)
  }

  // Restore a version
  const handleRestore = (versionId) => {
    const content = restoreVersion(versionId)
    if (content) {
      // Update editor with restored content
      editor.setContent(content)
    }
  }

  // Compare two versions
  const handleCompare = (fromId, toId) => {
    const comparison = compareVersions(fromId, toId)
    console.log('Changes:', comparison?.changes)
    console.log('Stats:', comparison?.stats)
  }

  return (
    <div>
      <p>Total versions: {state.versions.length}</p>
      <p>Pinned: {state.versions.filter(v => v.isPinned).length}</p>
      <p>Auto-save: {state.autoSaveEnabled ? 'On' : 'Off'}</p>
    </div>
  )
}`}</CodeBlock>

      <h2>Version Structure</h2>
      <CodeBlock language="typescript">{`interface Version {
  id: string
  number: number
  title?: string
  description?: string
  content: string          // HTML content
  jsonContent?: unknown    // JSON representation
  textContent: string      // Plain text
  author: VersionAuthor
  createdAt: number
  wordCount: number
  characterCount: number
  isAutoSave: boolean
  isPinned: boolean
  tags?: string[]
}

interface VersionComparison {
  fromVersionId: string
  toVersionId: string
  changes: VersionChange[]
  stats: {
    additions: number
    deletions: number
    modifications: number
  }
}`}</CodeBlock>

      <style>{`
        .version-demo {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        .version-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        .version-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .version-count {
          font-weight: 600;
          color: var(--text-primary);
        }
        .latest-version {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .version-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .autosave-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          cursor: pointer;
        }
        .save-btn,
        .history-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--border-color);
        }
        .save-btn {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        .history-btn {
          background: white;
        }
        .version-layout {
          display: flex;
          position: relative;
          min-height: 350px;
        }
        .editor-area {
          flex: 1;
        }
        .panel-area {
          width: 360px;
          border-left: 1px solid var(--border-color);
          position: relative;
        }
        .panel-area .rte-version-panel {
          position: relative;
          height: 100%;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
