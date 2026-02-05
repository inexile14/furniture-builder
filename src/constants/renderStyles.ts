/**
 * Parametric Table Builder - Rendering Style Constants
 * Different visual styles for the 3D preview
 */

export type RenderStyleName = 'technical' | 'sketchy' | 'toon' | 'blueprint' | 'warm'

export interface RenderStyle {
  name: RenderStyleName
  displayName: string
  description: string
  material: {
    roughness: number
    metalness: number
    flatShading: boolean
    wireframe: boolean
    transparent: boolean
    opacity: number
  }
  edges: {
    visible: boolean
    color: string
    opacity: number
    lineWidth?: number
  }
  background: string
  ambientIntensity: number
  directionalIntensity: number
}

export const RENDER_STYLES: Record<RenderStyleName, RenderStyle> = {
  technical: {
    name: 'technical',
    displayName: 'Technical',
    description: 'Clean, precise rendering for planning',
    material: {
      roughness: 0.7,
      metalness: 0.05,
      flatShading: true,
      wireframe: false,
      transparent: false,
      opacity: 1.0,
    },
    edges: {
      visible: true,
      color: '#5C4A3A',
      opacity: 1.0,
    },
    background: '#B8C4CE',
    ambientIntensity: 0.6,
    directionalIntensity: 0.7,
  },

  sketchy: {
    name: 'sketchy',
    displayName: 'Sketchy',
    description: 'Hand-drawn look with visible edges',
    material: {
      roughness: 0.9,
      metalness: 0,
      flatShading: true,
      wireframe: false,
      transparent: false,
      opacity: 1.0,
    },
    edges: {
      visible: true,
      color: '#2D1810',
      opacity: 0.8,
      lineWidth: 2,
    },
    background: '#F5F0E8',
    ambientIntensity: 0.8,
    directionalIntensity: 0.4,
  },

  toon: {
    name: 'toon',
    displayName: 'Toon',
    description: 'Flat shaded cartoon style',
    material: {
      roughness: 1.0,
      metalness: 0,
      flatShading: true,
      wireframe: false,
      transparent: false,
      opacity: 1.0,
    },
    edges: {
      visible: true,
      color: '#1A0F08',
      opacity: 1.0,
      lineWidth: 2,
    },
    background: '#E8E2D9',
    ambientIntensity: 0.9,
    directionalIntensity: 0.3,
  },

  blueprint: {
    name: 'blueprint',
    displayName: 'Blueprint',
    description: 'Technical wireframe view',
    material: {
      roughness: 1.0,
      metalness: 0,
      flatShading: false,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    },
    edges: {
      visible: true,
      color: '#1E3A5F',
      opacity: 1.0,
    },
    background: '#0A1628',
    ambientIntensity: 1.0,
    directionalIntensity: 0.2,
  },

  warm: {
    name: 'warm',
    displayName: 'Warm',
    description: 'Soft, warm studio lighting',
    material: {
      roughness: 0.6,
      metalness: 0.1,
      flatShading: false,
      wireframe: false,
      transparent: false,
      opacity: 1.0,
    },
    edges: {
      visible: true,
      color: '#8B7355',
      opacity: 0.5,
    },
    background: '#D4C4B0',
    ambientIntensity: 0.5,
    directionalIntensity: 0.8,
  },
}

export const DEFAULT_RENDER_STYLE: RenderStyleName = 'technical'
