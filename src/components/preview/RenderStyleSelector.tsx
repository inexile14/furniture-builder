/**
 * Render Style Selector
 *
 * UI for switching between render styles (wireframe, shaded, realistic, etc.)
 * Appears as a toolbar in the 3D preview area.
 */

import { useTable } from '../../context/TableContext'
import { RENDER_STYLE_CONFIGS, WOOD_FINISH_CONFIGS } from '../../constants/rendering'
import type { RenderStyle, WoodFinish } from '../../types'

export default function RenderStyleSelector() {
  const { state, dispatch } = useTable()
  const { renderSettings } = state

  const isRealistic = renderSettings.style === 'realistic'

  const handleStyleChange = (style: RenderStyle) => {
    dispatch({ type: 'SET_RENDER_STYLE', style })
  }

  const handleFinishChange = (finish: WoodFinish) => {
    dispatch({ type: 'SET_WOOD_FINISH', finish })
  }

  // Available styles
  const styles: RenderStyle[] = ['shaded-edges', 'realistic', 'xray']

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
      {/* Style buttons */}
      <div className="flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
        {styles.map(style => {
          const config = RENDER_STYLE_CONFIGS[style]
          const isActive = renderSettings.style === style
          return (
            <button
              key={style}
              onClick={() => handleStyleChange(style)}
              className={`
                px-3 py-1.5 text-xs rounded-md transition-all duration-150
                ${isActive
                  ? 'bg-workshop-700 text-white shadow-sm'
                  : 'text-workshop-600 hover:bg-workshop-100'
                }
              `}
              title={config.description}
            >
              {config.name}
            </button>
          )
        })}
      </div>

      {/* Finish selector (only in realistic mode) */}
      {isRealistic && (
        <div className="flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
          {(Object.keys(WOOD_FINISH_CONFIGS) as WoodFinish[]).map(finish => {
            const config = WOOD_FINISH_CONFIGS[finish]
            const isActive = renderSettings.finish === finish
            return (
              <button
                key={finish}
                onClick={() => handleFinishChange(finish)}
                className={`
                  px-2 py-1 text-xs rounded-md transition-all
                  ${isActive
                    ? 'bg-workshop-600 text-white'
                    : 'text-workshop-500 hover:bg-workshop-100'
                  }
                `}
              >
                {config.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
