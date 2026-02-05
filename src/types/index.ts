/**
 * Parametric Table Builder - Type Exports
 */

export * from './table'
export * from './geometry'
export * from './joinery'
export * from './cutlist'

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Deep partial utility type - makes all properties and nested properties optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

// =============================================================================
// DIMENSION LIMITS
// =============================================================================

export interface DimensionLimits {
  min: number
  max: number
  step?: number
}

export interface TableTypeLimits {
  length: DimensionLimits
  width: DimensionLimits
  height: DimensionLimits
}

export interface AllLimits {
  dining: TableTypeLimits
  console: TableTypeLimits
  end: TableTypeLimits
  bedside: TableTypeLimits
  legThickness: DimensionLimits
  apronHeight: DimensionLimits
  topThickness: DimensionLimits
  splayAngle: DimensionLimits
}

// =============================================================================
// STYLE PRESET TYPE
// =============================================================================

export interface StylePreset {
  name: Style
  displayName: string
  description: string
  suggestedDimensions?: {
    dining?: { length: number; width: number; height: number }
    console?: { length: number; width: number; height: number }
    end?: { length: number; width: number; height: number }
    bedside?: { length: number; width: number; height: number }
  }
  defaults: {
    top: Partial<TopParams>
    legs: Partial<LegParams>
    aprons: Partial<ApronParams>
    stretchers: Partial<StretcherParams>
    slats?: Partial<SlatParams>
    joinery: Partial<JoineryParams>
  }
  tableTypeAdjustments: {
    dining?: DeepPartial<TableParams>
    console?: DeepPartial<TableParams>
    end?: DeepPartial<TableParams>
    bedside?: DeepPartial<TableParams>
  }
}

// Re-export Style for convenience
import type { Style, TopParams, LegParams, ApronParams, StretcherParams, SlatParams, TrestleParams, JoineryParams, TableParams } from './table'
export type { Style, TopParams, LegParams, ApronParams, StretcherParams, SlatParams, TrestleParams, JoineryParams, TableParams }

// =============================================================================
// RENDER STYLE TYPES
// =============================================================================

/**
 * Available render styles (inspired by SketchUp)
 */
export type RenderStyle =
  | 'wireframe'      // Lines only, no fills
  | 'hidden-line'    // White faces, black edges (blueprint feel)
  | 'shaded'         // Solid colors, basic lighting
  | 'shaded-edges'   // Current style with edge lines (default)
  | 'realistic'      // PBR materials, wood textures, shadows
  | 'xray'           // Semi-transparent, shows internal joinery

/**
 * Wood finish options for realistic mode
 */
export type WoodFinish = 'raw' | 'oiled' | 'satin' | 'semi-gloss' | 'gloss'

/**
 * Render settings for the preview
 */
export interface RenderSettings {
  style: RenderStyle
  finish: WoodFinish
  showShadows: boolean
  showAmbientOcclusion: boolean
  showReflections: boolean
  backgroundColor: string
}

// =============================================================================
// STATE TYPES
// =============================================================================

export interface TableBuilderState {
  params: TableParams
  geometry: import('./geometry').TableGeometry | null
  cutList: import('./cutlist').CutList | null
  validation: ValidationResult
  selectedComponent: string | null
  isExploded: boolean
  isTransparent: boolean
  showJoinery: boolean
  previewQuality: 'low' | 'medium' | 'high'
  renderSettings: RenderSettings
}

export type TableBuilderAction =
  | { type: 'SET_TABLE_TYPE'; tableType: import('./table').TableType }
  | { type: 'SET_STYLE'; style: Style }
  | { type: 'SET_DIMENSION'; dimension: 'length' | 'width' | 'height'; value: number }
  | { type: 'SET_TOP_PARAM'; key: keyof TopParams; value: unknown }
  | { type: 'SET_LEG_PARAM'; key: keyof LegParams; value: unknown }
  | { type: 'SET_APRON_PARAM'; key: keyof ApronParams; value: unknown }
  | { type: 'SET_STRETCHER_PARAM'; key: keyof StretcherParams; value: unknown }
  | { type: 'SET_SLAT_PARAM'; key: keyof SlatParams; value: unknown }
  | { type: 'SET_TRESTLE_PARAM'; key: keyof TrestleParams; value: unknown }
  | { type: 'SET_DRAWER_PARAM'; key: keyof import('./table').DrawerParams; value: unknown }
  | { type: 'SET_JOINERY_PARAM'; key: keyof JoineryParams; value: unknown }
  | { type: 'SET_PARAMS'; params: Partial<TableParams> }
  | { type: 'APPLY_PRESET'; preset: StylePreset }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'TOGGLE_EXPLODED' }
  | { type: 'TOGGLE_TRANSPARENT' }
  | { type: 'TOGGLE_JOINERY_PREVIEW' }
  | { type: 'SELECT_COMPONENT'; component: string | null }
  | { type: 'SET_PREVIEW_QUALITY'; quality: 'low' | 'medium' | 'high' }
  | { type: 'SET_VALIDATION'; validation: ValidationResult }
  | { type: 'SET_RENDER_STYLE'; style: RenderStyle }
  | { type: 'SET_WOOD_FINISH'; finish: WoodFinish }
  | { type: 'SET_RENDER_SETTINGS'; settings: Partial<RenderSettings> }
