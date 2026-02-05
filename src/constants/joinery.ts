/**
 * Parametric Table Builder - Joinery Visualization Constants
 */

// =============================================================================
// JOINERY COLORS
// =============================================================================

export const JOINERY_COLORS = {
  // Mortise: medium brown base, shaded by multipliers for depth effect
  mortise: '#5C4A3A',  // Lighter base so shading is visible
  mortiseOpacity: 0.7,

  // Tenon: lighter end-grain color
  tenon: '#E8D4B8',
  tenonOpacity: 1.0,

  // Through-tenon visible on outside
  throughTenon: '#D4C4A8',

  // Edge lines for joinery geometry
  joineryEdge: '#1A0F08',
}

// =============================================================================
// JOINERY DEFAULTS
// =============================================================================

export const JOINERY_DEFAULTS = {
  // Mortise setback from leg outer face (inches)
  mortiseSetback: 0.1875,  // 3/16"

  // Tenon thickness ratio (fraction of apron thickness)
  tenonThicknessRatio: 0.333,

  // Tenon length ratio (fraction of leg thickness)
  tenonLengthRatio: 0.65,

  // Shoulder width (inches)
  shoulderWidth: 0.25,

  // Clearances for mortise sizing
  mortiseWidthClearance: 0.015625,   // 1/64"
  mortiseHeightClearance: 0.03125,   // 1/32"
  mortiseDepthClearance: 0.0625,     // 1/16" air space at bottom

  // Haunch dimensions (as ratio of other dimensions)
  haunchWidthMultiplier: 2,      // 2x shoulder width
  haunchDepthRatio: 0.5,         // 50% of tenon length
}

// =============================================================================
// VISUALIZATION SETTINGS
// =============================================================================

export const JOINERY_VISUALIZATION = {
  // Z-fighting prevention
  mortiseOffset: 0.001,
  tenonOffset: 0.002,

  // Animation config for joinery visibility
  animationConfig: {
    mass: 1,
    tension: 200,
    friction: 25,
  },

  // Transparent mode opacity for wood
  transparentWoodOpacity: 0.4,
}
