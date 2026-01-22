import { useState } from 'react'
import BasicDemo from './demos/BasicDemo'
import ToolbarVariations from './demos/ToolbarVariations'
import MediaPickerDemo from './demos/MediaPickerDemo'
import FormIntegration from './demos/FormIntegration'
import AdvancedFeatures from './demos/AdvancedFeatures'
import CodeEditorDemo from './demos/CodeEditorDemo'
import PerformanceDemo from './demos/PerformanceDemo'
import AllFeatures from './demos/AllFeatures'

type DemoPage =
  | 'basic'
  | 'toolbars'
  | 'media'
  | 'form'
  | 'advanced'
  | 'code'
  | 'performance'
  | 'all'

function App() {
  const [activePage, setActivePage] = useState<DemoPage>('basic')

  const demos = [
    { id: 'basic' as const, label: '🚀 Basic Usage', component: BasicDemo },
    { id: 'toolbars' as const, label: '🎨 Toolbar Variations', component: ToolbarVariations },
    { id: 'media' as const, label: '🖼️ Media Picker', component: MediaPickerDemo },
    { id: 'form' as const, label: '📝 Form Integration', component: FormIntegration },
    { id: 'advanced' as const, label: '⚡ Advanced Features', component: AdvancedFeatures },
    { id: 'code' as const, label: '💻 Code Editor', component: CodeEditorDemo },
    { id: 'performance' as const, label: '📊 Performance', component: PerformanceDemo },
    { id: 'all' as const, label: '✨ All Features', component: AllFeatures },
  ]

  const ActiveComponent = demos.find((d) => d.id === activePage)?.component || BasicDemo

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>🎯 RTE Builder</h1>
        <p>
          A feature-rich TipTap-based WYSIWYG editor for React | Zero License Costs | Production Ready
        </p>
      </div>

      <div className="demo-nav">
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActivePage(demo.id)}
            className={activePage === demo.id ? 'active' : ''}
          >
            {demo.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  )
}

export default App
