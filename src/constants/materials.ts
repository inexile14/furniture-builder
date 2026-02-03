/**
 * Parametric Table Builder - Material Definitions
 * Based on research from DEFAULTS.md and CALCULATION_FORMULAS.md
 */

// =============================================================================
// WOOD SPECIES PROPERTIES
// =============================================================================

export interface WoodSpecies {
  name: string
  displayName: string
  hardness: number // Janka hardness
  tangentialCoefficient: number // wood movement coefficient
  radialCoefficient: number
  color: string // hex color for 3D preview
  grainColor: string // slightly darker for grain lines
  category: 'hardwood' | 'softwood'
  suitableForTurning: boolean
  notes?: string
}

export const WOOD_SPECIES: Record<string, WoodSpecies> = {
  'white-oak': {
    name: 'white-oak',
    displayName: 'White Oak',
    hardness: 1360,
    tangentialCoefficient: 0.00369,
    radialCoefficient: 0.00180,
    color: '#C9A86C',
    grainColor: '#A68B52',
    category: 'hardwood',
    suitableForTurning: true
  },
  'red-oak': {
    name: 'red-oak',
    displayName: 'Red Oak',
    hardness: 1290,
    tangentialCoefficient: 0.00369,
    radialCoefficient: 0.00158,
    color: '#B8956A',
    grainColor: '#9A7A52',
    category: 'hardwood',
    suitableForTurning: true
  },
  'hard-maple': {
    name: 'hard-maple',
    displayName: 'Hard Maple',
    hardness: 1450,
    tangentialCoefficient: 0.00353,
    radialCoefficient: 0.00165,
    color: '#E8D4B8',
    grainColor: '#D4C0A4',
    category: 'hardwood',
    suitableForTurning: true
  },
  'cherry': {
    name: 'cherry',
    displayName: 'Cherry',
    hardness: 950,
    tangentialCoefficient: 0.00274,
    radialCoefficient: 0.00126,
    color: '#A0522D',
    grainColor: '#8B4513',
    category: 'hardwood',
    suitableForTurning: true
  },
  'walnut': {
    name: 'walnut',
    displayName: 'Black Walnut',
    hardness: 1010,
    tangentialCoefficient: 0.00274,
    radialCoefficient: 0.00190,
    color: '#5C4033',
    grainColor: '#4A3728',
    category: 'hardwood',
    suitableForTurning: true
  },
  'ash': {
    name: 'ash',
    displayName: 'White Ash',
    hardness: 1320,
    tangentialCoefficient: 0.00274,
    radialCoefficient: 0.00169,
    color: '#D4C9B0',
    grainColor: '#BFB49A',
    category: 'hardwood',
    suitableForTurning: true
  },
  'pine': {
    name: 'pine',
    displayName: 'Eastern White Pine',
    hardness: 380,
    tangentialCoefficient: 0.00211,
    radialCoefficient: 0.00074,
    color: '#F5DEB3',
    grainColor: '#DBC89D',
    category: 'softwood',
    suitableForTurning: false,
    notes: 'Not recommended for turned legs'
  },
  'douglas-fir': {
    name: 'douglas-fir',
    displayName: 'Douglas Fir',
    hardness: 660,
    tangentialCoefficient: 0.00274,
    radialCoefficient: 0.00169,
    color: '#D2B48C',
    grainColor: '#BFA07A',
    category: 'softwood',
    suitableForTurning: false,
    notes: 'Suitable for farmhouse style'
  }
}

// =============================================================================
// STANDARD LUMBER THICKNESSES
// =============================================================================

export const LUMBER_THICKNESSES = {
  '4/4': 0.75,  // 4/4 rough = 3/4" finished
  '5/4': 1.0,   // 5/4 rough = 1" finished
  '6/4': 1.25,  // 6/4 rough = 1-1/4" finished
  '8/4': 1.75,  // 8/4 rough = 1-3/4" finished
  '10/4': 2.25, // 10/4 rough = 2-1/4" finished
  '12/4': 2.75  // 12/4 rough = 2-3/4" finished
} as const

// =============================================================================
// CHISEL SIZES FOR MORTISE ROUNDING
// =============================================================================

export const STANDARD_CHISEL_SIZES = [
  0.125, // 1/8"
  0.1875, // 3/16"
  0.25, // 1/4"
  0.3125, // 5/16"
  0.375, // 3/8"
  0.5, // 1/2"
  0.625, // 5/8"
  0.75, // 3/4"
  1.0 // 1"
] as const

/**
 * Round a dimension to the nearest standard chisel size
 */
export function roundToChiselSize(dimension: number): number {
  let closest: number = STANDARD_CHISEL_SIZES[0]
  let minDiff = Math.abs(dimension - closest)

  for (const size of STANDARD_CHISEL_SIZES) {
    const diff = Math.abs(dimension - size)
    if (diff < minDiff) {
      minDiff = diff
      closest = size
    }
  }

  return closest
}
