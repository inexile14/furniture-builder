/**
 * Parametric Table Builder - Dimension Limits
 * Based on research from DEFAULTS.md
 */

import type { TableTypeLimits, DimensionLimits } from '../types'

// =============================================================================
// TABLE TYPE LIMITS
// =============================================================================

export const DINING_TABLE_LIMITS: TableTypeLimits = {
  length: { min: 36, max: 120, step: 1 },
  width: { min: 30, max: 48, step: 1 },
  height: { min: 28, max: 32, step: 0.25 }
}

export const CONSOLE_TABLE_LIMITS: TableTypeLimits = {
  length: { min: 36, max: 72, step: 1 },
  width: { min: 10, max: 18, step: 0.5 },
  height: { min: 28, max: 36, step: 0.25 }
}

export const END_TABLE_LIMITS: TableTypeLimits = {
  length: { min: 18, max: 30, step: 1 },
  width: { min: 18, max: 30, step: 1 },
  height: { min: 20, max: 28, step: 0.25 }
}

export const BEDSIDE_TABLE_LIMITS: TableTypeLimits = {
  length: { min: 18, max: 28, step: 1 },
  width: { min: 14, max: 22, step: 1 },
  height: { min: 24, max: 30, step: 0.25 }
}

export const TABLE_TYPE_LIMITS = {
  dining: DINING_TABLE_LIMITS,
  console: CONSOLE_TABLE_LIMITS,
  end: END_TABLE_LIMITS,
  bedside: BEDSIDE_TABLE_LIMITS
} as const

// =============================================================================
// COMPONENT LIMITS
// =============================================================================

export const LEG_LIMITS = {
  thickness: { min: 1.25, max: 3, step: 0.125 } as DimensionLimits,
  chamfer: { min: 0, max: 0.25, step: 0.0625 } as DimensionLimits,
  taperEndDimension: { min: 0.75, max: 1.5, step: 0.125 } as DimensionLimits,
  splayAngle: { min: 0, max: 15, step: 1 } as DimensionLimits,
  pommelLength: { min: 4, max: 8, step: 0.5 } as DimensionLimits,
  insetFromEdge: { min: 0, max: 2, step: 0.125 } as DimensionLimits
}

export const APRON_LIMITS = {
  height: { min: 3, max: 6, step: 0.25 } as DimensionLimits,
  thickness: { min: 0.75, max: 1, step: 0.125 } as DimensionLimits,
  setback: { min: 0, max: 0.25, step: 0.0625 } as DimensionLimits,
  archHeight: { min: 0.5, max: 2, step: 0.25 } as DimensionLimits
}

export const TOP_LIMITS = {
  thickness: { min: 0.75, max: 1.5, step: 0.125 } as DimensionLimits,
  overhang: { min: 0.5, max: 2, step: 0.125 } as DimensionLimits,
  bevelAngle: { min: 15, max: 45, step: 5 } as DimensionLimits,
  breadboardWidth: { min: 2, max: 4, step: 0.25 } as DimensionLimits
}

export const STRETCHER_LIMITS = {
  heightFromFloor: { min: 4, max: 12, step: 0.5 } as DimensionLimits,
  width: { min: 1, max: 3, step: 0.25 } as DimensionLimits,
  thickness: { min: 0.75, max: 1.5, step: 0.125 } as DimensionLimits
}

export const JOINERY_LIMITS = {
  tenonThicknessRatio: { min: 0.25, max: 0.4, step: 0.05 } as DimensionLimits,
  tenonLengthRatio: { min: 0.5, max: 0.8, step: 0.05 } as DimensionLimits,
  tenonShoulderWidth: { min: 0.125, max: 0.5, step: 0.0625 } as DimensionLimits,
  mortiseSetback: { min: 0.125, max: 0.5, step: 0.0625 } as DimensionLimits
}

// =============================================================================
// SEATING CAPACITY GUIDELINES (for dining tables)
// =============================================================================

export const SEATING_CAPACITY = {
  perPersonWidth: 24, // inches per person along length
  minEndClearance: 12, // inches at each end for head of table
  maxComfortableReach: 24 // max reach to center of table
} as const

export function calculateSeatingCapacity(length: number, width: number): { sides: number; ends: number; total: number } {
  const sideSeats = Math.floor((length - SEATING_CAPACITY.minEndClearance * 2) / SEATING_CAPACITY.perPersonWidth) * 2
  const endSeats = width >= 36 ? 2 : 0 // Only seat ends if wide enough
  return {
    sides: sideSeats,
    ends: endSeats,
    total: sideSeats + endSeats
  }
}
