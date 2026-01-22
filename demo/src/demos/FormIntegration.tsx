import { useState, useRef, FormEvent } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { EditorRef } from 'rte-builder'

interface FormData {
  title: string
  category: string
  content: string
  tags: string
}

export default function FormIntegration() {
  const editorRef = useRef<EditorRef>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: 'general',
    content: '',
    tags: '',
  })
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Get content from editor ref
    const content = editorRef.current?.getContent() || ''

    const data = {
      ...formData,
      content,
    }

    setSubmittedData(data)
    console.log('Form submitted:', data)
  }

  const handleReset = () => {
    setFormData({
      title: '',
      category: 'general',
      content: '',
      tags: '',
    })
    editorRef.current?.clear()
    setSubmittedData(null)
  }

  return (
    <div className="demo-section">
      <h2>📝 Form Integration</h2>
      <p>Integrate the editor with standard forms and handle form submissions.</p>

      <form onSubmit={handleSubmit}>
        <div className="demo-grid">
          <div className="demo-card">
            <h4>Form Fields</h4>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              >
                <option value="general">General</option>
                <option value="tech">Technology</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="comma, separated, tags"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>

            <div className="demo-actions">
              <button type="submit" className="btn-primary">
                Submit Form
              </button>
              <button type="button" className="btn-secondary" onClick={handleReset}>
                Reset Form
              </button>
            </div>
          </div>

          <div className="demo-card">
            <h4>Content *</h4>
            <RichTextEditor
              ref={editorRef}
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your content here..."
              height={350}
              toolbarPreset="medium"
              showCharCounter
              charCounterMax={5000}
            />
          </div>
        </div>
      </form>

      {submittedData && (
        <div className="output-preview">
          <h4>Submitted Data:</h4>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}

      <h3>Integration Pattern</h3>
      <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '6px' }}>
{`const editorRef = useRef<EditorRef>(null)
const [formData, setFormData] = useState({ title: '', content: '' })

const handleSubmit = (e) => {
  e.preventDefault()

  // Get content from editor
  const content = editorRef.current?.getContent() || ''

  const data = { ...formData, content }
  // Submit to API
}

<form onSubmit={handleSubmit}>
  <input value={formData.title} onChange={...} />

  <RichTextEditor
    ref={editorRef}
    value={formData.content}
    onChange={(content) => setFormData({ ...formData, content })}
  />

  <button type="submit">Submit</button>
</form>`}
      </pre>
    </div>
  )
}
