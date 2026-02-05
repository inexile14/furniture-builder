/**
 * Hook for getting material properties based on render settings
 *
 * Provides consistent material configuration across all table components
 * based on the current render style and wood finish.
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import type { RenderSettings, RenderStyle } from '../types'
import { RENDER_STYLE_CONFIGS, WOOD_FINISH_CONFIGS } from '../constants/rendering'

export interface MaterialProps {
  color: string
  roughness: number
  metalness: number
  flatShading: boolean
  wireframe: boolean
  transparent: boolean
  opacity: number
  side: THREE.Side
  // For hidden-line mode
  overrideColor?: string
  // For realistic mode with clearcoat
  clearcoat?: number
  clearcoatRoughness?: number
}

export interface EdgeProps {
  visible: boolean
  color: string
  lineWidth: number
}

export interface RenderMaterialResult {
  materialProps: MaterialProps
  edgeProps: EdgeProps
  isRealistic: boolean
  isWireframe: boolean
  isXray: boolean
  isHiddenLine: boolean
}

/**
 * Get material and edge properties for a given render style
 */
export function useRenderMaterial(
  woodColor: string,
  renderSettings: RenderSettings
): RenderMaterialResult {
  return useMemo(() => {
    const styleConfig = RENDER_STYLE_CONFIGS[renderSettings.style]
    const finishConfig = WOOD_FINISH_CONFIGS[renderSettings.finish]

    const isRealistic = renderSettings.style === 'realistic'
    const isWireframe = renderSettings.style === 'wireframe'
    const isXray = renderSettings.style === 'xray'
    const isHiddenLine = renderSettings.style === 'hidden-line'

    // Base material props from style config
    let materialProps: MaterialProps = {
      color: woodColor,
      roughness: styleConfig.materialProps.roughness,
      metalness: styleConfig.materialProps.metalness,
      flatShading: styleConfig.materialProps.flatShading,
      wireframe: styleConfig.materialProps.wireframe,
      transparent: styleConfig.materialProps.transparent,
      opacity: styleConfig.materialProps.opacity,
      side: THREE.DoubleSide,
    }

    // Hidden-line mode: override color to white
    if (isHiddenLine) {
      materialProps.overrideColor = '#ffffff'
      materialProps.color = '#ffffff'
    }

    // Realistic mode: adjust based on finish
    if (isRealistic) {
      materialProps.roughness = finishConfig.roughness
      materialProps.clearcoat = finishConfig.clearcoat
      materialProps.clearcoatRoughness = finishConfig.clearcoatRoughness
    }

    // Edge properties from style config
    const edgeProps: EdgeProps = {
      visible: styleConfig.edgeProps.visible,
      color: isHiddenLine ? '#1a1a1a' : styleConfig.edgeProps.color,
      lineWidth: styleConfig.edgeProps.lineWidth,
    }

    return {
      materialProps,
      edgeProps,
      isRealistic,
      isWireframe,
      isXray,
      isHiddenLine,
    }
  }, [woodColor, renderSettings.style, renderSettings.finish])
}

/**
 * Default render settings for components that don't receive them
 */
export const DEFAULT_RENDER_SETTINGS: RenderSettings = {
  style: 'shaded-edges',
  finish: 'satin',
  showShadows: true,
  showAmbientOcclusion: false,
  showReflections: false,
  backgroundColor: '#f5f5f0',
}
