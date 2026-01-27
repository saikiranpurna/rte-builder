import { useState, useRef } from "react";
import {
  UnifiedEditor,
  CommentsProvider,
  CommentsPanel,
  useComments,
} from "rte-builder";
import type { UnifiedEditorRef, CommentThread, CommentAuthor } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";

// Mock current user
const currentUser: CommentAuthor = {
  id: "user-1",
  name: "John Doe",
  avatar: undefined,
};

// Mock initial threads for demo
const initialThreads: CommentThread[] = [
  {
    id: "thread-1",
    range: { from: 0, to: 20, text: "Welcome to the editor" },
    comments: [
      {
        id: "comment-1",
        threadId: "thread-1",
        content: "Great introduction! Consider adding more context about the features.",
        author: { id: "user-2", name: "Jane Smith" },
        createdAt: Date.now() - 3600000,
        isEdited: false,
        reactions: [{ emoji: "👍", users: [{ id: "user-3", name: "Bob" }] }],
      },
      {
        id: "comment-2",
        threadId: "thread-1",
        content: "Agreed! Maybe add a video tutorial too.",
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
    // In real implementation, get selection from editor
    const mockRange = {
      from: 50,
      to: 80,
      text: "Selected text for comment",
    };

    createThread(mockRange, "This is a new comment on the selected text.");
    togglePanel(true);
  };

  return (
    <button
      className="add-comment-btn"
      onClick={handleAddComment}
      title="Add comment"
    >
      💬 Add Comment ({state.threads.length})
    </button>
  );
}

export default function Comments() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState(
    "<p>Welcome to the editor with comments and annotations support!</p><p>Select any text and add a comment to start a discussion. Comments can have replies, reactions, and can be resolved when the discussion is complete.</p>"
  );
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="docs-page">
      <h1>Comments & Annotations</h1>
      <p className="lead">
        Add inline comments and annotations to collaborate on document reviews.
      </p>

      <h2>Features</h2>
      <ul>
        <li><strong>Threaded Comments</strong> - Start discussions on any text selection</li>
        <li><strong>Replies</strong> - Reply to comments in a thread</li>
        <li><strong>Reactions</strong> - React with emojis to comments</li>
        <li><strong>Resolve/Reopen</strong> - Mark threads as resolved when done</li>
        <li><strong>Edit/Delete</strong> - Modify or remove your comments</li>
        <li><strong>Filters</strong> - View all, open, or resolved comments</li>
      </ul>

      <h2>Basic Setup</h2>
      <CodeBlock language="tsx">{`import {
  UnifiedEditor,
  CommentsProvider,
  CommentsPanel
} from 'rte-builder'

function EditorWithComments() {
  const [content, setContent] = useState('')

  return (
    <CommentsProvider
      config={{
        currentUser: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'https://...',
        },
        allowResolve: true,
        allowDelete: true,
        allowEdit: true,
        allowReactions: true,
        reactionEmojis: ['👍', '👎', '❤️', '🎉', '😄', '😕'],
        onSave: async (threads) => {
          // Persist threads to your backend
          await saveToServer(threads)
        },
        onLoad: async () => {
          // Load threads from your backend
          return await loadFromServer()
        },
      }}
      onThreadsChange={(threads) => console.log('Threads:', threads)}
    >
      <div style={{ display: 'flex', position: 'relative' }}>
        <UnifiedEditor
          value={content}
          onChange={setContent}
          toolbar="full"
        />
        <CommentsPanel position="right" />
      </div>
    </CommentsProvider>
  )
}`}</CodeBlock>

      <h2>Live Demo</h2>
      <p>
        Try adding comments, replying, and resolving threads. Click "Add Comment"
        to create a new comment thread.
      </p>

      <div className="demo-container">
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
          <div className="comments-demo">
            <div className="comments-toolbar">
              <AddCommentButton />
              <button
                className="toggle-panel-btn"
                onClick={() => setShowPanel(!showPanel)}
              >
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
            <td><code>CommentAuthor</code></td>
            <td>Required</td>
            <td>Current user info for adding comments</td>
          </tr>
          <tr>
            <td><code>allowResolve</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow resolving/reopening threads</td>
          </tr>
          <tr>
            <td><code>allowDelete</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow deleting comments and threads</td>
          </tr>
          <tr>
            <td><code>allowEdit</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow editing own comments</td>
          </tr>
          <tr>
            <td><code>allowReactions</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow adding reactions to comments</td>
          </tr>
          <tr>
            <td><code>reactionEmojis</code></td>
            <td><code>string[]</code></td>
            <td>Default set</td>
            <td>Available reaction emojis</td>
          </tr>
          <tr>
            <td><code>onSave</code></td>
            <td><code>(threads) =&gt; Promise</code></td>
            <td>-</td>
            <td>Callback to persist threads</td>
          </tr>
          <tr>
            <td><code>onLoad</code></td>
            <td><code>() =&gt; Promise</code></td>
            <td>-</td>
            <td>Callback to load threads</td>
          </tr>
        </tbody>
      </table>

      <h2>Using the Hook</h2>
      <CodeBlock language="tsx">{`import { useComments } from 'rte-builder'

function CommentControls() {
  const {
    state,
    createThread,
    addComment,
    resolveThread,
    togglePanel,
    getFilteredThreads,
  } = useComments()

  // Create a new thread on selected text
  const handleCreateThread = (range, initialComment) => {
    const thread = createThread(range, initialComment)
    console.log('Created thread:', thread)
  }

  // Add a reply to a thread
  const handleReply = (threadId, content) => {
    const comment = addComment(threadId, content)
    console.log('Added comment:', comment)
  }

  return (
    <div>
      <p>Total threads: {state.threads.length}</p>
      <p>Open: {state.threads.filter(t => t.status === 'open').length}</p>
      <p>Resolved: {state.threads.filter(t => t.status === 'resolved').length}</p>

      <button onClick={() => togglePanel()}>
        {state.isPanelOpen ? 'Hide' : 'Show'} Panel
      </button>
    </div>
  )
}`}</CodeBlock>

      <h2>Comment Thread Structure</h2>
      <CodeBlock language="typescript">{`interface CommentThread {
  id: string
  range: {
    from: number
    to: number
    text: string
  }
  comments: Comment[]
  status: 'open' | 'resolved'
  createdAt: number
  resolvedAt?: number
  resolvedBy?: CommentAuthor
}

interface Comment {
  id: string
  threadId: string
  content: string
  author: CommentAuthor
  createdAt: number
  updatedAt?: number
  isEdited: boolean
  reactions?: CommentReaction[]
}`}</CodeBlock>

      <style>{`
        .comments-demo {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        .comments-toolbar {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        .add-comment-btn,
        .toggle-panel-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: white;
        }
        .add-comment-btn:hover,
        .toggle-panel-btn:hover {
          background: var(--bg-secondary);
        }
        .comments-layout {
          display: flex;
          position: relative;
          min-height: 350px;
        }
        .editor-area {
          flex: 1;
        }
        .panel-area {
          width: 320px;
          border-left: 1px solid var(--border-color);
          position: relative;
        }
        .panel-area .rte-comments-panel {
          position: relative;
          height: 100%;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
