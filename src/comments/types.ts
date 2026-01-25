/**
 * Comments & Annotations Types
 * Types for inline comments and annotation features
 */

/** Comment author information */
export interface CommentAuthor {
  /** Unique user identifier */
  id: string
  /** Display name */
  name: string
  /** Avatar URL (optional) */
  avatar?: string
}

/** Text range for comment anchor */
export interface CommentRange {
  /** Start position in document */
  from: number
  /** End position in document */
  to: number
  /** Selected text content */
  text: string
}

/** Single comment in a thread */
export interface Comment {
  /** Unique comment identifier */
  id: string
  /** Thread this comment belongs to */
  threadId: string
  /** Comment content (can be HTML) */
  content: string
  /** Comment author */
  author: CommentAuthor
  /** Creation timestamp */
  createdAt: number
  /** Last update timestamp */
  updatedAt?: number
  /** Is this comment edited */
  isEdited: boolean
  /** Reactions on this comment */
  reactions?: CommentReaction[]
}

/** Reaction on a comment */
export interface CommentReaction {
  /** Emoji reaction */
  emoji: string
  /** Users who reacted */
  users: CommentAuthor[]
}

/** Comment thread (group of comments on a text range) */
export interface CommentThread {
  /** Unique thread identifier */
  id: string
  /** Text range this thread is attached to */
  range: CommentRange
  /** Comments in this thread */
  comments: Comment[]
  /** Thread status */
  status: 'open' | 'resolved'
  /** Thread creation timestamp */
  createdAt: number
  /** Thread resolution timestamp */
  resolvedAt?: number
  /** User who resolved the thread */
  resolvedBy?: CommentAuthor
}

/** Comment highlight type */
export type CommentHighlightType = 'active' | 'hover' | 'resolved' | 'default'

/** Comments state */
export interface CommentsState {
  /** All comment threads */
  threads: CommentThread[]
  /** Currently active/selected thread ID */
  activeThreadId: string | null
  /** Is comment panel open */
  isPanelOpen: boolean
  /** Filter for threads */
  filter: 'all' | 'open' | 'resolved'
  /** Current user (for adding comments) */
  currentUser: CommentAuthor | null
}

/** Comment event types */
export type CommentEvent =
  | { type: 'thread-created'; thread: CommentThread }
  | { type: 'thread-deleted'; threadId: string }
  | { type: 'thread-resolved'; threadId: string; resolvedBy: CommentAuthor }
  | { type: 'thread-reopened'; threadId: string }
  | { type: 'comment-added'; threadId: string; comment: Comment }
  | { type: 'comment-updated'; threadId: string; comment: Comment }
  | { type: 'comment-deleted'; threadId: string; commentId: string }
  | { type: 'reaction-added'; threadId: string; commentId: string; emoji: string; user: CommentAuthor }
  | { type: 'reaction-removed'; threadId: string; commentId: string; emoji: string; userId: string }

/** Comments configuration */
export interface CommentsConfig {
  /** Current user for adding comments */
  currentUser: CommentAuthor
  /** Allow resolving threads */
  allowResolve?: boolean
  /** Allow deleting comments */
  allowDelete?: boolean
  /** Allow editing comments */
  allowEdit?: boolean
  /** Allow reactions */
  allowReactions?: boolean
  /** Available reaction emojis */
  reactionEmojis?: string[]
  /** Callback to persist comments */
  onSave?: (threads: CommentThread[]) => Promise<void>
  /** Callback to load comments */
  onLoad?: () => Promise<CommentThread[]>
}

/** Props for comments-enabled editor */
export interface CommentsProps {
  /** Enable comments features */
  comments?: CommentsConfig
  /** Initial comment threads */
  initialThreads?: CommentThread[]
  /** Callback when threads change */
  onThreadsChange?: (threads: CommentThread[]) => void
  /** Show comment highlights in editor */
  showCommentHighlights?: boolean
  /** Show comment panel */
  showCommentPanel?: boolean
  /** Comment panel position */
  commentPanelPosition?: 'left' | 'right'
}

/** Default reaction emojis */
export const DEFAULT_REACTION_EMOJIS = ['👍', '👎', '❤️', '🎉', '😄', '😕', '👀', '🚀']
