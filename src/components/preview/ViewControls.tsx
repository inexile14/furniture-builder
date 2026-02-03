/**
 * Parametric Table Builder - View Controls
 */

import { useTable } from '../../context/TableContext'

export default function ViewControls() {
  const { state, dispatch } = useTable()
  const { isExploded } = state

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE_EXPLODED' })}
        className={`
          px-3 py-2 rounded-md text-sm font-medium
          flex items-center gap-2 transition-all
          ${isExploded
            ? 'bg-workshop-700 text-white shadow-md'
            : 'bg-white/90 text-workshop-700 hover:bg-white shadow border border-workshop-200'
          }
        `}
        title="Toggle exploded view to see construction"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isExploded ? (
            // Collapse icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          ) : (
            // Expand icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          )}
        </svg>
        {isExploded ? 'Assembled' : 'Exploded'}
      </button>
    </div>
  )
}
