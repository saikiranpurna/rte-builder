import { useState } from "react";
import { RichTextEditor } from "rte-builder";
import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";
import { PropsTable } from "../components/PropsTable";

const toolbarProps = [
  {
    name: "toolbarPreset",
    type: "'full' | 'medium' | 'simple'",
    default: "'full'",
    required: false,
    description:
      "Predefined toolbar configuration. Choose based on your needs.",
  },
  {
    name: "toolbarButtons",
    type: "ToolbarButton[]",
    default: "-",
    required: false,
    description:
      "Custom toolbar buttons array for complete control over toolbar layout.",
  },
  {
    name: "showCharCounter",
    type: "boolean",
    default: "false",
    required: false,
    description: "Show character count at the bottom of the editor.",
  },
  {
    name: "charCounterMax",
    type: "number",
    default: "-",
    required: false,
    description: "Maximum character limit. Works with showCharCounter.",
  },
];

export default function ToolbarConfig() {
  const [preset, setPreset] = useState<"simple" | "medium" | "full">("full");
  const [content, setContent] = useState(
    "<p>Try different toolbar presets...</p>",
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Toolbar Configuration</h1>
        <p className="page-description">
          Customize the toolbar with presets or create your own button layout.
        </p>
      </div>

      <section className="section">
        <h2>Toolbar Presets</h2>
        <p>
          RTE Builder includes <strong>3 built-in presets</strong> for common
          use cases. Choose based on how much formatting control you want to
          give users.
        </p>

        <div className="preset-cards">
          <div className="preset-card" onClick={() => setPreset("simple")}>
            <h4>Simple</h4>
            <p>Basic formatting only</p>
            <span className="preset-use">Comments, quick notes</span>
          </div>
          <div className="preset-card" onClick={() => setPreset("medium")}>
            <h4>Medium</h4>
            <p>Text formatting + lists + media</p>
            <span className="preset-use">Blog posts, articles</span>
          </div>
          <div className="preset-card" onClick={() => setPreset("full")}>
            <h4>Full</h4>
            <p>All features enabled</p>
            <span className="preset-use">CMS, documentation</span>
          </div>
        </div>

        <CodeBlock
          code={`// Use a preset
<RichTextEditor
  value={content}
  onChange={setContent}
  toolbarPreset="${preset}"
/>`}
          language="tsx"
          showLineNumbers={false}
        />

        <div className="live-example">
          <h4>
            Current Preset: <code>{preset}</code>
          </h4>
          <div className="preset-selector">
            {(["simple", "medium", "full"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={preset === p ? "active" : ""}
              >
                {p}
              </button>
            ))}
          </div>
          <RichTextEditor
            value={content}
            onChange={setContent}
            toolbarPreset={preset}
            height={200}
          />
        </div>
      </section>

      <section className="section">
        <h2>Preset Comparison</h2>

        <div className="preset-table-wrapper">
          <table className="preset-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Simple</th>
                <th>Medium</th>
                <th>Full</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bold / Italic / Underline</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Strikethrough</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Headings</td>
                <td>H1-H2</td>
                <td>H1-H4</td>
                <td>H1-H6</td>
              </tr>
              <tr>
                <td>Lists (Bullet/Ordered)</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Links</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Images</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Videos</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Code Blocks</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Tables</td>
                <td>-</td>
                <td>-</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Text Color</td>
                <td>-</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Alignment</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Blockquote</td>
                <td>-</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Custom Toolbar</h2>
        <p>
          For complete control, use the <code>toolbarButtons</code> prop to
          define your own button layout.
        </p>

        <Callout type="info" title="Button Array">
          The <code>toolbarButtons</code> prop is an array of button identifiers
          that will be displayed in the toolbar.
        </Callout>

        <CodeBlock
          code={`import { RichTextEditor, ToolbarButton } from 'rte-builder'

const customButtons: ToolbarButton[] = [
  // Text formatting
  'bold', 'italic', 'underline',
  // Structure
  'heading1', 'heading2', 'bulletList', 'orderedList',
  // Insert
  'link', 'image',
  // History
  'undo', 'redo',
]

function CustomToolbarEditor() {
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      toolbarPreset="custom"
      customToolbar={customToolbar}
    />
  )
}`}
          language="tsx"
          filename="CustomToolbarEditor.tsx"
        />
      </section>

      <section className="section">
        <h2>Available Toolbar Buttons</h2>
        <p>
          These are all the available button identifiers you can use in custom
          toolbars:
        </p>

        <div className="button-grid">
          <div className="button-category">
            <h4>Text Formatting</h4>
            <ul>
              <li>
                <code>bold</code> - Bold text
              </li>
              <li>
                <code>italic</code> - Italic text
              </li>
              <li>
                <code>underline</code> - Underline text
              </li>
              <li>
                <code>strikethrough</code> - Strikethrough
              </li>
              <li>
                <code>code</code> - Inline code
              </li>
              <li>
                <code>subscript</code> - Subscript
              </li>
              <li>
                <code>superscript</code> - Superscript
              </li>
            </ul>
          </div>

          <div className="button-category">
            <h4>Headings</h4>
            <ul>
              <li>
                <code>heading1</code> - Heading 1
              </li>
              <li>
                <code>heading2</code> - Heading 2
              </li>
              <li>
                <code>heading3</code> - Heading 3
              </li>
              <li>
                <code>heading4</code> - Heading 4
              </li>
              <li>
                <code>heading5</code> - Heading 5
              </li>
              <li>
                <code>heading6</code> - Heading 6
              </li>
            </ul>
          </div>

          <div className="button-category">
            <h4>Lists & Structure</h4>
            <ul>
              <li>
                <code>bulletList</code> - Bullet list
              </li>
              <li>
                <code>orderedList</code> - Numbered list
              </li>
              <li>
                <code>blockquote</code> - Quote block
              </li>
              <li>
                <code>codeBlock</code> - Code block
              </li>
              <li>
                <code>horizontalRule</code> - Divider line
              </li>
            </ul>
          </div>

          <div className="button-category">
            <h4>Media & Links</h4>
            <ul>
              <li>
                <code>link</code> - Insert link
              </li>
              <li>
                <code>image</code> - Insert image
              </li>
              <li>
                <code>video</code> - Insert video
              </li>
              <li>
                <code>table</code> - Insert table
              </li>
            </ul>
          </div>

          <div className="button-category">
            <h4>Alignment</h4>
            <ul>
              <li>
                <code>alignLeft</code> - Left align
              </li>
              <li>
                <code>alignCenter</code> - Center align
              </li>
              <li>
                <code>alignRight</code> - Right align
              </li>
              <li>
                <code>alignJustify</code> - Justify
              </li>
            </ul>
          </div>

          <div className="button-category">
            <h4>Colors & History</h4>
            <ul>
              <li>
                <code>textColor</code> - Text color
              </li>
              <li>
                <code>highlight</code> - Highlight color
              </li>
              <li>
                <code>undo</code> - Undo
              </li>
              <li>
                <code>redo</code> - Redo
              </li>
              <li>
                <code>clearFormatting</code> - Clear format
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Toolbar Props</h2>
        <PropsTable props={toolbarProps} />
      </section>

      <section className="section">
        <h2>Toolbar Position</h2>
        <p>
          By default, the toolbar appears at the top. You can move it to the
          bottom with <code>toolbarPosition="bottom"</code>.
        </p>

        <CodeBlock
          code={`// Toolbar at the bottom
<RichTextEditor
  value={content}
  onChange={setContent}
  toolbarPosition="bottom"
/>`}
          language="tsx"
          showLineNumbers={false}
        />
      </section>

      <section className="section">
        <h2>Sticky Toolbar</h2>
        <p>
          For long documents, enable <code>stickyToolbar</code> to keep the
          toolbar visible while scrolling.
        </p>

        <CodeBlock
          code={`<RichTextEditor
  value={content}
  onChange={setContent}
  stickyToolbar={true}
  height={600}
/>`}
          language="tsx"
          showLineNumbers={false}
        />
      </section>

      <section className="section next-steps">
        <h2>Next Steps</h2>
        <div className="next-links">
          <a href="#/api" className="next-link">
            <span className="next-label">Next</span>
            <span className="next-title">API Reference →</span>
          </a>
        </div>
      </section>
    </div>
  );
}
