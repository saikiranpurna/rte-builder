/**
 * Collaboration Context
 * Provides real-time collaboration state and methods to child components
 */

import { createContext, useContext, useReducer, useCallback, useEffect, useRef, ReactNode } from 'react'
import type {
  CollaborationState,
  CollaborationConfig,
  CollaborationUser,
  CollaborationStatus,
  CollaborationEvent,
  CursorPosition,
} from './types'

/** Actions for collaboration reducer */
type CollaborationAction =
  | { type: 'SET_STATUS'; status: CollaborationStatus }
  | { type: 'SET_USERS'; users: CollaborationUser[] }
  | { type: 'ADD_USER'; user: CollaborationUser }
  | { type: 'REMOVE_USER'; userId: string }
  | { type: 'UPDATE_CURSOR'; userId: string; cursor: CursorPosition }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_HOST'; isHost: boolean }

/** Initial collaboration state */
const initialState: CollaborationState = {
  status: 'disconnected',
  users: [],
  error: undefined,
  isHost: false,
}

/** Collaboration reducer */
function collaborationReducer(state: CollaborationState, action: CollaborationAction): CollaborationState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status, error: action.status === 'error' ? state.error : undefined }
    case 'SET_USERS':
      return { ...state, users: action.users }
    case 'ADD_USER':
      if (state.users.find(u => u.id === action.user.id)) {
        return {
          ...state,
          users: state.users.map(u => u.id === action.user.id ? action.user : u),
        }
      }
      return { ...state, users: [...state.users, action.user] }
    case 'REMOVE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.userId) }
    case 'UPDATE_CURSOR':
      return {
        ...state,
        users: state.users.map(u =>
          u.id === action.userId ? { ...u, cursor: action.cursor, lastActive: Date.now() } : u
        ),
      }
    case 'SET_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'CLEAR_ERROR':
      return { ...state, error: undefined }
    case 'SET_HOST':
      return { ...state, isHost: action.isHost }
    default:
      return state
  }
}

/** Context value type */
interface CollaborationContextValue {
  state: CollaborationState
  config: CollaborationConfig | null
  connect: () => Promise<void>
  disconnect: () => void
  updateCursor: (cursor: CursorPosition) => void
  isEnabled: boolean
}

/** Create context */
const CollaborationContext = createContext<CollaborationContextValue | null>(null)

/** Provider props */
interface CollaborationProviderProps {
  children: ReactNode
  config?: CollaborationConfig
  onStatusChange?: (status: CollaborationStatus) => void
  onUsersChange?: (users: CollaborationUser[]) => void
}

/** Generate a random color for user */
function generateUserColor(): string {
  const colors = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80',
    '#2dd4bf', '#22d3ee', '#60a5fa', '#a78bfa', '#e879f9',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/** Collaboration Provider Component */
export function CollaborationProvider({
  children,
  config,
  onStatusChange,
  onUsersChange,
}: CollaborationProviderProps) {
  const [state, dispatch] = useReducer(collaborationReducer, initialState)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  // Notify on status change
  useEffect(() => {
    onStatusChange?.(state.status)
  }, [state.status, onStatusChange])

  // Notify on users change
  useEffect(() => {
    onUsersChange?.(state.users)
  }, [state.users, onUsersChange])

  /** Connect to collaboration server */
  const connect = useCallback(async () => {
    if (!config) return

    dispatch({ type: 'SET_STATUS', status: 'connecting' })

    try {
      if (config.provider === 'websocket' && config.serverUrl) {
        const url = new URL(config.serverUrl)
        url.searchParams.set('room', config.roomId)
        if (config.token) {
          url.searchParams.set('token', config.token)
        }

        const ws = new WebSocket(url.toString())
        wsRef.current = ws

        ws.onopen = () => {
          dispatch({ type: 'SET_STATUS', status: 'connected' })
          reconnectAttemptsRef.current = 0

          // Send join message
          ws.send(JSON.stringify({
            type: 'join',
            user: {
              id: config.user.id,
              name: config.user.name,
              avatar: config.user.avatar,
              color: config.user.color || generateUserColor(),
            },
          }))
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as CollaborationEvent
            handleCollaborationEvent(message)
          } catch {
            console.error('Failed to parse collaboration message')
          }
        }

        ws.onclose = () => {
          dispatch({ type: 'SET_STATUS', status: 'disconnected' })
          handleReconnect()
        }

        ws.onerror = () => {
          dispatch({ type: 'SET_ERROR', error: 'Connection error' })
        }
      } else if (config.provider === 'webrtc') {
        // WebRTC implementation would go here
        dispatch({ type: 'SET_ERROR', error: 'WebRTC provider not yet implemented' })
      } else if (config.provider === 'custom') {
        // Custom provider - user handles connection
        dispatch({ type: 'SET_STATUS', status: 'connected' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Connection failed' })
    }
  }, [config])

  /** Handle collaboration events */
  const handleCollaborationEvent = useCallback((event: CollaborationEvent) => {
    switch (event.type) {
      case 'user-joined':
        dispatch({ type: 'ADD_USER', user: event.user })
        break
      case 'user-left':
        dispatch({ type: 'REMOVE_USER', userId: event.userId })
        break
      case 'cursor-moved':
        dispatch({ type: 'UPDATE_CURSOR', userId: event.userId, cursor: event.cursor })
        break
      case 'status-changed':
        dispatch({ type: 'SET_STATUS', status: event.status })
        break
      case 'error':
        dispatch({ type: 'SET_ERROR', error: event.message })
        break
    }
  }, [])

  /** Handle reconnection */
  const handleReconnect = useCallback(() => {
    if (!config?.autoReconnect) return

    const maxAttempts = config.maxReconnectAttempts ?? 5
    const interval = config.reconnectInterval ?? 3000

    if (reconnectAttemptsRef.current >= maxAttempts) {
      dispatch({ type: 'SET_ERROR', error: 'Max reconnection attempts reached' })
      return
    }

    dispatch({ type: 'SET_STATUS', status: 'reconnecting' })
    reconnectAttemptsRef.current++

    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, interval)
  }, [config, connect])

  /** Disconnect from collaboration server */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    dispatch({ type: 'SET_STATUS', status: 'disconnected' })
    dispatch({ type: 'SET_USERS', users: [] })
  }, [])

  /** Update cursor position */
  const updateCursor = useCallback((cursor: CursorPosition) => {
    if (!config || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    wsRef.current.send(JSON.stringify({
      type: 'cursor',
      userId: config.user.id,
      cursor,
    }))
  }, [config])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  const value: CollaborationContextValue = {
    state,
    config: config ?? null,
    connect,
    disconnect,
    updateCursor,
    isEnabled: !!config,
  }

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  )
}

/** Hook to use collaboration context */
export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider')
  }
  return context
}

/** Hook to check if collaboration is available (doesn't throw) */
export function useCollaborationOptional() {
  return useContext(CollaborationContext)
}

export default CollaborationContext
