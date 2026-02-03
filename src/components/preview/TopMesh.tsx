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
 * Create a chamfered table top geometry using THREE.js ExtrudeGeometry with bevel.
 * This handles corners automatically.
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
  const hL = length / 2
  const hW = width / 2

  // Calculate chamfer dimensions
  const angleRad = (chamferAngle * Math.PI) / 180
  const chamferV = Math.min(chamferSize * Math.tan(angleRad), thickness * 0.45)
  const chamferH = chamferV / Math.tan(angleRad)

  const doTop = chamferEdge === 'top' || chamferEdge === 'both'
  const doBottom = chamferEdge === 'bottom' || chamferEdge === 'both'

  // Create the 2D shape (rectangle)
  const shape = new THREE.Shape()
  shape.moveTo(-hL, -hW)
  shape.lineTo(hL, -hW)
  shape.lineTo(hL, hW)
  shape.lineTo(-hL, hW)
  shape.closePath()

  // For bottom-only chamfer, we extrude with bevel on one side
  // For top-only, we flip the geometry
  // For both, we use bevel on both sides

  if (doBottom && !doTop) {
    // Bottom chamfer only - extrude with bevel, then flip
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: thickness - chamferV,
      bevelEnabled: true,
      bevelThickness: chamferV,
      bevelSize: chamferH,
      bevelSegments: 1,
      bevelOffset: 0
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    // Rotate so Y is up, and position so it's centered
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, thickness / 2 - chamferV / 2, 0)
    return geo
  } else if (doTop && !doBottom) {
    // Top chamfer only - extrude with bevel, positioned differently
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: thickness - chamferV,
      bevelEnabled: true,
      bevelThickness: chamferV,
      bevelSize: chamferH,
      bevelSegments: 1,
      bevelOffset: 0
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.rotateX(-Math.PI / 2)
    geo.rotateY(Math.PI)  // Flip to put bevel on top
    geo.translate(0, -thickness / 2 + chamferV / 2, 0)
    return geo
  } else if (doTop && doBottom) {
    // Both chamfers - use bevel on both sides
    // THREE.js bevel only works on one side, so we need to do this manually
    // or accept bevel on both ends of the extrusion
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: thickness - 2 * chamferV,
      bevelEnabled: true,
      bevelThickness: chamferV,
      bevelSize: chamferH,
      bevelSegments: 1,
      bevelOffset: 0
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, 0, 0)
    return geo
  }

  // No chamfer - simple box
  return new THREE.BoxGeometry(length, thickness, width)
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
