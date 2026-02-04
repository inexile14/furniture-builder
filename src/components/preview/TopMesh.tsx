/**
 * Parametric Table Builder - Table Top Mesh
 * Supports rectangular tops with optional rounded corners and edge profiles
 */

import * as THREE from 'three'
import { useMemo } from 'react'
import { Edges, Line } from '@react-three/drei'
import type { EdgeProfile, ChamferEdge } from '../../types'

interface TopMeshProps {
  length: number
  width: number
  thickness: number
  color: string
  edgeProfile: EdgeProfile
  cornerRadius?: number
  // Chamfer parameters
  chamferEdge?: ChamferEdge
  chamferSize?: number
  chamferAngle?: number
}

/**
 * Create points for a rounded rectangle outline
 */
function createRoundedRectPoints(
  length: number,
  width: number,
  radius: number,
  y: number,
  cornerSegments: number = 8
): [number, number, number][] {
  const points: [number, number, number][] = []
  const halfLength = length / 2
  const halfWidth = width / 2
  const r = Math.min(radius, halfLength, halfWidth)

  // Helper to add corner arc points
  function addCorner(cx: number, cz: number, startAngle: number) {
    for (let i = 0; i <= cornerSegments; i++) {
      const angle = startAngle + (Math.PI / 2) * (i / cornerSegments)
      const x = cx + r * Math.cos(angle)
      const z = cz + r * Math.sin(angle)
      points.push([x, y, z])
    }
  }

  // Bottom-left corner
  addCorner(-halfLength + r, -halfWidth + r, Math.PI)
  // Bottom edge to bottom-right corner
  addCorner(halfLength - r, -halfWidth + r, -Math.PI / 2)
  // Right edge to top-right corner
  addCorner(halfLength - r, halfWidth - r, 0)
  // Top edge to top-left corner
  addCorner(-halfLength + r, halfWidth - r, Math.PI / 2)

  // Close the loop
  points.push(points[0])

  return points
}

/**
 * Create a chamfered table top geometry.
 * Uses a 2D cross-section profile extruded around the perimeter.
 */
function createChamferedTopGeometry(
  length: number,
  width: number,
  thickness: number,
  chamferEdge: ChamferEdge,
  chamferSize: number,
  chamferAngle: number,
  _cornerRadius: number
): THREE.BufferGeometry {
  // Calculate chamfer dimensions
  const angleRad = (chamferAngle * Math.PI) / 180
  const chamferV = Math.min(chamferSize * Math.tan(angleRad), thickness * 0.4)
  const chamferH = chamferV / Math.tan(angleRad)

  const doTop = chamferEdge === 'top' || chamferEdge === 'both'
  const doBottom = chamferEdge === 'bottom' || chamferEdge === 'both'

  // Create a 2D cross-section profile (looking at the edge from the side)
  // Y is vertical (thickness direction), X is horizontal (into the table)
  const profile = new THREE.Shape()

  const halfT = thickness / 2

  if (doTop && doBottom) {
    // Both chamfers
    profile.moveTo(0, halfT - chamferV)           // Top outer, at chamfer start
    profile.lineTo(chamferH, halfT)               // Top inner (inset)
    profile.lineTo(chamferH, -halfT)              // Bottom inner
    profile.lineTo(0, -halfT + chamferV)          // Bottom outer, at chamfer start
    profile.lineTo(0, halfT - chamferV)           // Close
  } else if (doBottom) {
    // Bottom chamfer only
    profile.moveTo(0, halfT)                      // Top outer
    profile.lineTo(chamferH, halfT)               // Top inner
    profile.lineTo(chamferH, -halfT)              // Bottom inner
    profile.lineTo(0, -halfT + chamferV)          // Bottom outer, at chamfer start
    profile.lineTo(0, halfT)                      // Close
  } else if (doTop) {
    // Top chamfer only
    profile.moveTo(0, halfT - chamferV)           // Top outer, at chamfer start
    profile.lineTo(chamferH, halfT)               // Top inner
    profile.lineTo(chamferH, -halfT)              // Bottom inner
    profile.lineTo(0, -halfT)                     // Bottom outer
    profile.lineTo(0, halfT - chamferV)           // Close
  } else {
    // No chamfer - simple rectangle
    return new THREE.BoxGeometry(length, thickness, width)
  }

  // Create the perimeter path (rectangle)
  const hL = length / 2
  const hW = width / 2

  // We'll use ExtrudeGeometry with a rectangular path
  // But ExtrudeGeometry extrudes along Z, not around a path
  // So we need a different approach: build the geometry manually with the profile at each edge

  // Actually, let's use a simpler approach: create the shape as the footprint
  // and use bevel for the chamfer, accepting it applies to both ends
  // Then manually adjust by creating a composite

  // Simplest working approach: create inner box + chamfer strips
  const geometries: THREE.BufferGeometry[] = []

  // Inner box (the part that's not chamfered)
  const innerLength = length - 2 * chamferH
  const innerWidth = width - 2 * chamferH
  const innerHeight = doTop && doBottom ? thickness - 2 * chamferV : thickness - chamferV
  const innerY = doTop && doBottom ? 0 : (doBottom ? chamferV / 2 : -chamferV / 2)

  const innerBox = new THREE.BoxGeometry(innerLength, innerHeight, innerWidth)
  innerBox.translate(0, innerY, 0)
  geometries.push(innerBox)

  // Top surface (if no top chamfer, or the flat part above chamfer)
  if (!doTop) {
    const topPlate = new THREE.BoxGeometry(length, chamferV, width)
    topPlate.translate(0, halfT - chamferV / 2, 0)
    geometries.push(topPlate)
  }

  // Bottom surface (if no bottom chamfer)
  if (!doBottom) {
    const bottomPlate = new THREE.BoxGeometry(length, chamferV, width)
    bottomPlate.translate(0, -halfT + chamferV / 2, 0)
    geometries.push(bottomPlate)
  }

  // Front chamfer strip (-Z)
  if (doBottom) {
    const frontChamfer = createChamferStrip(length - 2 * chamferH, chamferH, chamferV)
    frontChamfer.rotateX(Math.PI / 2 + Math.atan2(chamferV, chamferH))
    frontChamfer.translate(0, -halfT + chamferV / 2, -hW + chamferH / 2)
    geometries.push(frontChamfer)
  }

  // Back chamfer strip (+Z)
  if (doBottom) {
    const backChamfer = createChamferStrip(length - 2 * chamferH, chamferH, chamferV)
    backChamfer.rotateX(-(Math.PI / 2 + Math.atan2(chamferV, chamferH)))
    backChamfer.rotateY(Math.PI)
    backChamfer.translate(0, -halfT + chamferV / 2, hW - chamferH / 2)
    geometries.push(backChamfer)
  }

  // Left chamfer strip (-X)
  if (doBottom) {
    const leftChamfer = createChamferStrip(width - 2 * chamferH, chamferH, chamferV)
    leftChamfer.rotateX(Math.PI / 2 + Math.atan2(chamferV, chamferH))
    leftChamfer.rotateY(-Math.PI / 2)
    leftChamfer.translate(-hL + chamferH / 2, -halfT + chamferV / 2, 0)
    geometries.push(leftChamfer)
  }

  // Right chamfer strip (+X)
  if (doBottom) {
    const rightChamfer = createChamferStrip(width - 2 * chamferH, chamferH, chamferV)
    rightChamfer.rotateX(Math.PI / 2 + Math.atan2(chamferV, chamferH))
    rightChamfer.rotateY(Math.PI / 2)
    rightChamfer.translate(hL - chamferH / 2, -halfT + chamferV / 2, 0)
    geometries.push(rightChamfer)
  }

  // Merge all geometries
  return mergeBufferGeometries(geometries)
}

/**
 * Create a flat strip for the chamfer face
 */
function createChamferStrip(length: number, width: number, _height: number): THREE.BufferGeometry {
  return new THREE.PlaneGeometry(length, Math.sqrt(width * width + _height * _height))
}

/**
 * Merge multiple BufferGeometries into one
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  let indexOffset = 0

  for (const geo of geometries) {
    const posAttr = geo.getAttribute('position')
    const posArray = posAttr.array as Float32Array

    for (let i = 0; i < posArray.length; i++) {
      positions.push(posArray[i])
    }

    const idx = geo.getIndex()
    if (idx) {
      const idxArray = idx.array as Uint16Array | Uint32Array
      for (let i = 0; i < idxArray.length; i++) {
        indices.push(idxArray[i] + indexOffset)
      }
    } else {
      // Non-indexed geometry - create indices
      const vertexCount = posAttr.count
      for (let i = 0; i < vertexCount; i += 3) {
        indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2)
      }
    }

    indexOffset += posAttr.count
  }

  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  merged.setIndex(indices)
  merged.computeVertexNormals()

  return merged
}

export default function TopMesh({
  length,
  width,
  thickness,
  color,
  edgeProfile,
  cornerRadius = 0,
  chamferEdge = 'bottom',
  chamferSize = 0.25,
  chamferAngle = 45
}: TopMeshProps) {
  const geometry = useMemo(() => {
    // For chamfered edges, create custom geometry
    if (edgeProfile === 'chamfered' && chamferSize > 0) {
      return createChamferedTopGeometry(
        length,
        width,
        thickness,
        chamferEdge,
        chamferSize,
        chamferAngle,
        cornerRadius
      )
    }

    // If no corner radius, use simple box
    if (!cornerRadius || cornerRadius <= 0) {
      return new THREE.BoxGeometry(length, thickness, width)
    }

    // Create rounded rectangle shape for extrusion
    const shape = new THREE.Shape()
    const halfLength = length / 2
    const halfWidth = width / 2
    const r = Math.min(cornerRadius, halfLength, halfWidth)
    const segments = 8

    // Build the shape with arc segments
    shape.moveTo(-halfLength + r, -halfWidth)

    // Bottom edge
    shape.lineTo(halfLength - r, -halfWidth)
    // Bottom-right corner
    shape.absarc(halfLength - r, -halfWidth + r, r, -Math.PI / 2, 0, false)

    // Right edge
    shape.lineTo(halfLength, halfWidth - r)
    // Top-right corner
    shape.absarc(halfLength - r, halfWidth - r, r, 0, Math.PI / 2, false)

    // Top edge
    shape.lineTo(-halfLength + r, halfWidth)
    // Top-left corner
    shape.absarc(-halfLength + r, halfWidth - r, r, Math.PI / 2, Math.PI, false)

    // Left edge
    shape.lineTo(-halfLength, -halfWidth + r)
    // Bottom-left corner
    shape.absarc(-halfLength + r, -halfWidth + r, r, Math.PI, Math.PI * 1.5, false)

    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: false,
      curveSegments: segments
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, -thickness / 2, 0)

    return geo
  }, [length, width, thickness, cornerRadius, edgeProfile, chamferEdge, chamferSize, chamferAngle])

  // Create outline points for explicit edge lines
  const { topOutline, bottomOutline, verticalEdges } = useMemo(() => {
    if (!cornerRadius || cornerRadius <= 0) {
      return { topOutline: null, bottomOutline: null, verticalEdges: null }
    }

    const halfThickness = thickness / 2
    const top = createRoundedRectPoints(length, width, cornerRadius, halfThickness)
    const bottom = createRoundedRectPoints(length, width, cornerRadius, -halfThickness)

    // Create vertical edge lines at corners
    const halfLength = length / 2
    const halfWidth = width / 2
    const r = Math.min(cornerRadius, halfLength, halfWidth)
    const verticals: [number, number, number][][] = [
      // Four corner verticals
      [[-halfLength + r, halfThickness, -halfWidth], [-halfLength + r, -halfThickness, -halfWidth]],
      [[halfLength - r, halfThickness, -halfWidth], [halfLength - r, -halfThickness, -halfWidth]],
      [[halfLength, halfThickness, -halfWidth + r], [halfLength, -halfThickness, -halfWidth + r]],
      [[halfLength, halfThickness, halfWidth - r], [halfLength, -halfThickness, halfWidth - r]],
      [[halfLength - r, halfThickness, halfWidth], [halfLength - r, -halfThickness, halfWidth]],
      [[-halfLength + r, halfThickness, halfWidth], [-halfLength + r, -halfThickness, halfWidth]],
      [[-halfLength, halfThickness, halfWidth - r], [-halfLength, -halfThickness, halfWidth - r]],
      [[-halfLength, halfThickness, -halfWidth + r], [-halfLength, -halfThickness, -halfWidth + r]],
    ]

    return { topOutline: top, bottomOutline: bottom, verticalEdges: verticals }
  }, [length, width, thickness, cornerRadius])

  const hasRoundedCorners = cornerRadius && cornerRadius > 0

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
        {!hasRoundedCorners && <Edges threshold={15} color="#8B7355" />}
      </mesh>

      {/* Explicit edge lines for rounded corners */}
      {hasRoundedCorners && topOutline && (
        <>
          <Line points={topOutline} color="#8B7355" lineWidth={1} />
          <Line points={bottomOutline!} color="#8B7355" lineWidth={1} />
          {verticalEdges!.map((edge, i) => (
            <Line key={i} points={edge} color="#8B7355" lineWidth={1} />
          ))}
        </>
      )}
    </group>
  )
}
