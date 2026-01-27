# RTE Builder

A **universal, adapter-based** rich text editor library for React that supports multiple editor backends. Built to be **editor-agnostic** with a unified API.

## Features

- **Multiple Editor Support**: TipTap, Slate.js, and Lexical (all included)
- **Unified API**: Same interface works with any editor
- **Editor Registry**: Dynamically register and switch between editors
- **Full Feature Set**: 50+ toolbar buttons, code highlighting, tables, media, and more
- **TypeScript First**: Complete type definitions with strict mode
- **Zero License Costs**: All included editors are MIT licensed
- **Customizable**: Toolbar presets, custom extensions, styling

## Supported Editors

| Editor       | Status      | Bundle Size | Description                          |
| ------------ | ----------- | ----------- | ------------------------------------ |
| **TipTap**   | ✅ Included | ~280KB      | ProseMirror-based, highly extensible |
| **Slate.js** | ✅ Included | ~150KB      | Completely customizable framework    |
| **Lexical**  | ✅ Included | ~100KB      | Meta's modern editor framework       |
| **Quill**    | 📋 Backlog  | ~50KB       | Simple, lightweight editor           |
| **Draft.js** | 📋 Backlog  | ~200KB      | React-first by Facebook              |

## 🎯 Try the Demo

```bash
cd d:\projects\GrabOn\rte-builder
npm run demo:install
npm run demo
```

## Installation

```bash
npm install rte-builder
```

## Quick Start

### Basic Usage (TipTap - Default)

```tsx
import { RichTextEditor } from "rte-builder";

function App() {
  const [content, setContent] = useState("");

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
      height={400}
    />
  );
}
```

### Using the Unified Editor (Recommended)

```tsx
import { UnifiedEditor } from "rte-builder";
import type { UnifiedEditorRef } from "rte-builder";

function App() {
  const editorRef = useRef<UnifiedEditorRef>(null);
  const [content, setContent] = useState("");

  return (
    <UnifiedEditor
      editor="tiptap" // Optional: explicitly select editor
      value={content}
      onChange={setContent}
      toolbar="full" // Use preset: 'full' | 'medium' | 'simple' | 'minimal'
      showCharCounter
      charCounterMax={5000}
    />
  );
}
```

### With Custom Toolbar

```tsx
import { RichTextEditor, customizeToolbar } from "rte-builder";

// Create custom toolbar from preset
const myToolbar = customizeToolbar("medium", {
  remove: ["table", "video"],
  add: ["emoji", "fullscreen"],
});

// Or define explicitly
const myToolbar = [
  "bold",
  "italic",
  "underline",
  "separator",
  "heading1",
  "heading2",
  "separator",
  "bulletList",
  "orderedList",
  "separator",
  "link",
  "image",
  "separator",
  "undo",
  "redo",
];

function App() {
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      toolbarButtons={myToolbar}
    />
  );
}
```

### With Media Picker Integration

```tsx
import { RichTextEditor } from "rte-builder";
import type { MediaFile } from "rte-builder";

function App() {
  const handleImagePicker = async (): Promise<MediaFile | null> => {
    // Open your media picker dialog
    const file = await openYourMediaPicker("image");

    if (file) {
      return {
        url: file.url,
        name: file.name,
        alt: file.name,
      };
    }
    return null;
  };

  const handleVideoPicker = async (): Promise<MediaFile | null> => {
    const file = await openYourMediaPicker("video");
    return file ? { url: file.url, name: file.name } : null;
  };

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      onMediaPickerImage={handleImagePicker}
      onMediaPickerVideo={handleVideoPicker}
    />
  );
}
```

## API Reference

### Component Props

| Prop                  | Type                               | Default             | Description                     |
| --------------------- | ---------------------------------- | ------------------- | ------------------------------- |
| `value`               | `string`                           | `''`                | HTML content                    |
| `onChange`            | `(content: string) => void`        | -                   | Content change handler          |
| `onBlur`              | `() => void`                       | -                   | Blur event handler              |
| `onFocus`             | `() => void`                       | -                   | Focus event handler             |
| `placeholder`         | `string`                           | `'Start typing...'` | Placeholder text                |
| `height`              | `number`                           | `400`               | Editor height in pixels         |
| `minHeight`           | `number`                           | `300`               | Minimum height                  |
| `maxHeight`           | `number`                           | -                   | Maximum height                  |
| `disabled`            | `boolean`                          | `false`             | Disable editing                 |
| `readOnly`            | `boolean`                          | `false`             | Read-only mode                  |
| `charCounterMax`      | `number`                           | `-1`                | Character limit (-1 = no limit) |
| `showCharCounter`     | `boolean`                          | `false`             | Show character count            |
| `toolbarPreset`       | `'full' \| 'medium' \| 'simple'`   | `'full'`            | Toolbar preset                  |
| `toolbarButtons`      | `ToolbarButton[]`                  | -                   | Custom toolbar buttons          |
| `className`           | `string`                           | `''`                | Additional CSS class            |
| `onMediaPickerImage`  | `() => Promise<MediaFile \| null>` | -                   | Image picker callback           |
| `onMediaPickerVideo`  | `() => Promise<MediaFile \| null>` | -                   | Video picker callback           |
| `enableCodeHighlight` | `boolean`                          | `true`              | Enable syntax highlighting      |
| `defaultCodeLanguage` | `string`                           | `'javascript'`      | Default code language           |

### Ref Methods

```tsx
const editorRef = useRef<EditorRef>(null);

// Get content
const html = editorRef.current?.getContent();
const text = editorRef.current?.getText();
const json = editorRef.current?.getJSON();

// Set content
editorRef.current?.setContent("<p>Hello World</p>");

// Navigation
editorRef.current?.focus();
editorRef.current?.blur();

// Insert
editorRef.current?.insertHTML("<strong>Bold text</strong>");
editorRef.current?.insertText("Plain text");

// Clear
editorRef.current?.clear();

// State
const empty = editorRef.current?.isEmpty();
const chars = editorRef.current?.getCharacterCount();
const words = editorRef.current?.getWordCount();

// History
editorRef.current?.undo();
editorRef.current?.redo();
const canUndo = editorRef.current?.canUndo();
const canRedo = editorRef.current?.canRedo();

// Actions
editorRef.current?.toggleFullscreen();
editorRef.current?.print();

// Native editor access
const tiptapEditor = editorRef.current?.getNativeEditor();
```

### Toolbar Buttons

All available toolbar buttons:

**Text Formatting:**
`bold`, `italic`, `underline`, `strike`, `code`, `codeBlock`, `subscript`, `superscript`, `clearFormatting`

**Font & Colors:**
`fontFamily`, `fontSize`, `lineHeight`, `textColor`, `backgroundColor`

**Alignment & Indentation:**
`alignLeft`, `alignCenter`, `alignRight`, `alignJustify`, `indent`, `outdent`

**Lists:**
`bulletList`, `orderedList`

**Headings:**
`heading1`, `heading2`, `heading3`, `heading4`, `heading5`, `heading6`

**Blocks:**
`blockquote`, `horizontalRule`

**Links & Media:**
`link`, `unlink`, `image`, `video`, `table`, `emoji`

**Actions:**
`undo`, `redo`, `fullscreen`, `print`

**Special:**
`separator`

### Toolbar Presets

```tsx
import { toolbarPresets, getToolbarPreset } from "rte-builder";

// Available presets
const full = getToolbarPreset("full"); // All features (50+ buttons)
const medium = getToolbarPreset("medium"); // Standard features (30+ buttons)
const simple = getToolbarPreset("simple"); // Basic features (12 buttons)
const minimal = getToolbarPreset("minimal"); // Just essentials (7 buttons)
const code = getToolbarPreset("code"); // For technical docs
const blog = getToolbarPreset("blog"); // For blog posts
const email = getToolbarPreset("email"); // For email composition
```

## Editor Registry

Register custom editors or check availability:

```tsx
import {
  EditorRegistry,
  registerAdapter,
  isEditorAvailable,
  getAvailableAdapters,
  getEditorFeatures,
} from "rte-builder";

// Check what's available
const available = getAvailableAdapters();
console.log(available.map((a) => a.name));

// Check specific editor
if (isEditorAvailable("tiptap")) {
  console.log("TipTap is ready!");
}

// Get feature comparison
const features = getEditorFeatures("tiptap");
console.log(features.tables); // true
console.log(features.collaboration); // false
```

## Custom Extensions (TipTap)

The library exports TipTap extensions for advanced use:

```tsx
import {
  FontSize,
  LineHeight,
  Video,
  Emoji,
  Fullscreen,
  Print,
  Indent,
  EMOJI_CATEGORIES,
} from "rte-builder";

// Use with TipTap directly
import { useEditor } from "@tiptap/react";

const editor = useEditor({
  extensions: [
    // ... other extensions
    FontSize,
    LineHeight,
    Fullscreen,
  ],
});
```

## Styling

The library includes comprehensive CSS. You can customize via CSS variables:

```css
/* Override in your CSS */
.rte-builder-wrapper {
  --editor-border-color: #e5e7eb;
  --editor-background: #ffffff;
  --toolbar-background: #f9fafb;
  --button-active-color: #3b82f6;
  --text-color: #1f2937;
}

/* Or use custom classes */
.my-editor .rte-builder-toolbar {
  background: #1a1a1a;
}
```

## Project Structure

```
rte-builder/
├── src/
│   ├── core/               # Core types, registry, presets
│   │   ├── types.ts        # Unified type definitions
│   │   ├── registry.ts     # Editor adapter registry
│   │   └── presets.ts      # Toolbar presets
│   ├── adapters/           # Editor implementations
│   │   ├── tiptap/         # TipTap adapter (included)
│   │   ├── slate/          # Slate.js adapter (included)
│   │   └── lexical/        # Lexical adapter (included)
│   ├── components/         # React components
│   │   ├── RichTextEditor.tsx    # Legacy TipTap component
│   │   └── UnifiedEditor.tsx     # New unified component
│   ├── extensions/         # Custom TipTap extensions
│   └── styles/             # CSS styles
├── dist/                   # Built output
├── README.md
└── package.json
```

## Roadmap

- [x] **v1.0**: Complete TipTap implementation
- [x] **v1.1**: Generic adapter architecture
- [x] **v1.2**: Slate.js adapter
- [x] **v1.3**: Lexical adapter
- [x] **v2.0**: Collaborative editing
- [x] **v2.1**: Comments & annotations
- [x] **v2.2**: Version history
- [ ] **v2.3**: Quill adapter
- [ ] **v2.4**: Draft.js adapter

## Collaborative Editing (v2.0)

Enable real-time collaboration with presence indicators:

```tsx
import { UnifiedEditor, CollaborationProvider, PresenceIndicator } from 'rte-builder'

function CollaborativeEditor() {
  return (
    <CollaborationProvider
      config={{
        provider: 'websocket',
        serverUrl: 'wss://your-server.com/collab',
        roomId: 'document-123',
        user: {
          id: 'user-1',
          name: 'John Doe',
          color: '#3b82f6',
        },
      }}
      onStatusChange={(status) => console.log('Status:', status)}
      onUsersChange={(users) => console.log('Users:', users)}
    >
      <PresenceIndicator />
      <UnifiedEditor
        value={content}
        onChange={setContent}
      />
    </CollaborationProvider>
  )
}
```

## Comments & Annotations (v2.1)

Add inline comments and annotations to your documents:

```tsx
import { UnifiedEditor, CommentsProvider, CommentsPanel } from 'rte-builder'

function EditorWithComments() {
  return (
    <CommentsProvider
      config={{
        currentUser: {
          id: 'user-1',
          name: 'John Doe',
        },
        allowResolve: true,
        allowReactions: true,
      }}
      onThreadsChange={(threads) => saveThreads(threads)}
    >
      <div style={{ display: 'flex' }}>
        <UnifiedEditor
          value={content}
          onChange={setContent}
        />
        <CommentsPanel position="right" />
      </div>
    </CommentsProvider>
  )
}
```

## Version History (v2.2)

Track and restore document versions:

```tsx
import { UnifiedEditor, VersionHistoryProvider, VersionHistoryPanel } from 'rte-builder'

function EditorWithHistory() {
  const editorRef = useRef(null)

  return (
    <VersionHistoryProvider
      config={{
        currentUser: {
          id: 'user-1',
          name: 'John Doe',
        },
        autoSave: true,
        autoSaveInterval: 60000, // 1 minute
        maxVersions: 100,
        onRestore: (version) => {
          editorRef.current?.setContent(version.content)
        },
      }}
      getCurrentContent={() => ({
        html: editorRef.current?.getContent() || '',
        text: editorRef.current?.getText() || '',
      })}
    >
      <div style={{ display: 'flex' }}>
        <UnifiedEditor
          ref={editorRef}
          value={content}
          onChange={setContent}
        />
        <VersionHistoryPanel position="right" />
      </div>
    </VersionHistoryProvider>
  )
}
```

## License

MIT License - Free for commercial and personal use.

## Contributing

Contributions welcome! Please read our contributing guidelines.

## Support

- GitHub Issues: Report bugs or request features
