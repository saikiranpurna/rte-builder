import { useState, useRef } from "react";
import {
  UnifiedEditor,
  CollaborationProvider,
  PresenceIndicator,
} from "rte-builder";
import type { UnifiedEditorRef, CollaborationStatus, CollaborationUser } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";

export default function Collaboration() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState("<p>Start collaborating...</p>");
  const [status, setStatus] = useState<CollaborationStatus>("disconnected");
  const [, setUsers] = useState<CollaborationUser[]>([]);

  // Mock users for demo
  const mockUsers: CollaborationUser[] = [
    { id: "1", name: "John Doe", color: "#3b82f6", isActive: true, lastActive: Date.now() },
    { id: "2", name: "Jane Smith", color: "#22c55e", isActive: true, lastActive: Date.now() },
    { id: "3", name: "Bob Wilson", color: "#f59e0b", isActive: false, lastActive: Date.now() - 60000 },
  ];

  return (
    <div className="docs-page">
      <h1>Collaborative Editing</h1>
      <p className="lead">
        Enable real-time collaboration with presence indicators and synchronized editing.
      </p>

      <div className="callout callout-info">
        <strong>Note:</strong> Full collaboration requires a WebSocket server. This demo shows
        the UI components and how to integrate them.
      </div>

      <h2>Features</h2>
      <ul>
        <li><strong>Real-time Sync</strong> - Document changes sync instantly across all users</li>
        <li><strong>Presence Indicators</strong> - See who's currently editing the document</li>
        <li><strong>User Cursors</strong> - Track where other users are editing</li>
        <li><strong>Auto-reconnect</strong> - Handles network disconnections gracefully</li>
      </ul>

      <h2>Basic Setup</h2>
      <CodeBlock language="tsx">{`import {
  UnifiedEditor,
  CollaborationProvider,
  PresenceIndicator
} from 'rte-builder'

function CollaborativeEditor() {
  const [content, setContent] = useState('')

  return (
    <CollaborationProvider
      config={{
        provider: 'websocket',
        serverUrl: 'wss://your-server.com/collab',
        roomId: 'document-123',
        user: {
          id: 'user-1',
          name: 'John Doe',
          color: '#3b82f6',
        },
        autoReconnect: true,
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
      }}
      onStatusChange={(status) => console.log('Status:', status)}
      onUsersChange={(users) => console.log('Users:', users)}
    >
      <PresenceIndicator />
      <UnifiedEditor
        value={content}
        onChange={setContent}
        toolbar="full"
      />
    </CollaborationProvider>
  )
}`}</CodeBlock>

      <h2>Live Demo</h2>
      <p>
        This demo shows the presence indicator with mock users. In production,
        connect to your WebSocket server to enable real-time collaboration.
      </p>

      <div className="demo-container">
        <CollaborationProvider
          config={{
            provider: "custom",
            roomId: "demo-room",
            user: {
              id: "current-user",
              name: "You",
              color: "#8b5cf6",
            },
          }}
          onStatusChange={setStatus}
          onUsersChange={setUsers}
        >
          <div className="collaboration-demo">
            <div className="collab-header">
              <PresenceIndicator maxAvatars={5} />
              <div className="collab-status">
                <span className={`status-badge status-${status}`}>
                  {status}
                </span>
              </div>
            </div>

            {/* Mock presence for demo */}
            <div className="mock-presence">
              <span className="mock-label">Demo Users:</span>
              <div className="mock-avatars">
                {mockUsers.map(user => (
                  <div
                    key={user.id}
                    className="mock-avatar"
                    style={{ backgroundColor: user.color }}
                    title={user.name}
                  >
                    {user.name.charAt(0)}
                  </div>
                ))}
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

      <h2>Configuration Options</h2>
      <table className="props-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>provider</code></td>
            <td><code>'websocket' | 'webrtc' | 'custom'</code></td>
            <td>The collaboration provider type</td>
          </tr>
          <tr>
            <td><code>serverUrl</code></td>
            <td><code>string</code></td>
            <td>WebSocket server URL for collaboration</td>
          </tr>
          <tr>
            <td><code>roomId</code></td>
            <td><code>string</code></td>
            <td>Unique identifier for the collaborative session</td>
          </tr>
          <tr>
            <td><code>user</code></td>
            <td><code>CollaborationUser</code></td>
            <td>Current user information (id, name, color)</td>
          </tr>
          <tr>
            <td><code>token</code></td>
            <td><code>string</code></td>
            <td>Authentication token for the server</td>
          </tr>
          <tr>
            <td><code>autoReconnect</code></td>
            <td><code>boolean</code></td>
            <td>Automatically reconnect on disconnect</td>
          </tr>
          <tr>
            <td><code>reconnectInterval</code></td>
            <td><code>number</code></td>
            <td>Milliseconds between reconnection attempts</td>
          </tr>
          <tr>
            <td><code>maxReconnectAttempts</code></td>
            <td><code>number</code></td>
            <td>Maximum number of reconnection attempts</td>
          </tr>
        </tbody>
      </table>

      <h2>Using the Hook</h2>
      <CodeBlock language="tsx">{`import { useCollaboration } from 'rte-builder'

function CustomPresence() {
  const { state, connect, disconnect, updateCursor } = useCollaboration()

  return (
    <div>
      <p>Status: {state.status}</p>
      <p>Users: {state.users.length}</p>

      {state.users.map(user => (
        <div key={user.id}>
          <span style={{ color: user.color }}>{user.name}</span>
          {user.isActive && <span> (active)</span>}
        </div>
      ))}

      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}`}</CodeBlock>

      <h2>Server Requirements</h2>
      <p>
        To enable full collaboration, you need a WebSocket server that handles:
      </p>
      <ul>
        <li>User authentication and room management</li>
        <li>Document state synchronization (using CRDT like Yjs)</li>
        <li>Presence and cursor position broadcasting</li>
        <li>Conflict resolution</li>
      </ul>

      <div className="callout callout-tip">
        <strong>Recommended:</strong> Use{" "}
        <a href="https://docs.yjs.dev/" target="_blank" rel="noopener noreferrer">
          Yjs
        </a>{" "}
        with{" "}
        <a href="https://tiptap.dev/hocuspocus" target="_blank" rel="noopener noreferrer">
          Hocuspocus
        </a>{" "}
        for a production-ready collaboration server.
      </div>

      <style>{`
        .collaboration-demo {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        .collab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        .collab-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }
        .status-connected { background: #dcfce7; color: #15803d; }
        .status-connecting { background: #fef3c7; color: #92400e; }
        .status-disconnected { background: #f3f4f6; color: #6b7280; }
        .status-reconnecting { background: #fee2e2; color: #dc2626; }
        .mock-presence {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #f9fafb;
          border-bottom: 1px solid var(--border-color);
        }
        .mock-label {
          font-size: 12px;
          color: #6b7280;
        }
        .mock-avatars {
          display: flex;
          gap: 4px;
        }
        .mock-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
