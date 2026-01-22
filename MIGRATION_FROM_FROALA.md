# Migration Guide: Froala → rte-builder

Complete guide to migrate from Froala Editor to rte-builder.

## Why Migrate?

| Feature | Froala 4.2.0 | rte-builder |
|---------|--------------|-------------|
| **License Cost** | $399+/year | **FREE (MIT)** |
| **Bundle Size** | ~500KB | ~300KB |
| **TypeScript** | Partial | Native & Complete |
| **React Support** | jQuery wrapper | React-first |
| **Syntax Highlighting** | ❌ | ✅ 190+ languages |
| **Active Development** | Frozen at 4.2.0 | Latest TipTap |
| **2-Year Cost** | $798+ | **$0** |

## Step-by-Step Migration

### Step 1: Install rte-builder

#### Local Development (Recommended First)

```bash
# Build the library
cd d:\projects\GrabOn\rte-builder
npm install
npm run build

# Link to your project
npm link

# In your grabon-admin-in project
cd d:\projects\GrabOn\grabon-admin-in
npm link rte-builder
```

#### Or via npm (when published)

```bash
npm install rte-builder
```

### Step 2: Remove Froala

```bash
# Uninstall Froala packages
npm uninstall froala-editor react-froala-wysiwyg
```

### Step 3: Update Imports

#### Before (Froala)

```tsx
import FroalaEditor from 'react-froala-wysiwyg'
import FroalaEditorClass from 'froala-editor'

// Import Froala styles
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

// Import all plugins
import 'froala-editor/js/plugins/align.min.js'
import 'froala-editor/js/plugins/char_counter.min.js'
// ... 30+ more plugin imports
```

#### After (rte-builder)

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef, MediaFile } from 'rte-builder'

// That's it! Styles are bundled automatically
```

### Step 4: Update Component Code

#### Before (Your Froala Component)

```tsx
// d:\projects\GrabOn\grabon-admin-in\src\components\ui\froala-editor.tsx

const FROALA_LICENSE_KEY = import.meta.env.VITE_FROALA_LICENSE_KEY || ""

export const RichTextEditor = forwardRef<FroalaEditorRef, FroalaEditorProps>(
  ({
    value = "",
    onChange,
    placeholder = "Start typing...",
    height = 400,
    // ... other props
  }, ref) => {
    const editorConfig = {
      key: FROALA_LICENSE_KEY, // ❌ License required
      placeholderText: placeholder,
      height,
      toolbarButtons: fullToolbarButtons,
      // ... massive config object
    }

    return (
      <div className="froala-editor-wrapper">
        <FroalaEditor
          ref={editorRef}
          tag="textarea"
          model={value}
          onModelChange={onChange}
          config={editorConfig}
        />
      </div>
    )
  }
)
```

#### After (rte-builder)

```tsx
// d:\projects\GrabOn\grabon-admin-in\src\components\ui\rich-text-editor.tsx

import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'

export const Editor = forwardRef<EditorRef, EditorProps>(
  ({
    value = "",
    onChange,
    placeholder = "Start typing...",
    height = 400,
    // ... other props
  }, ref) => {
    return (
      <RichTextEditor
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
        toolbarPreset="full"
      />
    )
  }
)
```

### Step 5: Migrate Media Picker Integration

#### Before (Froala Custom Button)

```tsx
FroalaEditorClass.DefineIcon("mediaPickerImage", {
  NAME: "image",
  SVG_KEY: "insertImage",
})

FroalaEditorClass.RegisterCommand("mediaPickerImage", {
  title: "Insert Image from Media Library",
  callback: function () {
    const event = new CustomEvent("froala-open-media-picker", {
      detail: { type: "image", editor: this },
    })
    window.dispatchEvent(event)
  },
})
```

#### After (rte-builder Callback)

```tsx
import type { MediaFile } from 'rte-builder'

const handleImagePicker = async (): Promise<MediaFile | null> => {
  // Open your existing MediaPickerDialog
  const file = await openMediaDialog('image')

  if (file) {
    return {
      url: getCdnUrl(file.url),
      name: file.name,
      alt: file.name,
    }
  }

  return null
}

<RichTextEditor
  onMediaPickerImage={handleImagePicker}
  onMediaPickerVideo={handleVideoPicker}
/>
```

### Step 6: Update Ref Methods

#### Before (Froala)

```tsx
const editorRef = useRef<FroalaEditorRef>(null)

// Get content
const html = (editorInstanceRef.current as any).html.get()

// Set content
(editorInstanceRef.current as any).html.set(html)

// Focus
(editorInstanceRef.current as any).events.focus()
```

#### After (rte-builder)

```tsx
const editorRef = useRef<EditorRef>(null)

// Get content
const html = editorRef.current?.getContent()

// Set content
editorRef.current?.setContent(html)

// Focus
editorRef.current?.focus()
```

### Step 7: Update Styling (if customized)

#### Before (Froala classes)

```css
.froala-editor-wrapper {
  /* custom styles */
}

.fr-toolbar {
  /* toolbar styles */
}

.fr-element {
  /* content styles */
}
```

#### After (rte-builder classes)

```css
.rte-builder-wrapper {
  /* custom styles */
}

.rte-builder-toolbar {
  /* toolbar styles */
}

.rte-builder-content {
  /* content styles */
}
```

## Complete Example Migration

### Your Current Froala Setup

```tsx
// src/components/ui/froala-editor.tsx
import { useRef, useState, useCallback } from 'react'
import FroalaEditor from 'react-froala-wysiwyg'
import { MediaPickerDialog } from '@/pages/MediaUpload/components/MediaPickerDialog'
import { getCdnUrl } from '@/config'

export const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const editorConfig = {
    key: FROALA_LICENSE_KEY,
    height: 400,
    toolbarButtons: fullToolbarButtons,
    // ... many more options
  }

  return (
    <>
      <div className="froala-editor-wrapper">
        <FroalaEditor
          model={value}
          onModelChange={onChange}
          config={editorConfig}
        />
      </div>
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
      />
    </>
  )
}
```

### Migrated to rte-builder

```tsx
// src/components/ui/rich-text-editor.tsx
import { useRef, useState, useCallback } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { EditorRef, MediaFile } from 'rte-builder'
import { MediaPickerDialog } from '@/pages/MediaUpload/components/MediaPickerDialog'
import { getCdnUrl } from '@/config'

export const Editor = ({ value, onChange }) => {
  const editorRef = useRef<EditorRef>(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [mediaResolver, setMediaResolver] = useState<((file: MediaFile | null) => void) | null>(null)

  const handleImagePicker = (): Promise<MediaFile | null> => {
    return new Promise((resolve) => {
      setMediaType('image')
      setMediaPickerOpen(true)
      setMediaResolver(() => resolve)
    })
  }

  const handleVideoPicker = (): Promise<MediaFile | null> => {
    return new Promise((resolve) => {
      setMediaType('video')
      setMediaPickerOpen(true)
      setMediaResolver(() => resolve)
    })
  }

  const handleMediaSelect = (file) => {
    const mediaFile: MediaFile = {
      url: getCdnUrl(file.url),
      name: file.name,
      alt: file.name,
    }

    if (mediaResolver) {
      mediaResolver(mediaFile)
      setMediaResolver(null)
    }
    setMediaPickerOpen(false)
  }

  return (
    <>
      <RichTextEditor
        ref={editorRef}
        value={value}
        onChange={onChange}
        onMediaPickerImage={handleImagePicker}
        onMediaPickerVideo={handleVideoPicker}
        height={400}
        toolbarPreset="full"
        showCharCounter
        enableCodeHighlight
      />
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        type={mediaType}
      />
    </>
  )
}
```

## Props Mapping

| Froala Prop | rte-builder Prop | Notes |
|-------------|------------------|-------|
| `model` | `value` | Renamed for clarity |
| `onModelChange` | `onChange` | Renamed for consistency |
| `config.key` | ❌ Removed | No license needed! |
| `config.placeholderText` | `placeholder` | Top-level prop |
| `config.height` | `height` | Top-level prop |
| `config.heightMin` | `minHeight` | Top-level prop |
| `config.heightMax` | `maxHeight` | Top-level prop |
| `config.charCounterMax` | `charCounterMax` | Top-level prop |
| `config.charCounterCount` | `showCharCounter` | Top-level prop |
| `config.toolbarButtons` | `toolbarButtons` or `toolbarPreset` | Simplified |
| `config.events.blur` | `onBlur` | Top-level prop |
| `config.events.focus` | `onFocus` | Top-level prop |

## Testing Checklist

After migration, test these features:

- [ ] Basic text formatting (bold, italic, underline)
- [ ] Font family and size selection
- [ ] Text and background colors
- [ ] Lists (bullet and numbered)
- [ ] Headings (H1-H6)
- [ ] Links (insert, edit, remove)
- [ ] **Media Picker** - Images
- [ ] **Media Picker** - Videos
- [ ] Tables (insert, resize, edit)
- [ ] Code blocks with syntax highlighting
- [ ] Undo/Redo
- [ ] Character counter
- [ ] Save/Load content
- [ ] Read-only mode
- [ ] Form integration

## Common Issues & Solutions

### Issue 1: "Module not found: rte-builder"

**Solution:**
```bash
cd d:\projects\GrabOn\rte-builder
npm link

cd d:\projects\GrabOn\grabon-admin-in
npm link rte-builder
```

### Issue 2: TypeScript errors

**Solution:** Rebuild the library
```bash
cd d:\projects\GrabOn\rte-builder
npm run build
```

### Issue 3: Styles not loading

**Solution:** Make sure you're importing from the correct package:
```tsx
import { RichTextEditor } from 'rte-builder'
// Styles are auto-imported
```

### Issue 4: Media picker not working

**Solution:** Check your promise implementation:
```tsx
const handleImagePicker = (): Promise<MediaFile | null> => {
  return new Promise((resolve) => {
    // Your logic here
    resolve(mediaFile) // or resolve(null)
  })
}
```

## Rollback Plan

If you need to rollback:

```bash
# Reinstall Froala
npm install froala-editor react-froala-wysiwyg

# Unlink rte-builder
npm unlink rte-builder

# Restore original component
git checkout src/components/ui/froala-editor.tsx
```

## Benefits After Migration

✅ **No more license costs** - Save $399/year
✅ **Better TypeScript** - Full type safety
✅ **Smaller bundle** - 40% reduction
✅ **Modern codebase** - React 18+ optimized
✅ **Active development** - Latest features
✅ **Better code blocks** - Syntax highlighting
✅ **Full control** - Customize anything

## Need Help?

- Check [EXAMPLES.md](./EXAMPLES.md) for usage examples
- Read [README.md](./README.md) for full API documentation
- See [QUICKSTART.md](./QUICKSTART.md) for setup guide

---

**Ready to migrate?** Follow the steps above and enjoy license-free editing! 🎉
