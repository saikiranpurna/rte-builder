import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";

export default function Installation() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Installation</h1>
        <p className="page-description">
          Install RTE Builder in your React project using your preferred package
          manager.
        </p>
      </div>

      <section className="section">
        <h2>Requirements</h2>
        <ul className="requirements-list">
          <li>
            <strong>React 18+</strong> - RTE Builder requires React 18 or higher
          </li>
          <li>
            <strong>Node.js 16+</strong> - For development and build processes
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>Package Installation</h2>

        <div className="install-tabs">
          <div className="install-option">
            <h4>npm</h4>
            <CodeBlock
              code="npm install rte-builder"
              language="bash"
              showLineNumbers={false}
            />
          </div>

          <div className="install-option">
            <h4>yarn</h4>
            <CodeBlock
              code="yarn add rte-builder"
              language="bash"
              showLineNumbers={false}
            />
          </div>

          <div className="install-option">
            <h4>pnpm</h4>
            <CodeBlock
              code="pnpm add rte-builder"
              language="bash"
              showLineNumbers={false}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Import Styles</h2>

        <Callout type="warning" title="Important">
          Don't forget to import the CSS styles! The editor won't render
          correctly without them.
        </Callout>

        <p>
          Import the styles in your main entry file (e.g., <code>main.tsx</code>{" "}
          or <code>App.tsx</code>):
        </p>

        <CodeBlock
          code={`// In your main entry file
import 'rte-builder/styles.css'`}
          language="tsx"
          filename="main.tsx"
        />

        <h3>Tailwind CSS Users</h3>
        <p>
          If you're using Tailwind CSS, you may want to add the editor styles to
          your safelist or import them separately to avoid conflicts:
        </p>

        <CodeBlock
          code={`// Import after Tailwind
import './styles/globals.css' // Your Tailwind styles
import 'rte-builder/styles.css' // RTE Builder styles`}
          language="tsx"
          showLineNumbers={false}
        />
      </section>

      <section className="section">
        <h2>Verify Installation</h2>
        <p>Create a simple test component to verify everything is working:</p>

        <CodeBlock
          code={`import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'

export function TestEditor() {
  const [content, setContent] = useState('<p>Hello, RTE Builder!</p>')

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Editor</h1>
      <RichTextEditor
        value={content}
        onChange={setContent}
        height={300}
      />
      
      {/* Show the HTML output */}
      <pre style={{ marginTop: 20 }}>
        {content}
      </pre>
    </div>
  )
}`}
          language="tsx"
          filename="TestEditor.tsx"
        />

        <Callout type="success" title="Success!">
          If you see a fully functional editor with a toolbar, you're all set!
          Continue to the Basic Usage guide to learn more.
        </Callout>
      </section>

      <section className="section">
        <h2>TypeScript Support</h2>
        <p>
          RTE Builder is written in TypeScript and includes full type
          definitions. No additional <code>@types</code> package is needed.
        </p>

        <CodeBlock
          code={`import type { EditorRef, EditorProps, MediaFile, ToolbarButton } from 'rte-builder'

// All types are exported and available
const editorRef = useRef<EditorRef>(null)

// Props are fully typed
const config: EditorProps = {
  value: '',
  onChange: (content: string) => console.log(content),
  toolbarPreset: 'full',
  height: 400,
}`}
          language="tsx"
          filename="types-example.tsx"
        />
      </section>

      <section className="section">
        <h2>Bundle Size</h2>
        <p>RTE Builder is optimized for production use:</p>

        <div className="bundle-stats">
          <div className="bundle-stat">
            <span className="bundle-value">~200KB</span>
            <span className="bundle-label">Minified</span>
          </div>
          <div className="bundle-stat">
            <span className="bundle-value">~65KB</span>
            <span className="bundle-label">Gzipped</span>
          </div>
          <div className="bundle-stat">
            <span className="bundle-value">~11KB</span>
            <span className="bundle-label">CSS</span>
          </div>
        </div>

        <Callout type="tip" title="Tree Shaking">
          RTE Builder supports tree shaking. Only import what you need to
          minimize bundle size.
        </Callout>
      </section>

      <section className="section">
        <h2>Troubleshooting</h2>

        <div className="faq-list">
          <div className="faq-item">
            <h4>Editor doesn't render / blank screen</h4>
            <p>
              Make sure you've imported the CSS styles:{" "}
              <code>import 'rte-builder/styles.css'</code>
            </p>
          </div>

          <div className="faq-item">
            <h4>TypeScript errors about missing types</h4>
            <p>
              Ensure you're using TypeScript 4.7+ and have{" "}
              <code>"moduleResolution": "bundler"</code> or{" "}
              <code>"node16"</code> in your tsconfig.json
            </p>
          </div>

          <div className="faq-item">
            <h4>Styles conflict with my CSS</h4>
            <p>
              RTE Builder styles are scoped with <code>.rte-builder-*</code>{" "}
              prefixes. If you still have conflicts, import the styles after
              your own CSS.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
