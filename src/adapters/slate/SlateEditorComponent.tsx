/**
 * Slate.js Editor Component
 *
 * This is the actual Slate.js editor implementation that conforms
 * to the adapter interface.
 */

import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react'
import { createEditor, Descendant, Editor, Transforms, Text, Element as SlateElement, Node } from 'slate'
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'
import isHotkey from 'is-hotkey'

// Toolbar
import { SlateToolbar } from './SlateToolbar'

// Types
import type { AdapterComponentProps, AdapterEditorRef } from '../../core/types'

// ============================================================================
// CUSTOM TYPES
// ============================================================================

type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  subscript?: boolean
  superscript?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: string
  fontFamily?: string
}

type ParagraphElement = { type: 'paragraph'; align?: string; indent?: number; children: Descendant[] }
type HeadingElement = { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; align?: string; children: Descendant[] }
type BlockquoteElement = { type: 'blockquote'; children: Descendant[] }
type CodeBlockElement = { type: 'code-block'; language?: string; children: Descendant[] }
type BulletListElement = { type: 'bulleted-list'; children: Descendant[] }
type NumberedListElement = { type: 'numbered-list'; children: Descendant[] }
type ListItemElement = { type: 'list-item'; children: Descendant[] }
type LinkElement = { type: 'link'; url: string; children: Descendant[] }
type ImageElement = { type: 'image'; url: string; alt?: string; children: Descendant[] }
type VideoElement = { type: 'video'; url: string; children: Descendant[] }
type HorizontalRuleElement = { type: 'horizontal-rule'; children: Descendant[] }
type TableElement = { type: 'table'; children: Descendant[] }
type TableRowElement = { type: 'table-row'; children: Descendant[] }
type TableCellElement = { type: 'table-cell'; children: Descendant[] }

type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | CodeBlockElement
  | BulletListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | ImageElement
  | VideoElement
  | HorizontalRuleElement
  | TableElement
  | TableRowElement
  | TableCellElement

declare module 'slate' {
  interface CustomTypes {
    Editor: Editor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

// ============================================================================
// HOTKEYS
// ============================================================================

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+shift+s': 'strikethrough',
}

// ============================================================================
// HELPERS
// ============================================================================

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? (marks as Record<string, unknown>)[format] === true : false
}

const isBlockActive = (editor: Editor, format: string, blockType: 'type' | 'align' = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (blockType === 'type' ? n.type === format : (n as any).align === format),
    })
  )

  return !!match
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties: Partial<CustomElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as Partial<CustomElement>
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<CustomElement>
  }
  Transforms.setNodes<CustomElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement
    Transforms.wrapNodes(editor, block)
  }
}

// ============================================================================
// SERIALIZATION
// ============================================================================

const serializeToHtml = (nodes: Descendant[]): string => {
  return nodes.map(n => serializeNode(n)).join('')
}

const serializeNode = (node: Descendant): string => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) string = `<strong>${string}</strong>`
    if (node.italic) string = `<em>${string}</em>`
    if (node.underline) string = `<u>${string}</u>`
    if (node.strikethrough) string = `<s>${string}</s>`
    if (node.code) string = `<code>${string}</code>`
    if (node.subscript) string = `<sub>${string}</sub>`
    if (node.superscript) string = `<sup>${string}</sup>`
    if (node.color) string = `<span style="color: ${node.color}">${string}</span>`
    if (node.backgroundColor) string = `<span style="background-color: ${node.backgroundColor}">${string}</span>`
    if (node.fontSize) string = `<span style="font-size: ${node.fontSize}">${string}</span>`
    if (node.fontFamily) string = `<span style="font-family: ${node.fontFamily}">${string}</span>`
    return string
  }

  const children = (node.children as Descendant[]).map(n => serializeNode(n)).join('')
  const element = node as CustomElement
  const alignStyle = (element as any).align ? ` style="text-align: ${(element as any).align}"` : ''

  switch (element.type) {
    case 'paragraph':
      return `<p${alignStyle}>${children}</p>`
    case 'heading':
      return `<h${element.level}${alignStyle}>${children}</h${element.level}>`
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`
    case 'code-block':
      return `<pre><code class="language-${element.language || 'plaintext'}">${children}</code></pre>`
    case 'bulleted-list':
      return `<ul>${children}</ul>`
    case 'numbered-list':
      return `<ol>${children}</ol>`
    case 'list-item':
      return `<li>${children}</li>`
    case 'link':
      return `<a href="${escapeHtml(element.url)}" target="_blank" rel="noopener noreferrer">${children}</a>`
    case 'image':
      return `<img src="${escapeHtml(element.url)}" alt="${escapeHtml(element.alt || '')}" />`
    case 'video':
      return `<video src="${escapeHtml(element.url)}" controls></video>`
    case 'horizontal-rule':
      return '<hr />'
    case 'table':
      return `<table>${children}</table>`
    case 'table-row':
      return `<tr>${children}</tr>`
    case 'table-cell':
      return `<td>${children}</td>`
    default:
      return children
  }
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const deserializeFromHtml = (html: string): Descendant[] => {
  if (!html || html.trim() === '') {
    return [{ type: 'paragraph', children: [{ text: '' }] }]
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  return deserializeElement(doc.body)
}

const deserializeElement = (el: HTMLElement): Descendant[] => {
  if (el.nodeType === 3) {
    return [{ text: el.textContent || '' }]
  }

  if (el.nodeType !== 1) {
    return [{ text: '' }]
  }

  const children: Descendant[] = Array.from(el.childNodes)
    .flatMap(child => deserializeElement(child as HTMLElement))

  if (children.length === 0) {
    children.push({ text: '' })
  }

  switch (el.nodeName) {
    case 'BODY':
      return children
    case 'BR':
      return [{ text: '\n' }]
    case 'P':
      return [{ type: 'paragraph', align: el.style.textAlign || undefined, children }]
    case 'H1':
      return [{ type: 'heading', level: 1, children }]
    case 'H2':
      return [{ type: 'heading', level: 2, children }]
    case 'H3':
      return [{ type: 'heading', level: 3, children }]
    case 'H4':
      return [{ type: 'heading', level: 4, children }]
    case 'H5':
      return [{ type: 'heading', level: 5, children }]
    case 'H6':
      return [{ type: 'heading', level: 6, children }]
    case 'BLOCKQUOTE':
      return [{ type: 'blockquote', children }]
    case 'PRE':
      return [{ type: 'code-block', children }]
    case 'UL':
      return [{ type: 'bulleted-list', children }]
    case 'OL':
      return [{ type: 'numbered-list', children }]
    case 'LI':
      return [{ type: 'list-item', children }]
    case 'A':
      return [{ type: 'link', url: el.getAttribute('href') || '', children }]
    case 'IMG':
      return [{ type: 'image', url: el.getAttribute('src') || '', alt: el.getAttribute('alt') || '', children: [{ text: '' }] }]
    case 'VIDEO':
      return [{ type: 'video', url: el.getAttribute('src') || '', children: [{ text: '' }] }]
    case 'HR':
      return [{ type: 'horizontal-rule', children: [{ text: '' }] }]
    case 'TABLE':
      return [{ type: 'table', children }]
    case 'TR':
      return [{ type: 'table-row', children }]
    case 'TD':
    case 'TH':
      return [{ type: 'table-cell', children }]
    case 'STRONG':
    case 'B':
      return children.map(child => ({ ...child, bold: true } as CustomText))
    case 'EM':
    case 'I':
      return children.map(child => ({ ...child, italic: true } as CustomText))
    case 'U':
      return children.map(child => ({ ...child, underline: true } as CustomText))
    case 'S':
    case 'STRIKE':
    case 'DEL':
      return children.map(child => ({ ...child, strikethrough: true } as CustomText))
    case 'CODE':
      return children.map(child => ({ ...child, code: true } as CustomText))
    case 'SUB':
      return children.map(child => ({ ...child, subscript: true } as CustomText))
    case 'SUP':
      return children.map(child => ({ ...child, superscript: true } as CustomText))
    default:
      return children
  }
}

// ============================================================================
// RENDER ELEMENTS & LEAVES
// ============================================================================

const renderElement = (props: { attributes: any; children: React.ReactNode; element: CustomElement }) => {
  const { attributes, children, element } = props
  const style = { textAlign: (element as any).align }

  switch (element.type) {
    case 'heading':
      const Tag = `h${element.level}` as keyof JSX.IntrinsicElements
      return <Tag style={style} {...attributes}>{children}</Tag>
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'code-block':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      )
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'link':
      return (
        <a href={element.url} target="_blank" rel="noopener noreferrer" {...attributes}>
          {children}
        </a>
      )
    case 'image':
      return (
        <div {...attributes} contentEditable={false}>
          <img src={element.url} alt={element.alt || ''} style={{ maxWidth: '100%' }} />
          {children}
        </div>
      )
    case 'video':
      return (
        <div {...attributes} contentEditable={false}>
          <video src={element.url} controls style={{ maxWidth: '100%' }} />
          {children}
        </div>
      )
    case 'horizontal-rule':
      return (
        <div {...attributes} contentEditable={false}>
          <hr />
          {children}
        </div>
      )
    case 'table':
      return <table {...attributes}><tbody>{children}</tbody></table>
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes}>{children}</td>
    case 'paragraph':
    default:
      return <p style={style} {...attributes}>{children}</p>
  }
}

const renderLeaf = (props: { attributes: any; children: React.ReactNode; leaf: CustomText }) => {
  const { attributes, leaf } = props
  let { children } = props

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }
  if (leaf.code) {
    children = <code>{children}</code>
  }
  if (leaf.subscript) {
    children = <sub>{children}</sub>
  }
  if (leaf.superscript) {
    children = <sup>{children}</sup>
  }

  const style: React.CSSProperties = {}
  if (leaf.color) style.color = leaf.color
  if (leaf.backgroundColor) style.backgroundColor = leaf.backgroundColor
  if (leaf.fontSize) style.fontSize = leaf.fontSize
  if (leaf.fontFamily) style.fontFamily = leaf.fontFamily

  return (
    <span {...attributes} style={Object.keys(style).length > 0 ? style : undefined}>
      {children}
    </span>
  )
}

// ============================================================================
// WITHPLUGINS
// ============================================================================

const withInlines = (editor: Editor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = (element) => {
    return ['image', 'video', 'horizontal-rule'].includes(element.type) ? true : isVoid(element)
  }

  return editor
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface SlateEditorComponentProps extends AdapterComponentProps {}

export const SlateEditorComponent = forwardRef<AdapterEditorRef, SlateEditorComponentProps>(
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
    // Create editor instance
    const editor = useMemo(
      () => withInlines(withHistory(withReact(createEditor()))),
      []
    )

    // Track fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Initial value
    const [editorValue, setEditorValue] = useState<Descendant[]>(() => {
      return deserializeFromHtml(value)
    })

    // Update value when prop changes
    useEffect(() => {
      const currentHtml = serializeToHtml(editorValue)
      if (value !== currentHtml) {
        const newValue = deserializeFromHtml(value)
        setEditorValue(newValue)
        // Reset editor selection
        editor.children = newValue
        Transforms.select(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 0 } })
      }
    }, [value])

    // Handle change
    const handleChange = useCallback(
      (newValue: Descendant[]) => {
        setEditorValue(newValue)
        const html = serializeToHtml(newValue)
        onChange?.(html)
      },
      [onChange]
    )

    // Handle keydown
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        for (const hotkey in HOTKEYS) {
          if (isHotkey(hotkey, event as any)) {
            event.preventDefault()
            const mark = HOTKEYS[hotkey]
            toggleMark(editor, mark)
          }
        }
      },
      [editor]
    )

    // Get text content
    const getText = useCallback(() => {
      return editorValue.map(n => Node.string(n)).join('\n')
    }, [editorValue])

    // Get character count
    const getCharacterCount = useCallback(() => {
      return getText().length
    }, [getText])

    // Get word count
    const getWordCount = useCallback(() => {
      const text = getText()
      return text.split(/\s+/).filter(word => word.length > 0).length
    }, [getText])

    // Toggle fullscreen
    const handleToggleFullscreen = useCallback(() => {
      setIsFullscreen(prev => !prev)
    }, [])

    // Print
    const handlePrint = useCallback(() => {
      const html = serializeToHtml(editorValue)
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
    }, [editorValue])

    // Handle media picker for images
    const handleMediaPickerImage = useCallback(async () => {
      if (onMediaPickerImage) {
        const file = await onMediaPickerImage()
        if (file) {
          const image: ImageElement = {
            type: 'image',
            url: file.url,
            alt: file.alt || file.name,
            children: [{ text: '' }],
          }
          Transforms.insertNodes(editor, image)
        }
      }
    }, [onMediaPickerImage, editor])

    // Handle media picker for videos
    const handleMediaPickerVideo = useCallback(async () => {
      if (onMediaPickerVideo) {
        const file = await onMediaPickerVideo()
        if (file) {
          const video: VideoElement = {
            type: 'video',
            url: file.url,
            children: [{ text: '' }],
          }
          Transforms.insertNodes(editor, video)
        }
      }
    }, [onMediaPickerVideo, editor])

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => serializeToHtml(editorValue),
      getText,
      getJSON: () => editorValue,
      setContent: (html: string) => {
        const newValue = deserializeFromHtml(html)
        setEditorValue(newValue)
        editor.children = newValue
      },
      focus: () => {
        ReactEditor.focus(editor)
      },
      blur: () => {
        ReactEditor.blur(editor)
      },
      insertHTML: (html: string) => {
        const fragment = deserializeFromHtml(html)
        Transforms.insertFragment(editor, fragment)
      },
      insertText: (text: string) => {
        Transforms.insertText(editor, text)
      },
      clear: () => {
        const emptyValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }]
        setEditorValue(emptyValue)
        editor.children = emptyValue
      },
      isEmpty: () => {
        return (
          editorValue.length === 1 &&
          editorValue[0].type === 'paragraph' &&
          (editorValue[0] as ParagraphElement).children.length === 1 &&
          ((editorValue[0] as ParagraphElement).children[0] as CustomText).text === ''
        )
      },
      getCharacterCount,
      getWordCount,
      isFullscreen: () => isFullscreen,
      toggleFullscreen: handleToggleFullscreen,
      print: handlePrint,
      undo: () => {
        HistoryEditor.undo(editor)
      },
      redo: () => {
        HistoryEditor.redo(editor)
      },
      canUndo: () => {
        return editor.history.undos.length > 0
      },
      canRedo: () => {
        return editor.history.redos.length > 0
      },
      getNativeEditor: () => editor,
    }))

    const characterCount = getCharacterCount()
    const characterLimit = charCounterMax > 0 ? charCounterMax : null

    return (
      <div
        ref={wrapperRef}
        className={`rte-builder-wrapper slate-editor ${disabled ? 'disabled' : ''} ${readOnly ? 'readonly' : ''} ${isFullscreen ? 'fullscreen' : ''} ${className}`}
      >
        <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
          <SlateToolbar
            editor={editor}
            buttons={toolbarButtons}
            onMediaPickerImage={onMediaPickerImage ? handleMediaPickerImage : undefined}
            onMediaPickerVideo={onMediaPickerVideo ? handleMediaPickerVideo : undefined}
            onToggleFullscreen={handleToggleFullscreen}
            onPrint={handlePrint}
            isFullscreen={isFullscreen}
            toggleMark={toggleMark}
            toggleBlock={toggleBlock}
            isMarkActive={isMarkActive}
            isBlockActive={isBlockActive}
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
            <Editable
              className="rte-builder-content"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              spellCheck
              autoFocus
              readOnly={disabled || readOnly}
              onKeyDown={handleKeyDown}
              onBlur={onBlur}
              onFocus={onFocus}
            />
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
        </Slate>
      </div>
    )
  }
)

SlateEditorComponent.displayName = 'SlateEditorComponent'

export default SlateEditorComponent
