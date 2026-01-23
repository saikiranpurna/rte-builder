# RTE Builder - Interactive Demo

Live demo application showcasing all features of the rte-builder universal rich text editor library.

**Supports 3 Editor Backends:** TipTap, Slate.js, and Lexical

## Quick Start

```bash
# From the rte-builder root directory
npm run demo

# Or from this directory
npm install
npm run dev
```

Opens at: **http://localhost:3000**

## What's Inside

### 9 Interactive Demo Pages

1. **🚀 Basic Usage** - Default editor with editor selection (TipTap/Slate/Lexical)
2. **🔄 Editor Comparison** - Compare all three editors side-by-side with feature matrix
3. **🎨 Toolbar Variations** - Compare Full, Medium, Simple, and Custom toolbars
4. **🖼️ Media Picker** - Custom media library integration example
5. **📝 Form Integration** - Editor integrated with form submission
6. **⚡ Advanced Features** - Character limits, read-only, disabled states
7. **💻 Code Editor** - Syntax highlighting for 190+ languages
8. **📊 Performance** - Test with large documents
9. **✨ All Features** - Complete showcase of everything

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **rte-builder** - The editor library (local)

## Development

### First Time Setup

```bash
# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

- Opens at http://localhost:3000
- Hot module replacement enabled
- Auto-reloads on file changes

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
demo/
├── public/
│   └── index.html         # HTML template
├── src/
│   ├── demos/             # Demo pages
│   │   ├── BasicDemo.tsx          # Basic editor with editor selection
│   │   ├── EditorComparison.tsx   # Compare TipTap vs Slate vs Lexical
│   │   ├── ToolbarVariations.tsx
│   │   ├── MediaPickerDemo.tsx
│   │   ├── FormIntegration.tsx
│   │   ├── AdvancedFeatures.tsx
│   │   ├── CodeEditorDemo.tsx
│   │   ├── PerformanceDemo.tsx
│   │   └── AllFeatures.tsx
│   ├── App.tsx            # Main app with navigation
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Adding New Demos

1. Create new component in `src/demos/YourDemo.tsx`
2. Add to demos array in `src/App.tsx`:

```tsx
const demos = [
  // ... existing demos
  { id: 'your-demo' as const, label: '🎯 Your Demo', component: YourDemo },
]
```

3. Component appears in navigation automatically!

## Tips

### Using the Demo

- Click navigation buttons to switch between pages
- Each page is isolated (separate state)
- Test all features interactively
- Check browser console for logs

### Testing Features

- **Editor Switching:** Try TipTap, Slate.js, and Lexical backends
- **Text Formatting:** Try all toolbar buttons
- **Media:** Use sample URLs provided
- **Code:** Insert code samples with syntax highlighting
- **Performance:** Generate large documents
- **Forms:** Submit and see JSON output
- **Feature Comparison:** Check the comparison table for editor capabilities

### Sample Media URLs

```
Image: https://picsum.photos/800/400
Video: https://www.w3schools.com/html/mov_bbb.mp4
```

## Troubleshooting

### Demo won't start

```bash
# Rebuild library
cd ..
npm run build

# Reinstall demo deps
cd demo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use

Edit `vite.config.ts`:
```ts
server: {
  port: 3001, // Change port
}
```

### Changes not reflecting

1. Stop dev server
2. Rebuild library: `cd .. && npm run build`
3. Restart: `cd demo && npm run dev`

## Documentation

- **[Full Demo Guide](../DEMO.md)** - Complete testing guide
- **[Variations Guide](../VARIATIONS.md)** - All configuration options
- **[Testing Guide](../TESTING_GUIDE.md)** - Test procedures
- **[Main README](../README.md)** - Library documentation

## License

MIT - Same as rte-builder library

---

## Supported Editors

| Editor | Description |
|--------|-------------|
| **TipTap** | ProseMirror-based, highly extensible with excellent TypeScript support |
| **Slate.js** | Completely customizable framework for building rich text editors |
| **Lexical** | Meta's modern, extensible text editor with excellent performance |

---

**Built with ❤️ using React + Vite + rte-builder**
