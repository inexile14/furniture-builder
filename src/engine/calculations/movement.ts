/**
 * Parametric Table Builder - Wood Movement Calculations
 * Based on research in CALCULATION_FORMULAS.md and JOINERY_CONVENTIONS.md
 */

import { WOOD_SPECIES } from '../../constants'

// =============================================================================
// WOOD MOVEMENT CALCULATIONS
// =============================================================================

/**
 * Calculate expected wood movement across the grain
 * Formula: Movement = Width × Coefficient × MC Change
 *
 * @param widthAcrossGrain - Width of the board in inches
 * @param species - Wood species name
 * @param moistureChangePercent - Expected moisture content change (e.g., 4 for 4%)
 * @param isFlatsawn - True for tangential (flatsawn), false for radial (quartersawn)
 */
export function calculateWoodMovement(
  widthAcrossGrain: number,
  species: string,
  moistureChangePercent: number,
  isFlatsawn: boolean = true
): number {
  const wood = WOOD_SPECIES[species]
  if (!wood) {
    // Default to white oak if species not found
    const coefficient = isFlatsawn ? 0.00369 : 0.00180
    return widthAcrossGrain * coefficient * moistureChangePercent
  }

  const coefficient = isFlatsawn ? wood.tangentialCoefficient : wood.radialCoefficient
  return widthAcrossGrain * coefficient * moistureChangePercent
}

/**
 * Calculate movement for a table top
 * Returns total movement and per-side movement
 */
export function calculateTopMovement(
  topWidth: number,
  species: string,
  moistureChangePercent: number = 4
): { total: number; perSide: number } {
  const total = calculateWoodMovement(topWidth, species, moistureChangePercent, true)
  return {
    total,
    perSide: total / 2
  }
}

/**
 * Calculate required button slot length for wood movement
 * Button slot should allow for full seasonal movement
 */
export function calculateButtonSlotLength(
  topWidth: number,
  species: string,
  moistureChangePercent: number = 4
): number {
  const movement = calculateWoodMovement(topWidth, species, moistureChangePercent, true)
  // Add 50% margin for safety
  return movement * 1.5
}

/**
 * Calculate figure-8 fastener elongated hole length
 */
export function calculateFigure8HoleLength(
  distanceFromCenter: number,
  species: string,
  topWidth: number,
  moistureChangePercent: number = 4
): number {
  // Movement is proportional to distance from center
  const totalMovement = calculateWoodMovement(topWidth, species, moistureChangePercent, true)
  const proportionalMovement = (distanceFromCenter / (topWidth / 2)) * (totalMovement / 2)
  // Add margin
  return proportionalMovement + 0.125 // 1/8" minimum slot
}

// =============================================================================
// BREADBOARD END CALCULATIONS
// =============================================================================

export interface BreadboardTongueSlot {
  position: number // distance from center
  slotLength: number // elongated hole length
  fixedCenter: boolean // true for center tenon only
}

/**
 * Calculate breadboard end tongue slot lengths
 * Center tongue is fixed, outer tongues have elongated holes
 */
export function calculateBreadboardSlots(
  topWidth: number,
  species: string,
  tongueCount: number = 3,
  moistureChangePercent: number = 4
): BreadboardTongueSlot[] {
  const slots: BreadboardTongueSlot[] = []
  const totalMovement = calculateWoodMovement(topWidth, species, moistureChangePercent, true)

  // Calculate tongue positions (evenly spaced)
  const spacing = topWidth / (tongueCount + 1)

  for (let i = 1; i <= tongueCount; i++) {
    const position = (spacing * i) - (topWidth / 2) // relative to center
    const isCenter = Math.abs(position) < 0.5 // within 1/2" of center

    if (isCenter) {
      slots.push({
        position,
        slotLength: 0, // Fixed, no slot needed
        fixedCenter: true
      })
    } else {
      // Elongated slot proportional to distance from center
      const proportionalMovement = Math.abs(position) / (topWidth / 2) * (totalMovement / 2)
      slots.push({
        position,
        slotLength: proportionalMovement + 0.125, // Add 1/8" margin
        fixedCenter: false
      })
    }
  }

  return slots
}

// =============================================================================
// SEASONAL MOVEMENT ESTIMATION
// =============================================================================

export interface SeasonalMovement {
  winterToSummer: number // expansion
  summerToWinter: number // contraction
  totalRange: number
}

/**
 * Estimate seasonal movement for a region
 * Assumes typical indoor humidity swings
 */
export function estimateSeasonalMovement(
  widthAcrossGrain: number,
  species: string,
  climate: 'humid' | 'moderate' | 'dry' = 'moderate'
): SeasonalMovement {
  // Typical MC changes by climate
  const mcChanges = {
    humid: 6, // 6% MC change (humid summers, dry winters with heating)
    moderate: 4, // 4% MC change (typical)
    dry: 3 // 3% MC change (dry climates, well-humidified)
  }

  const mcChange = mcChanges[climate]
  const totalMovement = calculateWoodMovement(widthAcrossGrain, species, mcChange, true)

  return {
    winterToSummer: totalMovement / 2, // Expansion
    summerToWinter: totalMovement / 2, // Contraction
    totalRange: totalMovement
  }
}

// =============================================================================
// ATTACHMENT SPACING RECOMMENDATIONS
// =============================================================================

/**
 * Calculate recommended top attachment spacing
 * More attachments needed for wider tops and more movement-prone species
 */
export function calculateAttachmentSpacing(
  topWidth: number,
  topLength: number,
  species: string
): { acrossGrain: number; alongGrain: number; totalCount: number } {
  const wood = WOOD_SPECIES[species]
  const movementFactor = wood ? wood.tangentialCoefficient : 0.00369

  // Higher movement species need more frequent attachments
  const baseSpacing = 12 // inches
  const adjustedSpacing = baseSpacing * (0.00350 / movementFactor)

  // Along grain can be further apart (less movement)
  const acrossGrain = Math.min(adjustedSpacing, 14)
  const alongGrain = Math.min(adjustedSpacing * 1.5, 18)

  // Calculate total count needed
  const countAcross = Math.ceil(topLength / acrossGrain) + 1
  const countAlong = Math.ceil(topWidth / alongGrain) + 1
  const totalCount = (countAcross * 2) + (countAlong * 2) // perimeter

  return {
    acrossGrain,
    alongGrain,
    totalCount
  }
}
