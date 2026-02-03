/**
 * Parametric Table Builder - Joinery Calculations
 * Based on research in CALCULATION_FORMULAS.md and JOINERY_CONVENTIONS.md
 */

import type { TableParams, CalculatedJoinery } from '../../types'
import { roundToChiselSize } from '../../constants'

// =============================================================================
// MAIN JOINERY CALCULATION
// =============================================================================

export function calculateJoinery(params: TableParams): CalculatedJoinery {
  const { legs, aprons, joinery } = params

  // Tenon thickness: 1/3 rule, rounded to chisel size
  const rawTenonThickness = aprons.thickness * joinery.tenonThicknessRatio
  const tenonThickness = roundToChiselSize(rawTenonThickness)

  // Tenon width: apron height minus shoulders
  const tenonWidth = aprons.height - (joinery.tenonShoulderWidth * 2)

  // Tenon length: based on leg thickness
  const tenonLength = legs.thickness * joinery.tenonLengthRatio

  // Mortise dimensions (slightly larger than tenon for fit)
  const mortiseWidth = tenonThickness + 0.015625 // 1/64" clearance
  const mortiseHeight = tenonWidth + 0.03125 // 1/32" clearance
  const mortiseDepth = tenonLength + 0.0625 // 1/16" air space at bottom

  // Haunch dimensions (if haunched)
  const haunchWidth = joinery.haunched ? joinery.tenonShoulderWidth * 2 : 0
  const haunchDepth = joinery.haunched ? tenonLength * 0.5 : 0

  // Shoulder width
  const shoulderWidth = joinery.tenonShoulderWidth

  // Miter angle for corner joints
  const miterAngle = joinery.cornerJoint === 'mitered' ? 45 : undefined

  return {
    tenonThickness,
    tenonWidth,
    tenonLength,
    mortiseWidth,
    mortiseHeight,
    mortiseDepth,
    haunchWidth,
    haunchDepth,
    shoulderWidth,
    miterAngle
  }
}

// =============================================================================
// INDIVIDUAL CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate tenon thickness using the 1/3 rule
 * Stock thickness / 3, rounded to nearest chisel size
 */
export function calculateTenonThickness(stockThickness: number, ratio: number = 0.333): number {
  const rawThickness = stockThickness * ratio
  return roundToChiselSize(rawThickness)
}

/**
 * Calculate tenon width based on rail height and shoulders
 */
export function calculateTenonWidth(
  railHeight: number,
  shoulderWidth: number
): number {
  return railHeight - (shoulderWidth * 2)
}

/**
 * Calculate tenon length based on leg thickness
 */
export function calculateTenonLength(
  legThickness: number,
  ratio: number = 0.65
): number {
  return legThickness * ratio
}

/**
 * Calculate haunch dimensions for top-of-leg joints
 */
export function calculateHaunch(
  _tenonWidth: number,
  tenonLength: number,
  shoulderWidth: number
): { width: number; depth: number } {
  return {
    width: shoulderWidth * 2,
    depth: tenonLength * 0.5
  }
}

/**
 * Calculate miter angle for corner tenons
 * For standard 90° corners, this is 45°
 */
export function calculateMiterAngle(cornerAngle: number = 90): number {
  return cornerAngle / 2
}

/**
 * Calculate mortise dimensions with clearances
 */
export function calculateMortiseDimensions(
  tenonThickness: number,
  tenonWidth: number,
  tenonLength: number
): { width: number; height: number; depth: number } {
  return {
    width: tenonThickness + 0.015625, // 1/64" clearance
    height: tenonWidth + 0.03125, // 1/32" clearance
    depth: tenonLength + 0.0625 // 1/16" air space
  }
}

/**
 * Calculate compound angles for splayed leg mortises
 * Based on formulas from CALCULATION_FORMULAS.md
 */
export function calculateCompoundAngles(splayAngle: number): { miterAngle: number; bevelAngle: number } {
  const splayRad = splayAngle * Math.PI / 180

  // For splayed legs at 90° corners
  // Simplified formulas for rectangular tables
  const miterAngle = Math.atan(Math.tan(splayRad) * Math.cos(Math.PI / 4)) * 180 / Math.PI
  const bevelAngle = Math.atan(Math.tan(splayRad) * Math.sin(Math.PI / 4)) * 180 / Math.PI

  return { miterAngle, bevelAngle }
}

/**
 * Validate tenon dimensions against woodworking rules
 */
export function validateTenonDimensions(
  tenonThickness: number,
  tenonWidth: number,
  tenonLength: number
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  // Rule: Max width = 6 × thickness
  if (tenonWidth > tenonThickness * 6) {
    warnings.push('Tenon width exceeds 6× thickness - consider double tenons')
  }

  // Rule: Min length = 5 × thickness (for strength)
  if (tenonLength < tenonThickness * 5) {
    warnings.push('Tenon length is less than 5× thickness - may be weak')
  }

  // Rule: Absolute minimum length
  if (tenonLength < 1.25) {
    warnings.push('Tenon length below 1.25" minimum')
  }

  return {
    valid: warnings.length === 0,
    warnings
  }
}

/**
 * Calculate mortise position based on leg dimensions and setback
 */
export function calculateMortisePosition(
  _legThickness: number,
  setback: number,
  distanceFromTop: number
): { x: number; y: number } {
  return {
    x: setback,
    y: distanceFromTop
  }
}

/**
 * Determine if double tenons are needed
 * Rule: Width > 5" or width > 6× thickness
 */
export function needsDoubleTenons(
  tenonWidth: number,
  tenonThickness: number
): boolean {
  return tenonWidth > 5 || tenonWidth > tenonThickness * 6
}

/**
 * Calculate double tenon dimensions
 */
export function calculateDoubleTenons(
  totalWidth: number,
  tenonThickness: number,
  shoulderWidth: number
): { tenonWidth: number; gapWidth: number; count: 2 } {
  const availableWidth = totalWidth - (shoulderWidth * 2)
  const gapWidth = tenonThickness * 0.5 // Gap between tenons
  const tenonWidth = (availableWidth - gapWidth) / 2

  return {
    tenonWidth,
    gapWidth,
    count: 2
  }
}

// =============================================================================
// LOOKUP TABLE FOR COMMON COMPOUND ANGLES
// =============================================================================

export const COMPOUND_ANGLE_TABLE: Record<number, { miter: number; bevel: number }> = {
  5: { miter: 2.5, bevel: 3.5 },
  8: { miter: 4.0, bevel: 5.6 },
  10: { miter: 5.0, bevel: 7.0 },
  12: { miter: 6.0, bevel: 8.5 },
  15: { miter: 7.5, bevel: 10.5 }
}

/**
 * Get compound angles from lookup table (faster than calculation)
 */
export function getCompoundAnglesFromTable(splayAngle: number): { miter: number; bevel: number } | undefined {
  return COMPOUND_ANGLE_TABLE[splayAngle]
}
