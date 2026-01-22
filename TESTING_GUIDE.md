# RTE Builder - Complete Testing Guide

## ✅ Quick Start - Test in 2 Minutes

```bash
cd d:\projects\GrabOn\rte-builder
npm run demo:install && npm run demo
```

Browser opens automatically at **http://localhost:3000** 🎉

---

## 📋 What to Test

### Demo Application Pages (8 Total)

#### 1. 🚀 Basic Usage (`/`)
**What to test:**
- Type and format text (bold, italic, underline)
- Change fonts and colors
- Create lists and headings
- Insert links
- Try ref methods (Get HTML, Set Content, Clear, Focus)

**Expected behavior:**
- Smooth typing
- Instant formatting
- No lag or delays
- All buttons work

---

#### 2. 🎨 Toolbar Variations
**What to test:**
- Compare Full vs Medium vs Simple toolbars
- Test custom toolbar configuration
- See which preset fits your needs

**Expected behavior:**
- Different button counts
- Consistent functionality across presets
- Responsive layout

---

#### 3. 🖼️ Media Picker Integration
**What to test:**
- Click image button → Enter URL → See image inserted
- Click video button → Enter URL → See video inserted
- Check event logs for callback execution

**Sample URLs provided:**
```
Image: https://picsum.photos/800/400
Video: https://www.w3schools.com/html/mov_bbb.mp4
```

**Expected behavior:**
- Prompt appears
- Media inserts correctly
- Events logged properly
- Cancel works

---

#### 4. 📝 Form Integration
**What to test:**
- Fill all form fields
- Edit content in editor
- Submit form
- See JSON output
- Reset form

**Expected behavior:**
- Form validation works
- Editor content included in submission
- Character counter updates
- Reset clears everything

---

#### 5. ⚡ Advanced Features
**What to test:**
- Type in character-limited editor (watch counter)
- Try editing read-only editor (should fail)
- Toggle disabled state
- Trigger focus/blur events
- Test min/max height constraints

**Expected behavior:**
- Character limit enforced
- Read-only prevents editing
- Disabled grays out editor
- Events fire correctly
- Height constraints work

---

#### 6. 💻 Code Editor
**What to test:**
- Insert sample code (JavaScript, Python, TypeScript, HTML)
- Click code block button in toolbar
- Paste your own code
- Check syntax highlighting

**Expected behavior:**
- Syntax highlighting appears
- Code formatted properly
- Colors match language
- Indentation preserved

---

#### 7. 📊 Performance
**What to test:**
- Click "Generate 100 Paragraphs"
- Type in large document
- Scroll through content
- Test undo/redo

**Expected behavior:**
- No lag with large content
- Smooth scrolling
- Fast undo/redo
- Memory stable

---

#### 8. ✨ All Features
**What to test:**
- Everything from above
- All toolbar buttons
- All formatting options
- Media insertion
- Code blocks
- Tables

**Expected behavior:**
- All features work together
- No conflicts
- Stable performance

---

## 🧪 Detailed Test Cases

### Text Formatting Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Bold | Select text → Click Bold | Text becomes bold |
| Italic | Select text → Click Italic | Text becomes italic |
| Underline | Select text → Click Underline | Text underlined |
| Strike | Select text → Click Strike | Text struck through |
| Font Family | Select text → Choose font | Font changes |
| Font Size | Select text → Choose size | Size changes |
| Text Color | Select text → Pick color | Color changes |
| BG Color | Select text → Pick BG color | Background changes |
| Sub/Sup | Select text → Click | Text formatted |
| Clear | Select formatted text → Clear | All formatting removed |

### Paragraph Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Heading 1-6 | Type → Select heading level | Text becomes heading |
| Align Left | Click align left | Text aligned left |
| Align Center | Click align center | Text centered |
| Align Right | Click align right | Text aligned right |
| Align Justify | Click justify | Text justified |
| Blockquote | Click blockquote | Text becomes quote |
| HR | Click horizontal rule | Line inserted |

### List Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Bullet List | Click bullet list | Bullet points created |
| Numbered List | Click numbered list | Numbers created |
| Nested List | Tab inside list | Nested level |
| Un-nest | Shift+Tab in nested | Move out one level |

### Media Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Insert Link | Click link → Enter URL → OK | Link created |
| Edit Link | Click link → Click edit → Change | Link updated |
| Remove Link | Click link → Click remove | Link removed |
| Insert Image (URL) | Click image → Enter URL | Image appears |
| Insert Image (Picker) | Click image → Callback fired | Image from picker |
| Insert Video (URL) | Click video → Enter URL | Video appears |
| Insert Video (Picker) | Click video → Callback fired | Video from picker |

### Table Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Insert Table | Click table | 3x3 table inserted |
| Add Row | Right-click → Add row | Row added |
| Add Column | Right-click → Add column | Column added |
| Delete Row | Right-click → Delete row | Row removed |
| Delete Column | Right-click → Delete column | Column removed |
| Resize Column | Drag column border | Width changes |

### Code Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Inline Code | Select text → Click code | Code formatting |
| Code Block | Click code block | Block inserted |
| Syntax Highlight | Paste code in block | Colors appear |
| Language Change | Change language dropdown | Highlighting updates |

### Editor State Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Read-Only | Try typing in read-only | Cannot edit |
| Disabled | Try clicking disabled editor | No interaction |
| Character Limit | Type past limit | Cannot exceed |
| Placeholder | Empty editor | Placeholder shows |
| Focus Event | Click in editor | onFocus fires |
| Blur Event | Click out of editor | onBlur fires |
| Change Event | Type anything | onChange fires |

### Ref Method Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| getContent() | Click Get HTML button | HTML returned |
| setContent() | Click Set Content button | Content updated |
| focus() | Click Focus button | Editor focused |
| clear() | Click Clear button | Content cleared |
| insertHTML() | Call method with HTML | HTML inserted |

---

## 🐛 Bug Testing Checklist

### Edge Cases

- [ ] Empty editor
- [ ] Very long text (10,000+ words)
- [ ] Special characters (`<>&"'`)
- [ ] Emoji insertion
- [ ] Copy/paste from Word
- [ ] Copy/paste from other websites
- [ ] Undo/redo repeatedly
- [ ] Rapid typing
- [ ] Multiple editors on same page
- [ ] Editor in modal/dialog
- [ ] Editor in hidden tab

### Browser Testing

Test in each browser:

- [ ] Chrome (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Good performance

- [ ] Firefox (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Good performance

- [ ] Safari (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Good performance

- [ ] Edge (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Good performance

### Performance Testing

- [ ] Load time acceptable (<2s)
- [ ] Typing smooth (no lag)
- [ ] Scrolling smooth
- [ ] Undo/redo fast
- [ ] Memory usage stable
- [ ] Bundle size reasonable (~300KB)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## 📊 Test Report Template

Use this template to document your testing:

```markdown
## Test Session Report

**Date:** [Date]
**Tester:** [Your Name]
**Browser:** [Browser + Version]
**OS:** [Operating System]

### Tests Passed ✅
- List all passing tests

### Tests Failed ❌
- Test name
- Steps to reproduce
- Expected result
- Actual result
- Screenshot (if applicable)

### Performance Notes
- Load time: [X]s
- Typing lag: [None/Slight/Noticeable]
- Memory usage: [XX]MB
- Bundle size: [XX]KB

### Additional Notes
- Any other observations
- Suggestions for improvement
```

---

## 🚀 Continuous Testing

### During Development

```bash
# Terminal 1: Watch library changes
cd d:\projects\GrabOn\rte-builder
npm run dev

# Terminal 2: Run demo with hot reload
npm run demo
```

### Before Release

```bash
# Full build and test
npm run build
npm run typecheck
cd demo && npm run build
```

### Automated Testing (Future)

Consider adding:
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright/Cypress)
- Visual regression tests
- Performance benchmarks

---

## 📝 Test Scenarios by Use Case

### For Blog Platforms

**Critical tests:**
- Media picker integration
- Character counter
- Auto-save functionality
- Large document handling
- Image/video insertion
- Code syntax highlighting

### For Comment Systems

**Critical tests:**
- Simple toolbar
- Character limits
- Quick editing
- Copy/paste
- Emoji support

### For CMS

**Critical tests:**
- All toolbar features
- Form integration
- Media library
- Multiple editors
- Save/load
- Version control

### For Documentation

**Critical tests:**
- Code highlighting
- Tables
- Links
- Headings structure
- Search integration

---

## 💡 Testing Tips

1. **Test Early** - Run demo after every major change
2. **Test Browsers** - Check all target browsers
3. **Test Performance** - Monitor with large documents
4. **Test Integration** - Verify in real app context
5. **Test Edge Cases** - Try to break it
6. **Test Accessibility** - Use keyboard only
7. **Test Mobile** - Check responsive behavior

---

## 🆘 Troubleshooting

### Demo won't start

```bash
cd d:\projects\GrabOn\rte-builder
npm run build
cd demo
rm -rf node_modules
npm install
npm run dev
```

### Features not working

- Check browser console for errors
- Verify library is built (`npm run build`)
- Check React version compatibility
- Clear browser cache

### Performance issues

- Check document size
- Monitor console for warnings
- Test in incognito mode
- Disable browser extensions

---

## ✅ Sign-Off Checklist

Before considering testing complete:

- [ ] All 8 demo pages tested
- [ ] All toolbar presets tested
- [ ] Media picker tested
- [ ] Form integration tested
- [ ] Character limits tested
- [ ] Code highlighting tested
- [ ] Performance tested with large content
- [ ] Tested in 3+ browsers
- [ ] No console errors
- [ ] No memory leaks
- [ ] Documentation accurate
- [ ] Examples work
- [ ] Migration guide verified

---

**Ready to test?** Run `npm run demo` and start exploring! 🚀

**Need help?** Check [DEMO.md](./DEMO.md) for detailed demo guide.
