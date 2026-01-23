/**
 * Slate.js Toolbar Component
 *
 * A toolbar component for the Slate.js editor with all standard formatting options.
 */

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { useSlate, ReactEditor } from 'slate-react'

import type { ToolbarButtonType } from '../../core/types'
import { EMOJI_CATEGORIES } from '../../extensions/Emoji'

// ============================================================================
// TYPES
// ============================================================================

interface SlateToolbarProps {
  editor: Editor
  buttons?: ToolbarButtonType[]
  onMediaPickerImage?: () => Promise<void>
  onMediaPickerVideo?: () => Promise<void>
  onToggleFullscreen?: () => void
  onPrint?: () => void
  isFullscreen?: boolean
  toggleMark: (editor: Editor, format: string) => void
  toggleBlock: (editor: Editor, format: string) => void
  isMarkActive: (editor: Editor, format: string) => boolean
  isBlockActive: (editor: Editor, format: string, blockType?: 'type' | 'align') => boolean
}

// ============================================================================
// TOOLBAR BUTTON COMPONENT
// ============================================================================

interface ToolbarButtonProps {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active = false,
  disabled = false,
  onClick,
  title,
  children,
}) => (
  <button
    className={`rte-builder-toolbar-button ${active ? 'active' : ''}`}
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
    disabled={disabled}
    title={title}
    type="button"
  >
    {children}
  </button>
)

// ============================================================================
// TOOLBAR ICONS (Simple SVG icons)
// ============================================================================

const icons: Record<string, JSX.Element> = {
  bold: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
  italic: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>,
  underline: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
  strike: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>,
  code: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
  codeBlock: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
  subscript: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M22 18h-2v1h3v1h-4v-2.5a.5.5 0 01.5-.5h2a.5.5 0 00.5-.5v-.5H18v-1h4v2.5a.5.5 0 01-.5.5h-2a.5.5 0 00-.5.5v.5zM5.88 5h2.66l3.4 5.42h.12L15.5 5h2.62l-4.87 7.38L18.22 20h-2.66l-3.62-5.63h-.12l-3.62 5.63H5.56l4.92-7.62L5.88 5z"/></svg>,
  superscript: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M22 7h-2v1h3v1h-4V6.5a.5.5 0 01.5-.5h2a.5.5 0 00.5-.5v-.5H18V4h4v2.5a.5.5 0 01-.5.5h-2a.5.5 0 00-.5.5v.5zM5.88 5h2.66l3.4 5.42h.12L15.5 5h2.62l-4.87 7.38L18.22 20h-2.66l-3.62-5.63h-.12l-3.62 5.63H5.56l4.92-7.62L5.88 5z"/></svg>,
  clearFormatting: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/></svg>,
  fontFamily: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9.93 13.5h4.14L12 7.98 9.93 13.5zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/></svg>,
  fontSize: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3v-3H3v3z"/></svg>,
  lineHeight: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h2.5L5 3.5 1.5 7H4v10H1.5L5 20.5 8.5 17H6V7zm4-2v2h12V5H10zm0 14h12v-2H10v2zm0-6h12v-2H10v2z"/></svg>,
  textColor: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/></svg>,
  backgroundColor: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5zM2 20h20v4H2v-4z"/></svg>,
  alignLeft: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>,
  alignCenter: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>,
  alignRight: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>,
  alignJustify: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>,
  indent: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>,
  outdent: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>,
  bulletList: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
  orderedList: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
  heading1: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/></svg>,
  heading2: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2h-2v2h4v2H9v-4c0-1.1.9-2 2-2h2V9H9V7h4c1.1 0 2 .9 2 2v2z"/></svg>,
  heading3: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2v0c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2H9v-2h4v-2h-2v-2h2V9H9V7h4c1.1 0 2 .9 2 2v2z"/></svg>,
  blockquote: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
  horizontalRule: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M4 11h16v2H4z"/></svg>,
  link: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
  unlink: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11A4.991 4.991 0 002 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z"/></svg>,
  image: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  video: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>,
  table: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/></svg>,
  emoji: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
  undo: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12.5 8c-2.65 0-5.05 1.04-6.83 2.73L3 8v9h9l-3.01-3c1.37-1.12 3.11-1.8 5.01-1.8 3.33 0 6.17 2.11 7.22 5.06l1.98-.65C21.79 12.58 17.54 8 12.5 8z"/></svg>,
  redo: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22l1.98.65c1.05-3.19 4.05-5.47 7.98-5.47 1.9 0 3.64.68 5.01 1.8L13.5 15h9V6l-4.1 4.6z"/></svg>,
  fullscreen: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>,
  print: <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SlateToolbar: React.FC<SlateToolbarProps> = ({
  editor,
  buttons = [],
  onMediaPickerImage,
  onMediaPickerVideo,
  onToggleFullscreen,
  onPrint,
  isFullscreen = false,
  toggleMark,
  toggleBlock,
  isMarkActive,
  isBlockActive,
}) => {
  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<string>('smileys')
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Link dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const linkDialogRef = useRef<HTMLDivElement>(null)

  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState<'text' | 'bg' | null>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
      if (linkDialogRef.current && !linkDialogRef.current.contains(event.target as Node)) {
        setShowLinkDialog(false)
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Insert emoji
  const insertEmoji = useCallback(
    (emoji: string) => {
      Transforms.insertText(editor, emoji)
      setShowEmojiPicker(false)
      ReactEditor.focus(editor)
    },
    [editor]
  )

  // Insert link
  const insertLink = useCallback(() => {
    if (linkUrl) {
      const link = {
        type: 'link' as const,
        url: linkUrl,
        children: [{ text: linkUrl }],
      }
      Transforms.insertNodes(editor, link)
      setLinkUrl('')
      setShowLinkDialog(false)
      ReactEditor.focus(editor)
    }
  }, [editor, linkUrl])

  // Remove link
  const removeLink = useCallback(() => {
    Transforms.unwrapNodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
  }, [editor])

  // Insert horizontal rule
  const insertHorizontalRule = useCallback(() => {
    const hr = { type: 'horizontal-rule' as const, children: [{ text: '' }] }
    Transforms.insertNodes(editor, hr)
    Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
  }, [editor])

  // Insert table
  const insertTable = useCallback(() => {
    const table = {
      type: 'table' as const,
      children: [
        {
          type: 'table-row' as const,
          children: [
            { type: 'table-cell' as const, children: [{ text: '' }] },
            { type: 'table-cell' as const, children: [{ text: '' }] },
            { type: 'table-cell' as const, children: [{ text: '' }] },
          ],
        },
        {
          type: 'table-row' as const,
          children: [
            { type: 'table-cell' as const, children: [{ text: '' }] },
            { type: 'table-cell' as const, children: [{ text: '' }] },
            { type: 'table-cell' as const, children: [{ text: '' }] },
          ],
        },
      ],
    }
    Transforms.insertNodes(editor, table)
  }, [editor])

  // Set color
  const setColor = useCallback(
    (color: string, type: 'text' | 'bg') => {
      if (type === 'text') {
        Editor.addMark(editor, 'color', color)
      } else {
        Editor.addMark(editor, 'backgroundColor', color)
      }
      setShowColorPicker(null)
    },
    [editor]
  )

  // Color palette
  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  ]

  // Render toolbar button based on type
  const renderButton = (button: ToolbarButtonType, index: number) => {
    if (button === 'separator') {
      return <div key={`sep-${index}`} className="rte-builder-toolbar-separator" />
    }

    switch (button) {
      // Text formatting
      case 'bold':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'bold')}
            onClick={() => toggleMark(editor, 'bold')}
            title="Bold (Ctrl+B)"
          >
            {icons.bold}
          </ToolbarButton>
        )
      case 'italic':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'italic')}
            onClick={() => toggleMark(editor, 'italic')}
            title="Italic (Ctrl+I)"
          >
            {icons.italic}
          </ToolbarButton>
        )
      case 'underline':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'underline')}
            onClick={() => toggleMark(editor, 'underline')}
            title="Underline (Ctrl+U)"
          >
            {icons.underline}
          </ToolbarButton>
        )
      case 'strike':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'strikethrough')}
            onClick={() => toggleMark(editor, 'strikethrough')}
            title="Strikethrough"
          >
            {icons.strike}
          </ToolbarButton>
        )
      case 'code':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'code')}
            onClick={() => toggleMark(editor, 'code')}
            title="Code"
          >
            {icons.code}
          </ToolbarButton>
        )
      case 'codeBlock':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'code-block')}
            onClick={() => toggleBlock(editor, 'code-block')}
            title="Code Block"
          >
            {icons.codeBlock}
          </ToolbarButton>
        )
      case 'subscript':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'subscript')}
            onClick={() => toggleMark(editor, 'subscript')}
            title="Subscript"
          >
            {icons.subscript}
          </ToolbarButton>
        )
      case 'superscript':
        return (
          <ToolbarButton
            key={button}
            active={isMarkActive(editor, 'superscript')}
            onClick={() => toggleMark(editor, 'superscript')}
            title="Superscript"
          >
            {icons.superscript}
          </ToolbarButton>
        )
      case 'clearFormatting':
        return (
          <ToolbarButton
            key={button}
            onClick={() => {
              Editor.removeMark(editor, 'bold')
              Editor.removeMark(editor, 'italic')
              Editor.removeMark(editor, 'underline')
              Editor.removeMark(editor, 'strikethrough')
              Editor.removeMark(editor, 'code')
              Editor.removeMark(editor, 'subscript')
              Editor.removeMark(editor, 'superscript')
              Editor.removeMark(editor, 'color')
              Editor.removeMark(editor, 'backgroundColor')
              Editor.removeMark(editor, 'fontSize')
              Editor.removeMark(editor, 'fontFamily')
            }}
            title="Clear Formatting"
          >
            {icons.clearFormatting}
          </ToolbarButton>
        )

      // Alignment
      case 'alignLeft':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'left', 'align')}
            onClick={() => toggleBlock(editor, 'left')}
            title="Align Left"
          >
            {icons.alignLeft}
          </ToolbarButton>
        )
      case 'alignCenter':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'center', 'align')}
            onClick={() => toggleBlock(editor, 'center')}
            title="Align Center"
          >
            {icons.alignCenter}
          </ToolbarButton>
        )
      case 'alignRight':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'right', 'align')}
            onClick={() => toggleBlock(editor, 'right')}
            title="Align Right"
          >
            {icons.alignRight}
          </ToolbarButton>
        )
      case 'alignJustify':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'justify', 'align')}
            onClick={() => toggleBlock(editor, 'justify')}
            title="Justify"
          >
            {icons.alignJustify}
          </ToolbarButton>
        )

      // Lists
      case 'bulletList':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'bulleted-list')}
            onClick={() => toggleBlock(editor, 'bulleted-list')}
            title="Bullet List"
          >
            {icons.bulletList}
          </ToolbarButton>
        )
      case 'orderedList':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'numbered-list')}
            onClick={() => toggleBlock(editor, 'numbered-list')}
            title="Numbered List"
          >
            {icons.orderedList}
          </ToolbarButton>
        )

      // Headings
      case 'heading1':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'heading')}
            onClick={() => {
              Transforms.setNodes(editor, { type: 'heading', level: 1 } as any)
            }}
            title="Heading 1"
          >
            {icons.heading1}
          </ToolbarButton>
        )
      case 'heading2':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'heading')}
            onClick={() => {
              Transforms.setNodes(editor, { type: 'heading', level: 2 } as any)
            }}
            title="Heading 2"
          >
            {icons.heading2}
          </ToolbarButton>
        )
      case 'heading3':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'heading')}
            onClick={() => {
              Transforms.setNodes(editor, { type: 'heading', level: 3 } as any)
            }}
            title="Heading 3"
          >
            {icons.heading3}
          </ToolbarButton>
        )

      // Blocks
      case 'blockquote':
        return (
          <ToolbarButton
            key={button}
            active={isBlockActive(editor, 'blockquote')}
            onClick={() => toggleBlock(editor, 'blockquote')}
            title="Blockquote"
          >
            {icons.blockquote}
          </ToolbarButton>
        )
      case 'horizontalRule':
        return (
          <ToolbarButton
            key={button}
            onClick={insertHorizontalRule}
            title="Horizontal Rule"
          >
            {icons.horizontalRule}
          </ToolbarButton>
        )

      // Links
      case 'link':
        return (
          <div key={button} className="rte-builder-toolbar-dropdown" ref={linkDialogRef}>
            <ToolbarButton
              onClick={() => setShowLinkDialog(!showLinkDialog)}
              title="Insert Link"
            >
              {icons.link}
            </ToolbarButton>
            {showLinkDialog && (
              <div className="rte-builder-toolbar-dropdown-content">
                <input
                  type="url"
                  placeholder="Enter URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      insertLink()
                    }
                  }}
                  autoFocus
                />
                <button onClick={insertLink}>Insert</button>
              </div>
            )}
          </div>
        )
      case 'unlink':
        return (
          <ToolbarButton
            key={button}
            onClick={removeLink}
            title="Remove Link"
          >
            {icons.unlink}
          </ToolbarButton>
        )

      // Media
      case 'image':
        return (
          <ToolbarButton
            key={button}
            onClick={onMediaPickerImage || (() => {})}
            disabled={!onMediaPickerImage}
            title="Insert Image"
          >
            {icons.image}
          </ToolbarButton>
        )
      case 'video':
        return (
          <ToolbarButton
            key={button}
            onClick={onMediaPickerVideo || (() => {})}
            disabled={!onMediaPickerVideo}
            title="Insert Video"
          >
            {icons.video}
          </ToolbarButton>
        )
      case 'table':
        return (
          <ToolbarButton
            key={button}
            onClick={insertTable}
            title="Insert Table"
          >
            {icons.table}
          </ToolbarButton>
        )

      // Colors
      case 'textColor':
        return (
          <div key={button} className="rte-builder-toolbar-dropdown" ref={colorPickerRef}>
            <ToolbarButton
              onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
              title="Text Color"
            >
              {icons.textColor}
            </ToolbarButton>
            {showColorPicker === 'text' && (
              <div className="rte-builder-toolbar-dropdown-content rte-builder-color-picker">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="rte-builder-color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => setColor(color, 'text')}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        )
      case 'backgroundColor':
        return (
          <div key={button} className="rte-builder-toolbar-dropdown" ref={colorPickerRef}>
            <ToolbarButton
              onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
              title="Background Color"
            >
              {icons.backgroundColor}
            </ToolbarButton>
            {showColorPicker === 'bg' && (
              <div className="rte-builder-toolbar-dropdown-content rte-builder-color-picker">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="rte-builder-color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => setColor(color, 'bg')}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        )

      // Emoji
      case 'emoji':
        return (
          <div key={button} className="rte-builder-toolbar-dropdown" ref={emojiPickerRef}>
            <ToolbarButton
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Insert Emoji"
            >
              {icons.emoji}
            </ToolbarButton>
            {showEmojiPicker && (
              <div className="rte-builder-emoji-picker">
                <div className="rte-builder-emoji-categories">
                  {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
                    <button
                      key={key}
                      className={`rte-builder-emoji-category-btn ${selectedEmojiCategory === key ? 'active' : ''}`}
                      onClick={() => setSelectedEmojiCategory(key)}
                      title={(category as any).label}
                    >
                      {(category as any).emojis[0]}
                    </button>
                  ))}
                </div>
                <div className="rte-builder-emoji-grid">
                  {(EMOJI_CATEGORIES[selectedEmojiCategory as keyof typeof EMOJI_CATEGORIES] as any)?.emojis.map(
                    (emoji: string, idx: number) => (
                      <button
                        key={idx}
                        className="rte-builder-emoji-btn"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )

      // Actions
      case 'undo':
        return (
          <ToolbarButton
            key={button}
            onClick={() => editor.undo()}
            title="Undo (Ctrl+Z)"
          >
            {icons.undo}
          </ToolbarButton>
        )
      case 'redo':
        return (
          <ToolbarButton
            key={button}
            onClick={() => editor.redo()}
            title="Redo (Ctrl+Y)"
          >
            {icons.redo}
          </ToolbarButton>
        )
      case 'fullscreen':
        return (
          <ToolbarButton
            key={button}
            active={isFullscreen}
            onClick={onToggleFullscreen || (() => {})}
            title="Toggle Fullscreen"
          >
            {icons.fullscreen}
          </ToolbarButton>
        )
      case 'print':
        return (
          <ToolbarButton
            key={button}
            onClick={onPrint || (() => {})}
            title="Print"
          >
            {icons.print}
          </ToolbarButton>
        )

      default:
        return null
    }
  }

  return (
    <div className="rte-builder-toolbar slate-toolbar">
      {buttons.map((button, index) => renderButton(button, index))}
    </div>
  )
}

export default SlateToolbar
