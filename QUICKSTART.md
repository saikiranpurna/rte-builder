# Quick Start Guide

## Installation & Setup

### 1. Install the package

```bash
cd d:\projects\GrabOn\rte-builder
npm install
```

### 2. Build the library

```bash
npm run build
```

This will create the `dist` folder with compiled files.

### 3. Use locally in your project

There are two ways to use this library locally:

#### Option A: npm link (Recommended for development)

```bash
# In the rte-builder directory
npm link

# In your grabon-admin-in directory
cd d:\projects\GrabOn\grabon-admin-in
npm link rte-builder
```

#### Option B: Local file path

In your `grabon-admin-in/package.json`:

```json
{
  "dependencies": {
    "rte-builder": "file:../rte-builder"
  }
}
```

Then run:
```bash
npm install
```

## Usage in grabon-admin-in

### 1. Replace Froala imports

**Before:**
```tsx
import FroalaEditor from 'react-froala-wysiwyg'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
```

**After:**
```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'
```

### 2. Update your component

**Before (Froala):**
```tsx
<FroalaEditor
  model={content}
  onModelChange={setContent}
  config={{
    key: FROALA_LICENSE_KEY,
    placeholderText: 'Start typing...',
    height: 400,
  }}
/>
```

**After (TipTap):**
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Start typing..."
  height={400}
/>
```

### 3. With Media Picker (matching your current setup)

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef, MediaFile } from 'rte-builder'
import { MediaPickerDialog } from '@/pages/MediaUpload/components/MediaPickerDialog'
import type { MediaFile as AppMediaFile } from '@/pages/MediaUpload/types'
import { getCdnUrl } from '@/config'
import { useRef, useState } from 'react'

export function YourComponent() {
  const editorRef = useRef<EditorRef>(null)
  const [content, setContent] = useState('')
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

  const handleMediaSelect = (file: AppMediaFile) => {
    const mediaFile: MediaFile = {
      url: getCdnUrl(file.url),
      name: file.name,
      type: file.type,
      alt: file.name,
    }

    if (mediaResolver) {
      mediaResolver(mediaFile)
      setMediaResolver(null)
    }
    setMediaPickerOpen(false)
  }

  const handleMediaCancel = () => {
    if (mediaResolver) {
      mediaResolver(null)
      setMediaResolver(null)
    }
    setMediaPickerOpen(false)
  }

  return (
    <>
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        onMediaPickerImage={handleImagePicker}
        onMediaPickerVideo={handleVideoPicker}
        placeholder="Start typing..."
        height={400}
        toolbarPreset="full"
        showCharCounter
        enableCodeHighlight
      />

      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        title={mediaType === 'image' ? 'Select Image' : 'Select Video'}
        acceptTypes={mediaType === 'image' ? ['image/*'] : ['video/*']}
      />
    </>
  )
}
```

## Development Workflow

### Making changes to the library

1. Edit files in `rte-builder/src/`
2. Build the library:
   ```bash
   npm run build
   ```
3. Changes will automatically reflect in linked projects

### Watch mode (auto-rebuild on changes)

```bash
npm run dev
```

This will watch for file changes and rebuild automatically.

## Publishing (Optional)

### To npm registry

```bash
# Login to npm
npm login

# Publish
npm publish --access public
```

### To private registry

Update `package.json`:
```json
{
  "publishConfig": {
    "registry": "https://your-private-registry.com"
  }
}
```

Then publish:
```bash
npm publish
```

## Troubleshooting

### Issue: Module not found

**Solution:** Make sure you've run `npm link` in both directories or installed via file path.

### Issue: Changes not reflecting

**Solution:** Run `npm run build` in the rte-builder directory.

### Issue: TypeScript errors

**Solution:** Run `npm run typecheck` to see type errors.

### Issue: Peer dependency warnings

**Solution:** Make sure your React version matches:
```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

## Next Steps

1. Read the full [README.md](./README.md) for complete API documentation
2. Check [EXAMPLES.md](./EXAMPLES.md) for more usage examples
3. Explore the source code in `src/` for customization options

## Support

For questions or issues, please create an issue in the repository.
