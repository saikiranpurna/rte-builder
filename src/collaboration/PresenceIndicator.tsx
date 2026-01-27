/**
 * Presence Indicator Component
 * Shows connected users with avatars and status
 */

import { useCollaborationOptional } from './CollaborationContext'
import type { CollaborationUser } from './types'

interface PresenceIndicatorProps {
  /** Maximum avatars to show before "+N" */
  maxAvatars?: number
  /** Show user names on hover */
  showNames?: boolean
  /** Custom class name */
  className?: string
}

/** Get initials from name */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Single user avatar */
function UserAvatar({ user, showName }: { user: CollaborationUser; showName?: boolean }) {
  return (
    <div
      className="rte-presence-avatar"
      style={{ borderColor: user.color }}
      title={user.name}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} />
      ) : (
        <span style={{ backgroundColor: user.color }}>
          {getInitials(user.name)}
        </span>
      )}
      {user.isActive && <div className="rte-presence-active-dot" />}
      {showName && <div className="rte-presence-name">{user.name}</div>}
    </div>
  )
}

/** Connection status badge */
function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    connected: { label: 'Connected', color: '#22c55e' },
    connecting: { label: 'Connecting...', color: '#eab308' },
    reconnecting: { label: 'Reconnecting...', color: '#f97316' },
    disconnected: { label: 'Disconnected', color: '#6b7280' },
    error: { label: 'Error', color: '#ef4444' },
  }

  const config = statusConfig[status] || statusConfig.disconnected

  return (
    <div className="rte-presence-status" style={{ color: config.color }}>
      <div className="rte-presence-status-dot" style={{ backgroundColor: config.color }} />
      {config.label}
    </div>
  )
}

/** Presence Indicator Component */
export function PresenceIndicator({
  maxAvatars = 5,
  showNames = false,
  className = '',
}: PresenceIndicatorProps) {
  const collaboration = useCollaborationOptional()

  if (!collaboration?.isEnabled) {
    return null
  }

  const { state } = collaboration
  const visibleUsers = state.users.slice(0, maxAvatars)
  const remainingCount = Math.max(0, state.users.length - maxAvatars)

  return (
    <div className={`rte-presence-indicator ${className}`}>
      <StatusBadge status={state.status} />

      {state.users.length > 0 && (
        <div className="rte-presence-avatars">
          {visibleUsers.map(user => (
            <UserAvatar key={user.id} user={user} showName={showNames} />
          ))}
          {remainingCount > 0 && (
            <div className="rte-presence-avatar rte-presence-more">
              +{remainingCount}
            </div>
          )}
        </div>
      )}

      {state.error && (
        <div className="rte-presence-error" title={state.error}>
          !
        </div>
      )}
    </div>
  )
}

export default PresenceIndicator
