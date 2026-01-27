import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'

export default function AdvancedFeatures() {
  const [content1, setContent1] = useState('<p>This editor has a character limit...</p>')
  const [content2] = useState('<p>This editor is read-only...</p>')
  const [content3, setContent3] = useState('<p>This editor can be disabled...</p>')
  const [isDisabled, setIsDisabled] = useState(false)
  const [content4, setContent4] = useState('<p>This editor has custom height constraints...</p>')

  return (
    <div className="demo-section">
      <h2>⚡ Advanced Features</h2>
      <p>Explore advanced configuration options and state management.</p>

      <div className="demo-grid">
        <div className="demo-card">
          <h4>Character Counter & Limit</h4>
          <p>Shows character count with a 500 character limit</p>
          <RichTextEditor
            value={content1}
            onChange={setContent1}
            showCharCounter
            charCounterMax={500}
            height={250}
            toolbarPreset="simple"
          />
        </div>

        <div className="demo-card">
          <h4>Read-Only Mode</h4>
          <p>Editor content cannot be modified</p>
          <RichTextEditor
            value={content2}
            readOnly
            height={250}
            toolbarPreset="simple"
          />
        </div>

        <div className="demo-card">
          <h4>Disabled State</h4>
          <p>Toggle the disabled state of the editor</p>
          <div style={{ marginBottom: '10px' }}>
            <button
              className={isDisabled ? 'btn-secondary' : 'btn-danger'}
              onClick={() => setIsDisabled(!isDisabled)}
            >
              {isDisabled ? 'Enable Editor' : 'Disable Editor'}
            </button>
          </div>
          <RichTextEditor
            value={content3}
            onChange={setContent3}
            disabled={isDisabled}
            height={250}
            toolbarPreset="simple"
          />
        </div>

        <div className="demo-card">
          <h4>Custom Height Constraints</h4>
          <p>Min height: 200px, Max height: 400px</p>
          <RichTextEditor
            value={content4}
            onChange={setContent4}
            height={300}
            minHeight={200}
            maxHeight={400}
            toolbarPreset="simple"
          />
        </div>
      </div>

      <h3>Event Handlers</h3>
      <EventHandlersDemo />

      <h3>Configuration Examples</h3>
      <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '6px' }}>
{`// Character limit
<RichTextEditor
  showCharCounter
  charCounterMax={1000}
/>

// Read-only
<RichTextEditor readOnly />

// Disabled
<RichTextEditor disabled={isDisabled} />

// Height constraints
<RichTextEditor
  height={400}
  minHeight={300}
  maxHeight={600}
/>

// Event handlers
<RichTextEditor
  onFocus={() => console.log('focused')}
  onBlur={() => console.log('blurred')}
  onChange={(content) => console.log(content)}
/>`}
      </pre>
    </div>
  )
}

function EventHandlersDemo() {
  const [events, setEvents] = useState<string[]>([])
  const [content, setContent] = useState('<p>Focus, blur, or edit this editor...</p>')

  const addEvent = (event: string) => {
    setEvents((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${event}`])
  }

  return (
    <div className="demo-card" style={{ marginTop: '20px' }}>
      <h4>Event Handlers</h4>
      <RichTextEditor
        value={content}
        onChange={(c) => {
          setContent(c)
          addEvent('onChange triggered')
        }}
        onFocus={() => addEvent('onFocus triggered')}
        onBlur={() => addEvent('onBlur triggered')}
        height={200}
        toolbarPreset="simple"
      />
      <div style={{ marginTop: '15px', padding: '10px', background: '#f7fafc', borderRadius: '6px' }}>
        <strong>Recent Events:</strong>
        {events.length === 0 ? (
          <p style={{ margin: '5px 0 0' }}>No events yet...</p>
        ) : (
          <ul style={{ margin: '5px 0 0', paddingLeft: '20px' }}>
            {events.map((event, i) => (
              <li key={i}>{event}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
