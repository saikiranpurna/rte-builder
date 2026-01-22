import { useState } from 'react'
import { RichTextEditor } from 'rte-builder'
import type { MediaFile } from 'rte-builder'

export default function MediaPickerDemo() {
  const [content, setContent] = useState('<p>Click the image or video buttons in the toolbar...</p>')
  const [log, setLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleImagePicker = async (): Promise<MediaFile | null> => {
    addLog('Image picker opened')

    // Simulate opening a media picker dialog
    const url = prompt('Enter image URL (or cancel):')

    if (url) {
      addLog(`Image selected: ${url}`)
      return {
        url,
        name: 'Demo Image',
        alt: 'Demo image from picker',
      }
    }

    addLog('Image picker cancelled')
    return null
  }

  const handleVideoPicker = async (): Promise<MediaFile | null> => {
    addLog('Video picker opened')

    // Simulate opening a media picker dialog
    const url = prompt('Enter video URL (or cancel):')

    if (url) {
      addLog(`Video selected: ${url}`)
      return {
        url,
        name: 'Demo Video',
      }
    }

    addLog('Video picker cancelled')
    return null
  }

  return (
    <div className="demo-section">
      <h2>🖼️ Media Picker Integration</h2>
      <p>
        Integrate with your custom media library by providing callbacks for image and video selection.
      </p>

      <h3>Editor with Media Picker</h3>
      <RichTextEditor
        value={content}
        onChange={setContent}
        onMediaPickerImage={handleImagePicker}
        onMediaPickerVideo={handleVideoPicker}
        height={400}
        toolbarPreset="medium"
      />

      <div className="output-preview">
        <h4>Event Log:</h4>
        <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
          {log.length === 0 ? 'No events yet...' : log.join('\n')}
        </pre>
      </div>

      <h3>Sample Images to Try</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        <button
          className="btn-info"
          onClick={() => {
            navigator.clipboard.writeText('https://picsum.photos/800/400')
            addLog('Copied image URL to clipboard')
          }}
        >
          Copy Sample Image URL
        </button>
        <button
          className="btn-info"
          onClick={() => {
            navigator.clipboard.writeText('https://www.w3schools.com/html/mov_bbb.mp4')
            addLog('Copied video URL to clipboard')
          }}
        >
          Copy Sample Video URL
        </button>
      </div>

      <h3>Integration Example Code</h3>
      <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '6px' }}>
{`const handleImagePicker = async (): Promise<MediaFile | null> => {
  // Open your custom media dialog
  const file = await openYourMediaDialog('image')

  if (file) {
    return {
      url: file.url,
      name: file.name,
      alt: file.alt,
    }
  }

  return null
}

<RichTextEditor
  onMediaPickerImage={handleImagePicker}
  onMediaPickerVideo={handleVideoPicker}
/>`}
      </pre>
    </div>
  )
}
