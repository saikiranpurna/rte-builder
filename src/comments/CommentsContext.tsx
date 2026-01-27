/**
 * Comments Context
 * Provides comments and annotations state and methods to child components
 */

import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import type {
  CommentsState,
  CommentsConfig,
  CommentThread,
  Comment,
  CommentAuthor,
  CommentRange,
  CommentEvent,
} from './types'
import { DEFAULT_REACTION_EMOJIS } from './types'

/** Actions for comments reducer */
type CommentsAction =
  | { type: 'SET_THREADS'; threads: CommentThread[] }
  | { type: 'ADD_THREAD'; thread: CommentThread }
  | { type: 'DELETE_THREAD'; threadId: string }
  | { type: 'RESOLVE_THREAD'; threadId: string; resolvedBy: CommentAuthor }
  | { type: 'REOPEN_THREAD'; threadId: string }
  | { type: 'ADD_COMMENT'; threadId: string; comment: Comment }
  | { type: 'UPDATE_COMMENT'; threadId: string; comment: Comment }
  | { type: 'DELETE_COMMENT'; threadId: string; commentId: string }
  | { type: 'ADD_REACTION'; threadId: string; commentId: string; emoji: string; user: CommentAuthor }
  | { type: 'REMOVE_REACTION'; threadId: string; commentId: string; emoji: string; userId: string }
  | { type: 'SET_ACTIVE_THREAD'; threadId: string | null }
  | { type: 'TOGGLE_PANEL'; isOpen?: boolean }
  | { type: 'SET_FILTER'; filter: 'all' | 'open' | 'resolved' }
  | { type: 'SET_CURRENT_USER'; user: CommentAuthor | null }

/** Initial comments state */
const initialState: CommentsState = {
  threads: [],
  activeThreadId: null,
  isPanelOpen: false,
  filter: 'all',
  currentUser: null,
}

/** Generate unique ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/** Comments reducer */
function commentsReducer(state: CommentsState, action: CommentsAction): CommentsState {
  switch (action.type) {
    case 'SET_THREADS':
      return { ...state, threads: action.threads }

    case 'ADD_THREAD':
      return { ...state, threads: [...state.threads, action.thread] }

    case 'DELETE_THREAD':
      return {
        ...state,
        threads: state.threads.filter(t => t.id !== action.threadId),
        activeThreadId: state.activeThreadId === action.threadId ? null : state.activeThreadId,
      }

    case 'RESOLVE_THREAD':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? { ...t, status: 'resolved' as const, resolvedAt: Date.now(), resolvedBy: action.resolvedBy }
            : t
        ),
      }

    case 'REOPEN_THREAD':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? { ...t, status: 'open' as const, resolvedAt: undefined, resolvedBy: undefined }
            : t
        ),
      }

    case 'ADD_COMMENT':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? { ...t, comments: [...t.comments, action.comment] }
            : t
        ),
      }

    case 'UPDATE_COMMENT':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? {
                ...t,
                comments: t.comments.map(c =>
                  c.id === action.comment.id ? action.comment : c
                ),
              }
            : t
        ),
      }

    case 'DELETE_COMMENT':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? { ...t, comments: t.comments.filter(c => c.id !== action.commentId) }
            : t
        ),
      }

    case 'ADD_REACTION':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? {
                ...t,
                comments: t.comments.map(c => {
                  if (c.id !== action.commentId) return c
                  const reactions = c.reactions || []
                  const existingReaction = reactions.find(r => r.emoji === action.emoji)
                  if (existingReaction) {
                    return {
                      ...c,
                      reactions: reactions.map(r =>
                        r.emoji === action.emoji
                          ? { ...r, users: [...r.users, action.user] }
                          : r
                      ),
                    }
                  }
                  return {
                    ...c,
                    reactions: [...reactions, { emoji: action.emoji, users: [action.user] }],
                  }
                }),
              }
            : t
        ),
      }

    case 'REMOVE_REACTION':
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === action.threadId
            ? {
                ...t,
                comments: t.comments.map(c => {
                  if (c.id !== action.commentId) return c
                  return {
                    ...c,
                    reactions: (c.reactions || [])
                      .map(r =>
                        r.emoji === action.emoji
                          ? { ...r, users: r.users.filter(u => u.id !== action.userId) }
                          : r
                      )
                      .filter(r => r.users.length > 0),
                  }
                }),
              }
            : t
        ),
      }

    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThreadId: action.threadId }

    case 'TOGGLE_PANEL':
      return { ...state, isPanelOpen: action.isOpen ?? !state.isPanelOpen }

    case 'SET_FILTER':
      return { ...state, filter: action.filter }

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.user }

    default:
      return state
  }
}

/** Context value type */
interface CommentsContextValue {
  state: CommentsState
  config: CommentsConfig | null

  // Thread operations
  createThread: (range: CommentRange, initialComment: string) => CommentThread | null
  deleteThread: (threadId: string) => void
  resolveThread: (threadId: string) => void
  reopenThread: (threadId: string) => void

  // Comment operations
  addComment: (threadId: string, content: string) => Comment | null
  updateComment: (threadId: string, commentId: string, content: string) => void
  deleteComment: (threadId: string, commentId: string) => void

  // Reaction operations
  addReaction: (threadId: string, commentId: string, emoji: string) => void
  removeReaction: (threadId: string, commentId: string, emoji: string) => void

  // UI operations
  setActiveThread: (threadId: string | null) => void
  togglePanel: (isOpen?: boolean) => void
  setFilter: (filter: 'all' | 'open' | 'resolved') => void

  // Getters
  getThreadByRange: (from: number, to: number) => CommentThread | undefined
  getFilteredThreads: () => CommentThread[]

  // Event subscription
  subscribe: (callback: (event: CommentEvent) => void) => () => void

  isEnabled: boolean
}

/** Create context */
const CommentsContext = createContext<CommentsContextValue | null>(null)

/** Provider props */
interface CommentsProviderProps {
  children: ReactNode
  config?: CommentsConfig
  initialThreads?: CommentThread[]
  onThreadsChange?: (threads: CommentThread[]) => void
}

/** Comments Provider Component */
export function CommentsProvider({
  children,
  config,
  initialThreads = [],
  onThreadsChange,
}: CommentsProviderProps) {
  const [state, dispatch] = useReducer(commentsReducer, {
    ...initialState,
    threads: initialThreads,
    currentUser: config?.currentUser ?? null,
  })

  const subscribersRef = { current: new Set<(event: CommentEvent) => void>() }

  // Load initial threads
  useEffect(() => {
    if (config?.onLoad) {
      config.onLoad().then(threads => {
        dispatch({ type: 'SET_THREADS', threads })
      })
    }
  }, [config])

  // Notify on threads change
  useEffect(() => {
    onThreadsChange?.(state.threads)
    if (config?.onSave) {
      config.onSave(state.threads)
    }
  }, [state.threads, onThreadsChange, config])

  // Update current user when config changes
  useEffect(() => {
    if (config?.currentUser) {
      dispatch({ type: 'SET_CURRENT_USER', user: config.currentUser })
    }
  }, [config?.currentUser])

  /** Emit event to subscribers */
  const emitEvent = useCallback((event: CommentEvent) => {
    subscribersRef.current.forEach(callback => callback(event))
  }, [])

  /** Create a new thread */
  const createThread = useCallback((range: CommentRange, initialComment: string): CommentThread | null => {
    if (!state.currentUser) return null

    const threadId = generateId()
    const commentId = generateId()
    const now = Date.now()

    const comment: Comment = {
      id: commentId,
      threadId,
      content: initialComment,
      author: state.currentUser,
      createdAt: now,
      isEdited: false,
    }

    const thread: CommentThread = {
      id: threadId,
      range,
      comments: [comment],
      status: 'open',
      createdAt: now,
    }

    dispatch({ type: 'ADD_THREAD', thread })
    emitEvent({ type: 'thread-created', thread })
    return thread
  }, [state.currentUser, emitEvent])

  /** Delete a thread */
  const deleteThread = useCallback((threadId: string) => {
    if (config?.allowDelete === false) return
    dispatch({ type: 'DELETE_THREAD', threadId })
    emitEvent({ type: 'thread-deleted', threadId })
  }, [config, emitEvent])

  /** Resolve a thread */
  const resolveThread = useCallback((threadId: string) => {
    if (!state.currentUser || config?.allowResolve === false) return
    dispatch({ type: 'RESOLVE_THREAD', threadId, resolvedBy: state.currentUser })
    emitEvent({ type: 'thread-resolved', threadId, resolvedBy: state.currentUser })
  }, [state.currentUser, config, emitEvent])

  /** Reopen a thread */
  const reopenThread = useCallback((threadId: string) => {
    dispatch({ type: 'REOPEN_THREAD', threadId })
    emitEvent({ type: 'thread-reopened', threadId })
  }, [emitEvent])

  /** Add a comment to a thread */
  const addComment = useCallback((threadId: string, content: string): Comment | null => {
    if (!state.currentUser) return null

    const comment: Comment = {
      id: generateId(),
      threadId,
      content,
      author: state.currentUser,
      createdAt: Date.now(),
      isEdited: false,
    }

    dispatch({ type: 'ADD_COMMENT', threadId, comment })
    emitEvent({ type: 'comment-added', threadId, comment })
    return comment
  }, [state.currentUser, emitEvent])

  /** Update a comment */
  const updateComment = useCallback((threadId: string, commentId: string, content: string) => {
    if (config?.allowEdit === false) return

    const thread = state.threads.find(t => t.id === threadId)
    const existingComment = thread?.comments.find(c => c.id === commentId)
    if (!existingComment) return

    const updatedComment: Comment = {
      ...existingComment,
      content,
      updatedAt: Date.now(),
      isEdited: true,
    }

    dispatch({ type: 'UPDATE_COMMENT', threadId, comment: updatedComment })
    emitEvent({ type: 'comment-updated', threadId, comment: updatedComment })
  }, [state.threads, config, emitEvent])

  /** Delete a comment */
  const deleteComment = useCallback((threadId: string, commentId: string) => {
    if (config?.allowDelete === false) return
    dispatch({ type: 'DELETE_COMMENT', threadId, commentId })
    emitEvent({ type: 'comment-deleted', threadId, commentId })
  }, [config, emitEvent])

  /** Add a reaction */
  const addReaction = useCallback((threadId: string, commentId: string, emoji: string) => {
    if (!state.currentUser || config?.allowReactions === false) return

    const allowedEmojis = config?.reactionEmojis ?? DEFAULT_REACTION_EMOJIS
    if (!allowedEmojis.includes(emoji)) return

    dispatch({ type: 'ADD_REACTION', threadId, commentId, emoji, user: state.currentUser })
    emitEvent({ type: 'reaction-added', threadId, commentId, emoji, user: state.currentUser })
  }, [state.currentUser, config, emitEvent])

  /** Remove a reaction */
  const removeReaction = useCallback((threadId: string, commentId: string, emoji: string) => {
    if (!state.currentUser) return
    dispatch({ type: 'REMOVE_REACTION', threadId, commentId, emoji, userId: state.currentUser.id })
    emitEvent({ type: 'reaction-removed', threadId, commentId, emoji, userId: state.currentUser.id })
  }, [state.currentUser, emitEvent])

  /** Set active thread */
  const setActiveThread = useCallback((threadId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_THREAD', threadId })
  }, [])

  /** Toggle panel */
  const togglePanel = useCallback((isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_PANEL', isOpen })
  }, [])

  /** Set filter */
  const setFilter = useCallback((filter: 'all' | 'open' | 'resolved') => {
    dispatch({ type: 'SET_FILTER', filter })
  }, [])

  /** Get thread by range */
  const getThreadByRange = useCallback((from: number, to: number) => {
    return state.threads.find(t => t.range.from === from && t.range.to === to)
  }, [state.threads])

  /** Get filtered threads */
  const getFilteredThreads = useCallback(() => {
    if (state.filter === 'all') return state.threads
    return state.threads.filter(t => t.status === state.filter)
  }, [state.threads, state.filter])

  /** Subscribe to events */
  const subscribe = useCallback((callback: (event: CommentEvent) => void) => {
    subscribersRef.current.add(callback)
    return () => {
      subscribersRef.current.delete(callback)
    }
  }, [])

  const value: CommentsContextValue = {
    state,
    config: config ?? null,
    createThread,
    deleteThread,
    resolveThread,
    reopenThread,
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    removeReaction,
    setActiveThread,
    togglePanel,
    setFilter,
    getThreadByRange,
    getFilteredThreads,
    subscribe,
    isEnabled: !!config,
  }

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  )
}

/** Hook to use comments context */
export function useComments() {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider')
  }
  return context
}

/** Hook to check if comments is available (doesn't throw) */
export function useCommentsOptional() {
  return useContext(CommentsContext)
}

export default CommentsContext
