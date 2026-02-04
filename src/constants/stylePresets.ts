/**
 * Parametric Table Builder - Style Presets
 * Based on research from STYLE_GUIDE.md and DEFAULTS.md
 */

import type { StylePreset, Style } from '../types'

// =============================================================================
// SHAKER STYLE
// =============================================================================

export const SHAKER_PRESET: StylePreset = {
  name: 'shaker',
  displayName: 'Shaker',
  description: 'Clean lines, tapered legs, minimal ornamentation. Focus on proportion and function.',
  suggestedDimensions: {
    dining: { length: 60, width: 36, height: 30 }  // Classic Shaker proportions
  },
  defaults: {
    top: {
      thickness: 1.0,  // Authentic: 1" top
      edgeProfile: 'chamfered',
      chamferEdge: 'bottom',  // Under-chamfer
      chamferSize: 0.5625,  // 9/16"
      chamferAngle: 35,
      breadboardEnds: false,
      overhang: { sides: 3, ends: 6 }  // Traditional Shaker: generous overhang
    },
    legs: {
      style: 'tapered',
      thickness: 2.5,  // Authentic dining table: 2.5-2.75"
      chamfer: 0.0625,
      taperStartFromTop: 4,  // Authentic: 3-4" below apron
      taperEndDimension: 1.5,  // Proportional to larger leg
      taperSides: 'inside',  // Traditional Shaker: taper inside faces only
      insetFromEdge: 0,
      foot: 'none'
    },
    aprons: {
      height: 4,  // Authentic: 3.5-4"
      thickness: 0.875,
      bottomProfile: 'straight',
      setback: 0.0625,
      sides: { front: true, back: true, left: true, right: true }
    },
    stretchers: {
      enabled: false,
      style: 'none',
      heightFromFloor: 6,
      sideHeightFromFloor: 8,  // Side stretchers 2" higher than front/back
      width: 1.5,
      thickness: 0.875
    },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.65,
      tenonShoulderWidth: 0.25,
      mortiseSetback: 0.1875,
      topAttachment: 'buttons',
      topAttachmentSpacing: 12,
      showJoineryInPreview: true
    }
  },
  tableTypeAdjustments: {
    dining: {},
    console: {
      aprons: { sides: { front: false, back: true, left: true, right: true } }
    }
  }
}

// =============================================================================
// MID-CENTURY MODERN STYLE
// =============================================================================

export const MID_CENTURY_PRESET: StylePreset = {
  name: 'mid-century',
  displayName: 'Mid-Century Modern',
  description: 'Splayed legs, minimal aprons, visual lightness. Inspired by Danish Modern design.',
  suggestedDimensions: {
    dining: { length: 72, width: 36, height: 29 }  // Classic MCM proportions (slightly lower)
  },
  defaults: {
    top: {
      thickness: 0.75,
      edgeProfile: 'chamfered',
      chamferEdge: 'bottom',  // Under-chamfer for MCM floating look
      chamferSize: 0.375,
      chamferAngle: 30,  // Shallower angle for MCM
      cornerRadius: 4,  // Heavy rounded corners for MCM look
      breadboardEnds: false,
      overhang: { sides: 1, ends: 1 }  // MCM: minimal, consistent overhang
    },
    legs: {
      style: 'splayed',
      thickness: 2.25,
      chamfer: 0,
      splayAngle: 8,
      taperEndDimension: 1.0,  // Tapered from top to smaller bottom
      insetFromEdge: 2,  // Inset more to allow for splay
      foot: 'none'
    },
    aprons: {
      height: 3.5,
      thickness: 0.75,
      bottomProfile: 'straight',
      setback: 0,
      sides: { front: true, back: true, left: true, right: true }
    },
    stretchers: {
      enabled: false,
      style: 'none',
      heightFromFloor: 6,
      sideHeightFromFloor: 8,  // Side stretchers 2" higher than front/back
      width: 1.25,
      thickness: 0.75
    },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: false, // MCM uses lighter joinery
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.65,
      tenonShoulderWidth: 0.1875,
      mortiseSetback: 0.1875,
      topAttachment: 'figure-8',
      topAttachmentSpacing: 14,
      showJoineryInPreview: true
    }
  },
  tableTypeAdjustments: {
    dining: {},
    console: {
      legs: { splayAngle: 8 }
    }
  }
}

// =============================================================================
// FARMHOUSE STYLE
// =============================================================================

export const FARMHOUSE_PRESET: StylePreset = {
  name: 'farmhouse',
  displayName: 'Farmhouse',
  description: 'Robust construction, beefy square legs, thick top. Traditional country aesthetic.',
  suggestedDimensions: {
    dining: { length: 84, width: 38, height: 30 }  // Gold standard farmhouse
  },
  defaults: {
    top: {
      thickness: 1.5,  // Substantial but not overly heavy
      edgeProfile: 'square',
      breadboardEnds: true,
      breadboard: {
        width: 3,
        thickness: 2,
        tongueDepth: 0.75,
        tongueThickness: 0.375
      },
      overhang: { sides: 2, ends: 2 }  // Gold standard: 2" overhang all around
    },
    legs: {
      style: 'square',  // Default to square; turned/ornamental as future options
      thickness: 4,  // Gold standard: 4" square legs
      chamfer: 0.125,  // Legacy: slight chamfer for hand-friendly edges
      chamferLongEdges: true,
      chamferFoot: true,
      chamferSize: 0.25,  // 1/4" chamfer around bottom of legs
      insetFromEdge: 0,
      foot: 'none'
    },
    aprons: {
      height: 4.5,  // Gold standard: 4½" tall aprons
      thickness: 1,  // Gold standard: 1" thick aprons
      bottomProfile: 'straight',  // Simple farmhouse aesthetic
      setback: 0.25,  // 1/4" from outside edge of legs
      sides: { front: true, back: true, left: true, right: true }
    },
    stretchers: {
      enabled: false,  // Often no stretchers on farmhouse tables
      style: 'none',
      heightFromFloor: 4,
      sideHeightFromFloor: 7,  // Side stretchers higher than front/back
      width: 3,       // Stretcher height (vertical dimension)
      thickness: 1.5, // Stretcher thickness (depth)
      centerStretcher: true
    },
    joinery: {
      legApronJoint: 'through-tenon',
      cornerJoint: 'shortened',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.75,
      tenonShoulderWidth: 0.375,
      mortiseSetback: 0.25,
      topAttachment: 'elongated-holes',
      topAttachmentSpacing: 10,
      stretcherJoint: 'through-tenon',
      showJoineryInPreview: true
    }
  },
  tableTypeAdjustments: {
    dining: {},
    console: {
      stretchers: { enabled: true, style: 'box' }
    }
  }
}

// =============================================================================
// JAPANDI STYLE
// =============================================================================

export const JAPANDI_PRESET: StylePreset = {
  name: 'japandi',
  displayName: 'Japandi',
  description: 'Japanese-Scandinavian fusion. Clean geometry, natural materials, subtle details.',
  suggestedDimensions: {
    dining: { length: 60, width: 32, height: 28 }  // Lower, more compact Japanese-inspired proportions
  },
  defaults: {
    top: {
      thickness: 0.75,
      edgeProfile: 'chamfered',
      breadboardEnds: false,
      overhang: { sides: 0.5, ends: 0.5 }  // Japandi: minimal, consistent
    },
    legs: {
      style: 'square',
      thickness: 1.5,
      chamfer: 0.125,
      insetFromEdge: 0.375,
      foot: 'none'
    },
    aprons: {
      height: 3,
      thickness: 0.75,
      bottomProfile: 'straight',
      setback: 0.125, // Subtle shadow line
      sides: { front: true, back: true, left: true, right: true }
    },
    stretchers: {
      enabled: true,
      style: 'box',
      heightFromFloor: 4,  // Front/back stretchers lower
      sideHeightFromFloor: 6,  // Side stretchers slightly higher
      width: 1,
      thickness: 0.75
    },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.7,
      tenonShoulderWidth: 0.1875,
      mortiseSetback: 0.1875,
      topAttachment: 'buttons',
      topAttachmentSpacing: 10,
      stretcherJoint: 'mortise-tenon',
      showJoineryInPreview: true
    }
  },
  tableTypeAdjustments: {
    dining: {},
    console: {
      aprons: { height: 2.5 },
      stretchers: { heightFromFloor: 3 }
    }
  }
}

// =============================================================================
// TRESTLE STYLE
// =============================================================================

export const TRESTLE_PRESET: StylePreset = {
  name: 'trestle',
  displayName: 'Trestle',
  description: 'Classic trestle construction with vertical posts, feet, and a center stretcher.',
  suggestedDimensions: {
    dining: { length: 72, width: 36, height: 30 }
  },
  defaults: {
    top: {
      thickness: 1.25,
      edgeProfile: 'square',
      breadboardEnds: true,
      breadboard: {
        width: 2.5,
        thickness: 1.25,
        tongueDepth: 0.625,
        tongueThickness: 0.375
      },
      overhang: { sides: 1.5, ends: 3 }  // Trestle: more overhang at ends
    },
    legs: {
      // Legs not used for trestle - included for type compatibility
      style: 'square',
      thickness: 2,
      chamfer: 0,
      insetFromEdge: 0,
      foot: 'none'
    },
    aprons: {
      // Aprons not used for trestle - included for type compatibility
      height: 4,
      thickness: 0.875,
      bottomProfile: 'straight',
      setback: 0,
      sides: { front: false, back: false, left: false, right: false }
    },
    stretchers: {
      // Regular stretchers not used - trestle has its own stretcher
      enabled: false,
      style: 'none',
      heightFromFloor: 6,
      width: 1.5,
      thickness: 0.875
    },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.7,
      tenonShoulderWidth: 0.25,
      mortiseSetback: 0.1875,
      topAttachment: 'buttons',
      topAttachmentSpacing: 12,
      showJoineryInPreview: true
    }
  },
  tableTypeAdjustments: {
    dining: {}
  }
}

// =============================================================================
// MISSION / ARTS & CRAFTS STYLE
// =============================================================================

export const MISSION_PRESET: StylePreset = {
  name: 'mission',
  displayName: 'Mission',
  description: 'Arts & Crafts style with sturdy square legs, vertical slats, and strong geometric lines.',
  suggestedDimensions: {
    dining: { length: 72, width: 42, height: 30 }  // Classic Mission proportions
  },
  defaults: {
    top: {
      thickness: 1.125,  // Substantial but not too thick
      edgeProfile: 'square',  // Clean square edge
      breadboardEnds: false,
      overhang: { sides: 2, ends: 2.5 }  // Generous overhang
    },
    legs: {
      style: 'square',
      thickness: 2.5,  // Medium-weight square legs
      chamfer: 0.0625,  // Subtle chamfer on corners
      insetFromEdge: 0,
      foot: 'none'
    },
    aprons: {
      height: 4.5,  // Taller aprons to frame slat panels
      thickness: 0.875,
      bottomProfile: 'straight',  // Clean, simple profile
      setback: 0.125,  // Slight setback from leg face
      sides: { front: true, back: true, left: true, right: true }
    },
    stretchers: {
      enabled: true,  // End stretchers only
      style: 'box',
      heightFromFloor: 4,  // Lower position for end stretchers
      sideHeightFromFloor: 4,  // Same height - only ends will show due to slat config
      width: 3,  // Tall stretcher to anchor slat panel
      thickness: 0.875
    },
    slats: {
      enabled: true,
      count: 11,  // More slats for proper spacing
      width: 0.5,  // 1/2" wide slats
      thickness: 0.375,  // 3/8" thick
      topGap: 0.375,  // Small gap below apron
      bottomGap: 0.375,  // Small gap above stretcher
      sides: { front: false, back: false, left: true, right: true }  // Only on ends
    },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.7,
      tenonShoulderWidth: 0.25,
      mortiseSetback: 0.1875,
      topAttachment: 'buttons',
      topAttachmentSpacing: 12,
      stretcherJoint: 'mortise-tenon',
      showJoineryInPreview: true
    }
  },
  tableTypeAdjustments: {
    dining: {},
    console: {
      aprons: { sides: { front: false, back: true, left: true, right: true } },
      stretchers: { style: 'H' }
    }
  }
}

// =============================================================================
// STYLE PRESET MAP
// =============================================================================

export const STYLE_PRESETS: Record<Style, StylePreset> = {
  'shaker': SHAKER_PRESET,
  'mid-century': MID_CENTURY_PRESET,
  'farmhouse': FARMHOUSE_PRESET,
  'japandi': JAPANDI_PRESET,
  'trestle': TRESTLE_PRESET,
  'mission': MISSION_PRESET
}

/**
 * Get the display name for a style
 */
export function getStyleDisplayName(style: Style): string {
  return STYLE_PRESETS[style].displayName
}

/**
 * Get the description for a style
 */
export function getStyleDescription(style: Style): string {
  return STYLE_PRESETS[style].description
}
