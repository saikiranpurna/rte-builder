/**
 * Version History Context
 * Provides version history state and methods to child components
 */

import { createContext, useContext, useReducer, useCallback, useEffect, useRef, ReactNode } from 'react'
import type {
  VersionHistoryState,
  VersionHistoryConfig,
  Version,
  VersionComparison,
  VersionChange,
  VersionHistoryEvent,
} from './types'

/** Actions for version history reducer */
type VersionHistoryAction =
  | { type: 'SET_VERSIONS'; versions: Version[] }
  | { type: 'ADD_VERSION'; version: Version }
  | { type: 'DELETE_VERSION'; versionId: string }
  | { type: 'PIN_VERSION'; versionId: string }
  | { type: 'UNPIN_VERSION'; versionId: string }
  | { type: 'RENAME_VERSION'; versionId: string; title: string }
  | { type: 'SET_VIEWING_VERSION'; versionId: string | null }
  | { type: 'TOGGLE_PANEL'; isOpen?: boolean }
  | { type: 'START_COMPARE'; fromId: string; toId: string }
  | { type: 'STOP_COMPARE' }
  | { type: 'SET_AUTO_SAVE'; enabled: boolean }
  | { type: 'SET_AUTO_SAVE_INTERVAL'; interval: number }

/** Initial version history state */
const initialState: VersionHistoryState = {
  versions: [],
  viewingVersionId: null,
  isPanelOpen: false,
  isComparing: false,
  compareFromId: null,
  compareToId: null,
  autoSaveEnabled: true,
  autoSaveInterval: 60000,
}

/** Generate unique ID */
function generateId(): string {
  return `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/** Version history reducer */
function versionHistoryReducer(state: VersionHistoryState, action: VersionHistoryAction): VersionHistoryState {
  switch (action.type) {
    case 'SET_VERSIONS':
      return { ...state, versions: action.versions }

    case 'ADD_VERSION':
      return {
        ...state,
        versions: [action.version, ...state.versions],
      }

    case 'DELETE_VERSION':
      return {
        ...state,
        versions: state.versions.filter(v => v.id !== action.versionId),
        viewingVersionId: state.viewingVersionId === action.versionId ? null : state.viewingVersionId,
      }

    case 'PIN_VERSION':
      return {
        ...state,
        versions: state.versions.map(v =>
          v.id === action.versionId ? { ...v, isPinned: true } : v
        ),
      }

    case 'UNPIN_VERSION':
      return {
        ...state,
        versions: state.versions.map(v =>
          v.id === action.versionId ? { ...v, isPinned: false } : v
        ),
      }

    case 'RENAME_VERSION':
      return {
        ...state,
        versions: state.versions.map(v =>
          v.id === action.versionId ? { ...v, title: action.title } : v
        ),
      }

    case 'SET_VIEWING_VERSION':
      return { ...state, viewingVersionId: action.versionId }

    case 'TOGGLE_PANEL':
      return { ...state, isPanelOpen: action.isOpen ?? !state.isPanelOpen }

    case 'START_COMPARE':
      return {
        ...state,
        isComparing: true,
        compareFromId: action.fromId,
        compareToId: action.toId,
      }

    case 'STOP_COMPARE':
      return {
        ...state,
        isComparing: false,
        compareFromId: null,
        compareToId: null,
      }

    case 'SET_AUTO_SAVE':
      return { ...state, autoSaveEnabled: action.enabled }

    case 'SET_AUTO_SAVE_INTERVAL':
      return { ...state, autoSaveInterval: action.interval }

    default:
      return state
  }
}

/** Count words in text */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Simple diff algorithm for version comparison */
function computeDiff(oldText: string, newText: string): VersionChange[] {
  const changes: VersionChange[] = []
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')

  let i = 0
  let j = 0

  while (i < oldLines.length || j < newLines.length) {
    if (i >= oldLines.length) {
      // Remaining new lines are additions
      changes.push({
        type: 'addition',
        content: newLines[j],
        position: j,
      })
      j++
    } else if (j >= newLines.length) {
      // Remaining old lines are deletions
      changes.push({
        type: 'deletion',
        content: oldLines[i],
        position: i,
      })
      i++
    } else if (oldLines[i] === newLines[j]) {
      // Lines match, move on
      i++
      j++
    } else {
      // Lines differ - check if it's a modification or add/delete
      const oldLineInNew = newLines.indexOf(oldLines[i], j)
      const newLineInOld = oldLines.indexOf(newLines[j], i)

      if (oldLineInNew === -1 && newLineInOld === -1) {
        // Modification
        changes.push({
          type: 'modification',
          content: `${oldLines[i]} -> ${newLines[j]}`,
          position: i,
        })
        i++
        j++
      } else if (oldLineInNew === -1) {
        // Deletion
        changes.push({
          type: 'deletion',
          content: oldLines[i],
          position: i,
        })
        i++
      } else {
        // Addition
        changes.push({
          type: 'addition',
          content: newLines[j],
          position: j,
        })
        j++
      }
    }
  }

  return changes
}

/** Context value type */
interface VersionHistoryContextValue {
  state: VersionHistoryState
  config: VersionHistoryConfig | null

  // Version operations
  createVersion: (content: string, jsonContent?: unknown, options?: { title?: string; isAutoSave?: boolean }) => Version | null
  deleteVersion: (versionId: string) => void
  restoreVersion: (versionId: string) => string | null
  pinVersion: (versionId: string) => void
  unpinVersion: (versionId: string) => void
  renameVersion: (versionId: string, title: string) => void

  // Viewing operations
  viewVersion: (versionId: string | null) => void
  getVersionContent: (versionId: string) => string | null

  // Comparison operations
  compareVersions: (fromId: string, toId: string) => VersionComparison | null
  startCompare: (fromId: string, toId: string) => void
  stopCompare: () => void

  // UI operations
  togglePanel: (isOpen?: boolean) => void
  setAutoSave: (enabled: boolean) => void

  // Getters
  getVersion: (versionId: string) => Version | undefined
  getLatestVersion: () => Version | undefined
  getPinnedVersions: () => Version[]

  // Event subscription
  subscribe: (callback: (event: VersionHistoryEvent) => void) => () => void

  isEnabled: boolean
}

/** Create context */
const VersionHistoryContext = createContext<VersionHistoryContextValue | null>(null)

/** Provider props */
interface VersionHistoryProviderProps {
  children: ReactNode
  config?: VersionHistoryConfig
  initialVersions?: Version[]
  onVersionsChange?: (versions: Version[]) => void
  getCurrentContent?: () => { html: string; json?: unknown; text: string }
}

/** Version History Provider Component */
export function VersionHistoryProvider({
  children,
  config,
  initialVersions = [],
  onVersionsChange,
  getCurrentContent,
}: VersionHistoryProviderProps) {
  const [state, dispatch] = useReducer(versionHistoryReducer, {
    ...initialState,
    versions: initialVersions,
    autoSaveEnabled: config?.autoSave ?? true,
    autoSaveInterval: config?.autoSaveInterval ?? 60000,
  })

  const subscribersRef = useRef(new Set<(event: VersionHistoryEvent) => void>())
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastContentRef = useRef<string>('')
  const versionNumberRef = useRef(initialVersions.length)

  // Load initial versions
  useEffect(() => {
    if (config?.onLoad) {
      config.onLoad().then(versions => {
        dispatch({ type: 'SET_VERSIONS', versions })
        versionNumberRef.current = versions.length
      })
    }
  }, [config])

  // Notify on versions change
  useEffect(() => {
    onVersionsChange?.(state.versions)
    if (config?.onSave) {
      config.onSave(state.versions)
    }
  }, [state.versions, onVersionsChange, config])

  // Auto-save timer
  useEffect(() => {
    if (!state.autoSaveEnabled || !config || !getCurrentContent) return

    autoSaveTimerRef.current = setInterval(() => {
      const { html, json } = getCurrentContent()

      // Only save if content changed
      if (html !== lastContentRef.current) {
        lastContentRef.current = html
        createVersion(html, json, { isAutoSave: true })
      }
    }, state.autoSaveInterval)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [state.autoSaveEnabled, state.autoSaveInterval, config, getCurrentContent])

  /** Emit event to subscribers */
  const emitEvent = useCallback((event: VersionHistoryEvent) => {
    subscribersRef.current.forEach(callback => callback(event))
  }, [])

  /** Create a new version */
  const createVersion = useCallback((
    content: string,
    jsonContent?: unknown,
    options?: { title?: string; isAutoSave?: boolean }
  ): Version | null => {
    if (!config?.currentUser) return null

    // Check max versions
    const maxVersions = config.maxVersions ?? 100
    let versions = state.versions

    if (versions.length >= maxVersions) {
      // Remove oldest non-pinned version
      const oldestUnpinned = [...versions].reverse().find(v => !v.isPinned)
      if (oldestUnpinned) {
        versions = versions.filter(v => v.id !== oldestUnpinned.id)
      }
    }

    versionNumberRef.current++
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

    const version: Version = {
      id: generateId(),
      number: versionNumberRef.current,
      title: options?.title,
      content,
      jsonContent,
      textContent,
      author: config.currentUser,
      createdAt: Date.now(),
      wordCount: countWords(textContent),
      characterCount: textContent.length,
      isAutoSave: options?.isAutoSave ?? false,
      isPinned: false,
    }

    dispatch({ type: 'ADD_VERSION', version })
    emitEvent({ type: 'version-created', version })
    return version
  }, [config, state.versions, emitEvent])

  /** Delete a version */
  const deleteVersion = useCallback((versionId: string) => {
    dispatch({ type: 'DELETE_VERSION', versionId })
    emitEvent({ type: 'version-deleted', versionId })
  }, [emitEvent])

  /** Restore a version */
  const restoreVersion = useCallback((versionId: string): string | null => {
    const version = state.versions.find(v => v.id === versionId)
    if (!version) return null

    config?.onRestore?.(version)
    emitEvent({ type: 'version-restored', versionId })
    return version.content
  }, [state.versions, config, emitEvent])

  /** Pin a version */
  const pinVersion = useCallback((versionId: string) => {
    dispatch({ type: 'PIN_VERSION', versionId })
    emitEvent({ type: 'version-pinned', versionId })
  }, [emitEvent])

  /** Unpin a version */
  const unpinVersion = useCallback((versionId: string) => {
    dispatch({ type: 'UNPIN_VERSION', versionId })
    emitEvent({ type: 'version-unpinned', versionId })
  }, [emitEvent])

  /** Rename a version */
  const renameVersion = useCallback((versionId: string, title: string) => {
    dispatch({ type: 'RENAME_VERSION', versionId, title })
    emitEvent({ type: 'version-renamed', versionId, title })
  }, [emitEvent])

  /** View a version */
  const viewVersion = useCallback((versionId: string | null) => {
    dispatch({ type: 'SET_VIEWING_VERSION', versionId })
  }, [])

  /** Get version content */
  const getVersionContent = useCallback((versionId: string): string | null => {
    const version = state.versions.find(v => v.id === versionId)
    return version?.content ?? null
  }, [state.versions])

  /** Compare two versions */
  const compareVersions = useCallback((fromId: string, toId: string): VersionComparison | null => {
    const fromVersion = state.versions.find(v => v.id === fromId)
    const toVersion = state.versions.find(v => v.id === toId)

    if (!fromVersion || !toVersion) return null

    const changes = computeDiff(fromVersion.textContent, toVersion.textContent)

    return {
      fromVersionId: fromId,
      toVersionId: toId,
      changes,
      stats: {
        additions: changes.filter(c => c.type === 'addition').length,
        deletions: changes.filter(c => c.type === 'deletion').length,
        modifications: changes.filter(c => c.type === 'modification').length,
      },
    }
  }, [state.versions])

  /** Start comparing versions */
  const startCompare = useCallback((fromId: string, toId: string) => {
    dispatch({ type: 'START_COMPARE', fromId, toId })
  }, [])

  /** Stop comparing versions */
  const stopCompare = useCallback(() => {
    dispatch({ type: 'STOP_COMPARE' })
  }, [])

  /** Toggle panel */
  const togglePanel = useCallback((isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_PANEL', isOpen })
  }, [])

  /** Set auto-save */
  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', enabled })
    emitEvent({ type: 'auto-save-toggled', enabled })
  }, [emitEvent])

  /** Get a version by ID */
  const getVersion = useCallback((versionId: string) => {
    return state.versions.find(v => v.id === versionId)
  }, [state.versions])

  /** Get latest version */
  const getLatestVersion = useCallback(() => {
    return state.versions[0]
  }, [state.versions])

  /** Get pinned versions */
  const getPinnedVersions = useCallback(() => {
    return state.versions.filter(v => v.isPinned)
  }, [state.versions])

  /** Subscribe to events */
  const subscribe = useCallback((callback: (event: VersionHistoryEvent) => void) => {
    subscribersRef.current.add(callback)
    return () => {
      subscribersRef.current.delete(callback)
    }
  }, [])

  const value: VersionHistoryContextValue = {
    state,
    config: config ?? null,
    createVersion,
    deleteVersion,
    restoreVersion,
    pinVersion,
    unpinVersion,
    renameVersion,
    viewVersion,
    getVersionContent,
    compareVersions,
    startCompare,
    stopCompare,
    togglePanel,
    setAutoSave,
    getVersion,
    getLatestVersion,
    getPinnedVersions,
    subscribe,
    isEnabled: !!config,
  }

  return (
    <VersionHistoryContext.Provider value={value}>
      {children}
    </VersionHistoryContext.Provider>
  )
}

/** Hook to use version history context */
export function useVersionHistory() {
  const context = useContext(VersionHistoryContext)
  if (!context) {
    throw new Error('useVersionHistory must be used within a VersionHistoryProvider')
  }
  return context
}

/** Hook to check if version history is available (doesn't throw) */
export function useVersionHistoryOptional() {
  return useContext(VersionHistoryContext)
}

export default VersionHistoryContext
