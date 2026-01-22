# RTE Builder - All Variations & Use Cases

Complete reference for all editor variations, configurations, and use cases.

## Table of Contents

1. [Toolbar Variations](#toolbar-variations)
2. [Height & Size Variations](#height--size-variations)
3. [State Variations](#state-variations)
4. [Feature Variations](#feature-variations)
5. [Integration Variations](#integration-variations)
6. [Styling Variations](#styling-variations)
7. [Event Handler Variations](#event-handler-variations)

---

## Toolbar Variations

### 1. Full Toolbar (Default)
```tsx
<RichTextEditor toolbarPreset="full" />
```
**Features:** 40+ buttons including all formatting, media, and advanced features
**Use case:** Full-featured content management systems, blog platforms

### 2. Medium Toolbar
```tsx
<RichTextEditor toolbarPreset="medium" />
```
**Features:** 25+ buttons with essential formatting and media
**Use case:** Standard blog posts, articles, comments

### 3. Simple Toolbar
```tsx
<RichTextEditor toolbarPreset="simple" />
```
**Features:** 10+ basic buttons for minimal formatting
**Use case:** Simple comments, notes, quick edits

### 4. Custom Toolbar
```tsx
const customButtons: ToolbarButton[] = [
  'bold', 'italic', 'separator',
  'heading1', 'heading2', 'separator',
  'link', 'image'
]

<RichTextEditor toolbarButtons={customButtons} />
```
**Use case:** Specific workflows, custom requirements

### 5. Code-Focused Toolbar
```tsx
const codeButtons: ToolbarButton[] = [
  'bold', 'italic', 'code', 'separator',
  'heading1', 'heading2', 'heading3', 'separator',
  'bulletList', 'orderedList', 'separator',
  'codeBlock', 'link'
]

<RichTextEditor toolbarButtons={codeButtons} />
```
**Use case:** Technical documentation, developer blogs

---

## Height & Size Variations

### 1. Fixed Height
```tsx
<RichTextEditor height={400} />
```
**Use case:** Consistent layout, form fields

### 2. Min/Max Height
```tsx
<RichTextEditor
  minHeight={200}
  maxHeight={600}
/>
```
**Use case:** Responsive content areas, flexible forms

### 3. Small Editor (Comments)
```tsx
<RichTextEditor
  height={150}
  toolbarPreset="simple"
/>
```
**Use case:** Comment sections, quick replies

### 4. Large Editor (Articles)
```tsx
<RichTextEditor
  height={800}
  toolbarPreset="full"
/>
```
**Use case:** Long-form content, blog posts

### 5. Auto-height with Constraints
```tsx
<RichTextEditor
  minHeight={300}
  maxHeight={1000}
/>
```
**Use case:** Dynamic content, user-adjustable

---

## State Variations

### 1. Normal (Editable)
```tsx
<RichTextEditor value={content} onChange={setContent} />
```
**State:** Fully editable
**Use case:** Standard editing

### 2. Read-Only
```tsx
<RichTextEditor value={content} readOnly />
```
**State:** Display only, no editing
**Use case:** Content preview, published articles

### 3. Disabled
```tsx
<RichTextEditor value={content} disabled={isDisabled} />
```
**State:** Grayed out, cannot interact
**Use case:** Loading states, permission-based access

### 4. Controlled
```tsx
const [content, setContent] = useState('')

<RichTextEditor
  value={content}
  onChange={setContent}
/>
```
**Use case:** Form integration, state management

### 5. Uncontrolled with Ref
```tsx
const editorRef = useRef<EditorRef>(null)

<RichTextEditor ref={editorRef} />
// Access via editorRef.current?.getContent()
```
**Use case:** Imperative control, manual state management

---

## Feature Variations

### 1. With Character Counter
```tsx
<RichTextEditor
  showCharCounter
  charCounterMax={1000}
/>
```
**Use case:** Twitter-like posts, limited content

### 2. With Media Picker
```tsx
<RichTextEditor
  onMediaPickerImage={handleImagePicker}
  onMediaPickerVideo={handleVideoPicker}
/>
```
**Use case:** CMS, blog platforms with media library

### 3. With Syntax Highlighting
```tsx
<RichTextEditor
  enableCodeHighlight
  defaultCodeLanguage="javascript"
/>
```
**Use case:** Developer documentation, technical blogs

### 4. Without Syntax Highlighting
```tsx
<RichTextEditor enableCodeHighlight={false} />
```
**Use case:** Non-technical content, performance optimization

### 5. Minimal Configuration
```tsx
<RichTextEditor
  placeholder="Type here..."
  height={300}
/>
```
**Use case:** Quick implementation, simple needs

---

## Integration Variations

### 1. Form Integration
```tsx
<form onSubmit={handleSubmit}>
  <input name="title" />

  <RichTextEditor
    ref={editorRef}
    value={formData.content}
    onChange={(c) => setFormData({...formData, content: c})}
  />

  <button type="submit">Submit</button>
</form>
```
**Use case:** Blog post forms, CMS content creation

### 2. React Hook Form Integration
```tsx
import { Controller } from 'react-hook-form'

<Controller
  name="content"
  control={control}
  render={({ field }) => (
    <RichTextEditor
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
```
**Use case:** Complex forms, validation

### 3. Multi-Editor Layout
```tsx
<>
  <RichTextEditor value={intro} onChange={setIntro} height={200} />
  <RichTextEditor value={body} onChange={setBody} height={400} />
  <RichTextEditor value={conclusion} onChange={setConclusion} height={200} />
</>
```
**Use case:** Multi-section content, complex layouts

### 4. Tabbed Editors
```tsx
{activeTab === 'en' && (
  <RichTextEditor value={contentEn} onChange={setContentEn} />
)}
{activeTab === 'es' && (
  <RichTextEditor value={contentEs} onChange={setContentEs} />
)}
```
**Use case:** Multi-language content, different versions

### 5. Modal/Dialog Integration
```tsx
<Dialog open={isOpen}>
  <RichTextEditor
    value={content}
    onChange={setContent}
    height={400}
  />
  <button onClick={handleSave}>Save</button>
</Dialog>
```
**Use case:** Quick editing, inline content modification

---

## Styling Variations

### 1. Default Styling
```tsx
<RichTextEditor />
```
**Uses:** Built-in `.rte-builder-*` classes

### 2. Custom className
```tsx
<RichTextEditor className="my-custom-editor" />
```
**CSS:**
```css
.my-custom-editor .rte-builder-wrapper {
  border-color: #custom;
}
```

### 3. Dark Mode
```tsx
<RichTextEditor className="dark-theme" />
```
**CSS:**
```css
.dark-theme .rte-builder-wrapper {
  background: #1a1a1a;
  border-color: #333;
}
.dark-theme .rte-builder-content {
  color: #fff;
}
```

### 4. Inline Styling
```tsx
<div style={{ maxWidth: '800px', margin: '0 auto' }}>
  <RichTextEditor />
</div>
```

### 5. Themed Editor
```tsx
<RichTextEditor className="theme-purple" />
```
**CSS:**
```css
.theme-purple .rte-builder-toolbar-btn.active {
  background: #9333ea;
}
```

---

## Event Handler Variations

### 1. onChange Only
```tsx
<RichTextEditor onChange={(content) => console.log(content)} />
```

### 2. All Events
```tsx
<RichTextEditor
  onChange={handleChange}
  onFocus={handleFocus}
  onBlur={handleBlur}
/>
```

### 3. Auto-Save Pattern
```tsx
const debouncedSave = useMemo(
  () => debounce((content) => saveToAPI(content), 1000),
  []
)

<RichTextEditor onChange={debouncedSave} />
```

### 4. Validation on Blur
```tsx
<RichTextEditor
  onBlur={() => {
    const content = editorRef.current?.getContent()
    if (!content) setError('Content required')
  }}
/>
```

### 5. Analytics Tracking
```tsx
<RichTextEditor
  onFocus={() => trackEvent('editor_focused')}
  onChange={(content) => trackEvent('editor_changed', { length: content.length })}
/>
```

---

## Complete Use Case Examples

### Blog Platform Editor
```tsx
<RichTextEditor
  value={post.content}
  onChange={(content) => setPost({...post, content})}
  onMediaPickerImage={handleImagePicker}
  onMediaPickerVideo={handleVideoPicker}
  height={600}
  showCharCounter
  charCounterMax={10000}
  toolbarPreset="full"
  enableCodeHighlight
/>
```

### Comment Editor
```tsx
<RichTextEditor
  placeholder="Add a comment..."
  height={150}
  toolbarPreset="simple"
  showCharCounter
  charCounterMax={500}
/>
```

### Email Editor
```tsx
<RichTextEditor
  placeholder="Compose your message..."
  height={400}
  toolbarButtons={[
    'bold', 'italic', 'underline', 'separator',
    'bulletList', 'orderedList', 'separator',
    'link', 'image', 'separator',
    'undo', 'redo'
  ]}
/>
```

### Documentation Editor
```tsx
<RichTextEditor
  value={docContent}
  onChange={setDocContent}
  height={800}
  toolbarButtons={[
    'bold', 'italic', 'code', 'separator',
    'heading1', 'heading2', 'heading3', 'separator',
    'bulletList', 'orderedList', 'separator',
    'codeBlock', 'link', 'image', 'table', 'separator',
    'undo', 'redo'
  ]}
  enableCodeHighlight
  defaultCodeLanguage="javascript"
/>
```

### Note-Taking Editor
```tsx
<RichTextEditor
  placeholder="Take a note..."
  height={300}
  toolbarPreset="medium"
  onBlur={autoSave}
/>
```

---

## Configuration Matrix

| Use Case | Toolbar | Height | Features | Events |
|----------|---------|--------|----------|--------|
| **Blog Post** | Full | 600px | Media Picker, Char Counter, Code | onChange, onBlur (auto-save) |
| **Comment** | Simple | 150px | Char Limit (500) | onChange |
| **Email** | Custom | 400px | Basic formatting | onChange |
| **Documentation** | Custom | 800px | Code Highlighting | onChange, auto-save |
| **Note** | Medium | 300px | Basic features | onBlur (auto-save) |
| **CMS Article** | Full | 700px | All features | onChange, Media Picker |
| **FAQ Answer** | Medium | 300px | Basic formatting | onChange |
| **Product Description** | Medium | 400px | Char Limit (1000) | onChange |

---

## Quick Reference

### Minimal Setup
```tsx
<RichTextEditor />
```

### Recommended Setup
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Start typing..."
  height={400}
  toolbarPreset="medium"
/>
```

### Full-Featured Setup
```tsx
<RichTextEditor
  ref={editorRef}
  value={content}
  onChange={setContent}
  onFocus={handleFocus}
  onBlur={handleBlur}
  onMediaPickerImage={handleImagePicker}
  onMediaPickerVideo={handleVideoPicker}
  placeholder="Create amazing content..."
  height={600}
  minHeight={400}
  maxHeight={1000}
  showCharCounter
  charCounterMax={10000}
  toolbarPreset="full"
  enableCodeHighlight
  defaultCodeLanguage="javascript"
  className="my-editor"
/>
```

---

**For more examples, see [EXAMPLES.md](./EXAMPLES.md)**
**For testing, see [DEMO.md](./DEMO.md)**
**For API reference, see [README.md](./README.md)**
