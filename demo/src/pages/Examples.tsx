import { useState, useRef } from "react";
import { RichTextEditor, EditorRef } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";

export default function Examples() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Examples</h1>
        <p className="page-description">
          Real-world examples and common use cases for RTE Builder.
        </p>
      </div>

      <BlogPostExample />
      <CommentEditorExample />
      <MarkdownExportExample />
      <CharacterLimitExample />
      <AutoSaveExample />
    </div>
  );
}

function BlogPostExample() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("tech");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content, category });
    alert("Blog post saved! Check console for data.");
  };

  return (
    <section className="section example-section">
      <h2>📝 Blog Post Editor</h2>
      <p>
        Full-featured blog post editor with title, category, and rich content.
      </p>

      <div className="example-container">
        <div className="example-demo">
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="tech">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
              </select>
            </div>

            <div className="form-group">
              <label>Content</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                toolbarPreset="full"
                height={300}
                placeholder="Write your blog post..."
              />
            </div>

            <button type="submit" className="btn-primary">
              Publish Post
            </button>
          </form>
        </div>

        <CodeBlock
          code={`function BlogPostEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('tech')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await api.createPost({
      title,
      content, // HTML from editor
      category,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="tech">Technology</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
      
      <RichTextEditor
        value={content}
        onChange={setContent}
        toolbarPreset="full"
        height={300}
      />
      
      <button type="submit">Publish</button>
    </form>
  )
}`}
          language="tsx"
          filename="BlogPostEditor.tsx"
        />
      </div>
    </section>
  );
}

function CommentEditorExample() {
  const [comment, setComment] = useState("");
  const editorRef = useRef<EditorRef>(null);

  const handleSubmit = () => {
    const content = editorRef.current?.getContent() || "";
    if (!content || content === "<p></p>") {
      alert("Please enter a comment");
      return;
    }
    console.log("Comment:", comment);
    setComment("");
    alert("Comment posted!");
  };

  return (
    <section className="section example-section">
      <h2>💬 Comment Editor</h2>
      <p>Simple editor for comments with basic formatting.</p>

      <div className="example-container">
        <div className="example-demo">
          <div className="comment-editor">
            <RichTextEditor
              ref={editorRef}
              value={comment}
              onChange={setComment}
              toolbarPreset="simple"
              height={120}
              placeholder="Write a comment..."
            />
            <div className="comment-actions">
              <button onClick={handleSubmit} className="btn-primary btn-small">
                Post Comment
              </button>
            </div>
          </div>
        </div>

        <CodeBlock
          code={`function CommentEditor() {
  const [comment, setComment] = useState('')
  const editorRef = useRef<EditorRef>(null)

  const handleSubmit = () => {
    if (editorRef.current?.isEmpty()) {
      alert('Please enter a comment')
      return
    }
    
    api.postComment({ content: comment })
    setComment('') // Clear after posting
  }

  return (
    <div className="comment-editor">
      <RichTextEditor
        ref={editorRef}
        value={comment}
        onChange={setComment}
        toolbarPreset="minimal"
        height={120}
        placeholder="Write a comment..."
      />
      <button onClick={handleSubmit}>Post Comment</button>
    </div>
  )
}`}
          language="tsx"
          filename="CommentEditor.tsx"
        />
      </div>
    </section>
  );
}

function MarkdownExportExample() {
  const [content, setContent] = useState(
    "<h1>Hello World</h1><p>This is <strong>bold</strong> and <em>italic</em> text.</p>",
  );
  const [markdown, setMarkdown] = useState("");

  const convertToMarkdown = () => {
    // Simple HTML to Markdown conversion (for demo)
    let md = content
      .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
      .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
      .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
      .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<em>(.*?)<\/em>/g, "*$1*")
      .replace(/<code>(.*?)<\/code>/g, "`$1`")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .trim();
    setMarkdown(md);
  };

  return (
    <section className="section example-section">
      <h2>📄 Markdown Export</h2>
      <p>Convert editor HTML to Markdown format.</p>

      <Callout type="tip" title="Pro Tip">
        For production, use a library like <code>turndown</code> for proper
        HTML-to-Markdown conversion.
      </Callout>

      <div className="example-container">
        <div className="example-demo">
          <RichTextEditor
            value={content}
            onChange={setContent}
            toolbarPreset="medium"
            height={200}
          />
          <button
            onClick={convertToMarkdown}
            className="btn-secondary"
            style={{ marginTop: 12 }}
          >
            Convert to Markdown
          </button>
          {markdown && <pre className="markdown-output">{markdown}</pre>}
        </div>

        <CodeBlock
          code={`import TurndownService from 'turndown'

function MarkdownExporter() {
  const [content, setContent] = useState('')
  const turndown = new TurndownService()

  const exportToMarkdown = () => {
    const markdown = turndown.turndown(content)
    // Download or save markdown
    downloadFile('content.md', markdown)
  }

  return (
    <div>
      <RichTextEditor
        value={content}
        onChange={setContent}
      />
      <button onClick={exportToMarkdown}>
        Export as Markdown
      </button>
    </div>
  )
}`}
          language="tsx"
          filename="MarkdownExporter.tsx"
        />
      </div>
    </section>
  );
}

function CharacterLimitExample() {
  const [content, setContent] = useState("");
  const CHAR_LIMIT = 280;

  // Simple text extraction from HTML for character counting
  const getTextFromHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const charCount = getTextFromHtml(content).length;
  const remaining = CHAR_LIMIT - charCount;
  const isOverLimit = remaining < 0;

  return (
    <section className="section example-section">
      <h2>🔢 Character Limit</h2>
      <p>Editor with character count and limit (like Twitter/X).</p>

      <div className="example-container">
        <div className="example-demo">
          <RichTextEditor
            value={content}
            onChange={setContent}
            toolbarPreset="simple"
            height={150}
            placeholder="What's happening?"
            showCharCounter
            charCounterMax={CHAR_LIMIT}
          />
          <div className={`char-counter ${isOverLimit ? "over-limit" : ""}`}>
            <span>{remaining}</span> characters remaining
          </div>
        </div>

        <CodeBlock
          code={`function TweetEditor() {
  const [content, setContent] = useState('')
  const CHAR_LIMIT = 280

  // The editor has built-in character counting
  return (
    <div>
      <RichTextEditor
        value={content}
        onChange={setContent}
        toolbarPreset="simple"
        height={150}
        showCharCounter
        charCounterMax={CHAR_LIMIT}
      />
      <button disabled={content.length === 0}>
        Post
      </button>
    </div>
  )
}`}
          language="tsx"
          filename="TweetEditor.tsx"
        />
      </div>
    </section>
  );
}

function AutoSaveExample() {
  const [content, setContent] = useState(
    "<p>Start typing to see auto-save...</p>",
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (newContent: string) => {
    setContent(newContent);

    // Simulate auto-save with debounce
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);
  };

  return (
    <section className="section example-section">
      <h2>💾 Auto-Save</h2>
      <p>Automatically save content as the user types.</p>

      <div className="example-container">
        <div className="example-demo">
          <RichTextEditor
            value={content}
            onChange={handleChange}
            toolbarPreset="medium"
            height={200}
          />
          <div className="save-status">
            {isSaving ? (
              <span className="saving">Saving...</span>
            ) : lastSaved ? (
              <span className="saved">
                ✓ Saved at {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        <CodeBlock
          code={`import { useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function AutoSaveEditor() {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Debounced save function
  const saveContent = useDebouncedCallback(
    async (content: string) => {
      setIsSaving(true)
      await api.saveDraft({ content })
      setIsSaving(false)
    },
    1000 // Wait 1 second after typing stops
  )

  const handleChange = (newContent: string) => {
    setContent(newContent)
    saveContent(newContent) // Auto-save on change
  }

  return (
    <div>
      <RichTextEditor
        value={content}
        onChange={handleChange}
      />
      {isSaving && <span>Saving...</span>}
    </div>
  )
}`}
          language="tsx"
          filename="AutoSaveEditor.tsx"
        />
      </div>
    </section>
  );
}
