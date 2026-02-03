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
 * Chamfer can be on top edge, bottom edge, or both.
 *
 * For a bottom chamfer, the cross-section looks like:
 *     _______________  <- top surface (full size)
 *    |               |
 *    |               |  <- vertical side
 *     \             /   <- chamfer face (angled)
 *      \___________|    <- bottom surface (inset)
 *
 * The corners have triangular chamfer faces where the edge chamfers meet.
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
  const hL = length / 2  // half length
  const hW = width / 2   // half width
  const hT = thickness / 2  // half thickness

  // Calculate chamfer dimensions based on angle
  const angleRad = (chamferAngle * Math.PI) / 180
  const chamferV = Math.min(chamferSize * Math.tan(angleRad), hT * 0.9)  // vertical
  const chamferH = chamferV / Math.tan(angleRad)  // horizontal

  const doTop = chamferEdge === 'top' || chamferEdge === 'both'
  const doBottom = chamferEdge === 'bottom' || chamferEdge === 'both'

  // Key Y levels
  const topY = hT
  const botY = -hT
  const topChamferY = doTop ? topY - chamferV : topY
  const botChamferY = doBottom ? botY + chamferV : botY

  // Insets for chamfered surfaces
  const topIn = doTop ? chamferH : 0
  const botIn = doBottom ? chamferH : 0

  const vertices: number[] = []
  const indices: number[] = []
  let vi = 0

  function addQuad(p0: number[], p1: number[], p2: number[], p3: number[]) {
    vertices.push(...p0, ...p1, ...p2, ...p3)
    indices.push(vi, vi + 1, vi + 2)
    indices.push(vi, vi + 2, vi + 3)
    vi += 4
  }

  // =========================================================================
  // TOP SURFACE (may be inset if top chamfer)
  // =========================================================================
  addQuad(
    [-hL + topIn, topY, -hW + topIn],
    [hL - topIn, topY, -hW + topIn],
    [hL - topIn, topY, hW - topIn],
    [-hL + topIn, topY, hW - topIn]
  )

  // =========================================================================
  // BOTTOM SURFACE (may be inset if bottom chamfer)
  // =========================================================================
  addQuad(
    [-hL + botIn, botY, hW - botIn],
    [hL - botIn, botY, hW - botIn],
    [hL - botIn, botY, -hW + botIn],
    [-hL + botIn, botY, -hW + botIn]
  )

  // =========================================================================
  // FRONT SIDE (-Z)
  // =========================================================================
  // Top chamfer (if any)
  if (doTop) {
    addQuad(
      [-hL + topIn, topY, -hW + topIn],
      [-hL, topChamferY, -hW],
      [hL, topChamferY, -hW],
      [hL - topIn, topY, -hW + topIn]
    )
  }

  // Vertical middle section
  addQuad(
    [-hL, doTop ? topChamferY : topY, -hW],
    [-hL, doBottom ? botChamferY : botY, -hW],
    [hL, doBottom ? botChamferY : botY, -hW],
    [hL, doTop ? topChamferY : topY, -hW]
  )

  // Bottom chamfer (if any)
  if (doBottom) {
    addQuad(
      [-hL, botChamferY, -hW],
      [-hL + botIn, botY, -hW + botIn],
      [hL - botIn, botY, -hW + botIn],
      [hL, botChamferY, -hW]
    )
  }

  // =========================================================================
  // BACK SIDE (+Z)
  // =========================================================================
  if (doTop) {
    addQuad(
      [hL - topIn, topY, hW - topIn],
      [hL, topChamferY, hW],
      [-hL, topChamferY, hW],
      [-hL + topIn, topY, hW - topIn]
    )
  }

  addQuad(
    [hL, doTop ? topChamferY : topY, hW],
    [hL, doBottom ? botChamferY : botY, hW],
    [-hL, doBottom ? botChamferY : botY, hW],
    [-hL, doTop ? topChamferY : topY, hW]
  )

  if (doBottom) {
    addQuad(
      [hL, botChamferY, hW],
      [hL - botIn, botY, hW - botIn],
      [-hL + botIn, botY, hW - botIn],
      [-hL, botChamferY, hW]
    )
  }

  // =========================================================================
  // LEFT SIDE (-X)
  // =========================================================================
  if (doTop) {
    addQuad(
      [-hL + topIn, topY, hW - topIn],
      [-hL, topChamferY, hW],
      [-hL, topChamferY, -hW],
      [-hL + topIn, topY, -hW + topIn]
    )
  }

  addQuad(
    [-hL, doTop ? topChamferY : topY, hW],
    [-hL, doBottom ? botChamferY : botY, hW],
    [-hL, doBottom ? botChamferY : botY, -hW],
    [-hL, doTop ? topChamferY : topY, -hW]
  )

  if (doBottom) {
    addQuad(
      [-hL, botChamferY, hW],
      [-hL + botIn, botY, hW - botIn],
      [-hL + botIn, botY, -hW + botIn],
      [-hL, botChamferY, -hW]
    )
  }

  // =========================================================================
  // RIGHT SIDE (+X)
  // =========================================================================
  if (doTop) {
    addQuad(
      [hL - topIn, topY, -hW + topIn],
      [hL, topChamferY, -hW],
      [hL, topChamferY, hW],
      [hL - topIn, topY, hW - topIn]
    )
  }

  addQuad(
    [hL, doTop ? topChamferY : topY, -hW],
    [hL, doBottom ? botChamferY : botY, -hW],
    [hL, doBottom ? botChamferY : botY, hW],
    [hL, doTop ? topChamferY : topY, hW]
  )

  if (doBottom) {
    addQuad(
      [hL, botChamferY, -hW],
      [hL - botIn, botY, -hW + botIn],
      [hL - botIn, botY, hW - botIn],
      [hL, botChamferY, hW]
    )
  }

  // Corner vertices should match between adjacent chamfer faces:
  // Front chamfer left corner: [-hL + botIn, botY, -hW + botIn]
  // Left chamfer front corner: [-hL + botIn, botY, -hW + botIn]
  // These match, so the geometry should be watertight.

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
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
