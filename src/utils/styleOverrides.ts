/**
 * Style Overrides - Persistent custom defaults for style presets
 *
 * Allows admin users to save custom defaults that override the
 * built-in style presets. Stored in localStorage.
 */

import type { TableParams, Style } from '../types'
import { STYLE_PRESETS } from '../constants/stylePresets'

const STORAGE_KEY = 'furniture-builder-style-overrides'

interface StyleOverrides {
  [style: string]: Partial<TableParams>
}

/**
 * Load all style overrides from localStorage
 */
export function loadStyleOverrides(): StyleOverrides {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load style overrides:', error)
  }
  return {}
}

/**
 * Save a style override to localStorage
 */
export function saveStyleOverride(style: Style, params: TableParams): void {
  try {
    const overrides = loadStyleOverrides()

    // Extract just the relevant defaults (not dimensions, wood, etc.)
    const defaults: Partial<TableParams> = {
      top: params.top,
      legs: params.legs,
      aprons: params.aprons,
      stretchers: params.stretchers,
      slats: params.slats,
      trestle: params.trestle,
      joinery: params.joinery,
    }

    overrides[style] = defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
    console.log(`✓ Saved defaults for ${style} style`)
  } catch (error) {
    console.error('Failed to save style override:', error)
    throw error
  }
}

/**
 * Clear a style override (reset to built-in defaults)
 */
export function clearStyleOverride(style: Style): void {
  try {
    const overrides = loadStyleOverrides()
    delete overrides[style]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
    console.log(`✓ Reset ${style} style to built-in defaults`)
  } catch (error) {
    console.error('Failed to clear style override:', error)
    throw error
  }
}

/**
 * Check if a style has custom overrides
 */
export function hasStyleOverride(style: Style): boolean {
  const overrides = loadStyleOverrides()
  return style in overrides
}

/**
 * Get effective defaults for a style (custom override or built-in)
 */
export function getEffectiveDefaults(style: Style): Partial<TableParams> {
  const overrides = loadStyleOverrides()
  const builtInDefaults = STYLE_PRESETS[style].defaults

  if (style in overrides) {
    // Merge: override takes precedence, fall back to built-in
    return deepMerge(builtInDefaults, overrides[style])
  }

  return builtInDefaults
}

/**
 * Export all overrides as JSON for backup/sharing
 */
export function exportStyleOverrides(): string {
  return JSON.stringify(loadStyleOverrides(), null, 2)
}

/**
 * Import overrides from JSON
 */
export function importStyleOverrides(json: string): void {
  try {
    const overrides = JSON.parse(json)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
    console.log('✓ Imported style overrides')
  } catch (error) {
    console.error('Failed to import style overrides:', error)
    throw error
  }
}

/**
 * Deep merge two objects (source overrides target)
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null
      ) {
        // Recursively merge objects
        result[key] = deepMerge(target[key] as object, source[key] as object) as T[Extract<keyof T, string>]
      } else {
        // Direct assignment for primitives and arrays
        result[key] = source[key] as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}
