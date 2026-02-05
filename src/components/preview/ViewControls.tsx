/**
 * Parametric Table Builder - View Controls
 */

import { useTable } from '../../context/TableContext'

export default function ViewControls() {
  const { state, dispatch } = useTable()
  const { isExploded, showJoinery } = state

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      {/* Exploded View Toggle */}
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

      {/* Transparent View Toggle - hidden for MVP */}
      {/* TODO: Implement proper X-Ray mode with transparent materials */}

      {/* Joinery Toggle */}
      <button
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE_JOINERY_PREVIEW' })}
        className={`
          px-3 py-2 rounded-md text-sm font-medium
          flex items-center gap-2 transition-all
          ${showJoinery
            ? 'bg-workshop-700 text-white shadow-md'
            : 'bg-white/90 text-workshop-700 hover:bg-white shadow border border-workshop-200'
          }
        `}
        title="Toggle joinery visualization"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        {showJoinery ? 'Hide Joinery' : 'Show Joinery'}
      </button>
    </div>
  )
}
