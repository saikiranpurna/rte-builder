/**
 * Lexical Editor Component
 *
 * This is the actual Lexical editor implementation that conforms
 * to the adapter interface.
 */

import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
  useRef,
} from 'react'

// Lexical core
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'

// Lexical nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'

// Lexical utilities
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  LexicalEditor,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'

// Toolbar
import { LexicalToolbar } from './LexicalToolbar'

// Types
import type { AdapterComponentProps, AdapterEditorRef } from '../../core/types'

// ============================================================================
// THEME
// ============================================================================

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'rte-builder-paragraph',
  quote: 'rte-builder-blockquote',
  heading: {
    h1: 'rte-builder-h1',
    h2: 'rte-builder-h2',
    h3: 'rte-builder-h3',
    h4: 'rte-builder-h4',
    h5: 'rte-builder-h5',
    h6: 'rte-builder-h6',
  },
  list: {
    nested: {
      listitem: 'rte-builder-nested-listitem',
    },
    ol: 'rte-builder-ol',
    ul: 'rte-builder-ul',
    listitem: 'rte-builder-listitem',
    listitemChecked: 'rte-builder-listitem-checked',
    listitemUnchecked: 'rte-builder-listitem-unchecked',
  },
  hashtag: 'rte-builder-hashtag',
  image: 'rte-builder-image',
  link: 'rte-builder-link',
  text: {
    bold: 'rte-builder-bold',
    code: 'rte-builder-code',
    italic: 'rte-builder-italic',
    strikethrough: 'rte-builder-strikethrough',
    subscript: 'rte-builder-subscript',
    superscript: 'rte-builder-superscript',
    underline: 'rte-builder-underline',
    underlineStrikethrough: 'rte-builder-underline-strikethrough',
  },
  code: 'rte-builder-code-block',
  codeHighlight: {
    atrule: 'rte-builder-code-atrule',
    attr: 'rte-builder-code-attr',
    boolean: 'rte-builder-code-boolean',
    builtin: 'rte-builder-code-builtin',
    cdata: 'rte-builder-code-cdata',
    char: 'rte-builder-code-char',
    class: 'rte-builder-code-class',
    'class-name': 'rte-builder-code-class-name',
    comment: 'rte-builder-code-comment',
    constant: 'rte-builder-code-constant',
    deleted: 'rte-builder-code-deleted',
    doctype: 'rte-builder-code-doctype',
    entity: 'rte-builder-code-entity',
    function: 'rte-builder-code-function',
    important: 'rte-builder-code-important',
    inserted: 'rte-builder-code-inserted',
    keyword: 'rte-builder-code-keyword',
    namespace: 'rte-builder-code-namespace',
    number: 'rte-builder-code-number',
    operator: 'rte-builder-code-operator',
    prolog: 'rte-builder-code-prolog',
    property: 'rte-builder-code-property',
    punctuation: 'rte-builder-code-punctuation',
    regex: 'rte-builder-code-regex',
    selector: 'rte-builder-code-selector',
    string: 'rte-builder-code-string',
    symbol: 'rte-builder-code-symbol',
    tag: 'rte-builder-code-tag',
    url: 'rte-builder-code-url',
    variable: 'rte-builder-code-variable',
  },
  table: 'rte-builder-table',
  tableCell: 'rte-builder-table-cell',
  tableCellHeader: 'rte-builder-table-cell-header',
  tableRow: 'rte-builder-table-row',
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

function onError(error: Error): void {
  console.error('Lexical Error:', error)
}

// ============================================================================
// EDITOR INNER COMPONENT
// ============================================================================

interface EditorInnerProps {
  value: string
  onChange?: (content: string) => void
  onBlur?: () => void
  onFocus?: () => void
  placeholder: string
  height: number
  minHeight: number
  maxHeight?: number
  disabled: boolean
  readOnly: boolean
  charCounterMax: number
  showCharCounter: boolean
  toolbarButtons?: string[]
  onMediaPickerImage?: () => Promise<void>
  onMediaPickerVideo?: () => Promise<void>
  editorRef: React.Ref<AdapterEditorRef>
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

const EditorInner: React.FC<EditorInnerProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  height,
  minHeight,
  maxHeight,
  disabled,
  readOnly,
  charCounterMax,
  showCharCounter,
  toolbarButtons,
  onMediaPickerImage,
  onMediaPickerVideo,
  editorRef,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [editor] = useLexicalComposerContext()
  const [characterCount, setCharacterCount] = useState(0)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const initialLoadRef = useRef(true)

  // Load initial value
  useEffect(() => {
    if (value && initialLoadRef.current) {
      initialLoadRef.current = false
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(value, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        root.append(...nodes)
      })
    }
  }, [value, editor])

  // Update editable state
  useEffect(() => {
    editor.setEditable(!disabled && !readOnly)
  }, [disabled, readOnly, editor])

  // Track can undo/redo
  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor])

  // Handle change
  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot()
        const text = root.getTextContent()
        setCharacterCount(text.length)

        if (onChange) {
          const html = $generateHtmlFromNodes(editor, null)
          onChange(html)
        }
      })
    },
    [onChange, editor]
  )

  // Print function
  const handlePrint = useCallback(() => {
    editor.getEditorState().read(() => {
      const html = $generateHtmlFromNodes(editor, null)
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                img { max-width: 100%; }
              </style>
            </head>
            <body>${html}</body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    })
  }, [editor])

  // Expose methods via ref
  useImperativeHandle(editorRef, () => ({
    getContent: () => {
      let html = ''
      editor.getEditorState().read(() => {
        html = $generateHtmlFromNodes(editor, null)
      })
      return html
    },
    getText: () => {
      let text = ''
      editor.getEditorState().read(() => {
        text = $getRoot().getTextContent()
      })
      return text
    },
    getJSON: () => {
      return editor.getEditorState().toJSON()
    },
    setContent: (html: string) => {
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(html, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        root.append(...nodes)
      })
    },
    focus: () => {
      editor.focus()
    },
    blur: () => {
      editor.blur()
    },
    insertHTML: (html: string) => {
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(html, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertNodes(nodes)
        }
      })
    },
    insertText: (text: string) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertText(text)
        }
      })
    },
    clear: () => {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        root.append($createParagraphNode())
      })
    },
    isEmpty: () => {
      let isEmpty = true
      editor.getEditorState().read(() => {
        const text = $getRoot().getTextContent()
        isEmpty = text.trim().length === 0
      })
      return isEmpty
    },
    getCharacterCount: () => characterCount,
    getWordCount: () => {
      let wordCount = 0
      editor.getEditorState().read(() => {
        const text = $getRoot().getTextContent()
        wordCount = text.split(/\s+/).filter(word => word.length > 0).length
      })
      return wordCount
    },
    isFullscreen: () => isFullscreen,
    toggleFullscreen: onToggleFullscreen,
    print: handlePrint,
    undo: () => {
      editor.dispatchCommand(UNDO_COMMAND, undefined)
    },
    redo: () => {
      editor.dispatchCommand(REDO_COMMAND, undefined)
    },
    canUndo: () => canUndo,
    canRedo: () => canRedo,
    getNativeEditor: () => editor,
  }))

  const characterLimit = charCounterMax > 0 ? charCounterMax : null

  return (
    <>
      <LexicalToolbar
        editor={editor}
        buttons={toolbarButtons}
        onMediaPickerImage={onMediaPickerImage}
        onMediaPickerVideo={onMediaPickerVideo}
        onToggleFullscreen={onToggleFullscreen}
        onPrint={handlePrint}
        isFullscreen={isFullscreen}
      />
      <div
        className="rte-builder-container"
        style={{
          height: `${height}px`,
          minHeight: `${minHeight}px`,
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          overflow: 'auto',
        }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="rte-builder-content"
              onBlur={onBlur}
              onFocus={onFocus}
            />
          }
          placeholder={<div className="rte-builder-placeholder">{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin />
        <CheckListPlugin />
      </div>
      {showCharCounter && (
        <div className="rte-builder-footer">
          <div className="rte-builder-char-counter">
            {characterCount}
            {characterLimit && ` / ${characterLimit}`}
            {characterLimit && characterCount > characterLimit && (
              <span className="rte-builder-char-counter-exceeded"> (limit exceeded)</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface LexicalEditorComponentProps extends AdapterComponentProps {}

export const LexicalEditorComponent = forwardRef<AdapterEditorRef, LexicalEditorComponentProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      onFocus,
      placeholder = 'Start typing...',
      height = 400,
      minHeight = 300,
      maxHeight,
      disabled = false,
      readOnly = false,
      charCounterMax = -1,
      showCharCounter = false,
      toolbarButtons,
      className = '',
      onMediaPickerImage,
      onMediaPickerVideo,
      enableCodeHighlight = true,
      defaultCodeLanguage = 'javascript',
      editorConfig = {},
    },
    ref
  ) => {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handleToggleFullscreen = useCallback(() => {
      setIsFullscreen(prev => !prev)
    }, [])

    // Handle media picker for images
    const handleMediaPickerImage = useCallback(async () => {
      if (onMediaPickerImage) {
        await onMediaPickerImage()
      }
    }, [onMediaPickerImage])

    // Handle media picker for videos
    const handleMediaPickerVideo = useCallback(async () => {
      if (onMediaPickerVideo) {
        await onMediaPickerVideo()
      }
    }, [onMediaPickerVideo])

    const initialConfig = {
      namespace: 'RTEBuilder',
      theme,
      onError,
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        HorizontalRuleNode,
      ],
      editable: !disabled && !readOnly,
      ...editorConfig,
    }

    return (
      <div
        className={`rte-builder-wrapper lexical-editor ${disabled ? 'disabled' : ''} ${readOnly ? 'readonly' : ''} ${isFullscreen ? 'fullscreen' : ''} ${className}`}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <EditorInner
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            height={height}
            minHeight={minHeight}
            maxHeight={maxHeight}
            disabled={disabled}
            readOnly={readOnly}
            charCounterMax={charCounterMax}
            showCharCounter={showCharCounter}
            toolbarButtons={toolbarButtons}
            onMediaPickerImage={onMediaPickerImage ? handleMediaPickerImage : undefined}
            onMediaPickerVideo={onMediaPickerVideo ? handleMediaPickerVideo : undefined}
            editorRef={ref}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </LexicalComposer>
      </div>
    )
  }
)

LexicalEditorComponent.displayName = 'LexicalEditorComponent'

export default LexicalEditorComponent
