/**
 * TipTap Toolbar Component
 *
 * Toolbar implementation specific to TipTap editor.
 */

import React, { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import type { ToolbarButtonType } from '../../core/types'
import { EMOJI_CATEGORIES } from '../../extensions/Emoji'

interface TipTapToolbarProps {
  editor: Editor | null
  buttons: ToolbarButtonType[]
  onMediaPickerImage?: () => void
  onMediaPickerVideo?: () => void
}

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
]

const FONT_SIZES = [
  '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px',
]

const LINE_HEIGHTS = [
  { value: '1', label: 'Single' },
  { value: '1.15', label: '1.15' },
  { value: '1.5', label: '1.5' },
  { value: '1.75', label: '1.75' },
  { value: '2', label: 'Double' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: 'Triple' },
]

// Emoji Picker Component
const EmojiPicker: React.FC<{
  onSelect: (emoji: string) => void
  onClose: () => void
}> = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('smileys')
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div ref={popoverRef} className="rte-builder-emoji-picker">
      <div className="rte-builder-emoji-categories">
        {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            type="button"
            className={`rte-builder-emoji-category-btn ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key as keyof typeof EMOJI_CATEGORIES)}
            title={category.label}
          >
            {category.emojis[0]}
          </button>
        ))}
      </div>
      <div className="rte-builder-emoji-grid">
        {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            type="button"
            className="rte-builder-emoji-btn"
            onClick={() => {
              onSelect(emoji)
              onClose()
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export const TipTapToolbar: React.FC<TipTapToolbarProps> = ({
  editor,
  buttons,
  onMediaPickerImage,
  onMediaPickerVideo,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)

  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
    title,
    buttonRef,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
    buttonRef?: React.RefObject<HTMLButtonElement>
  }) => (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rte-builder-toolbar-btn ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
    >
      {children}
    </button>
  )

  const renderButton = (button: ToolbarButtonType, index: number) => {
    switch (button) {
      case 'bold':
        return (
          <ToolbarButton
            key="bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
        )

      case 'italic':
        return (
          <ToolbarButton
            key="italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
        )

      case 'underline':
        return (
          <ToolbarButton
            key="underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </ToolbarButton>
        )

      case 'strike':
        return (
          <ToolbarButton
            key="strike"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolbarButton>
        )

      case 'code':
        return (
          <ToolbarButton
            key="code"
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline Code"
          >
            {'</>'}
          </ToolbarButton>
        )

      case 'codeBlock':
        return (
          <ToolbarButton
            key="codeBlock"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            {'{ }'}
          </ToolbarButton>
        )

      case 'subscript':
        return (
          <ToolbarButton
            key="subscript"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            active={editor.isActive('subscript')}
            title="Subscript"
          >
            X<sub>2</sub>
          </ToolbarButton>
        )

      case 'superscript':
        return (
          <ToolbarButton
            key="superscript"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            active={editor.isActive('superscript')}
            title="Superscript"
          >
            X<sup>2</sup>
          </ToolbarButton>
        )

      case 'clearFormatting':
        return (
          <ToolbarButton
            key="clearFormatting"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            ✕
          </ToolbarButton>
        )

      case 'fontFamily':
        return (
          <select
            key="fontFamily"
            className="rte-builder-toolbar-select"
            onChange={(e) => {
              if (e.target.value === 'default') {
                editor.chain().focus().unsetFontFamily().run()
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run()
              }
            }}
            value={editor.getAttributes('textStyle').fontFamily || 'default'}
          >
            <option value="default">Font Family</option>
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        )

      case 'fontSize':
        return (
          <select
            key="fontSize"
            className="rte-builder-toolbar-select"
            onChange={(e) => {
              if (e.target.value === 'default') {
                editor.chain().focus().unsetFontSize().run()
              } else {
                editor.chain().focus().setFontSize(e.target.value).run()
              }
            }}
            value={editor.getAttributes('textStyle').fontSize || 'default'}
          >
            <option value="default">Font Size</option>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        )

      case 'lineHeight':
        return (
          <select
            key="lineHeight"
            className="rte-builder-toolbar-select rte-builder-toolbar-select-sm"
            onChange={(e) => {
              if (e.target.value === 'default') {
                editor.chain().focus().unsetLineHeight().run()
              } else {
                editor.chain().focus().setLineHeight(e.target.value).run()
              }
            }}
            value={
              editor.getAttributes('paragraph').lineHeight ||
              editor.getAttributes('heading').lineHeight ||
              'default'
            }
            title="Line Height"
          >
            <option value="default">Line Height</option>
            {LINE_HEIGHTS.map((lh) => (
              <option key={lh.value} value={lh.value}>
                {lh.label}
              </option>
            ))}
          </select>
        )

      case 'textColor':
        return (
          <span key="textColor" className="rte-builder-toolbar-color">
            <label title="Text Color">
              A
              <input
                type="color"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
              />
            </label>
          </span>
        )

      case 'backgroundColor':
        return (
          <span key="backgroundColor" className="rte-builder-toolbar-color">
            <label title="Background Color">
              ⬛
              <input
                type="color"
                onChange={(e) =>
                  editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
                }
                value={editor.getAttributes('highlight').color || '#ffff00'}
              />
            </label>
          </span>
        )

      case 'alignLeft':
        return (
          <ToolbarButton
            key="alignLeft"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            ⬅
          </ToolbarButton>
        )

      case 'alignCenter':
        return (
          <ToolbarButton
            key="alignCenter"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            ↔
          </ToolbarButton>
        )

      case 'alignRight':
        return (
          <ToolbarButton
            key="alignRight"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            ➡
          </ToolbarButton>
        )

      case 'alignJustify':
        return (
          <ToolbarButton
            key="alignJustify"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            ⬌
          </ToolbarButton>
        )

      case 'indent':
        return (
          <ToolbarButton
            key="indent"
            onClick={() => editor.chain().focus().indent().run()}
            title="Indent (Tab)"
          >
            →|
          </ToolbarButton>
        )

      case 'outdent':
        return (
          <ToolbarButton
            key="outdent"
            onClick={() => editor.chain().focus().outdent().run()}
            title="Outdent (Shift+Tab)"
          >
            |←
          </ToolbarButton>
        )

      case 'bulletList':
        return (
          <ToolbarButton
            key="bulletList"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            •
          </ToolbarButton>
        )

      case 'orderedList':
        return (
          <ToolbarButton
            key="orderedList"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            1.
          </ToolbarButton>
        )

      case 'heading1':
      case 'heading2':
      case 'heading3':
      case 'heading4':
      case 'heading5':
      case 'heading6':
        const level = parseInt(button.replace('heading', '')) as 1 | 2 | 3 | 4 | 5 | 6
        return (
          <ToolbarButton
            key={button}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
            title={`Heading ${level}`}
          >
            H{level}
          </ToolbarButton>
        )

      case 'blockquote':
        return (
          <ToolbarButton
            key="blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            "
          </ToolbarButton>
        )

      case 'horizontalRule':
        return (
          <ToolbarButton
            key="horizontalRule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            ―
          </ToolbarButton>
        )

      case 'link':
        return (
          <ToolbarButton
            key="link"
            onClick={() => {
              const url = window.prompt('Enter URL:')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            active={editor.isActive('link')}
            title="Insert Link"
          >
            🔗
          </ToolbarButton>
        )

      case 'unlink':
        return (
          <ToolbarButton
            key="unlink"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            title="Remove Link"
          >
            🔗✕
          </ToolbarButton>
        )

      case 'image':
        return (
          <ToolbarButton
            key="image"
            onClick={() => {
              if (onMediaPickerImage) {
                onMediaPickerImage()
              } else {
                const url = window.prompt('Enter image URL:')
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                }
              }
            }}
            title="Insert Image"
          >
            🖼️
          </ToolbarButton>
        )

      case 'video':
        return (
          <ToolbarButton
            key="video"
            onClick={() => {
              if (onMediaPickerVideo) {
                onMediaPickerVideo()
              } else {
                const url = window.prompt('Enter video URL:')
                if (url) {
                  editor.chain().focus().setVideo({ src: url }).run()
                }
              }
            }}
            title="Insert Video"
          >
            🎥
          </ToolbarButton>
        )

      case 'table':
        return (
          <ToolbarButton
            key="table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            title="Insert Table"
          >
            ⊞
          </ToolbarButton>
        )

      case 'emoji':
        return (
          <span key="emoji" style={{ position: 'relative' }}>
            <ToolbarButton
              buttonRef={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              active={showEmojiPicker}
              title="Insert Emoji"
            >
              😀
            </ToolbarButton>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) => editor.chain().focus().insertEmoji(emoji).run()}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </span>
        )

      case 'fullscreen':
        const isFullscreen = editor.storage.fullscreen?.isFullscreen || false
        return (
          <ToolbarButton
            key="fullscreen"
            onClick={() => editor.chain().focus().toggleFullscreen().run()}
            active={isFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (Ctrl+Shift+F)'}
          >
            {isFullscreen ? '⊗' : '⛶'}
          </ToolbarButton>
        )

      case 'print':
        return (
          <ToolbarButton
            key="print"
            onClick={() => editor.chain().focus().print().run()}
            title="Print (Ctrl+P)"
          >
            🖨️
          </ToolbarButton>
        )

      case 'undo':
        return (
          <ToolbarButton
            key="undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </ToolbarButton>
        )

      case 'redo':
        return (
          <ToolbarButton
            key="redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </ToolbarButton>
        )

      case 'separator':
        return <div key={`sep-${index}`} className="rte-builder-toolbar-separator" />

      default:
        return null
    }
  }

  return <div className="rte-builder-toolbar">{buttons.map(renderButton)}</div>
}

export default TipTapToolbar
