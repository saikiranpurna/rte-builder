/**
 * Collaboration Types
 * Types for real-time collaborative editing features
 */

/** User presence information */
export interface CollaborationUser {
  /** Unique user identifier */
  id: string
  /** Display name */
  name: string
  /** Avatar URL (optional) */
  avatar?: string
  /** User color for cursor/selection */
  color: string
  /** Current cursor position (optional) */
  cursor?: CursorPosition
  /** Whether user is currently active */
  isActive: boolean
  /** Last activity timestamp */
  lastActive: number
}

/** Cursor position in the document */
export interface CursorPosition {
  /** Position index in the document */
  index: number
  /** Length of selection (0 if just cursor) */
  length: number
}

/** Collaboration provider configuration */
export interface CollaborationConfig {
  /** Provider type */
  provider: 'websocket' | 'webrtc' | 'custom'
  /** Server URL for websocket/webrtc */
  serverUrl?: string
  /** Room/document identifier */
  roomId: string
  /** Current user information */
  user: Omit<CollaborationUser, 'cursor' | 'isActive' | 'lastActive'>
  /** Authentication token (optional) */
  token?: string
  /** Auto-reconnect on disconnect */
  autoReconnect?: boolean
  /** Reconnect interval in ms */
  reconnectInterval?: number
  /** Maximum reconnect attempts */
  maxReconnectAttempts?: number
}

/** Collaboration connection status */
export type CollaborationStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

/** Collaboration state */
export interface CollaborationState {
  /** Connection status */
  status: CollaborationStatus
  /** Connected users */
  users: CollaborationUser[]
  /** Error message if status is 'error' */
  error?: string
  /** Is current user the host/owner */
  isHost: boolean
}

/** Collaboration event types */
export type CollaborationEvent =
  | { type: 'user-joined'; user: CollaborationUser }
  | { type: 'user-left'; userId: string }
  | { type: 'cursor-moved'; userId: string; cursor: CursorPosition }
  | { type: 'content-changed'; origin: string }
  | { type: 'status-changed'; status: CollaborationStatus }
  | { type: 'error'; message: string }

/** Collaboration provider interface */
export interface CollaborationProvider {
  /** Connect to collaboration server */
  connect(): Promise<void>
  /** Disconnect from collaboration server */
  disconnect(): void
  /** Get current state */
  getState(): CollaborationState
  /** Update cursor position */
  updateCursor(cursor: CursorPosition): void
  /** Subscribe to events */
  subscribe(callback: (event: CollaborationEvent) => void): () => void
  /** Check if connected */
  isConnected(): boolean
}

/** Props for collaboration-enabled editor */
export interface CollaborationProps {
  /** Enable collaboration features */
  collaboration?: CollaborationConfig
  /** Callback when collaboration status changes */
  onCollaborationStatusChange?: (status: CollaborationStatus) => void
  /** Callback when users join/leave */
  onUsersChange?: (users: CollaborationUser[]) => void
  /** Show user cursors */
  showCursors?: boolean
  /** Show user avatars in presence list */
  showPresence?: boolean
}
