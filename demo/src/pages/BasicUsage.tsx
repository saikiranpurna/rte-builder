import { useState, useRef } from "react";
import { RichTextEditor, EditorRef } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";
import { PropsTable } from "../components/PropsTable";

const essentialProps = [
  {
    name: "value",
    type: "string",
    default: "''",
    required: true,
    description:
      "The HTML content of the editor. This is a controlled component.",
  },
  {
    name: "onChange",
    type: "(content: string) => void",
    default: "-",
    required: true,
    description:
      "Callback fired when the content changes. Receives the new HTML string.",
  },
  {
    name: "height",
    type: "number | string",
    default: "300",
    required: false,
    description:
      'Height of the editor. Can be a number (pixels) or string ("100%", "50vh").',
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Start typing..."',
    required: false,
    description: "Placeholder text shown when the editor is empty.",
  },
];

export default function BasicUsage() {
  const [content, setContent] = useState("<p>Type something here...</p>");
  const [readonlyContent] = useState("<p>This content cannot be edited.</p>");
  const editorRef = useRef<EditorRef>(null);

  const insertTextExample = () => {
    editorRef.current?.insertHTML("<p><strong>Inserted text!</strong></p>");
  };

  const getContentExample = () => {
    const html = editorRef.current?.getContent();
    alert("Current content:\n\n" + html);
  };

  const clearEditor = () => {
    editorRef.current?.clear();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Basic Usage</h1>
        <p className="page-description">
          Learn the fundamental concepts and patterns for using RTE Builder in
          your React applications.
        </p>
      </div>

      <section className="section">
        <h2>Controlled Component</h2>
        <p>
          RTE Builder works as a <strong>controlled component</strong>, similar
          to a standard React <code>&lt;input&gt;</code> or{" "}
          <code>&lt;textarea&gt;</code>. You provide the
          <code>value</code> and handle changes via <code>onChange</code>.
        </p>

        <CodeBlock
          code={`import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'

function MyEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      height={300}
    />
  )
}`}
          language="tsx"
          filename="MyEditor.tsx"
        />

        <div className="live-example">
          <h4>Live Example</h4>
          <RichTextEditor
            value={content}
            onChange={setContent}
            height={200}
            placeholder="Type something here..."
          />
          <div className="output-preview">
            <strong>HTML Output:</strong>
            <pre>{content}</pre>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Essential Props</h2>
        <PropsTable props={essentialProps} />
      </section>

      <section className="section">
        <h2>Using Editor Ref</h2>
        <p>
          For imperative operations (inserting content, getting content, focus,
          etc.), use a ref to access the editor instance.
        </p>

        <CodeBlock
          code={`import { useRef } from 'react'
import { RichTextEditor, EditorRef } from 'rte-builder'

function EditorWithRef() {
  const editorRef = useRef<EditorRef>(null)

  const handleInsert = () => {
    // Insert content at cursor position
    editorRef.current?.insertContent('<p>Hello World!</p>')
  }

  const handleGetContent = () => {
    // Get current HTML content
    const html = editorRef.current?.getHTML()
    console.log('Content:', html)
  }

  const handleFocus = () => {
    // Focus the editor
    editorRef.current?.focus()
  }

  return (
    <div>
      <div className="button-group">
        <button onClick={handleInsert}>Insert Text</button>
        <button onClick={handleGetContent}>Get Content</button>
        <button onClick={handleFocus}>Focus Editor</button>
      </div>
      
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
      />
    </div>
  )
}`}
          language="tsx"
          filename="EditorWithRef.tsx"
        />

        <div className="live-example">
          <h4>Try It</h4>
          <div className="button-group">
            <button onClick={insertTextExample}>Insert Text</button>
            <button onClick={getContentExample}>Get Content</button>
            <button onClick={clearEditor}>Clear</button>
          </div>
          <RichTextEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            height={200}
          />
        </div>
      </section>

      <section className="section">
        <h2>Read-Only Mode</h2>
        <p>
          Set <code>editable={"{false}"}</code> to make the editor read-only.
          Useful for previewing content or displaying saved content.
        </p>

        <CodeBlock
          code={`<RichTextEditor
  value={savedContent}
  onChange={() => {}} // No-op for read-only
  editable={false}
  height={200}
/>`}
          language="tsx"
          showLineNumbers={false}
        />

        <div className="live-example">
          <h4>Read-Only Example</h4>
          <RichTextEditor
            value={readonlyContent}
            onChange={() => {}}
            readOnly={true}
            height={100}
          />
        </div>
      </section>

      <section className="section">
        <h2>Setting Initial Content</h2>

        <Callout type="tip" title="HTML String">
          The <code>value</code> prop accepts HTML strings. You can load content
          from an API and pass it directly to the editor.
        </Callout>

        <CodeBlock
          code={`import { useState, useEffect } from 'react'
import { RichTextEditor } from 'rte-builder'

function EditorWithAPIContent() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch content from API
    fetch('/api/posts/123')
      .then(res => res.json())
      .then(data => {
        setContent(data.content) // HTML string from API
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading editor...</div>

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      height={400}
    />
  )
}`}
          language="tsx"
          filename="EditorWithAPIContent.tsx"
        />
      </section>

      <section className="section">
        <h2>Height Configuration</h2>
        <p>
          The <code>height</code> prop controls the editor's height. It accepts:
        </p>
        <ul>
          <li>
            <strong>Number:</strong> Pixels (e.g., <code>300</code>)
          </li>
          <li>
            <strong>String:</strong> Any CSS value (e.g., <code>"50vh"</code>,{" "}
            <code>"100%"</code>)
          </li>
        </ul>

        <CodeBlock
          code={`// Fixed pixel height
<RichTextEditor height={400} />

// Viewport-relative height
<RichTextEditor height="50vh" />

// Percentage (parent must have height)
<div style={{ height: 500 }}>
  <RichTextEditor height="100%" />
</div>`}
          language="tsx"
          showLineNumbers={false}
        />
      </section>

      <section className="section">
        <h2>Common Patterns</h2>

        <h3>Form Integration</h3>
        <CodeBlock
          code={`function ArticleForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Submit form data
    api.createArticle({
      title,
      content, // HTML string from editor
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title"
      />
      
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Write your article..."
        height={400}
      />
      
      <button type="submit">Publish</button>
    </form>
  )
}`}
          language="tsx"
          filename="ArticleForm.tsx"
        />

        <h3>With React Hook Form</h3>
        <CodeBlock
          code={`import { Controller, useForm } from 'react-hook-form'
import { RichTextEditor } from 'rte-builder'

function FormWithHookForm() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <RichTextEditor
            value={field.value}
            onChange={field.onChange}
            height={300}
          />
        )}
      />
    </form>
  )
}`}
          language="tsx"
          filename="FormWithHookForm.tsx"
        />
      </section>

      <section className="section next-steps">
        <h2>Next Steps</h2>
        <div className="next-links">
          <a href="#/toolbar" className="next-link">
            <span className="next-label">Next</span>
            <span className="next-title">Toolbar Configuration →</span>
          </a>
        </div>
      </section>
    </div>
  );
}
