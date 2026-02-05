/**
 * Parametric Table Builder - Table Context
 * Global state management for table parameters and UI state
 */

import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react'
import type { TableParams, TableBuilderState, TableBuilderAction, StylePreset, ApronProfile } from '../types'
import { DEFAULT_TABLE_PARAMS, STYLE_PRESETS, TABLE_TYPE_LIMITS } from '../constants'
import { validateTableParams } from '../engine/validation'
import { loadStyleOverrides } from '../utils/styleOverrides'

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: TableBuilderState = {
  params: DEFAULT_TABLE_PARAMS,
  geometry: null,
  cutList: null,
  validation: { valid: true, errors: [], warnings: [] },
  selectedComponent: null,
  isExploded: false,
  isTransparent: false,
  showJoinery: true,
  previewQuality: 'medium',
  renderSettings: {
    style: 'shaded-edges',
    finish: 'satin',
    showShadows: true,
    showAmbientOcclusion: false,
    showReflections: false,
    backgroundColor: '#f5f5f0'
  }
}

// =============================================================================
// REDUCER
// =============================================================================

function tableReducer(state: TableBuilderState, action: TableBuilderAction): TableBuilderState {
  switch (action.type) {
    case 'SET_TABLE_TYPE': {
      const limits = TABLE_TYPE_LIMITS[action.tableType]
      return {
        ...state,
        params: {
          ...state.params,
          tableType: action.tableType,
          // Clamp dimensions to new type limits
          length: Math.min(Math.max(state.params.length, limits.length.min), limits.length.max),
          width: Math.min(Math.max(state.params.width, limits.width.min), limits.width.max),
          height: Math.min(Math.max(state.params.height, limits.height.min), limits.height.max)
        }
      }
    }

    case 'SET_STYLE': {
      const preset = STYLE_PRESETS[action.style]
      return {
        ...state,
        params: applyStylePreset(state.params, preset)
      }
    }

    case 'SET_DIMENSION': {
      return {
        ...state,
        params: {
          ...state.params,
          [action.dimension]: action.value
        }
      }
    }

    case 'SET_TOP_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          top: {
            ...state.params.top,
            [action.key]: action.value
          }
        }
      }
    }

    case 'SET_LEG_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          legs: {
            ...state.params.legs,
            [action.key]: action.value
          }
        }
      }
    }

    case 'SET_APRON_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          aprons: {
            ...state.params.aprons,
            [action.key]: action.value
          }
        }
      }
    }

    case 'SET_STRETCHER_PARAM': {
      const newStretchers = {
        ...state.params.stretchers,
        [action.key]: action.value
      }
      // When enabling stretchers, auto-set style to 'box' if currently 'none'
      if (action.key === 'enabled' && action.value === true && newStretchers.style === 'none') {
        newStretchers.style = 'box'
      }
      return {
        ...state,
        params: {
          ...state.params,
          stretchers: newStretchers
        }
      }
    }

    case 'SET_SLAT_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          slats: state.params.slats
            ? { ...state.params.slats, [action.key]: action.value }
            : undefined
        }
      }
    }

    case 'SET_TRESTLE_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          trestle: state.params.trestle
            ? { ...state.params.trestle, [action.key]: action.value }
            : undefined
        }
      }
    }

    case 'SET_DRAWER_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          drawers: state.params.drawers
            ? { ...state.params.drawers, [action.key]: action.value }
            : undefined
        }
      }
    }

    case 'SET_JOINERY_PARAM': {
      return {
        ...state,
        params: {
          ...state.params,
          joinery: {
            ...state.params.joinery,
            [action.key]: action.value
          }
        }
      }
    }

    case 'SET_PARAMS': {
      return {
        ...state,
        params: {
          ...state.params,
          ...action.params
        }
      }
    }

    case 'APPLY_PRESET': {
      return {
        ...state,
        params: applyStylePreset(state.params, action.preset)
      }
    }

    case 'RESET_TO_DEFAULTS': {
      return {
        ...initialState
      }
    }

    case 'TOGGLE_EXPLODED': {
      return {
        ...state,
        isExploded: !state.isExploded
      }
    }

    case 'TOGGLE_TRANSPARENT': {
      return {
        ...state,
        isTransparent: !state.isTransparent
      }
    }

    case 'TOGGLE_JOINERY_PREVIEW': {
      return {
        ...state,
        showJoinery: !state.showJoinery
      }
    }

    case 'SELECT_COMPONENT': {
      return {
        ...state,
        selectedComponent: action.component
      }
    }

    case 'SET_PREVIEW_QUALITY': {
      return {
        ...state,
        previewQuality: action.quality
      }
    }

    case 'SET_VALIDATION': {
      return {
        ...state,
        validation: action.validation
      }
    }

    case 'SET_RENDER_STYLE': {
      return {
        ...state,
        renderSettings: {
          ...state.renderSettings,
          style: action.style
        }
      }
    }

    case 'SET_WOOD_FINISH': {
      return {
        ...state,
        renderSettings: {
          ...state.renderSettings,
          finish: action.finish
        }
      }
    }

    case 'SET_RENDER_SETTINGS': {
      return {
        ...state,
        renderSettings: {
          ...state.renderSettings,
          ...action.settings
        }
      }
    }

    default:
      return state
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function applyStylePreset(params: TableParams, preset: StylePreset): TableParams {
  const tableAdjustments = preset.tableTypeAdjustments[params.tableType] || {}

  // Check for custom overrides saved by admin
  const styleOverrides = loadStyleOverrides()
  const customDefaults = styleOverrides[preset.name] as Partial<TableParams> | undefined

  // Get suggested dimensions for this style + table type, or preserve existing
  const suggestedDims = preset.suggestedDimensions?.[params.tableType]
  const length = suggestedDims?.length ?? params.length
  const width = suggestedDims?.width ?? params.width
  const height = suggestedDims?.height ?? params.height

  // Use custom defaults if available, otherwise use preset defaults
  const effectiveDefaults = {
    top: customDefaults?.top ?? preset.defaults.top,
    legs: customDefaults?.legs ?? preset.defaults.legs,
    aprons: customDefaults?.aprons ?? preset.defaults.aprons,
    stretchers: customDefaults?.stretchers ?? preset.defaults.stretchers,
    slats: customDefaults?.slats ?? preset.defaults.slats,
    joinery: customDefaults?.joinery ?? preset.defaults.joinery,
    trestle: customDefaults?.trestle,
  }

  // When switching styles, apply style's suggested dimensions if available
  // Everything else comes from the effective defaults (custom or built-in)
  const presetSides = effectiveDefaults.aprons?.sides
  const adjustmentSides = (tableAdjustments.aprons as { sides?: { front?: boolean; back?: boolean; left?: boolean; right?: boolean } })?.sides
  const apronSides = {
    front: adjustmentSides?.front ?? presetSides?.front ?? true,
    back: adjustmentSides?.back ?? presetSides?.back ?? true,
    left: adjustmentSides?.left ?? presetSides?.left ?? true,
    right: adjustmentSides?.right ?? presetSides?.right ?? true
  }

  return {
    // Preserve table type and wood, apply suggested dimensions if available
    tableType: params.tableType,
    length,
    width,
    height,
    primaryWood: params.primaryWood,
    // Everything else from effective defaults (custom or built-in)
    style: preset.name,
    top: {
      thickness: effectiveDefaults.top?.thickness || 1,
      edgeProfile: effectiveDefaults.top?.edgeProfile || 'square',
      cornerRadius: effectiveDefaults.top?.cornerRadius,
      breadboardEnds: effectiveDefaults.top?.breadboardEnds || false,
      breadboard: effectiveDefaults.top?.breadboard,
      overhang: effectiveDefaults.top?.overhang as { sides: number; ends: number } || { sides: 1, ends: 1 },
      chamferEdge: effectiveDefaults.top?.chamferEdge,
      chamferSize: effectiveDefaults.top?.chamferSize,
      chamferAngle: effectiveDefaults.top?.chamferAngle
    },
    legs: {
      style: effectiveDefaults.legs?.style || 'square',
      thickness: effectiveDefaults.legs?.thickness || 2,
      insetFromEdge: effectiveDefaults.legs?.insetFromEdge || 0,
      chamfer: effectiveDefaults.legs?.chamfer || 0,
      chamferFoot: effectiveDefaults.legs?.chamferFoot || false,
      footChamferSize: effectiveDefaults.legs?.footChamferSize,
      taperStartFromTop: effectiveDefaults.legs?.taperStartFromTop,
      taperEndDimension: effectiveDefaults.legs?.taperEndDimension,
      taperSides: effectiveDefaults.legs?.taperSides,
      splayAngle: effectiveDefaults.legs?.splayAngle,
      turnProfile: effectiveDefaults.legs?.turnProfile,
      pommelLength: effectiveDefaults.legs?.pommelLength,
      maxDiameter: effectiveDefaults.legs?.maxDiameter,
      minDiameter: effectiveDefaults.legs?.minDiameter,
      foot: effectiveDefaults.legs?.foot || 'none'
    },
    aprons: {
      height: (tableAdjustments.aprons as { height?: number })?.height ?? effectiveDefaults.aprons?.height ?? 4,
      thickness: (tableAdjustments.aprons as { thickness?: number })?.thickness ?? effectiveDefaults.aprons?.thickness ?? 0.875,
      bottomProfile: ((tableAdjustments.aprons as { bottomProfile?: ApronProfile })?.bottomProfile ?? effectiveDefaults.aprons?.bottomProfile ?? 'straight') as ApronProfile,
      archHeight: effectiveDefaults.aprons?.archHeight,
      setback: (tableAdjustments.aprons as { setback?: number })?.setback ?? effectiveDefaults.aprons?.setback ?? 0,
      sides: apronSides
    },
    stretchers: {
      enabled: effectiveDefaults.stretchers?.enabled || false,
      style: effectiveDefaults.stretchers?.style || 'none',
      heightFromFloor: effectiveDefaults.stretchers?.heightFromFloor || 6,
      sideHeightFromFloor: effectiveDefaults.stretchers?.sideHeightFromFloor,
      width: effectiveDefaults.stretchers?.width || 1.5,
      thickness: effectiveDefaults.stretchers?.thickness || 0.875,
      centerStretcher: effectiveDefaults.stretchers?.centerStretcher
    },
    slats: effectiveDefaults.slats ? {
      enabled: effectiveDefaults.slats.enabled || false,
      count: effectiveDefaults.slats.count || 5,
      width: effectiveDefaults.slats.width || 2,
      thickness: effectiveDefaults.slats.thickness || 0.5,
      spacing: effectiveDefaults.slats.spacing || 1,
      sides: effectiveDefaults.slats.sides || { front: false, back: false, left: true, right: true }
    } : undefined,
    trestle: effectiveDefaults.trestle ?? params.trestle,  // Use custom trestle if set, else preserve
    joinery: {
      legApronJoint: effectiveDefaults.joinery?.legApronJoint || 'mortise-tenon',
      cornerJoint: effectiveDefaults.joinery?.cornerJoint || 'mitered',
      haunched: effectiveDefaults.joinery?.haunched || false,
      tenonThicknessRatio: effectiveDefaults.joinery?.tenonThicknessRatio || 0.333,
      tenonLengthRatio: effectiveDefaults.joinery?.tenonLengthRatio || 0.65,
      tenonShoulderWidth: effectiveDefaults.joinery?.tenonShoulderWidth || 0.25,
      mortiseSetback: effectiveDefaults.joinery?.mortiseSetback || 0.1875,
      topAttachment: effectiveDefaults.joinery?.topAttachment || 'buttons',
      topAttachmentSpacing: effectiveDefaults.joinery?.topAttachmentSpacing || 12,
      stretcherJoint: effectiveDefaults.joinery?.stretcherJoint,
      showJoineryInPreview: effectiveDefaults.joinery?.showJoineryInPreview ?? true
    }
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface TableContextValue {
  state: TableBuilderState
  dispatch: React.Dispatch<TableBuilderAction>
  params: TableParams
}

const TableContext = createContext<TableContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

interface TableProviderProps {
  children: React.ReactNode
}

export function TableProvider({ children }: TableProviderProps) {
  const [state, dispatch] = useReducer(tableReducer, initialState)

  // Run validation whenever params change
  useEffect(() => {
    const validation = validateTableParams(state.params)
    // Only dispatch if validation changed to avoid infinite loop
    if (
      validation.valid !== state.validation.valid ||
      validation.errors.length !== state.validation.errors.length ||
      validation.warnings.length !== state.validation.warnings.length
    ) {
      dispatch({ type: 'SET_VALIDATION', validation })
    }
  }, [state.params, state.validation.valid, state.validation.errors.length, state.validation.warnings.length])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      params: state.params
    }),
    [state]
  )

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useTable() {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error('useTable must be used within a TableProvider')
  }
  return context
}

// Convenience hooks for common operations
export function useTableParams() {
  const { params } = useTable()
  return params
}

export function useTableDispatch() {
  const { dispatch } = useTable()
  return dispatch
}
