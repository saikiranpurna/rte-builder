import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";

export default function GettingStarted() {
  return (
    <div className="page">
      {/* Professional Hero Section */}
      <div className="hero-section">
        <div className="hero-badges">
          <span className="hero-badge license">MIT License</span>
          <span className="hero-badge version">v1.0.0</span>
          <a
            href="https://www.npmjs.com/package/rte-builder"
            className="hero-badge npm"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </a>
          <a
            href="https://github.com/AshutoshBuilds/rte-builder"
            className="hero-badge github"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⭐ GitHub
          </a>
        </div>

        <h1 className="hero-title">RTE Builder</h1>
        <p className="hero-subtitle">
          A modern, lightweight Rich Text Editor for React applications. Built
          on TipTap & ProseMirror. Free and open source forever.
        </p>

        <div className="hero-install">
          <div className="install-command">
            <code>npm install rte-builder</code>
            <button
              className="copy-btn"
              onClick={() =>
                navigator.clipboard.writeText("npm install rte-builder")
              }
            >
              Copy
            </button>
          </div>
        </div>

        <div className="hero-actions">
          <a href="#/installation" className="btn btn-primary">
            Get Started →
          </a>
          <a href="#/playground" className="btn btn-secondary">
            Try Playground
          </a>
          <a
            href="https://github.com/AshutoshBuilds/rte-builder"
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">~200KB</span>
            <span className="stat-label">Bundle Size</span>
          </div>
          <div className="stat">
            <span className="stat-value">MIT</span>
            <span className="stat-label">License</span>
          </div>
          <div className="stat">
            <span className="stat-value">TypeScript</span>
            <span className="stat-label">First-class</span>
          </div>
          <div className="stat">
            <span className="stat-value">190+</span>
            <span className="stat-label">Languages</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="section">
        <h2>Why RTE Builder?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Easy to Use</h3>
            <p>
              Get started in minutes with a simple, intuitive API. No complex
              configuration required.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Fully Customizable</h3>
            <p>
              Customize every aspect of the editor - toolbars, styles,
              extensions, and more.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Zero License Costs</h3>
            <p>
              100% open source. No subscription fees, no per-seat licensing, no
              hidden costs.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Production Ready</h3>
            <p>
              Built on TipTap/ProseMirror - the same tech powering Notion,
              GitLab, and more.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Quick Start</h2>
        <p>Get a fully-featured rich text editor running in under 2 minutes:</p>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Install the package</h4>
              <CodeBlock
                code="npm install rte-builder"
                language="bash"
                showLineNumbers={false}
              />
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Import and use</h4>
              <CodeBlock
                code={`import { RichTextEditor } from 'rte-builder'
import 'rte-builder/styles.css'

function App() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing..."
    />
  )
}`}
                language="tsx"
                filename="App.tsx"
              />
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>That's it! 🎉</h4>
              <p>
                You now have a fully-featured rich text editor with formatting,
                lists, links, images, tables, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Comparison</h2>

        <Callout type="tip" title="Migration from Froala/CKEditor?">
          RTE Builder was designed as a drop-in replacement for commercial
          editors. Check our migration guide for a smooth transition.
        </Callout>

        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>RTE Builder</th>
                <th>Froala</th>
                <th>CKEditor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>License Cost</td>
                <td className="highlight">Free (MIT)</td>
                <td>$199-899/year</td>
                <td>$99-499/year</td>
              </tr>
              <tr>
                <td>Bundle Size</td>
                <td className="highlight">~200KB</td>
                <td>~500KB</td>
                <td>~600KB</td>
              </tr>
              <tr>
                <td>React Native</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>TypeScript</td>
                <td>✅ Full</td>
                <td>Partial</td>
                <td>Partial</td>
              </tr>
              <tr>
                <td>Syntax Highlighting</td>
                <td>190+ languages</td>
                <td>Limited</td>
                <td>Limited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>What's Included</h2>
        <div className="included-grid">
          <div className="included-item">
            <h4>📝 Text Formatting</h4>
            <p>
              Bold, italic, underline, strike, subscript, superscript, code, and
              more.
            </p>
          </div>
          <div className="included-item">
            <h4>🎨 Font Styling</h4>
            <p>Font family, size, text color, background color, line height.</p>
          </div>
          <div className="included-item">
            <h4>📋 Lists & Structure</h4>
            <p>
              Bullet lists, numbered lists, headings (H1-H6), blockquotes,
              horizontal rules.
            </p>
          </div>
          <div className="included-item">
            <h4>🔗 Links & Media</h4>
            <p>Hyperlinks, images, videos, custom media picker integration.</p>
          </div>
          <div className="included-item">
            <h4>📊 Tables</h4>
            <p>Resizable tables with add/remove rows and columns.</p>
          </div>
          <div className="included-item">
            <h4>💻 Code Blocks</h4>
            <p>Syntax highlighting for 190+ programming languages.</p>
          </div>
          <div className="included-item">
            <h4>😊 Emoji</h4>
            <p>Built-in emoji picker with search and categories.</p>
          </div>
          <div className="included-item">
            <h4>🖨️ Utilities</h4>
            <p>Fullscreen mode, print, undo/redo, character counter.</p>
          </div>
        </div>
      </section>

      {/* Open for Contributors Section */}
      <section className="section contributors-section">
        <div className="contributors-card">
          <div className="contributors-content">
            <h2>🌟 Open for Contributors</h2>
            <p>
              RTE Builder is open source and we welcome contributions! Whether
              you're fixing bugs, adding features, improving documentation, or
              helping with translations - every contribution matters.
            </p>
            <div className="contributors-actions">
              <a
                href="https://github.com/AshutoshBuilds/rte-builder/issues"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse Issues
              </a>
              <a
                href="https://github.com/AshutoshBuilds/rte-builder/blob/main/CONTRIBUTING.md"
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contributing Guide
              </a>
            </div>
            <div className="license-info">
              <span className="license-badge-large">MIT License</span>
              <p>Free for personal and commercial use. No strings attached.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Next Steps</h2>
        <div className="next-steps">
          <a href="#/installation" className="next-step-card">
            <span className="next-icon">📦</span>
            <div>
              <h4>Installation</h4>
              <p>Detailed installation instructions and requirements</p>
            </div>
            <span className="arrow">→</span>
          </a>
          <a href="#/basic-usage" className="next-step-card">
            <span className="next-icon">✏️</span>
            <div>
              <h4>Basic Usage</h4>
              <p>Learn the fundamental concepts and API</p>
            </div>
            <span className="arrow">→</span>
          </a>
          <a href="#/playground" className="next-step-card">
            <span className="next-icon">🎮</span>
            <div>
              <h4>Playground</h4>
              <p>Interactive playground to explore all features</p>
            </div>
            <span className="arrow">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
