# Usage Examples

## Basic Examples

### 1. Simple Editor

```tsx
import { RichTextEditor } from 'rte-builder'
import { useState } from 'react'

export function SimpleEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  )
}
```

### 2. Controlled Editor with Ref

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'
import { useRef, useState } from 'react'

export function ControlledEditor() {
  const editorRef = useRef<EditorRef>(null)
  const [content, setContent] = useState('')

  const handleSave = () => {
    const html = editorRef.current?.getContent()
    console.log('Saving:', html)
    // Save to API
  }

  const handleClear = () => {
    editorRef.current?.clear()
  }

  return (
    <div>
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

### 3. Simple Toolbar

```tsx
import { RichTextEditor } from 'rte-builder'
import { useState } from 'react'

export function SimpleToolbarEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      toolbarPreset="simple"
      height={300}
    />
  )
}
```

### 4. Read-Only Editor

```tsx
import { RichTextEditor } from 'rte-builder'

export function ReadOnlyEditor({ content }: { content: string }) {
  return (
    <RichTextEditor
      value={content}
      readOnly
      toolbarPreset="simple"
    />
  )
}
```

## Advanced Examples

### 5. Custom Toolbar

```tsx
import { RichTextEditor } from 'rte-builder'
import type { ToolbarButton } from 'rte-builder'
import { useState } from 'react'

export function CustomToolbarEditor() {
  const [content, setContent] = useState('')

  const customButtons: ToolbarButton[] = [
    'bold',
    'italic',
    'underline',
    'strike',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'separator',
    'bulletList',
    'orderedList',
    'separator',
    'link',
    'image',
    'codeBlock',
    'separator',
    'undo',
    'redo',
  ]

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      toolbarButtons={customButtons}
    />
  )
}
```

### 6. Character Counter

```tsx
import { RichTextEditor } from 'rte-builder'
import { useState } from 'react'

export function CharacterLimitEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      showCharCounter
      charCounterMax={1000}
      placeholder="Maximum 1000 characters..."
    />
  )
}
```

### 7. Media Picker Integration

```tsx
import { RichTextEditor } from 'rte-builder'
import type { MediaFile } from 'rte-builder'
import { useState } from 'react'

export function MediaPickerEditor() {
  const [content, setContent] = useState('')
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [mediaResolver, setMediaResolver] = useState<((file: MediaFile | null) => void) | null>(null)

  const handleImagePicker = (): Promise<MediaFile | null> => {
    return new Promise((resolve) => {
      setMediaType('image')
      setMediaDialogOpen(true)
      setMediaResolver(() => resolve)
    })
  }

  const handleVideoPicker = (): Promise<MediaFile | null> => {
    return new Promise((resolve) => {
      setMediaType('video')
      setMediaDialogOpen(true)
      setMediaResolver(() => resolve)
    })
  }

  const handleMediaSelect = (file: MediaFile) => {
    if (mediaResolver) {
      mediaResolver(file)
      setMediaResolver(null)
    }
    setMediaDialogOpen(false)
  }

  const handleMediaCancel = () => {
    if (mediaResolver) {
      mediaResolver(null)
      setMediaResolver(null)
    }
    setMediaDialogOpen(false)
  }

  return (
    <>
      <RichTextEditor
        value={content}
        onChange={setContent}
        onMediaPickerImage={handleImagePicker}
        onMediaPickerVideo={handleVideoPicker}
      />

      {/* Your custom media picker dialog */}
      <MediaPickerDialog
        open={mediaDialogOpen}
        type={mediaType}
        onSelect={handleMediaSelect}
        onCancel={handleMediaCancel}
      />
    </>
  )
}
```

### 8. Form Integration

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'
import { useRef, useState } from 'react'

interface FormData {
  title: string
  content: string
}

export function FormWithEditor() {
  const editorRef = useRef<EditorRef>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const content = editorRef.current?.getContent() || ''

    const data = {
      ...formData,
      content,
    }

    console.log('Submitting:', data)
    // Submit to API
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label>Content</label>
        <RichTextEditor
          ref={editorRef}
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          height={400}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
```

### 9. Multiple Editors

```tsx
import { RichTextEditor } from 'rte-builder'
import { useState } from 'react'

export function MultipleEditors() {
  const [intro, setIntro] = useState('')
  const [body, setBody] = useState('')
  const [conclusion, setConclusion] = useState('')

  return (
    <div>
      <section>
        <h3>Introduction</h3>
        <RichTextEditor
          value={intro}
          onChange={setIntro}
          height={200}
          toolbarPreset="simple"
        />
      </section>

      <section>
        <h3>Main Content</h3>
        <RichTextEditor
          value={body}
          onChange={setBody}
          height={400}
          toolbarPreset="full"
        />
      </section>

      <section>
        <h3>Conclusion</h3>
        <RichTextEditor
          value={conclusion}
          onChange={setConclusion}
          height={200}
          toolbarPreset="simple"
        />
      </section>
    </div>
  )
}
```

### 10. Code Editor with Syntax Highlighting

```tsx
import { RichTextEditor } from 'rte-builder'
import type { ToolbarButton } from 'rte-builder'
import { useState } from 'react'

export function CodeEditor() {
  const [content, setContent] = useState('')

  const codeButtons: ToolbarButton[] = [
    'bold',
    'italic',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'separator',
    'bulletList',
    'orderedList',
    'separator',
    'codeBlock', // Important: Code block with syntax highlighting
    'code', // Inline code
    'separator',
    'undo',
    'redo',
  ]

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      toolbarButtons={codeButtons}
      enableCodeHighlight={true}
      defaultCodeLanguage="typescript"
    />
  )
}
```

### 11. Dark Mode Support

```tsx
import { RichTextEditor } from 'rte-builder'
import { useState } from 'react'
import './dark-mode.css' // Your custom dark mode CSS

export function DarkModeEditor() {
  const [content, setContent] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode
      </button>

      <RichTextEditor
        value={content}
        onChange={setContent}
        className={darkMode ? 'editor-dark' : 'editor-light'}
      />
    </div>
  )
}
```

```css
/* dark-mode.css */
.dark-mode .rte-builder-wrapper {
  background: #1f2937;
  border-color: #374151;
}

.dark-mode .rte-builder-toolbar {
  background: #111827;
  border-color: #374151;
}

.dark-mode .rte-builder-content {
  color: #f9fafb;
}

.dark-mode .rte-builder-toolbar-btn {
  color: #f9fafb;
}

.dark-mode .rte-builder-toolbar-btn:hover {
  background: #374151;
}
```

### 12. Auto-save

```tsx
import { RichTextEditor } from 'rte-builder'
import { useState, useEffect } from 'react'

export function AutoSaveEditor() {
  const [content, setContent] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (content) {
        handleSave()
      }
    }, 30000)

    return () => clearInterval(timer)
  }, [content])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save to API
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      setLastSaved(new Date())
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {saving && <span>Saving...</span>}
        {lastSaved && !saving && (
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>

      <RichTextEditor
        value={content}
        onChange={setContent}
      />
    </div>
  )
}
```

## Integration Examples

### React Hook Form Integration

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'
import { useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'

interface FormInputs {
  title: string
  content: string
}

export function ReactHookFormExample() {
  const { control, handleSubmit } = useForm<FormInputs>()
  const editorRef = useRef<EditorRef>(null)

  const onSubmit = (data: FormInputs) => {
    console.log('Form data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <input {...field} placeholder="Title" />
        )}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            ref={editorRef}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  )
}
```

### Next.js Integration

```tsx
'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

// Dynamically import to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('rte-builder').then((mod) => mod.RichTextEditor),
  { ssr: false }
)

export function NextJsEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
    />
  )
}
```

## Tips & Best Practices

1. **Always use refs for imperative actions**
   ```tsx
   const editorRef = useRef<EditorRef>(null)
   // Use ref methods for getting/setting content programmatically
   ```

2. **Debounce onChange for performance**
   ```tsx
   const debouncedOnChange = useMemo(
     () => debounce((content: string) => {
       setContent(content)
     }, 300),
     []
   )
   ```

3. **Sanitize HTML output**
   ```tsx
   import DOMPurify from 'dompurify'

   const sanitizedContent = DOMPurify.sanitize(editorRef.current?.getContent() || '')
   ```

4. **Handle images properly**
   - Use CDN URLs for better performance
   - Implement proper upload handling
   - Add image compression before upload
