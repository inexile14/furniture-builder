/**
 * Parametric Table Builder - Leg Calculations
 * Based on research in CALCULATION_FORMULAS.md
 */

import type { LegParams } from '../../types'
import { degToRad } from '../../utils'

// =============================================================================
// TAPERED LEG CALCULATIONS
// =============================================================================

export interface TaperCalculation {
  taperRate: number // inches per inch of length
  taperAngle: number // degrees
  widthAtHeight: (height: number) => number
  legLength: number
}

/**
 * Calculate taper properties for a leg
 */
export function calculateTaper(
  topDimension: number,
  bottomDimension: number,
  taperLength: number
): TaperCalculation {
  const taperAmount = topDimension - bottomDimension
  const taperRate = taperAmount / taperLength
  const taperAngle = Math.atan(taperRate) * 180 / Math.PI

  return {
    taperRate,
    taperAngle,
    widthAtHeight: (height: number) => topDimension - (taperRate * height),
    legLength: taperLength
  }
}

/**
 * Calculate the leg width at a specific height from the top
 */
export function getLegWidthAtHeight(
  leg: LegParams,
  heightFromTop: number,
  totalLegLength: number
): number {
  if (leg.style !== 'tapered' || !leg.taperEndDimension || !leg.taperStartFromTop) {
    return leg.thickness
  }

  // Before taper starts
  if (heightFromTop < leg.taperStartFromTop) {
    return leg.thickness
  }

  // In taper zone
  const taperLength = totalLegLength - leg.taperStartFromTop
  const taperProgress = (heightFromTop - leg.taperStartFromTop) / taperLength
  const taperAmount = leg.thickness - leg.taperEndDimension

  return leg.thickness - (taperAmount * taperProgress)
}

// =============================================================================
// SPLAYED LEG CALCULATIONS
// =============================================================================

export interface SplayCalculation {
  actualLength: number
  footOffset: { x: number; z: number }
  compoundAngles: { miter: number; bevel: number }
}

/**
 * Calculate splayed leg properties
 */
export function calculateSplayedLeg(
  verticalHeight: number,
  splayAngle: number,
  cornerPosition: 'FL' | 'FR' | 'BL' | 'BR'
): SplayCalculation {
  const splayRad = degToRad(splayAngle)

  // Actual leg length (hypotenuse)
  const horizontalOffset = Math.tan(splayRad) * verticalHeight
  const actualLength = verticalHeight / Math.cos(splayRad)

  // Foot offset direction based on corner
  const directions: Record<string, { x: number; z: number }> = {
    'FL': { x: -1, z: -1 },
    'FR': { x: 1, z: -1 },
    'BL': { x: -1, z: 1 },
    'BR': { x: 1, z: 1 }
  }

  const dir = directions[cornerPosition]
  const footOffset = {
    x: horizontalOffset * dir.x,
    z: horizontalOffset * dir.z
  }

  // Compound angles for joinery
  // Simplified formula for 45° table corners
  const miterAngle = Math.atan(Math.tan(splayRad) * Math.cos(Math.PI / 4)) * 180 / Math.PI
  const bevelAngle = Math.atan(Math.tan(splayRad) * Math.sin(Math.PI / 4)) * 180 / Math.PI

  return {
    actualLength,
    footOffset,
    compoundAngles: { miter: miterAngle, bevel: bevelAngle }
  }
}

/**
 * Calculate the rotation angles for a splayed leg in 3D space
 */
export function calculateSplayRotation(
  splayAngle: number,
  cornerPosition: 'FL' | 'FR' | 'BL' | 'BR'
): { x: number; y: number; z: number } {
  const splayRad = degToRad(splayAngle)

  // Rotation depends on corner position
  const rotations: Record<string, { x: number; z: number }> = {
    'FL': { x: splayRad, z: splayRad },
    'FR': { x: splayRad, z: -splayRad },
    'BL': { x: -splayRad, z: splayRad },
    'BR': { x: -splayRad, z: -splayRad }
  }

  const rot = rotations[cornerPosition]
  return { x: rot.x, y: 0, z: rot.z }
}

// =============================================================================
// TURNED LEG CALCULATIONS
// =============================================================================

export interface TurningElement {
  type: 'pommel' | 'cylinder' | 'cove' | 'bead' | 'vase' | 'taper'
  startY: number
  endY: number
  startDiameter: number
  endDiameter: number
  profile?: (t: number) => number // parametric curve, 0-1 returns diameter ratio
}

export interface TurnedLegProfile {
  elements: TurningElement[]
  totalLength: number
  maxDiameter: number
}

/**
 * Generate a baluster turning profile
 */
export function generateBalusterProfile(
  totalLength: number,
  pommelLength: number,
  maxDiameter: number,
  minDiameter: number
): TurnedLegProfile {
  const turnedLength = totalLength - pommelLength

  const elements: TurningElement[] = [
    // Square pommel section
    {
      type: 'pommel',
      startY: 0,
      endY: pommelLength,
      startDiameter: maxDiameter,
      endDiameter: maxDiameter
    },
    // Transition bead
    {
      type: 'bead',
      startY: pommelLength,
      endY: pommelLength + 0.5,
      startDiameter: maxDiameter,
      endDiameter: maxDiameter * 0.9
    },
    // Upper vase swell
    {
      type: 'vase',
      startY: pommelLength + 0.5,
      endY: pommelLength + turnedLength * 0.3,
      startDiameter: maxDiameter * 0.9,
      endDiameter: maxDiameter,
      profile: (t) => 0.9 + 0.1 * Math.sin(t * Math.PI)
    },
    // Main taper
    {
      type: 'taper',
      startY: pommelLength + turnedLength * 0.3,
      endY: pommelLength + turnedLength * 0.8,
      startDiameter: maxDiameter,
      endDiameter: minDiameter * 1.2
    },
    // Lower cove
    {
      type: 'cove',
      startY: pommelLength + turnedLength * 0.8,
      endY: pommelLength + turnedLength * 0.9,
      startDiameter: minDiameter * 1.2,
      endDiameter: minDiameter
    },
    // Foot
    {
      type: 'cylinder',
      startY: pommelLength + turnedLength * 0.9,
      endY: totalLength,
      startDiameter: minDiameter,
      endDiameter: minDiameter
    }
  ]

  return {
    elements,
    totalLength,
    maxDiameter
  }
}

/**
 * Generate a simple vase profile
 */
export function generateVaseProfile(
  totalLength: number,
  pommelLength: number,
  maxDiameter: number,
  minDiameter: number
): TurnedLegProfile {
  const turnedLength = totalLength - pommelLength

  const elements: TurningElement[] = [
    {
      type: 'pommel',
      startY: 0,
      endY: pommelLength,
      startDiameter: maxDiameter,
      endDiameter: maxDiameter
    },
    {
      type: 'vase',
      startY: pommelLength,
      endY: pommelLength + turnedLength * 0.6,
      startDiameter: maxDiameter * 0.85,
      endDiameter: maxDiameter,
      profile: (t) => 0.85 + 0.15 * Math.sin(t * Math.PI)
    },
    {
      type: 'taper',
      startY: pommelLength + turnedLength * 0.6,
      endY: totalLength,
      startDiameter: maxDiameter,
      endDiameter: minDiameter
    }
  ]

  return {
    elements,
    totalLength,
    maxDiameter
  }
}

/**
 * Generate a simple cylinder profile
 */
export function generateCylinderProfile(
  totalLength: number,
  pommelLength: number,
  diameter: number
): TurnedLegProfile {
  const elements: TurningElement[] = [
    {
      type: 'pommel',
      startY: 0,
      endY: pommelLength,
      startDiameter: diameter,
      endDiameter: diameter
    },
    {
      type: 'cylinder',
      startY: pommelLength,
      endY: totalLength,
      startDiameter: diameter,
      endDiameter: diameter
    }
  ]

  return {
    elements,
    totalLength,
    maxDiameter: diameter
  }
}

/**
 * Get diameter at specific Y position along turned leg
 */
export function getDiameterAtY(profile: TurnedLegProfile, y: number): number {
  for (const element of profile.elements) {
    if (y >= element.startY && y <= element.endY) {
      const t = (y - element.startY) / (element.endY - element.startY)

      if (element.profile) {
        return element.startDiameter * element.profile(t)
      }

      // Linear interpolation
      return element.startDiameter + (element.endDiameter - element.startDiameter) * t
    }
  }

  return profile.maxDiameter
}
