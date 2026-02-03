/**
 * Parametric Table Builder - Math Utilities
 */

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Round to nearest fraction (for woodworking dimensions)
 */
export function roundToFraction(value: number, denominator: number = 16): number {
  return Math.round(value * denominator) / denominator
}

/**
 * Round to specified step value
 */
export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Calculate board feet (thickness in inches, width in inches, length in inches)
 */
export function calculateBoardFeet(thickness: number, width: number, length: number): number {
  return (thickness * width * length) / 144
}

/**
 * Calculate golden ratio value (for proportional design)
 */
export const PHI = 1.618033988749895

export function goldenRatio(value: number): number {
  return value * PHI
}

export function inverseGoldenRatio(value: number): number {
  return value / PHI
}

/**
 * Calculate hypotenuse (for compound angles and splayed legs)
 */
export function hypotenuse(a: number, b: number): number {
  return Math.sqrt(a * a + b * b)
}

/**
 * Calculate 3D distance
 */
export function distance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
