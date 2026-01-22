import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'

export default function PerformanceDemo() {
  const [largeContent, setLargeContent] = useState('<p>Performance test editor...</p>')

  const generateLargeContent = () => {
    const paragraphs = Array.from({ length: 100 }, (_, i) =>
      `<p>Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`
    )
    setLargeContent(paragraphs.join(''))
  }

  return (
    <div className="demo-section">
      <h2>📊 Performance & Bundle Size</h2>

      <div className="stats">
        <div className="stat-card">
          <h3>~300KB</h3>
          <p>Total Bundle Size</p>
        </div>
        <div className="stat-card">
          <h3>40%</h3>
          <p>Smaller than Froala</p>
        </div>
        <div className="stat-card">
          <h3>$0</h3>
          <p>License Cost (Free!)</p>
        </div>
      </div>

      <h3>Large Document Test</h3>
      <p>Test editor performance with large documents</p>

      <button className="btn-primary" onClick={generateLargeContent}>
        Generate 100 Paragraphs
      </button>

      <div style={{ marginTop: '15px' }}>
        <RichTextEditor
          value={largeContent}
          onChange={setLargeContent}
          height={400}
          toolbarPreset="medium"
        />
      </div>

      <h3>Performance Metrics</h3>
      <ul className="feature-list">
        <li>Fast initial load time</li>
        <li>Efficient re-renders with React hooks</li>
        <li>Optimized for large documents (10,000+ words)</li>
        <li>Smooth typing experience</li>
        <li>Memory-efficient</li>
      </ul>
    </div>
  )
}
