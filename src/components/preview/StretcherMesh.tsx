/**
 * Parametric Table Builder - Stretcher Mesh Component
 * Renders stretchers between legs based on style (box, H)
 * Supports angled ends for tapered legs
 */

import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import type { StretcherParams, LegParams } from '../../types'

interface StretcherMeshProps {
  stretcherParams: StretcherParams
  legParams: LegParams
  legCenterX: number
  legCenterZ: number
  legHeight: number
  color: string
}

/**
 * Calculate leg dimension at a given height from floor
 * Returns { size, offset, taperAngle } where:
 * - size: the leg dimension at that height
 * - offset: how much the inside face has moved inward from top
 * - taperAngle: the angle of the inside face (radians)
 */
function getLegDimensionAtHeight(
  legParams: LegParams,
  legHeight: number,
  heightFromFloor: number
): { size: number; taperAngle: number } {
  const topSize = legParams.thickness

  if (legParams.style !== 'tapered') {
    return { size: topSize, taperAngle: 0 }
  }

  const bottomSize = legParams.taperEndDimension || topSize * 0.65
  const taperStartFromTop = legParams.taperStartFromTop || 6

  // Height from top of leg
  const heightFromTop = legHeight - heightFromFloor

  // If above taper start point, leg is full size
  if (heightFromTop <= taperStartFromTop) {
    return { size: topSize, taperAngle: 0 }
  }

  // Calculate taper progress (0 = just started tapering, 1 = at bottom)
  const taperLength = legHeight - taperStartFromTop
  const taperProgress = (heightFromTop - taperStartFromTop) / taperLength

  // Interpolate size
  const currentSize = topSize - (topSize - bottomSize) * taperProgress

  // Calculate taper angle (angle of inside face from vertical)
  // tan(angle) = horizontal_change / vertical_change
  const totalHorizontalChange = (topSize - bottomSize) / 2
  const taperAngle = Math.atan2(totalHorizontalChange, taperLength)

  return { size: currentSize, taperAngle }
}

/**
 * Create a stretcher geometry with angled ends for tapered legs
 * The stretcher has parallelogram-shaped ends that mate with angled leg faces
 */
function createAngledStretcherGeometry(
  length: number,
  height: number,  // stretcher height (Y dimension)
  depth: number,   // stretcher depth/thickness
  startAngle: number,  // angle at start end (radians, positive = angled inward at bottom)
  endAngle: number     // angle at end
): THREE.BufferGeometry {
  // If no angles, use simple box
  if (Math.abs(startAngle) < 0.001 && Math.abs(endAngle) < 0.001) {
    return new THREE.BoxGeometry(length, height, depth)
  }

  // Calculate how much the ends are offset due to angle
  // The angle affects the X position of top vs bottom vertices
  const startOffset = Math.tan(startAngle) * (height / 2)
  const endOffset = Math.tan(endAngle) * (height / 2)

  const halfLength = length / 2
  const halfHeight = height / 2
  const halfDepth = depth / 2

  // Build vertices for a box with angled ends
  // The start (-X) and end (+X) faces are angled
  const vertices: number[] = []
  const indices: number[] = []
  let vertexIndex = 0

  function addQuad(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) {
    vertices.push(...p0, ...p1, ...p2, ...p3)
    indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2)
    indices.push(vertexIndex, vertexIndex + 2, vertexIndex + 3)
    vertexIndex += 4
  }

  // Start end vertices (at -X, angled)
  // Bottom is offset inward (+X direction) when angle > 0
  const startTopX = -halfLength - startOffset
  const startBottomX = -halfLength + startOffset

  // End vertices (at +X, angled)
  // Bottom is offset inward (-X direction) when angle > 0
  const endTopX = halfLength + endOffset
  const endBottomX = halfLength - endOffset

  // Top face
  addQuad(
    [startTopX, halfHeight, -halfDepth],
    [endTopX, halfHeight, -halfDepth],
    [endTopX, halfHeight, halfDepth],
    [startTopX, halfHeight, halfDepth]
  )

  // Bottom face
  addQuad(
    [startBottomX, -halfHeight, halfDepth],
    [endBottomX, -halfHeight, halfDepth],
    [endBottomX, -halfHeight, -halfDepth],
    [startBottomX, -halfHeight, -halfDepth]
  )

  // Front face (-Z)
  addQuad(
    [startTopX, halfHeight, -halfDepth],
    [startBottomX, -halfHeight, -halfDepth],
    [endBottomX, -halfHeight, -halfDepth],
    [endTopX, halfHeight, -halfDepth]
  )

  // Back face (+Z)
  addQuad(
    [endTopX, halfHeight, halfDepth],
    [endBottomX, -halfHeight, halfDepth],
    [startBottomX, -halfHeight, halfDepth],
    [startTopX, halfHeight, halfDepth]
  )

  // Start end face (-X, angled)
  addQuad(
    [startTopX, halfHeight, halfDepth],
    [startBottomX, -halfHeight, halfDepth],
    [startBottomX, -halfHeight, -halfDepth],
    [startTopX, halfHeight, -halfDepth]
  )

  // End face (+X, angled)
  addQuad(
    [endTopX, halfHeight, -halfDepth],
    [endBottomX, -halfHeight, -halfDepth],
    [endBottomX, -halfHeight, halfDepth],
    [endTopX, halfHeight, halfDepth]
  )

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

export default function StretcherMesh({
  stretcherParams,
  legParams,
  legCenterX,
  legCenterZ,
  legHeight,
  color
}: StretcherMeshProps) {
  const { style, heightFromFloor, width, thickness } = stretcherParams

  // Side stretchers can be at different height (for box style)
  const sideHeightFromFloor = stretcherParams.sideHeightFromFloor ?? heightFromFloor

  // Stretcher Y positions (center of stretcher)
  const mainStretcherY = heightFromFloor + (width / 2)
  const sideStretcherY = sideHeightFromFloor + (width / 2)

  // Get leg dimensions at main stretcher height (for long stretchers)
  const legAtMainHeight = getLegDimensionAtHeight(legParams, legHeight, heightFromFloor)
  const legThicknessAtMain = legAtMainHeight.size
  const taperAngleMain = legAtMainHeight.taperAngle

  // Get leg dimensions at side stretcher height (for short stretchers in box style)
  const legAtSideHeight = getLegDimensionAtHeight(legParams, legHeight, sideHeightFromFloor)
  const legThicknessAtSide = legAtSideHeight.size
  const taperAngleSide = legAtSideHeight.taperAngle

  const isInsideTaper = legParams.style === 'tapered' && (legParams.taperSides || 'inside') === 'inside'

  // No mortise penetration for now - stretcher ends meet leg faces exactly
  const mortisePenetration = 0

  // For inside-only taper, stretchers meeting inside faces need to be longer
  // and have angled ends. Stretchers meeting outside faces are normal.

  // Calculate stretcher lengths based on where they meet the legs
  // Long stretchers (along X) meet legs at Z faces
  // Short stretchers (along Z) meet legs at X faces

  // Long stretcher: connects left legs to right legs (spans X axis)
  // Positioned at front (z=-legCenterZ) or back (z=+legCenterZ)
  // These meet the +Z face of front legs and -Z face of back legs
  // For inside taper: the Z faces taper, so stretcher is longer and angled
  // Add mortise penetration so stretcher extends into legs (eliminates Z-fighting)
  const longStretcherLength = isInsideTaper
    ? (legCenterX * 2) - legThicknessAtMain + (mortisePenetration * 2)
    : (legCenterX * 2) - legParams.thickness + (mortisePenetration * 2)

  // Short stretcher: connects front legs to back legs (spans Z axis)
  // Positioned at left (x=-legCenterX) or right (x=+legCenterX)
  // These meet the +X face of left legs and -X face of right legs
  // For inside taper: the X faces taper, so stretcher is longer and angled
  const shortStretcherLength = isInsideTaper
    ? (legCenterZ * 2) - legThicknessAtSide + (mortisePenetration * 2)
    : (legCenterZ * 2) - legParams.thickness + (mortisePenetration * 2)

  // Create geometries based on style
  const stretchers = useMemo(() => {
    const result: Array<{
      geometry: THREE.BufferGeometry
      position: [number, number, number]
      rotation: [number, number, number]
    }> = []

    if (style === 'none') return result

    // Create angled geometries for tapered legs, simple boxes otherwise
    // Long stretchers use main height taper angle
    const longGeo = isInsideTaper
      ? createAngledStretcherGeometry(longStretcherLength, width, thickness, taperAngleMain, taperAngleMain)
      : new THREE.BoxGeometry(longStretcherLength, width, thickness)

    // Short stretchers use side height taper angle (may be different for box style)
    const shortGeo = isInsideTaper
      ? createAngledStretcherGeometry(shortStretcherLength, width, thickness, taperAngleSide, taperAngleSide)
      : new THREE.BoxGeometry(thickness, width, shortStretcherLength)

    switch (style) {
      case 'H': {
        // Two long stretchers (front and back) + center crossbar
        // The center crossbar is what makes it an "H"
        result.push({
          geometry: longGeo.clone(),
          position: [0, mainStretcherY, -legCenterZ],
          rotation: [0, 0, 0]
        })
        result.push({
          geometry: longGeo.clone(),
          position: [0, mainStretcherY, legCenterZ],
          rotation: [0, 0, 0]
        })
        // Center crossbar (always included for H-style)
        const centerLength = (legCenterZ * 2) - thickness
        const centerGeo = new THREE.BoxGeometry(thickness, width, centerLength)
        result.push({
          geometry: centerGeo,
          position: [0, mainStretcherY, 0],
          rotation: [0, 0, 0]
        })
        break
      }

      case 'box': {
        // Four stretchers forming a rectangle, centered on legs
        // Front and back (along X) - at main height
        result.push({
          geometry: longGeo.clone(),
          position: [0, mainStretcherY, -legCenterZ],
          rotation: [0, 0, 0]
        })
        result.push({
          geometry: longGeo.clone(),
          position: [0, mainStretcherY, legCenterZ],
          rotation: [0, 0, 0]
        })
        // Left and right (along Z) - at side height
        if (isInsideTaper) {
          const sideGeo = createAngledStretcherGeometry(shortStretcherLength, width, thickness, taperAngleSide, taperAngleSide)
          result.push({
            geometry: sideGeo.clone(),
            position: [-legCenterX, sideStretcherY, 0],
            rotation: [0, Math.PI / 2, 0]
          })
          result.push({
            geometry: sideGeo.clone(),
            position: [legCenterX, sideStretcherY, 0],
            rotation: [0, Math.PI / 2, 0]
          })
        } else {
          result.push({
            geometry: shortGeo.clone(),
            position: [-legCenterX, sideStretcherY, 0],
            rotation: [0, 0, 0]
          })
          result.push({
            geometry: shortGeo.clone(),
            position: [legCenterX, sideStretcherY, 0],
            rotation: [0, 0, 0]
          })
        }
        break
      }

      case 'ends': {
        // Only end stretchers (left and right) - classic Mission style
        // No front/back stretchers, leaving long sides open
        if (isInsideTaper) {
          const sideGeo = createAngledStretcherGeometry(shortStretcherLength, width, thickness, taperAngleSide, taperAngleSide)
          result.push({
            geometry: sideGeo.clone(),
            position: [-legCenterX, sideStretcherY, 0],
            rotation: [0, Math.PI / 2, 0]
          })
          result.push({
            geometry: sideGeo.clone(),
            position: [legCenterX, sideStretcherY, 0],
            rotation: [0, Math.PI / 2, 0]
          })
        } else {
          result.push({
            geometry: shortGeo.clone(),
            position: [-legCenterX, sideStretcherY, 0],
            rotation: [0, 0, 0]
          })
          result.push({
            geometry: shortGeo.clone(),
            position: [legCenterX, sideStretcherY, 0],
            rotation: [0, 0, 0]
          })
        }
        break
      }
    }

    return result
  }, [
    style, longStretcherLength, shortStretcherLength, mainStretcherY, sideStretcherY,
    legCenterX, legCenterZ, legParams.thickness, thickness, width,
    isInsideTaper, taperAngleMain, taperAngleSide, legThicknessAtMain, legThicknessAtSide,
    stretcherParams.sideHeightFromFloor  // Explicit dependency to ensure re-render
  ])

  if (style === 'none' || stretchers.length === 0) return null

  return (
    <group>
      {stretchers.map((stretcher, i) => (
        <mesh
          key={i}
          geometry={stretcher.geometry}
          position={stretcher.position}
          rotation={stretcher.rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
            flatShading={true}
            side={THREE.DoubleSide}
            polygonOffset={true}
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
          <Edges threshold={15} color="#8B7355" />
        </mesh>
      ))}
    </group>
  )
}
