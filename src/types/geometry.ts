/**
 * Parametric Table Builder - Geometry Type Definitions
 */

import type { LegPosition, ApronPosition } from './table'

// =============================================================================
// DIMENSION TYPES
// =============================================================================

export interface Dimensions3D {
  length: number  // X axis
  width: number   // Z axis
  height: number  // Y axis
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface Rotation3D {
  x: number  // radians
  y: number
  z: number
}

// =============================================================================
// PART GEOMETRY TYPES
// =============================================================================

export interface PartGeometry {
  width: number
  height: number
  depth: number
  position: Point3D
  rotation?: Rotation3D
  vertices?: number[]
  indices?: number[]
}

export interface LegGeometry extends PartGeometry {
  legPosition: LegPosition
  compoundAngles?: {
    miterAngle: number
    bevelAngle: number
  }
}

export interface ApronGeometry extends PartGeometry {
  apronPosition: ApronPosition
}

export interface DrawerGeometry {
  front: PartGeometry
  box: {
    left: PartGeometry
    right: PartGeometry
    back: PartGeometry
    bottom: PartGeometry
  }
  position: Point3D
}

export interface TableGeometry {
  top: PartGeometry
  legs: LegGeometry[]
  aprons: ApronGeometry[]
  stretchers: PartGeometry[]
  drawers: DrawerGeometry[]
  shelf?: PartGeometry
}
