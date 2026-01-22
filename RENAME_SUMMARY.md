# Rename Summary - rte-builder

## Changes Applied

All references have been updated from `@grabon/editor` to `rte-builder` to create a unique, standalone library.

### 1. Folder Structure
- **Old:** `d:\projects\GrabOn\grabon-editor\`
- **New:** `d:\projects\GrabOn\rte-builder\`

### 2. Package Name
- **Old:** `@grabon/editor`
- **New:** `rte-builder`

### 3. CSS Class Prefixes
All CSS classes have been renamed for uniqueness:
- **Old:** `.grabon-editor-*`
- **New:** `.rte-builder-*`

Examples:
- `.grabon-editor-wrapper` → `.rte-builder-wrapper`
- `.grabon-editor-toolbar` → `.rte-builder-toolbar`
- `.grabon-editor-content` → `.rte-builder-content`
- `.grabon-editor-toolbar-btn` → `.rte-builder-toolbar-btn`
- etc.

### 4. Component References
Updated in all source files:
- `src/components/RichTextEditor.tsx`
- `src/components/Toolbar.tsx`
- `src/styles/editor.css`

### 5. Documentation
Updated in all documentation files:
- `README.md`
- `EXAMPLES.md`
- `QUICKSTART.md`
- `PROJECT_SUMMARY.md`
- `CHANGELOG.md`
- `LICENSE`

### 6. Author Information
- **Old:** GrabOn Team
- **New:** RTE Builder Team / Your Name

### 7. Repository URLs
- **Old:** `github.com/grabon/editor`
- **New:** `github.com/yourusername/rte-builder` (placeholder - update with your actual repo)

## Updated Usage

### Installation

```bash
npm install rte-builder
# or
yarn add rte-builder
```

### Import

```tsx
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'
```

### Local Development

```bash
cd d:\projects\GrabOn\rte-builder
npm install
npm run build

# Link to your project
npm link
cd ../grabon-admin-in
npm link rte-builder
```

### Usage Example

```tsx
import { RichTextEditor } from 'rte-builder'

function App() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
      height={400}
    />
  )
}
```

## CSS Class Reference

All CSS classes now use the `rte-builder-` prefix:

| Component | CSS Class |
|-----------|-----------|
| Wrapper | `.rte-builder-wrapper` |
| Toolbar | `.rte-builder-toolbar` |
| Toolbar Button | `.rte-builder-toolbar-btn` |
| Toolbar Select | `.rte-builder-toolbar-select` |
| Toolbar Color | `.rte-builder-toolbar-color` |
| Toolbar Separator | `.rte-builder-toolbar-separator` |
| Container | `.rte-builder-container` |
| Content | `.rte-builder-content` |
| Footer | `.rte-builder-footer` |
| Character Counter | `.rte-builder-char-counter` |

### Custom Styling Example

```css
/* Override default styles */
.rte-builder-wrapper {
  border-color: #custom-color;
}

.rte-builder-toolbar {
  background: #custom-background;
}

.rte-builder-content {
  font-family: 'Your Custom Font';
}
```

## What Stayed the Same

- All functionality and features
- API methods and props
- TypeScript definitions
- TipTap extensions
- Build configuration
- MIT License

## Next Steps

1. ✅ Folder renamed
2. ✅ Package name updated
3. ✅ All references updated
4. ✅ CSS classes renamed
5. ✅ Documentation updated

### To Start Using:

```bash
cd d:\projects\GrabOn\rte-builder
npm install
npm run build
npm link
```

Then in your app:
```bash
cd ../your-app
npm link rte-builder
```

```tsx
import { RichTextEditor } from 'rte-builder'
```

## Repository Setup (Optional)

To publish or set up version control:

1. Initialize git:
   ```bash
   cd d:\projects\GrabOn\rte-builder
   git init
   git add .
   git commit -m "Initial commit - rte-builder v1.0.0"
   ```

2. Create GitHub repository and push:
   ```bash
   git remote add origin https://github.com/yourusername/rte-builder.git
   git push -u origin main
   ```

3. Publish to npm:
   ```bash
   npm login
   npm publish
   ```

---

**Library:** rte-builder v1.0.0
**Last Updated:** 2025-01-22
**Status:** ✅ Ready to use
