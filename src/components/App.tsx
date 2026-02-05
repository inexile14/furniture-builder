/**
 * Parametric Table Builder - Main Application Component
 */

import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useTable } from '../context/TableContext'
import { useDesigns } from '../hooks'
import ControlPanel from './controls/ControlPanel'
import TablePreview from './preview/TablePreview'
import ExportPanel from './export/ExportPanel'
import UserMenu from './auth/UserMenu'
import SaveDesignModal from './designs/SaveDesignModal'
import MyDesignsPanel from './designs/MyDesignsPanel'

export default function App() {
  const { state, dispatch } = useTable()
  const { isSignedIn } = useAuth()
  const { designs, isLoading, saveDesign, deleteDesign, isSaving } = useDesigns()

  const [showExport, setShowExport] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showMyDesigns, setShowMyDesigns] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Format style name for display
  const styleName = state.params.style
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Handle saving a design
  const handleSaveDesign = async (name: string, description?: string) => {
    await saveDesign(name, state.params, { description })
  }

  // Handle loading a design
  const handleLoadDesign = (design: { params: unknown }) => {
    dispatch({ type: 'SET_PARAMS', params: design.params as typeof state.params })
    setShowMyDesigns(false)
  }

  return (
    <div className="h-screen bg-workshop-100 text-workshop-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-workshop-200 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-workshop-800">
            Parametric Table Builder
          </h1>
          <span className="text-xs text-workshop-600 px-2 py-0.5 bg-workshop-100 rounded border border-workshop-200">
            {styleName}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn && (
            <>
              <button
                onClick={() => setShowSaveModal(true)}
                className="btn-secondary text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setShowMyDesigns(!showMyDesigns)}
                className="btn-secondary text-sm"
              >
                {showMyDesigns ? 'Hide Designs' : 'My Designs'}
              </button>
            </>
          )}
          <button
            onClick={() => setShowExport(!showExport)}
            className="btn-primary text-sm"
          >
            {showExport ? 'Hide Export' : 'Build Package'}
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Main Content - min-width prevents sidebar from disappearing */}
      <div className="flex-1 flex min-h-0 min-w-[600px]">
        {/* Left Panel - Controls (collapsible) */}
        <aside
          className={`flex-shrink-0 bg-workshop-50 border-r border-workshop-200 transition-all duration-200 ${
            sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80 overflow-y-auto'
          }`}
        >
          <ControlPanel />
        </aside>

        {/* Center - 3D Preview (shrinks to fit, smooth transition) */}
        <main className="flex-1 min-w-0 relative transition-all duration-200">
          {/* Sidebar Toggle - top left corner */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute left-3 top-3 z-10 bg-white/95 hover:bg-white border border-workshop-200 rounded-lg px-3 py-2 transition-all duration-200 shadow-md hover:shadow-lg group"
            title={sidebarCollapsed ? 'Show controls' : 'Hide controls'}
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <span className={`block h-0.5 bg-workshop-600 transition-all duration-200 ${sidebarCollapsed ? 'w-4' : 'w-3'}`} />
                <span className="block w-4 h-0.5 bg-workshop-600" />
                <span className={`block h-0.5 bg-workshop-600 transition-all duration-200 ${sidebarCollapsed ? 'w-4' : 'w-3'}`} />
              </div>
              <span className="text-xs font-medium text-workshop-600 group-hover:text-workshop-800">
                {sidebarCollapsed ? 'Controls' : 'Hide'}
              </span>
            </div>
          </button>

          <TablePreview />

          {/* Validation warnings overlay - hidden for now
          {state.validation.warnings.length > 0 && (
            <div className="absolute bottom-16 left-4 max-w-md">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-md">
                <h4 className="text-amber-800 text-sm font-medium mb-1">Warnings</h4>
                <ul className="text-amber-700 text-xs space-y-1">
                  {state.validation.warnings.slice(0, 3).map((w, i) => (
                    <li key={i}>• {w.message}</li>
                  ))}
                  {state.validation.warnings.length > 3 && (
                    <li className="text-amber-600 font-medium">
                      +{state.validation.warnings.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
          */}

          {/* Validation errors overlay - hidden for now
          {state.validation.errors.length > 0 && (
            <div className="absolute top-4 left-4 max-w-md">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-md">
                <h4 className="text-red-800 text-sm font-medium mb-1">Errors</h4>
                <ul className="text-red-700 text-xs space-y-1">
                  {state.validation.errors.map((e, i) => (
                    <li key={i}>• {e.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          */}
        </main>

        {/* Right Panel - Export (conditional, fixed width) */}
        {showExport && (
          <aside className="w-96 flex-shrink-0 bg-white border-l border-workshop-200 overflow-y-auto shadow-lg">
            <ExportPanel onClose={() => setShowExport(false)} />
          </aside>
        )}

        {/* Right Panel - My Designs (conditional, fixed width) */}
        {showMyDesigns && (
          <aside className="w-80 flex-shrink-0 bg-white border-l border-workshop-200 overflow-y-auto shadow-lg">
            <MyDesignsPanel
              designs={designs}
              isLoading={isLoading}
              onLoad={handleLoadDesign}
              onDelete={deleteDesign}
              onClose={() => setShowMyDesigns(false)}
            />
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-workshop-200 px-6 py-2 text-xs text-workshop-500 flex items-center justify-between flex-shrink-0">
        <div>
          Dimensions: {state.params.length}" × {state.params.width}" × {state.params.height}"
        </div>
        <div>
          {state.params.primaryWood.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </div>
      </footer>

      {/* Save Design Modal */}
      {showSaveModal && (
        <SaveDesignModal
          params={state.params}
          onSave={handleSaveDesign}
          onClose={() => setShowSaveModal(false)}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}
