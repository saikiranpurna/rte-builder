# RTE Builder - Demo & Testing Guide

## Quick Start - Run the Demo

### Option 1: Automated Setup (Recommended)

```bash
# From the rte-builder root directory
cd d:\projects\GrabOn\rte-builder

# Install demo dependencies
npm run demo:install

# Start the demo server (opens at http://localhost:3000)
npm run demo
```

### Option 2: Manual Setup

```bash
# 1. Build the library first
cd d:\projects\GrabOn\rte-builder
npm install
npm run build

# 2. Install demo dependencies
cd demo
npm install

# 3. Start the demo server
npm run dev
```

## Demo Pages Available

The demo application includes 8 comprehensive test pages:

### 1. 🚀 Basic Usage
**What it demonstrates:**
- Default editor configuration
- All standard toolbar buttons
- Ref methods (getContent, setContent, focus, clear)
- Basic text formatting, lists, headings
- Links, images, videos, tables

**Test scenarios:**
- Type and format text
- Insert images and videos
- Create tables and lists
- Use ref methods via buttons

---

### 2. 🎨 Toolbar Variations
**What it demonstrates:**
- Full toolbar (40+ buttons)
- Medium toolbar (25+ buttons)
- Simple toolbar (10+ buttons)
- Custom toolbar configuration

**Test scenarios:**
- Compare different toolbar sizes
- See which preset fits your needs
- Learn how to create custom toolbars

**Code example included:** Custom toolbar button configuration

---

### 3. 🖼️ Media Picker Integration
**What it demonstrates:**
- Custom image picker callback
- Custom video picker callback
- Event logging for debugging
- Promise-based API

**Test scenarios:**
- Click image/video buttons
- Enter URLs in prompts
- See event logs in real-time
- Copy sample media URLs

**Sample URLs provided:**
- Image: `https://picsum.photos/800/400`
- Video: `https://www.w3schools.com/html/mov_bbb.mp4`

---

### 4. 📝 Form Integration
**What it demonstrates:**
- Editor in a form context
- Multiple form fields
- Form validation
- Submit handler with editor content
- Character counter with limit

**Test scenarios:**
- Fill out the form
- Submit and see JSON output
- Test character limit (5000 chars)
- Reset the form

**Features:**
- Title input (required)
- Category dropdown
- Tags input
- Rich text content editor
- Form submission with JSON preview

---

### 5. ⚡ Advanced Features
**What it demonstrates:**
- Character counter & limit
- Read-only mode
- Disabled state (toggleable)
- Custom height constraints
- Event handlers (onChange, onFocus, onBlur)

**Test scenarios:**
- Test character limit enforcement
- Try editing read-only editor
- Toggle disabled state
- Watch event logs
- Test min/max height constraints

---

### 6. 💻 Code Editor with Syntax Highlighting
**What it demonstrates:**
- Syntax highlighting for 190+ languages
- Code block insertion
- Inline code formatting
- Sample code insertion buttons

**Test scenarios:**
- Insert JavaScript sample
- Insert Python sample
- Insert TypeScript sample
- Insert HTML sample
- Create your own code blocks

**Supported languages:**
- JavaScript, TypeScript, JSX, TSX
- Python, Java, C++, C#, Go, Rust, PHP, Ruby
- HTML, CSS, SCSS, Less
- JSON, YAML, XML, Markdown
- SQL, GraphQL, Bash, PowerShell
- And 175+ more!

---

### 7. 📊 Performance & Bundle Size
**What it demonstrates:**
- Bundle size metrics
- Performance with large documents
- Comparison with Froala

**Test scenarios:**
- Generate 100 paragraphs
- Test typing performance
- Test scrolling with large content

**Metrics:**
- Bundle Size: ~300KB (40% smaller than Froala)
- License Cost: $0 (vs Froala $399/year)
- Performance: Optimized for 10,000+ words

---

### 8. ✨ All Features Showcase
**What it demonstrates:**
- Everything enabled
- Full toolbar
- Character counter
- Media picker integration
- Syntax highlighting
- All formatting options

**Test scenarios:**
- Comprehensive feature testing
- Real-world usage simulation
- Complete feature list reference

---

## Demo Application Structure

```
demo/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── demos/
│   │   ├── BasicDemo.tsx              # Basic usage
│   │   ├── ToolbarVariations.tsx      # Toolbar presets
│   │   ├── MediaPickerDemo.tsx        # Media integration
│   │   ├── FormIntegration.tsx        # Form example
│   │   ├── AdvancedFeatures.tsx       # Advanced config
│   │   ├── CodeEditorDemo.tsx         # Code highlighting
│   │   ├── PerformanceDemo.tsx        # Performance test
│   │   └── AllFeatures.tsx            # Complete showcase
│   ├── App.tsx             # Main demo app
│   ├── main.tsx            # Entry point
│   └── index.css           # Demo styles
├── package.json            # Demo dependencies
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript config
```

## Testing Checklist

Use this checklist when testing the editor:

### Text Formatting
- [ ] Bold, Italic, Underline, Strike
- [ ] Font family selection
- [ ] Font size selection
- [ ] Text color
- [ ] Background color (highlight)
- [ ] Subscript, Superscript
- [ ] Clear formatting

### Paragraphs
- [ ] Headings (H1-H6)
- [ ] Text alignment (left, center, right, justify)
- [ ] Line height
- [ ] Blockquotes
- [ ] Horizontal rules

### Lists
- [ ] Bullet lists
- [ ] Numbered lists
- [ ] Nested lists
- [ ] Indent/outdent

### Media & Links
- [ ] Insert link
- [ ] Edit link
- [ ] Remove link
- [ ] Insert image (via URL)
- [ ] Insert image (via Media Picker)
- [ ] Insert video (via URL)
- [ ] Insert video (via Media Picker)

### Tables
- [ ] Insert table
- [ ] Add/remove rows
- [ ] Add/remove columns
- [ ] Resize columns
- [ ] Cell formatting

### Code
- [ ] Inline code
- [ ] Code block
- [ ] Syntax highlighting
- [ ] Different language selection

### Editor Features
- [ ] Undo/Redo
- [ ] Character counter
- [ ] Character limit enforcement
- [ ] Placeholder text
- [ ] Read-only mode
- [ ] Disabled state
- [ ] Height constraints
- [ ] Event handlers (onChange, onFocus, onBlur)

### Ref Methods
- [ ] getContent()
- [ ] setContent()
- [ ] focus()
- [ ] getEditor()
- [ ] insertHTML()
- [ ] clear()

## Performance Testing

### Large Document Test

1. Go to **📊 Performance** page
2. Click "Generate 100 Paragraphs"
3. Test typing performance
4. Test scrolling
5. Test undo/redo with large content

### Expected Results
- Smooth typing (no lag)
- Fast scrolling
- Instant undo/redo
- Memory usage stays stable

## Browser Testing

Test the demo in different browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Testing (if applicable)

- [ ] Responsive toolbar
- [ ] Touch interactions
- [ ] Virtual keyboard handling

## Development Tips

### Hot Module Replacement (HMR)

The demo uses Vite with HMR enabled. Changes to the library source will require a rebuild:

```bash
# Terminal 1: Watch library changes
cd d:\projects\GrabOn\rte-builder
npm run dev

# Terminal 2: Run demo
npm run demo
```

### Adding New Demos

1. Create a new component in `demo/src/demos/YourDemo.tsx`
2. Add it to the demos array in `demo/src/App.tsx`
3. Demo will appear in the navigation automatically

### Debugging

- Open browser DevTools (F12)
- Check Console for errors
- Use React DevTools for component inspection
- Check Network tab for bundle sizes

## Common Issues

### Demo won't start

**Solution:**
```bash
# Rebuild library
cd d:\projects\GrabOn\rte-builder
npm run build

# Reinstall demo dependencies
cd demo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Changes not reflecting

**Solution:**
```bash
# Rebuild library after code changes
cd d:\projects\GrabOn\rte-builder
npm run build

# Or use watch mode
npm run dev
```

### Port 3000 already in use

**Solution:** Edit `demo/vite.config.ts` and change the port:
```ts
server: {
  port: 3001, // Change to available port
}
```

## Sharing the Demo

### Build for production

```bash
cd d:\projects\GrabOn\rte-builder
npm run demo:build
```

Output will be in `demo/dist/`

### Deploy to static hosting

The built demo can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Next Steps

After testing the demo:

1. **Integrate into your app** - See [QUICKSTART.md](./QUICKSTART.md)
2. **Read examples** - See [EXAMPLES.md](./EXAMPLES.md)
3. **Check API docs** - See [README.md](./README.md)
4. **Migration guide** - See [MIGRATION_FROM_FROALA.md](./MIGRATION_FROM_FROALA.md)

---

**Demo URL:** http://localhost:3000 (default)
**Last Updated:** 2026-01-22
**Status:** ✅ Ready to test
