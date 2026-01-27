/**
 * Version History Types
 * Types for document version history and change tracking
 */

/** Author of a version */
export interface VersionAuthor {
  /** Unique user identifier */
  id: string
  /** Display name */
  name: string
  /** Avatar URL (optional) */
  avatar?: string
}

/** A single version/snapshot of the document */
export interface Version {
  /** Unique version identifier */
  id: string
  /** Version number (incremental) */
  number: number
  /** Version title/label (optional) */
  title?: string
  /** Version description (optional) */
  description?: string
  /** HTML content at this version */
  content: string
  /** JSON content (if available) */
  jsonContent?: unknown
  /** Plain text content */
  textContent: string
  /** Author who created this version */
  author: VersionAuthor
  /** Creation timestamp */
  createdAt: number
  /** Word count at this version */
  wordCount: number
  /** Character count at this version */
  characterCount: number
  /** Is this version auto-saved or manual */
  isAutoSave: boolean
  /** Is this a named/pinned version */
  isPinned: boolean
  /** Tags for this version */
  tags?: string[]
}

/** Change between two versions */
export interface VersionChange {
  /** Type of change */
  type: 'addition' | 'deletion' | 'modification'
  /** Content that was changed */
  content: string
  /** Position in document */
  position: number
}

/** Version comparison result */
export interface VersionComparison {
  /** Source version ID */
  fromVersionId: string
  /** Target version ID */
  toVersionId: string
  /** List of changes */
  changes: VersionChange[]
  /** Summary statistics */
  stats: {
    additions: number
    deletions: number
    modifications: number
  }
}

/** Version history state */
export interface VersionHistoryState {
  /** All versions */
  versions: Version[]
  /** Currently viewing version ID (null = current) */
  viewingVersionId: string | null
  /** Is history panel open */
  isPanelOpen: boolean
  /** Is comparing versions */
  isComparing: boolean
  /** Version being compared from */
  compareFromId: string | null
  /** Version being compared to */
  compareToId: string | null
  /** Is auto-save enabled */
  autoSaveEnabled: boolean
  /** Auto-save interval in ms */
  autoSaveInterval: number
}

/** Version history event types */
export type VersionHistoryEvent =
  | { type: 'version-created'; version: Version }
  | { type: 'version-deleted'; versionId: string }
  | { type: 'version-restored'; versionId: string }
  | { type: 'version-pinned'; versionId: string }
  | { type: 'version-unpinned'; versionId: string }
  | { type: 'version-renamed'; versionId: string; title: string }
  | { type: 'auto-save-toggled'; enabled: boolean }

/** Version history configuration */
export interface VersionHistoryConfig {
  /** Current user for versioning */
  currentUser: VersionAuthor
  /** Enable auto-save */
  autoSave?: boolean
  /** Auto-save interval in ms (default: 60000 = 1 minute) */
  autoSaveInterval?: number
  /** Maximum versions to keep (default: 100) */
  maxVersions?: number
  /** Callback to persist versions */
  onSave?: (versions: Version[]) => Promise<void>
  /** Callback to load versions */
  onLoad?: () => Promise<Version[]>
  /** Callback when version is restored */
  onRestore?: (version: Version) => void
}

/** Props for version history-enabled editor */
export interface VersionHistoryProps {
  /** Enable version history features */
  versionHistory?: VersionHistoryConfig
  /** Initial versions */
  initialVersions?: Version[]
  /** Callback when versions change */
  onVersionsChange?: (versions: Version[]) => void
  /** Show version history panel */
  showVersionPanel?: boolean
  /** Version panel position */
  versionPanelPosition?: 'left' | 'right'
}

/** Storage adapter for version history */
export interface VersionStorageAdapter {
  /** Save versions */
  save(documentId: string, versions: Version[]): Promise<void>
  /** Load versions */
  load(documentId: string): Promise<Version[]>
  /** Delete a version */
  delete(documentId: string, versionId: string): Promise<void>
  /** Clear all versions */
  clear(documentId: string): Promise<void>
}
