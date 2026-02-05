/**
 * Rendering Constants and Material Configurations
 *
 * Defines render styles, material properties, and visual settings
 * for the parametric table builder preview.
 */

import type { RenderStyle, WoodFinish } from '../types'

// =============================================================================
// RENDER STYLE DEFINITIONS
// =============================================================================

export interface RenderStyleConfig {
  name: string
  description: string
  icon: string  // Emoji for quick recognition
  materialProps: {
    roughness: number
    metalness: number
    flatShading: boolean
    wireframe: boolean
    transparent: boolean
    opacity: number
  }
  edgeProps: {
    visible: boolean
    color: string
    lineWidth: number
  }
  lighting: 'basic' | 'studio' | 'dramatic'
  postProcessing: boolean
}

export const RENDER_STYLE_CONFIGS: Record<RenderStyle, RenderStyleConfig> = {
  wireframe: {
    name: 'Wireframe',
    description: 'Lines only, no fills',
    icon: '📐',
    materialProps: {
      roughness: 1,
      metalness: 0,
      flatShading: false,
      wireframe: true,
      transparent: false,
      opacity: 1
    },
    edgeProps: {
      visible: false,  // Wireframe mode shows edges via material
      color: '#333333',
      lineWidth: 1
    },
    lighting: 'basic',
    postProcessing: false
  },

  'hidden-line': {
    name: 'Hidden Line',
    description: 'Blueprint style with white faces',
    icon: '📋',
    materialProps: {
      roughness: 1,
      metalness: 0,
      flatShading: true,
      wireframe: false,
      transparent: false,
      opacity: 1
    },
    edgeProps: {
      visible: true,
      color: '#1a1a1a',
      lineWidth: 1.5
    },
    lighting: 'basic',
    postProcessing: false
  },

  shaded: {
    name: 'Shaded',
    description: 'Solid colors with basic lighting',
    icon: '🎨',
    materialProps: {
      roughness: 0.8,
      metalness: 0.02,
      flatShading: true,
      wireframe: false,
      transparent: false,
      opacity: 1
    },
    edgeProps: {
      visible: false,
      color: '#5C4A3A',
      lineWidth: 1
    },
    lighting: 'studio',
    postProcessing: false
  },

  'shaded-edges': {
    name: 'Shaded + Edges',
    description: 'Default working view',
    icon: '✏️',
    materialProps: {
      roughness: 0.7,
      metalness: 0.05,
      flatShading: true,
      wireframe: false,
      transparent: false,
      opacity: 1
    },
    edgeProps: {
      visible: true,
      color: '#5C4A3A',
      lineWidth: 1
    },
    lighting: 'studio',
    postProcessing: false
  },

  realistic: {
    name: 'Realistic',
    description: 'Photo-realistic with textures',
    icon: '📸',
    materialProps: {
      roughness: 0.5,  // Will be adjusted by finish
      metalness: 0.0,
      flatShading: false,  // Smooth shading for realism
      wireframe: false,
      transparent: false,
      opacity: 1
    },
    edgeProps: {
      visible: false,  // No edges in realistic mode
      color: '#5C4A3A',
      lineWidth: 1
    },
    lighting: 'dramatic',
    postProcessing: true
  },

  xray: {
    name: 'X-Ray',
    description: 'See-through to view joinery',
    icon: '🔍',
    materialProps: {
      roughness: 0.7,
      metalness: 0.05,
      flatShading: true,
      wireframe: false,
      transparent: true,
      opacity: 0.35
    },
    edgeProps: {
      visible: true,
      color: '#5C4A3A',
      lineWidth: 1.5
    },
    lighting: 'studio',
    postProcessing: false
  }
}

// =============================================================================
// WOOD FINISH CONFIGURATIONS
// =============================================================================

export interface WoodFinishConfig {
  name: string
  roughness: number
  clearcoatRoughness: number
  clearcoat: number  // 0 = no clearcoat, 1 = full clearcoat
  sheen: number
}

export const WOOD_FINISH_CONFIGS: Record<WoodFinish, WoodFinishConfig> = {
  raw: {
    name: 'Raw Wood',
    roughness: 0.9,
    clearcoatRoughness: 0,
    clearcoat: 0,
    sheen: 0
  },
  oiled: {
    name: 'Oiled',
    roughness: 0.7,
    clearcoatRoughness: 0.6,
    clearcoat: 0.1,
    sheen: 0.2
  },
  satin: {
    name: 'Satin',
    roughness: 0.5,
    clearcoatRoughness: 0.4,
    clearcoat: 0.3,
    sheen: 0.4
  },
  'semi-gloss': {
    name: 'Semi-Gloss',
    roughness: 0.3,
    clearcoatRoughness: 0.2,
    clearcoat: 0.5,
    sheen: 0.6
  },
  gloss: {
    name: 'High Gloss',
    roughness: 0.1,
    clearcoatRoughness: 0.05,
    clearcoat: 0.8,
    sheen: 0.9
  }
}

// =============================================================================
// LIGHTING PRESETS
// =============================================================================

export interface LightConfig {
  type: 'ambient' | 'directional' | 'point' | 'spot'
  position?: [number, number, number]
  intensity: number
  color?: string
  castShadow?: boolean
}

export interface LightingPreset {
  name: string
  ambient: number
  lights: LightConfig[]
  environment?: string
  shadowsEnabled: boolean
}

export const LIGHTING_PRESETS: Record<string, LightingPreset> = {
  basic: {
    name: 'Basic',
    ambient: 0.8,
    lights: [
      { type: 'directional', position: [10, 20, 10], intensity: 0.5 }
    ],
    shadowsEnabled: false
  },
  studio: {
    name: 'Studio',
    ambient: 0.6,
    lights: [
      { type: 'directional', position: [30, 50, 30], intensity: 0.7, castShadow: true },
      { type: 'directional', position: [-20, 30, -20], intensity: 0.4 },
      { type: 'directional', position: [0, -10, 0], intensity: 0.15 }
    ],
    environment: 'studio',
    shadowsEnabled: true
  },
  dramatic: {
    name: 'Dramatic',
    ambient: 0.3,
    lights: [
      { type: 'directional', position: [40, 60, 20], intensity: 1.0, castShadow: true, color: '#fff5e6' },
      { type: 'directional', position: [-30, 20, -30], intensity: 0.3, color: '#e6f0ff' },
      { type: 'point', position: [0, -20, 0], intensity: 0.2, color: '#ffeecc' }
    ],
    environment: 'sunset',
    shadowsEnabled: true
  }
}

// =============================================================================
// BACKGROUND COLORS
// =============================================================================

export const BACKGROUND_PRESETS = {
  workshop: '#f5f5f0',      // Warm off-white (current)
  white: '#ffffff',         // Pure white
  light: '#e8e8e0',         // Light gray
  neutral: '#d0d0c8',       // Medium gray
  dark: '#2a2a28',          // Dark gray
  blueprint: '#1e3a5f',     // Blueprint blue
  black: '#0a0a0a'          // Near black
}

// =============================================================================
// EDGE COLORS FOR DIFFERENT MODES
// =============================================================================

export const EDGE_COLORS = {
  wood: '#5C4A3A',          // Dark brown (default)
  light: '#8B7355',         // Light brown (chamfers)
  dark: '#3d2e24',          // Very dark brown
  black: '#1a1a1a',         // Near black (hidden line mode)
  white: '#f0f0f0',         // White (dark backgrounds)
  accent: '#c49a6c'         // Accent gold
}
