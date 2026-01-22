import React from 'react'
import type { Editor } from '@tiptap/react'
import type { ToolbarButton } from '../types'

interface ToolbarProps {
  editor: Editor | null
  buttons: ToolbarButton[]
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

const HEADINGS = [
  { level: 1, label: 'Heading 1' },
  { level: 2, label: 'Heading 2' },
  { level: 3, label: 'Heading 3' },
  { level: 4, label: 'Heading 4' },
  { level: 5, label: 'Heading 5' },
  { level: 6, label: 'Heading 6' },
] as const

const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
]

export const Toolbar: React.FC<ToolbarProps> = ({ editor, buttons, onMediaPickerImage, onMediaPickerVideo }) => {
  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
    title
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rte-builder-toolbar-btn ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
    >
      {children}
    </button>
  )

  const renderButton = (button: ToolbarButton) => {
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
                onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
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
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            ⊞
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
        return <span key={`sep-${Math.random()}`} className="rte-builder-toolbar-separator">|</span>

      default:
        return null
    }
  }

  return (
    <div className="rte-builder-toolbar">
      {buttons.map(renderButton)}
    </div>
  )
}
