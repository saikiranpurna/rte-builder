/**
 * Version History Panel Component
 * Displays version history with restore and compare functionality
 */

import { useState } from 'react'
import { useVersionHistoryOptional } from './VersionHistoryContext'
import type { Version } from './types'

interface VersionHistoryPanelProps {
  /** Panel position */
  position?: 'left' | 'right'
  /** Custom class name */
  className?: string
}

/** Format date */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Single version item */
function VersionItem({
  version,
  isViewing,
  isCompareFrom,
  isCompareTo,
  onView,
  onRestore,
  onPin,
  onRename,
  onDelete,
  onCompareSelect,
}: {
  version: Version
  isViewing: boolean
  isCompareFrom: boolean
  isCompareTo: boolean
  onView: () => void
  onRestore: () => void
  onPin: () => void
  onRename: (title: string) => void
  onDelete: () => void
  onCompareSelect: () => void
}) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(version.title || '')

  const handleRename = () => {
    onRename(newTitle)
    setIsRenaming(false)
  }

  return (
    <div
      className={`rte-version-item ${isViewing ? 'rte-version-viewing' : ''} ${
        isCompareFrom ? 'rte-version-compare-from' : ''
      } ${isCompareTo ? 'rte-version-compare-to' : ''}`}
    >
      {/* Version header */}
      <div className="rte-version-header" onClick={onView}>
        <div className="rte-version-info">
          {isRenaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
              className="rte-version-rename-input"
              onClick={e => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <span className="rte-version-title">
              {version.title || `Version ${version.number}`}
              {version.isPinned && <span className="rte-version-pin-icon">📌</span>}
              {version.isAutoSave && <span className="rte-version-auto-badge">Auto</span>}
            </span>
          )}
          <span className="rte-version-time">{formatDate(version.createdAt)}</span>
        </div>
        <div className="rte-version-author">
          {version.author.avatar ? (
            <img src={version.author.avatar} alt={version.author.name} className="rte-version-avatar" />
          ) : (
            <div className="rte-version-avatar-placeholder">
              {version.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{version.author.name}</span>
        </div>
      </div>

      {/* Version stats */}
      <div className="rte-version-stats">
        <span>{version.wordCount} words</span>
        <span>{version.characterCount} chars</span>
      </div>

      {/* Version actions */}
      <div className="rte-version-actions">
        <button onClick={onRestore} className="rte-version-btn" title="Restore this version">
          ↺ Restore
        </button>
        <button onClick={onCompareSelect} className="rte-version-btn" title="Compare with another version">
          ⇄ Compare
        </button>
        <button onClick={onPin} className="rte-version-btn" title={version.isPinned ? 'Unpin' : 'Pin'}>
          {version.isPinned ? '📌 Unpin' : '📌 Pin'}
        </button>
        <button
          onClick={() => setIsRenaming(true)}
          className="rte-version-btn"
          title="Rename version"
        >
          ✏️
        </button>
        {!version.isPinned && (
          <button onClick={onDelete} className="rte-version-btn rte-version-btn-delete" title="Delete">
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

/** Version comparison view */
function ComparisonView({
  fromVersion,
  toVersion,
  onClose,
}: {
  fromVersion: Version
  toVersion: Version
  onClose: () => void
}) {
  const versionHistory = useVersionHistoryOptional()
  if (!versionHistory) return null

  const comparison = versionHistory.compareVersions(fromVersion.id, toVersion.id)

  return (
    <div className="rte-version-comparison">
      <div className="rte-version-comparison-header">
        <h4>Comparing Versions</h4>
        <button onClick={onClose} className="rte-version-comparison-close">×</button>
      </div>

      <div className="rte-version-comparison-info">
        <div className="rte-version-comparison-from">
          <span className="rte-version-comparison-label">From:</span>
          {fromVersion.title || `Version ${fromVersion.number}`}
        </div>
        <span className="rte-version-comparison-arrow">→</span>
        <div className="rte-version-comparison-to">
          <span className="rte-version-comparison-label">To:</span>
          {toVersion.title || `Version ${toVersion.number}`}
        </div>
      </div>

      {comparison && (
        <div className="rte-version-comparison-stats">
          <span className="rte-comparison-stat rte-comparison-additions">
            +{comparison.stats.additions} additions
          </span>
          <span className="rte-comparison-stat rte-comparison-deletions">
            -{comparison.stats.deletions} deletions
          </span>
          <span className="rte-comparison-stat rte-comparison-modifications">
            ~{comparison.stats.modifications} modifications
          </span>
        </div>
      )}

      <div className="rte-version-comparison-diff">
        {comparison?.changes.map((change, index) => (
          <div key={index} className={`rte-diff-line rte-diff-${change.type}`}>
            <span className="rte-diff-indicator">
              {change.type === 'addition' ? '+' : change.type === 'deletion' ? '-' : '~'}
            </span>
            <span className="rte-diff-content">{change.content}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Version History Panel Component */
export function VersionHistoryPanel({ position = 'right', className = '' }: VersionHistoryPanelProps) {
  const versionHistory = useVersionHistoryOptional()
  const [compareFromId, setCompareFromId] = useState<string | null>(null)

  if (!versionHistory?.isEnabled || !versionHistory.state.isPanelOpen) {
    return null
  }

  const {
    state,
    togglePanel,
    viewVersion,
    restoreVersion,
    pinVersion,
    unpinVersion,
    renameVersion,
    deleteVersion,
    setAutoSave,
    getVersion,
    createVersion,
    stopCompare,
  } = versionHistory

  const handleRestore = (versionId: string) => {
    const content = restoreVersion(versionId)
    if (content) {
      viewVersion(null) // Go back to current
    }
  }

  const handleCompareSelect = (versionId: string) => {
    if (!compareFromId) {
      setCompareFromId(versionId)
    } else {
      versionHistory.startCompare(compareFromId, versionId)
      setCompareFromId(null)
    }
  }

  const handleCancelCompare = () => {
    setCompareFromId(null)
    stopCompare()
  }

  // Get versions for comparison view
  const compareFromVersion = state.compareFromId ? getVersion(state.compareFromId) : undefined
  const compareToVersion = state.compareToId ? getVersion(state.compareToId) : undefined

  return (
    <div className={`rte-version-panel rte-version-panel-${position} ${className}`}>
      {/* Panel header */}
      <div className="rte-version-panel-header">
        <h3>Version History</h3>
        <button onClick={() => togglePanel(false)} className="rte-version-close-btn">×</button>
      </div>

      {/* Auto-save toggle */}
      <div className="rte-version-autosave">
        <label className="rte-version-autosave-label">
          <input
            type="checkbox"
            checked={state.autoSaveEnabled}
            onChange={e => setAutoSave(e.target.checked)}
          />
          Auto-save versions
        </label>
        <button
          onClick={() => createVersion('', undefined, { isAutoSave: false })}
          className="rte-version-save-btn"
        >
          Save Now
        </button>
      </div>

      {/* Compare mode indicator */}
      {compareFromId && !state.isComparing && (
        <div className="rte-version-compare-mode">
          <span>Select another version to compare</span>
          <button onClick={handleCancelCompare}>Cancel</button>
        </div>
      )}

      {/* Comparison view */}
      {state.isComparing && compareFromVersion && compareToVersion && (
        <ComparisonView
          fromVersion={compareFromVersion}
          toVersion={compareToVersion}
          onClose={handleCancelCompare}
        />
      )}

      {/* Versions list */}
      {!state.isComparing && (
        <div className="rte-version-list">
          {state.versions.length === 0 ? (
            <div className="rte-version-empty">
              No versions saved yet. Changes will be auto-saved periodically.
            </div>
          ) : (
            <>
              {/* Pinned versions */}
              {state.versions.some(v => v.isPinned) && (
                <div className="rte-version-section">
                  <div className="rte-version-section-title">📌 Pinned</div>
                  {state.versions
                    .filter(v => v.isPinned)
                    .map(version => (
                      <VersionItem
                        key={version.id}
                        version={version}
                        isViewing={state.viewingVersionId === version.id}
                        isCompareFrom={compareFromId === version.id}
                        isCompareTo={false}
                        onView={() => viewVersion(version.id)}
                        onRestore={() => handleRestore(version.id)}
                        onPin={() => unpinVersion(version.id)}
                        onRename={title => renameVersion(version.id, title)}
                        onDelete={() => deleteVersion(version.id)}
                        onCompareSelect={() => handleCompareSelect(version.id)}
                      />
                    ))}
                </div>
              )}

              {/* Recent versions */}
              <div className="rte-version-section">
                <div className="rte-version-section-title">Recent</div>
                {state.versions
                  .filter(v => !v.isPinned)
                  .map(version => (
                    <VersionItem
                      key={version.id}
                      version={version}
                      isViewing={state.viewingVersionId === version.id}
                      isCompareFrom={compareFromId === version.id}
                      isCompareTo={false}
                      onView={() => viewVersion(version.id)}
                      onRestore={() => handleRestore(version.id)}
                      onPin={() => pinVersion(version.id)}
                      onRename={title => renameVersion(version.id, title)}
                      onDelete={() => deleteVersion(version.id)}
                      onCompareSelect={() => handleCompareSelect(version.id)}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Viewing version indicator */}
      {state.viewingVersionId && (
        <div className="rte-version-viewing-indicator">
          <span>Viewing: {getVersion(state.viewingVersionId)?.title || `Version ${getVersion(state.viewingVersionId)?.number}`}</span>
          <button onClick={() => viewVersion(null)} className="rte-version-back-btn">
            ← Back to current
          </button>
        </div>
      )}
    </div>
  )
}

export default VersionHistoryPanel
