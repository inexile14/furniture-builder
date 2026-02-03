/**
 * Parametric Table Builder - Joinery Type Definitions
 */

import type { Point3D } from './geometry'

// =============================================================================
// JOINERY GEOMETRY TYPES
// =============================================================================

export interface TenonGeometry {
  thickness: number
  width: number
  length: number
  shoulderWidth: number
  offset: Point3D
  haunch?: {
    width: number
    depth: number
  }
  miterAngle?: number
}

export interface MortiseGeometry {
  width: number
  height: number
  depth: number
  position: Point3D
  setbackFromFace: number
  distanceFromTop: number
}

export interface JoineryGeometry {
  tenon: TenonGeometry
  mortise: MortiseGeometry
  wedgeSlot?: {
    width: number
    depth: number
    angle: number
  }
}

// =============================================================================
// CALCULATED JOINERY DIMENSIONS
// =============================================================================

export interface CalculatedJoinery {
  tenonThickness: number
  tenonWidth: number
  tenonLength: number
  mortiseWidth: number
  mortiseHeight: number
  mortiseDepth: number
  haunchWidth: number
  haunchDepth: number
  shoulderWidth: number
  miterAngle?: number
}
