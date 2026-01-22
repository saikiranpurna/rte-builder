import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { ToolbarButton } from 'rte-builder'

export default function ToolbarVariations() {
  const [fullContent, setFullContent] = useState('<p>This editor has the full toolbar...</p>')
  const [mediumContent, setMediumContent] = useState('<p>This editor has the medium toolbar...</p>')
  const [simpleContent, setSimpleContent] = useState('<p>This editor has the simple toolbar...</p>')
  const [customContent, setCustomContent] = useState('<p>This editor has a custom toolbar...</p>')

  const customButtons: ToolbarButton[] = [
    'bold',
    'italic',
    'underline',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'separator',
    'bulletList',
    'orderedList',
    'separator',
    'link',
    'image',
    'codeBlock',
    'separator',
    'undo',
    'redo',
  ]

  return (
    <div className="demo-section">
      <h2>🎨 Toolbar Variations</h2>
      <p>
        Compare different toolbar presets and create your own custom toolbar configuration.
      </p>

      <div className="demo-grid">
        <div className="demo-card">
          <h4>Full Toolbar (40+ buttons)</h4>
          <p>All available features and formatting options</p>
          <RichTextEditor
            value={fullContent}
            onChange={setFullContent}
            toolbarPreset="full"
            height={300}
          />
        </div>

        <div className="demo-card">
          <h4>Medium Toolbar (25+ buttons)</h4>
          <p>Standard editing features for most use cases</p>
          <RichTextEditor
            value={mediumContent}
            onChange={setMediumContent}
            toolbarPreset="medium"
            height={300}
          />
        </div>

        <div className="demo-card">
          <h4>Simple Toolbar (10+ buttons)</h4>
          <p>Basic formatting for simple content</p>
          <RichTextEditor
            value={simpleContent}
            onChange={setSimpleContent}
            toolbarPreset="simple"
            height={300}
          />
        </div>

        <div className="demo-card">
          <h4>Custom Toolbar</h4>
          <p>Build your own toolbar with exactly what you need</p>
          <RichTextEditor
            value={customContent}
            onChange={setCustomContent}
            toolbarButtons={customButtons}
            height={300}
          />
        </div>
      </div>

      <h3>Custom Toolbar Example Code</h3>
      <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '6px' }}>
{`const customButtons: ToolbarButton[] = [
  'bold', 'italic', 'underline',
  'separator',
  'heading1', 'heading2', 'heading3',
  'separator',
  'bulletList', 'orderedList',
  'separator',
  'link', 'image', 'codeBlock',
  'separator',
  'undo', 'redo',
]

<RichTextEditor toolbarButtons={customButtons} />`}
      </pre>
    </div>
  )
}
