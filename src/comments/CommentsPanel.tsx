/**
 * Comments Panel Component
 * Displays comment threads with reply functionality
 */

import { useState } from 'react'
import { useCommentsOptional } from './CommentsContext'
import type { CommentThread, Comment as CommentType } from './types'
import { DEFAULT_REACTION_EMOJIS } from './types'

interface CommentsPanelProps {
  /** Panel position */
  position?: 'left' | 'right'
  /** Custom class name */
  className?: string
}

/** Format relative time */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return new Date(timestamp).toLocaleDateString()
}

/** Single comment component */
function CommentItem({
  comment,
  threadId,
  isFirst,
}: {
  comment: CommentType
  threadId: string
  isFirst: boolean
}) {
  const comments = useCommentsOptional()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReactions, setShowReactions] = useState(false)

  if (!comments) return null

  const { config, updateComment, deleteComment, addReaction, removeReaction, state } = comments
  const canEdit = config?.allowEdit !== false && comment.author.id === state.currentUser?.id
  const canDelete = config?.allowDelete !== false && comment.author.id === state.currentUser?.id
  const canReact = config?.allowReactions !== false
  const reactionEmojis = config?.reactionEmojis ?? DEFAULT_REACTION_EMOJIS

  const handleSaveEdit = () => {
    updateComment(threadId, comment.id, editContent)
    setIsEditing(false)
  }

  const handleToggleReaction = (emoji: string) => {
    const reaction = comment.reactions?.find(r => r.emoji === emoji)
    const hasReacted = reaction?.users.some(u => u.id === state.currentUser?.id)

    if (hasReacted) {
      removeReaction(threadId, comment.id, emoji)
    } else {
      addReaction(threadId, comment.id, emoji)
    }
    setShowReactions(false)
  }

  return (
    <div className={`rte-comment ${isFirst ? 'rte-comment-first' : ''}`}>
      <div className="rte-comment-header">
        <div className="rte-comment-author">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="rte-comment-avatar" />
          ) : (
            <div className="rte-comment-avatar-placeholder">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="rte-comment-author-name">{comment.author.name}</span>
        </div>
        <span className="rte-comment-time">
          {formatRelativeTime(comment.createdAt)}
          {comment.isEdited && ' (edited)'}
        </span>
      </div>

      {isEditing ? (
        <div className="rte-comment-edit">
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            className="rte-comment-edit-input"
          />
          <div className="rte-comment-edit-actions">
            <button onClick={handleSaveEdit} className="rte-comment-btn-save">Save</button>
            <button onClick={() => setIsEditing(false)} className="rte-comment-btn-cancel">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="rte-comment-content" dangerouslySetInnerHTML={{ __html: comment.content }} />
      )}

      {/* Reactions */}
      {comment.reactions && comment.reactions.length > 0 && (
        <div className="rte-comment-reactions">
          {comment.reactions.map(reaction => (
            <button
              key={reaction.emoji}
              className={`rte-comment-reaction ${
                reaction.users.some(u => u.id === state.currentUser?.id) ? 'active' : ''
              }`}
              onClick={() => handleToggleReaction(reaction.emoji)}
              title={reaction.users.map(u => u.name).join(', ')}
            >
              {reaction.emoji} {reaction.users.length}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="rte-comment-actions">
        {canReact && (
          <div className="rte-comment-reaction-picker">
            <button
              className="rte-comment-action-btn"
              onClick={() => setShowReactions(!showReactions)}
            >
              😊
            </button>
            {showReactions && (
              <div className="rte-comment-reaction-dropdown">
                {reactionEmojis.map(emoji => (
                  <button key={emoji} onClick={() => handleToggleReaction(emoji)}>
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {canEdit && (
          <button className="rte-comment-action-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        {canDelete && !isFirst && (
          <button
            className="rte-comment-action-btn rte-comment-action-delete"
            onClick={() => deleteComment(threadId, comment.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

/** Thread component */
function ThreadItem({ thread }: { thread: CommentThread }) {
  const comments = useCommentsOptional()
  const [replyContent, setReplyContent] = useState('')
  const [showReply, setShowReply] = useState(false)

  if (!comments) return null

  const { state, setActiveThread, addComment, resolveThread, reopenThread, deleteThread, config } = comments
  const isActive = state.activeThreadId === thread.id
  const canResolve = config?.allowResolve !== false

  const handleReply = () => {
    if (replyContent.trim()) {
      addComment(thread.id, replyContent)
      setReplyContent('')
      setShowReply(false)
    }
  }

  return (
    <div
      className={`rte-thread ${isActive ? 'rte-thread-active' : ''} ${
        thread.status === 'resolved' ? 'rte-thread-resolved' : ''
      }`}
      onClick={() => setActiveThread(thread.id)}
    >
      {/* Thread header */}
      <div className="rte-thread-header">
        <div className="rte-thread-quote">"{thread.range.text.slice(0, 50)}..."</div>
        <div className="rte-thread-meta">
          <span className={`rte-thread-status rte-thread-status-${thread.status}`}>
            {thread.status}
          </span>
          <span className="rte-thread-count">{thread.comments.length} comment{thread.comments.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Comments */}
      <div className="rte-thread-comments">
        {thread.comments.map((comment, index) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            threadId={thread.id}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Reply form */}
      {thread.status === 'open' && (
        <div className="rte-thread-reply">
          {showReply ? (
            <>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="rte-thread-reply-input"
              />
              <div className="rte-thread-reply-actions">
                <button onClick={handleReply} className="rte-btn-primary" disabled={!replyContent.trim()}>
                  Reply
                </button>
                <button onClick={() => setShowReply(false)} className="rte-btn-secondary">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setShowReply(true)} className="rte-thread-reply-btn">
              Reply
            </button>
          )}
        </div>
      )}

      {/* Thread actions */}
      <div className="rte-thread-actions">
        {canResolve && thread.status === 'open' && (
          <button onClick={() => resolveThread(thread.id)} className="rte-btn-resolve">
            ✓ Resolve
          </button>
        )}
        {thread.status === 'resolved' && (
          <button onClick={() => reopenThread(thread.id)} className="rte-btn-reopen">
            Reopen
          </button>
        )}
        <button
          onClick={e => {
            e.stopPropagation()
            deleteThread(thread.id)
          }}
          className="rte-btn-delete-thread"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

/** Comments Panel Component */
export function CommentsPanel({ position = 'right', className = '' }: CommentsPanelProps) {
  const comments = useCommentsOptional()

  if (!comments?.isEnabled || !comments.state.isPanelOpen) {
    return null
  }

  const { state, togglePanel, setFilter, getFilteredThreads } = comments
  const filteredThreads = getFilteredThreads()

  return (
    <div className={`rte-comments-panel rte-comments-panel-${position} ${className}`}>
      {/* Panel header */}
      <div className="rte-comments-panel-header">
        <h3>Comments</h3>
        <button onClick={() => togglePanel(false)} className="rte-comments-close-btn">×</button>
      </div>

      {/* Filter tabs */}
      <div className="rte-comments-filters">
        {(['all', 'open', 'resolved'] as const).map(filter => (
          <button
            key={filter}
            className={`rte-comments-filter ${state.filter === filter ? 'active' : ''}`}
            onClick={() => setFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            <span className="rte-comments-filter-count">
              {filter === 'all'
                ? state.threads.length
                : state.threads.filter(t => t.status === filter).length}
            </span>
          </button>
        ))}
      </div>

      {/* Threads list */}
      <div className="rte-comments-list">
        {filteredThreads.length === 0 ? (
          <div className="rte-comments-empty">
            {state.filter === 'all'
              ? 'No comments yet. Select text and add a comment.'
              : `No ${state.filter} comments.`}
          </div>
        ) : (
          filteredThreads.map(thread => (
            <ThreadItem key={thread.id} thread={thread} />
          ))
        )}
      </div>
    </div>
  )
}

export default CommentsPanel
