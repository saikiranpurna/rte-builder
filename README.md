# rte-builder

A feature-rich, production-ready WYSIWYG editor for React based on TipTap with **zero licensing costs**. Built to replace Froala Editor with full feature parity and modern architecture.

## Features

✅ **No License Required** - MIT licensed, completely free
✅ **Full Feature Parity** - All Froala features replicated
✅ **TypeScript Native** - Full type safety
✅ **Modern & Fast** - Built on TipTap/ProseMirror
✅ **Syntax Highlighting** - 190+ languages via lowlight
✅ **Media Picker Support** - Easy integration with custom media libraries
✅ **Responsive Toolbar** - Adapts to screen sizes
✅ **Character Counter** - Built-in with limit support
✅ **Customizable** - Flexible toolbar and styling

## 🎯 Try the Demo

Experience all features interactively before installing:

```bash
# Clone or download the library
cd d:\projects\GrabOn\rte-builder

# Install demo dependencies
npm run demo:install

# Start demo server (opens at http://localhost:3000)
npm run demo
```

**Demo includes 8 interactive pages:**
- 🚀 Basic Usage
- 🎨 Toolbar Variations
- 🖼️ Media Picker Integration
- 📝 Form Integration
- ⚡ Advanced Features
- 💻 Code Editor with Syntax Highlighting
- 📊 Performance Testing
- ✨ All Features Showcase

👉 **[See full demo guide →](./DEMO.md)**

---

## Installation

```bash
npm install rte-builder
# or
yarn add rte-builder
# or
pnpm add rte-builder
```

## Quick Start

### Basic Usage

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'
import { useRef, useState } from 'react'

function App() {
  const editorRef = useRef<EditorRef>(null)
  const [content, setContent] = useState('<p>Hello World!</p>')

  return (
    <RichTextEditor
      ref={editorRef}
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
      height={400}
      toolbarPreset="full"
    />
  )
}
```

### With Media Picker Integration

```tsx
import { RichTextEditor } from 'rte-builder'
import type { MediaFile } from 'rte-builder'

function App() {
  const [content, setContent] = useState('')

  const handleImagePicker = async (): Promise<MediaFile | null> => {
    // Open your custom media picker dialog
    const file = await openMediaPickerDialog('image')

    if (file) {
      return {
        url: file.url,
        name: file.name,
        alt: file.alt,
      }
    }

    return null
  }

  const handleVideoPicker = async (): Promise<MediaFile | null> => {
    // Open your custom media picker dialog
    const file = await openMediaPickerDialog('video')

    if (file) {
      return {
        url: file.url,
        name: file.name,
      }
    }

    return null
  }

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      onMediaPickerImage={handleImagePicker}
      onMediaPickerVideo={handleVideoPicker}
    />
  )
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Initial HTML content |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `onBlur` | `() => void` | - | Callback when editor loses focus |
| `onFocus` | `() => void` | - | Callback when editor gains focus |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `height` | `number` | `400` | Editor height in pixels |
| `minHeight` | `number` | `300` | Minimum height in pixels |
| `maxHeight` | `number` | - | Maximum height in pixels |
| `disabled` | `boolean` | `false` | Disable editor |
| `readOnly` | `boolean` | `false` | Make editor read-only |
| `charCounterMax` | `number` | `-1` | Character limit (-1 for unlimited) |
| `showCharCounter` | `boolean` | `false` | Show character counter |
| `toolbarPreset` | `'full' \| 'medium' \| 'simple'` | `'full'` | Toolbar preset |
| `toolbarButtons` | `ToolbarButton[]` | - | Custom toolbar buttons |
| `className` | `string` | `''` | Additional CSS class |
| `onMediaPickerImage` | `() => Promise<MediaFile \| null>` | - | Custom image picker |
| `onMediaPickerVideo` | `() => Promise<MediaFile \| null>` | - | Custom video picker |
| `enableCodeHighlight` | `boolean` | `true` | Enable syntax highlighting |
| `defaultCodeLanguage` | `string` | `'javascript'` | Default code language |

### Ref Methods

Access editor methods via ref:

```tsx
const editorRef = useRef<EditorRef>(null)

// Get HTML content
const html = editorRef.current?.getContent()

// Set HTML content
editorRef.current?.setContent('<p>New content</p>')

// Focus editor
editorRef.current?.focus()

// Insert HTML at cursor
editorRef.current?.insertHTML('<p>Inserted content</p>')

// Clear all content
editorRef.current?.clear()

// Get TipTap editor instance (for advanced usage)
const editor = editorRef.current?.getEditor()
```

### Toolbar Presets

#### Full Toolbar (Default)
All available features including:
- Text formatting (bold, italic, underline, strike, code)
- Subscript, superscript
- Font family, font size
- Text color, background color
- Text alignment (left, center, right, justify)
- Lists (bullet, numbered)
- Headings (H1-H6), blockquote
- Links, images, videos, tables
- Code blocks, horizontal rules
- Undo/redo

#### Medium Toolbar
Standard editing features without advanced options:
- Basic text formatting
- Font family, font size, colors
- Text alignment
- Lists, headings
- Links, images, tables
- Undo/redo

#### Simple Toolbar
Minimal editing features:
- Bold, italic, underline
- Lists
- Links, images
- Undo/redo

### Custom Toolbar

Define your own toolbar buttons:

```tsx
import type { ToolbarButton } from 'rte-builder'

const customButtons: ToolbarButton[] = [
  'bold',
  'italic',
  'underline',
  'separator',
  'bulletList',
  'orderedList',
  'separator',
  'link',
  'image',
]

<RichTextEditor
  toolbarButtons={customButtons}
  // ...other props
/>
```

### Available Toolbar Buttons

- `bold`, `italic`, `underline`, `strike`, `code`
- `subscript`, `superscript`
- `clearFormatting`
- `fontFamily`, `fontSize`
- `textColor`, `backgroundColor`
- `alignLeft`, `alignCenter`, `alignRight`, `alignJustify`
- `bulletList`, `orderedList`
- `heading1`, `heading2`, `heading3`, `heading4`, `heading5`, `heading6`
- `blockquote`, `horizontalRule`
- `link`, `image`, `video`, `table`
- `codeBlock`
- `undo`, `redo`
- `separator` (visual separator)

## Styling

The editor comes with default styling that works out of the box. You can customize it:

### Override CSS Variables

```css
.rte-builder-wrapper {
  --editor-border-color: #e5e7eb;
  --editor-background: #ffffff;
  --toolbar-background: #f9fafb;
  --button-active-color: #3b82f6;
  --text-color: #1f2937;
}
```

### Custom CSS Classes

Add custom styling to specific elements:

```css
/* Custom toolbar styling */
.my-custom-editor .rte-builder-toolbar {
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
}

/* Custom content styling */
.my-custom-editor .rte-builder-content {
  font-family: 'Georgia', serif;
  font-size: 16px;
}
```

## Advanced Usage

### Accessing TipTap Editor Instance

For advanced use cases, access the underlying TipTap editor:

```tsx
const editorRef = useRef<EditorRef>(null)

const insertCustomContent = () => {
  const editor = editorRef.current?.getEditor()

  if (editor) {
    // Use TipTap commands directly
    editor.chain()
      .focus()
      .insertContent('<p>Custom content</p>')
      .run()
  }
}
```

### Creating Custom Extensions

Extend the editor with your own TipTap extensions:

```tsx
import { RichTextEditor } from 'rte-builder'
import { Extension } from '@tiptap/core'

const MyCustomExtension = Extension.create({
  name: 'myCustomExtension',
  // ... extension configuration
})

<RichTextEditor
  config={{
    extensions: [MyCustomExtension]
  }}
/>
```

## Migration from Froala

### Key Differences

| Feature | Froala | rte-builder |
|---------|--------|----------------|
| License | Paid ($399+/year) | Free (MIT) |
| Framework | jQuery-based | React-first |
| Bundle Size | ~500KB | ~300KB |
| TypeScript | Partial | Native |
| Customization | Moderate | Full control |

### Migration Guide

1. **Install the package**
   ```bash
   npm install rte-builder
   ```

2. **Replace component import**
   ```tsx
   // Before (Froala)
   import FroalaEditor from 'react-froala-wysiwyg'

   // After (rte-builder)
   import { RichTextEditor } from 'rte-builder'
   ```

3. **Update props**
   ```tsx
   // Before (Froala)
   <FroalaEditor
     model={content}
     onModelChange={setContent}
     config={{
       key: FROALA_LICENSE_KEY,
       placeholderText: 'Type here...',
       height: 400,
     }}
   />

   // After (rte-builder)
   <RichTextEditor
     value={content}
     onChange={setContent}
     placeholder="Type here..."
     height={400}
   />
   ```

4. **Migrate custom buttons**

   Froala custom commands can be replaced with TipTap extensions or toolbar callbacks.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT © RTE Builder Team

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/rte-builder/issues)
- Documentation: [Full docs](https://github.com/yourusername/rte-builder)

---

**Built with ❤️ using [TipTap](https://tiptap.dev)**
