/**
 * Parametric Table Builder - Table Context
 * Global state management for table parameters and UI state
 */

import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react'
import type { TableParams, TableBuilderState, TableBuilderAction, StylePreset, ApronProfile } from '../types'
import { DEFAULT_TABLE_PARAMS, STYLE_PRESETS, TABLE_TYPE_LIMITS } from '../constants'
import { validateTableParams } from '../engine/validation'

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
  showJoinery: true,
  previewQuality: 'medium'
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

    default:
      return state
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function applyStylePreset(params: TableParams, preset: StylePreset): TableParams {
  const tableAdjustments = preset.tableTypeAdjustments[params.tableType] || {}

  // Get suggested dimensions for this style + table type, or preserve existing
  const suggestedDims = preset.suggestedDimensions?.[params.tableType]
  const length = suggestedDims?.length ?? params.length
  const width = suggestedDims?.width ?? params.width
  const height = suggestedDims?.height ?? params.height

  // When switching styles, apply style's suggested dimensions if available
  // Everything else comes from the new style preset
  const presetSides = preset.defaults.aprons?.sides
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
    // Everything else from preset
    style: preset.name,
    top: {
      thickness: preset.defaults.top?.thickness || 1,
      edgeProfile: preset.defaults.top?.edgeProfile || 'square',
      cornerRadius: preset.defaults.top?.cornerRadius,
      breadboardEnds: preset.defaults.top?.breadboardEnds || false,
      breadboard: preset.defaults.top?.breadboard,
      overhang: preset.defaults.top?.overhang || { front: 0.75, back: 0.75, left: 0.75, right: 0.75 },
      chamferEdge: preset.defaults.top?.chamferEdge,
      chamferSize: preset.defaults.top?.chamferSize,
      chamferAngle: preset.defaults.top?.chamferAngle
    },
    legs: {
      style: preset.defaults.legs?.style || 'square',
      thickness: preset.defaults.legs?.thickness || 2,
      insetFromEdge: preset.defaults.legs?.insetFromEdge || 0,
      chamfer: preset.defaults.legs?.chamfer || 0,
      taperStartFromTop: preset.defaults.legs?.taperStartFromTop,
      taperEndDimension: preset.defaults.legs?.taperEndDimension,
      taperSides: preset.defaults.legs?.taperSides,
      splayAngle: preset.defaults.legs?.splayAngle,
      turnProfile: preset.defaults.legs?.turnProfile,
      pommelLength: preset.defaults.legs?.pommelLength,
      maxDiameter: preset.defaults.legs?.maxDiameter,
      minDiameter: preset.defaults.legs?.minDiameter,
      foot: preset.defaults.legs?.foot || 'none'
    },
    aprons: {
      height: (tableAdjustments.aprons as { height?: number })?.height ?? preset.defaults.aprons?.height ?? 4,
      thickness: (tableAdjustments.aprons as { thickness?: number })?.thickness ?? preset.defaults.aprons?.thickness ?? 0.875,
      bottomProfile: ((tableAdjustments.aprons as { bottomProfile?: ApronProfile })?.bottomProfile ?? preset.defaults.aprons?.bottomProfile ?? 'straight') as ApronProfile,
      archHeight: preset.defaults.aprons?.archHeight,
      setback: (tableAdjustments.aprons as { setback?: number })?.setback ?? preset.defaults.aprons?.setback ?? 0,
      sides: apronSides
    },
    stretchers: {
      enabled: preset.defaults.stretchers?.enabled || false,
      style: preset.defaults.stretchers?.style || 'none',
      heightFromFloor: preset.defaults.stretchers?.heightFromFloor || 6,
      sideHeightFromFloor: preset.defaults.stretchers?.sideHeightFromFloor,
      width: preset.defaults.stretchers?.width || 1.5,
      thickness: preset.defaults.stretchers?.thickness || 0.875,
      centerStretcher: preset.defaults.stretchers?.centerStretcher
    },
    trestle: params.trestle,  // Preserve trestle params
    joinery: {
      legApronJoint: preset.defaults.joinery?.legApronJoint || 'mortise-tenon',
      cornerJoint: preset.defaults.joinery?.cornerJoint || 'mitered',
      haunched: preset.defaults.joinery?.haunched || false,
      tenonThicknessRatio: preset.defaults.joinery?.tenonThicknessRatio || 0.333,
      tenonLengthRatio: preset.defaults.joinery?.tenonLengthRatio || 0.65,
      tenonShoulderWidth: preset.defaults.joinery?.tenonShoulderWidth || 0.25,
      mortiseSetback: preset.defaults.joinery?.mortiseSetback || 0.1875,
      topAttachment: preset.defaults.joinery?.topAttachment || 'buttons',
      topAttachmentSpacing: preset.defaults.joinery?.topAttachmentSpacing || 12,
      stretcherJoint: preset.defaults.joinery?.stretcherJoint,
      showJoineryInPreview: preset.defaults.joinery?.showJoineryInPreview ?? true
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
