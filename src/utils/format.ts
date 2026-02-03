/**
 * Parametric Table Builder - Formatting Utilities
 */

/**
 * Convert decimal inches to fraction string (e.g., 1.75 -> "1-3/4")
 */
export function toFraction(decimal: number): string {
  const whole = Math.floor(decimal)
  const remainder = decimal - whole

  if (remainder === 0) {
    return whole.toString()
  }

  // Common woodworking fractions (1/16" precision)
  const fractions: [number, string][] = [
    [1/16, '1/16'],
    [1/8, '1/8'],
    [3/16, '3/16'],
    [1/4, '1/4'],
    [5/16, '5/16'],
    [3/8, '3/8'],
    [7/16, '7/16'],
    [1/2, '1/2'],
    [9/16, '9/16'],
    [5/8, '5/8'],
    [11/16, '11/16'],
    [3/4, '3/4'],
    [13/16, '13/16'],
    [7/8, '7/8'],
    [15/16, '15/16'],
  ]

  // Find closest fraction
  let closestFraction = fractions[0]
  let minDiff = Math.abs(remainder - closestFraction[0])

  for (const fraction of fractions) {
    const diff = Math.abs(remainder - fraction[0])
    if (diff < minDiff) {
      minDiff = diff
      closestFraction = fraction
    }
  }

  if (whole === 0) {
    return closestFraction[1]
  }

  return `${whole}-${closestFraction[1]}`
}

/**
 * Format dimension with inches symbol
 */
export function formatDimension(value: number, useFractions: boolean = true): string {
  if (useFractions) {
    return `${toFraction(value)}"`
  }
  return `${value.toFixed(3)}"`
}

/**
 * Format dimensions as L x W x T
 */
export function formatDimensions(length: number, width: number, thickness: number): string {
  return `${toFraction(length)}" × ${toFraction(width)}" × ${toFraction(thickness)}"`
}

/**
 * Format board feet
 */
export function formatBoardFeet(boardFeet: number): string {
  return `${boardFeet.toFixed(2)} BF`
}

/**
 * Format angle in degrees
 */
export function formatAngle(degrees: number): string {
  return `${degrees.toFixed(1)}°`
}

/**
 * Convert fraction string to decimal (e.g., "1-3/4" -> 1.75)
 */
export function fromFraction(fraction: string): number {
  // Handle whole numbers
  if (!fraction.includes('/')) {
    return parseFloat(fraction.replace('-', '.'))
  }

  // Split into whole and fraction parts
  const parts = fraction.split('-')
  let whole = 0
  let fractionPart = fraction

  if (parts.length === 2) {
    whole = parseInt(parts[0], 10)
    fractionPart = parts[1]
  }

  // Parse fraction
  const [numerator, denominator] = fractionPart.split('/').map(n => parseInt(n, 10))
  return whole + (numerator / denominator)
}

/**
 * Format part name for display
 */
export function formatPartName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
