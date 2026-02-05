/**
 * Parametric Table Builder - Constants Exports
 */

export * from './limits'
export * from './materials'
export * from './stylePresets'
export * from './joinery'
export * from './rendering'

// =============================================================================
// 3D PREVIEW COLORS
// =============================================================================

export const COLORS = {
  // Primary wood - warm oak/maple tone
  wood: '#C9A66B',
  woodEdge: '#8B6914',
  // Lighter maple accent
  maple: '#F5E6D3',
  mapleEdge: '#B8956E',
  // Darker walnut
  walnut: '#7A5F47',
  walnutEdge: '#5C4A35',
  // Cherry tones
  cherry: '#B86A50',
  cherryEdge: '#734234',
  // Background - cooler gray for contrast with warm wood
  background: '#B8C4CE',
}

// =============================================================================
// ANIMATION SETTINGS
// =============================================================================

export const EXPLODE_DISTANCE = {
  top: 8,
  legs: 4,
  aprons: 6,
  stretchers: 5,
}

export const ANIMATION_CONFIG = {
  mass: 1,
  tension: 120,
  friction: 20,
}

// =============================================================================
// DEFAULT TABLE PARAMETERS
// =============================================================================

import type { TableParams } from '../types'
import { SHAKER_PRESET } from './stylePresets'

export const DEFAULT_TABLE_PARAMS: TableParams = {
  tableType: 'dining',
  style: 'shaker',
  length: 60,
  width: 36,
  height: 30,
  top: {
    thickness: SHAKER_PRESET.defaults.top.thickness!,
    overhang: SHAKER_PRESET.defaults.top.overhang as { sides: number; ends: number },
    edgeProfile: SHAKER_PRESET.defaults.top.edgeProfile!,
    chamferEdge: SHAKER_PRESET.defaults.top.chamferEdge,
    chamferSize: SHAKER_PRESET.defaults.top.chamferSize,
    chamferAngle: SHAKER_PRESET.defaults.top.chamferAngle,
    breadboardEnds: SHAKER_PRESET.defaults.top.breadboardEnds!
  },
  legs: {
    style: SHAKER_PRESET.defaults.legs.style!,
    thickness: SHAKER_PRESET.defaults.legs.thickness!,
    insetFromEdge: SHAKER_PRESET.defaults.legs.insetFromEdge!,
    chamfer: SHAKER_PRESET.defaults.legs.chamfer!,
    taperStartFromTop: SHAKER_PRESET.defaults.legs.taperStartFromTop,
    taperEndDimension: SHAKER_PRESET.defaults.legs.taperEndDimension,
    taperSides: SHAKER_PRESET.defaults.legs.taperSides,
    foot: SHAKER_PRESET.defaults.legs.foot
  },
  aprons: {
    height: SHAKER_PRESET.defaults.aprons.height!,
    thickness: SHAKER_PRESET.defaults.aprons.thickness!,
    bottomProfile: SHAKER_PRESET.defaults.aprons.bottomProfile!,
    setback: SHAKER_PRESET.defaults.aprons.setback!,
    sides: SHAKER_PRESET.defaults.aprons.sides!
  },
  stretchers: {
    enabled: SHAKER_PRESET.defaults.stretchers.enabled!,
    style: SHAKER_PRESET.defaults.stretchers.style!,
    heightFromFloor: SHAKER_PRESET.defaults.stretchers.heightFromFloor!,
    sideHeightFromFloor: SHAKER_PRESET.defaults.stretchers.sideHeightFromFloor,
    width: SHAKER_PRESET.defaults.stretchers.width!,
    thickness: SHAKER_PRESET.defaults.stretchers.thickness!
  },
  trestle: {
    // Leg - width is along table width (Z), thickness is along table length (X)
    legWidth: 6,           // Wider dimension (along table width)
    legThickness: 3.5,     // Along table length (X) - matches footWidth
    legInset: 8,

    // Foot - footWidth matches legThickness so outside faces are flush
    footLength: 26,
    footHeight: 3.5,
    footWidth: 3.5,        // Along table length (X) - matches legThickness
    footBevelAngle: 12,
    footDadoDepth: 0.5,
    footDadoInset: 2,

    // Shoulder - matches feet by default
    shoulderLength: 26,        // Same as footLength
    shoulderHeight: 3.5,       // Same as footHeight
    shoulderWidth: 3.5,        // Same as footWidth
    shoulderBevelAngle: 12,    // Same as footBevelAngle

    // Stretcher
    stretcherHeight: 4,    // Doubled from 2
    stretcherThickness: 1.25,
    stretcherHeightFromFloor: 6
  },
  joinery: {
    legApronJoint: SHAKER_PRESET.defaults.joinery.legApronJoint!,
    cornerJoint: SHAKER_PRESET.defaults.joinery.cornerJoint!,
    haunched: SHAKER_PRESET.defaults.joinery.haunched!,
    tenonThicknessRatio: SHAKER_PRESET.defaults.joinery.tenonThicknessRatio!,
    tenonLengthRatio: SHAKER_PRESET.defaults.joinery.tenonLengthRatio!,
    tenonShoulderWidth: SHAKER_PRESET.defaults.joinery.tenonShoulderWidth!,
    mortiseSetback: SHAKER_PRESET.defaults.joinery.mortiseSetback!,
    topAttachment: SHAKER_PRESET.defaults.joinery.topAttachment!,
    topAttachmentSpacing: SHAKER_PRESET.defaults.joinery.topAttachmentSpacing!,
    showJoineryInPreview: SHAKER_PRESET.defaults.joinery.showJoineryInPreview!
  },
  primaryWood: 'white-oak'
}
