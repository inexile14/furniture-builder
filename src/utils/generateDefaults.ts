/**
 * Generate style preset defaults from current parameters
 *
 * Used by admin feature to capture current table configuration
 * as defaults for a style preset.
 */

import type { TableParams, Style } from '../types'
import { STYLE_PRESETS } from '../constants/stylePresets'

/**
 * Generate a code snippet for updating stylePresets.ts
 */
export function generateDefaultsCode(params: TableParams): string {
  const style = params.style
  const preset = STYLE_PRESETS[style]

  // Create the defaults object matching StylePreset structure
  const defaults = {
    top: {
      thickness: params.top.thickness,
      edgeProfile: params.top.edgeProfile,
      ...(params.top.edgeProfile === 'chamfered' && {
        chamferEdge: params.top.chamferEdge,
        chamferSize: params.top.chamferSize,
        chamferAngle: params.top.chamferAngle,
      }),
      ...(params.top.cornerRadius > 0 && {
        cornerRadius: params.top.cornerRadius,
      }),
      breadboardEnds: params.top.breadboardEnds,
      ...(params.top.breadboardEnds && params.top.breadboard && {
        breadboard: params.top.breadboard,
      }),
      overhang: params.top.overhang,
    },
    legs: {
      style: params.legs.style,
      thickness: params.legs.thickness,
      chamfer: params.legs.chamfer,
      ...(params.legs.chamferLongEdges && { chamferLongEdges: true }),
      ...(params.legs.chamferFoot && { chamferFoot: true }),
      ...(params.legs.chamferSize && { chamferSize: params.legs.chamferSize }),
      ...(params.legs.footChamferSize && { footChamferSize: params.legs.footChamferSize }),
      ...(params.legs.style === 'tapered' && {
        taperStartFromTop: params.legs.taperStartFromTop,
        taperEndDimension: params.legs.taperEndDimension,
        taperSides: params.legs.taperSides,
      }),
      ...(params.legs.style === 'splayed' && {
        splayAngle: params.legs.splayAngle,
        taperEndDimension: params.legs.taperEndDimension,
      }),
      insetFromEdge: params.legs.insetFromEdge,
      foot: params.legs.foot,
    },
    aprons: {
      height: params.aprons.height,
      thickness: params.aprons.thickness,
      bottomProfile: params.aprons.bottomProfile,
      setback: params.aprons.setback,
      sides: params.aprons.sides,
    },
    stretchers: {
      enabled: params.stretchers.enabled,
      style: params.stretchers.style,
      heightFromFloor: params.stretchers.heightFromFloor,
      ...(params.stretchers.sideHeightFromFloor !== params.stretchers.heightFromFloor && {
        sideHeightFromFloor: params.stretchers.sideHeightFromFloor,
      }),
      width: params.stretchers.width,
      thickness: params.stretchers.thickness,
      ...(params.stretchers.centerStretcher && { centerStretcher: true }),
    },
    ...(params.slats?.enabled && {
      slats: {
        enabled: params.slats.enabled,
        count: params.slats.count,
        width: params.slats.width,
        thickness: params.slats.thickness,
        spacing: params.slats.spacing,
        sides: params.slats.sides,
      },
    }),
    joinery: {
      legApronJoint: params.joinery.legApronJoint,
      cornerJoint: params.joinery.cornerJoint,
      haunched: params.joinery.haunched,
      tenonThicknessRatio: params.joinery.tenonThicknessRatio,
      tenonLengthRatio: params.joinery.tenonLengthRatio,
      tenonShoulderWidth: params.joinery.tenonShoulderWidth,
      mortiseSetback: params.joinery.mortiseSetback,
      topAttachment: params.joinery.topAttachment,
      topAttachmentSpacing: params.joinery.topAttachmentSpacing,
      ...(params.stretchers.enabled && {
        stretcherJoint: params.joinery.stretcherJoint,
      }),
      showJoineryInPreview: params.joinery.showJoineryInPreview,
    },
  }

  // Add trestle params if applicable
  const trestleDefaults = style === 'trestle' && params.trestle ? {
    trestle: {
      footLength: params.trestle.footLength,
      footHeight: params.trestle.footHeight,
      footWidth: params.trestle.footWidth,
      footBevelAngle: params.trestle.footBevelAngle,
      shoulderLength: params.trestle.shoulderLength,
      shoulderHeight: params.trestle.shoulderHeight,
      shoulderWidth: params.trestle.shoulderWidth,
      shoulderBevelAngle: params.trestle.shoulderBevelAngle,
      legThickness: params.trestle.legThickness,
      legWidth: params.trestle.legWidth,
      stretcherHeight: params.trestle.stretcherHeight,
      stretcherThickness: params.trestle.stretcherThickness,
      wedgeAngle: params.trestle.wedgeAngle,
    },
  } : {}

  const fullDefaults = { ...defaults, ...trestleDefaults }

  // Format as code
  const code = `// Updated defaults for ${preset.displayName} style
// Generated ${new Date().toISOString().split('T')[0]}
// Copy this into stylePresets.ts

defaults: ${JSON.stringify(fullDefaults, null, 2).replace(/"([^"]+)":/g, '$1:')}`

  return code
}

/**
 * Generate suggested dimensions code
 */
export function generateSuggestedDimensionsCode(params: TableParams): string {
  return `suggestedDimensions: {
  ${params.tableType}: { length: ${params.length}, width: ${params.width}, height: ${params.height} }
}`
}

/**
 * Copy text to clipboard and show feedback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    // Fallback: log to console
    console.log('=== Generated Defaults ===')
    console.log(text)
    console.log('=== End Defaults ===')
    return false
  }
}
