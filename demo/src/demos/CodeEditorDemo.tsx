import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { ToolbarButton } from 'rte-builder'

export default function CodeEditorDemo() {
  const [content, setContent] = useState(`<p>This editor is optimized for code documentation!</p><p>Click the <strong>Code Block</strong> button and paste some code.</p>`)

  const codeButtons: ToolbarButton[] = [
    'bold',
    'italic',
    'code',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'separator',
    'bulletList',
    'orderedList',
    'separator',
    'codeBlock',
    'link',
    'separator',
    'undo',
    'redo',
  ]

  const sampleCode = {
    javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,

    typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (data: User): User => {
  return { ...data };
}`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Page</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>`,
  }

  const insertSample = (language: string) => {
    const code = sampleCode[language as keyof typeof sampleCode]
    const codeBlock = `<pre><code class="language-${language}">${code}</code></pre>`
    setContent((prev) => prev + codeBlock)
  }

  return (
    <div className="demo-section">
      <h2>💻 Code Editor with Syntax Highlighting</h2>
      <p>
        Perfect for documentation, tutorials, and technical writing with full syntax highlighting
        support for 190+ languages.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <strong>Insert Sample Code:</strong>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
          <button className="btn-info" onClick={() => insertSample('javascript')}>
            JavaScript
          </button>
          <button className="btn-info" onClick={() => insertSample('python')}>
            Python
          </button>
          <button className="btn-info" onClick={() => insertSample('typescript')}>
            TypeScript
          </button>
          <button className="btn-info" onClick={() => insertSample('html')}>
            HTML
          </button>
        </div>
      </div>

      <RichTextEditor
        value={content}
        onChange={setContent}
        toolbarButtons={codeButtons}
        height={500}
        enableCodeHighlight
        defaultCodeLanguage="javascript"
      />

      <h3>Supported Languages</h3>
      <div className="stats">
        <div className="stat-card">
          <h3>190+</h3>
          <p>Programming Languages</p>
        </div>
        <div className="stat-card">
          <h3>Auto</h3>
          <p>Syntax Detection</p>
        </div>
        <div className="stat-card">
          <h3>Themes</h3>
          <p>Customizable Styles</p>
        </div>
      </div>

      <ul className="feature-list">
        <li>JavaScript, TypeScript, JSX, TSX</li>
        <li>Python, Java, C++, C#, Go, Rust, PHP, Ruby</li>
        <li>HTML, CSS, SCSS, Less</li>
        <li>JSON, YAML, XML, Markdown</li>
        <li>SQL, GraphQL, Bash, PowerShell</li>
        <li>And 175+ more languages!</li>
      </ul>

      <h3>Configuration</h3>
      <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '6px' }}>
{`<RichTextEditor
  enableCodeHighlight={true}
  defaultCodeLanguage="javascript"
  toolbarButtons={[
    'bold', 'italic', 'code',
    'separator',
    'codeBlock', // Code block button
    'separator',
    'undo', 'redo'
  ]}
/>`}
      </pre>
    </div>
  )
}
