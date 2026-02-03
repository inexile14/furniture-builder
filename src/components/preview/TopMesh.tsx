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
  const halfLength = length / 2
  const halfWidth = width / 2
  const halfThickness = thickness / 2

  // Calculate chamfer dimensions based on angle
  // chamferSize is the horizontal distance (visible from top/bottom)
  const angleRad = (chamferAngle * Math.PI) / 180
  const chamferVertical = chamferSize * Math.tan(angleRad)

  // Clamp chamfer to not exceed half the thickness
  const maxChamferVertical = halfThickness * 0.9
  const actualChamferVertical = Math.min(chamferVertical, maxChamferVertical)
  const actualChamferHorizontal = actualChamferVertical / Math.tan(angleRad)

  const vertices: number[] = []
  const indices: number[] = []
  let vertexIndex = 0

  // Helper to add a quad (two triangles)
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

  const doTop = chamferEdge === 'top' || chamferEdge === 'both'
  const doBottom = chamferEdge === 'bottom' || chamferEdge === 'both'

  // Calculate Y positions for top and bottom surfaces
  const topY = halfThickness
  const bottomY = -halfThickness

  // Chamfer insets
  const topChamferY = doTop ? topY - actualChamferVertical : topY
  const bottomChamferY = doBottom ? bottomY + actualChamferVertical : bottomY
  const topInset = doTop ? actualChamferHorizontal : 0
  const bottomInset = doBottom ? actualChamferHorizontal : 0

  // TOP FACE
  addQuad(
    [-halfLength + topInset, topY, -halfWidth + topInset],
    [halfLength - topInset, topY, -halfWidth + topInset],
    [halfLength - topInset, topY, halfWidth - topInset],
    [-halfLength + topInset, topY, halfWidth - topInset]
  )

  // BOTTOM FACE
  addQuad(
    [-halfLength + bottomInset, bottomY, halfWidth - bottomInset],
    [halfLength - bottomInset, bottomY, halfWidth - bottomInset],
    [halfLength - bottomInset, bottomY, -halfWidth + bottomInset],
    [-halfLength + bottomInset, bottomY, -halfWidth + bottomInset]
  )

  // FRONT SIDE (-Z)
  if (doTop && doBottom) {
    // Top chamfer
    addQuad(
      [-halfLength + topInset, topY, -halfWidth + topInset],
      [-halfLength, topChamferY, -halfWidth],
      [halfLength, topChamferY, -halfWidth],
      [halfLength - topInset, topY, -halfWidth + topInset]
    )
    // Vertical side
    addQuad(
      [-halfLength, topChamferY, -halfWidth],
      [-halfLength, bottomChamferY, -halfWidth],
      [halfLength, bottomChamferY, -halfWidth],
      [halfLength, topChamferY, -halfWidth]
    )
    // Bottom chamfer
    addQuad(
      [-halfLength, bottomChamferY, -halfWidth],
      [-halfLength + bottomInset, bottomY, -halfWidth + bottomInset],
      [halfLength - bottomInset, bottomY, -halfWidth + bottomInset],
      [halfLength, bottomChamferY, -halfWidth]
    )
  } else if (doTop) {
    // Top chamfer only
    addQuad(
      [-halfLength + topInset, topY, -halfWidth + topInset],
      [-halfLength, topChamferY, -halfWidth],
      [halfLength, topChamferY, -halfWidth],
      [halfLength - topInset, topY, -halfWidth + topInset]
    )
    // Vertical side (from chamfer to bottom)
    addQuad(
      [-halfLength, topChamferY, -halfWidth],
      [-halfLength, bottomY, -halfWidth],
      [halfLength, bottomY, -halfWidth],
      [halfLength, topChamferY, -halfWidth]
    )
  } else if (doBottom) {
    // Vertical side (from top to chamfer)
    addQuad(
      [-halfLength, topY, -halfWidth],
      [-halfLength, bottomChamferY, -halfWidth],
      [halfLength, bottomChamferY, -halfWidth],
      [halfLength, topY, -halfWidth]
    )
    // Bottom chamfer only
    addQuad(
      [-halfLength, bottomChamferY, -halfWidth],
      [-halfLength + bottomInset, bottomY, -halfWidth + bottomInset],
      [halfLength - bottomInset, bottomY, -halfWidth + bottomInset],
      [halfLength, bottomChamferY, -halfWidth]
    )
  } else {
    // No chamfer - simple vertical side
    addQuad(
      [-halfLength, topY, -halfWidth],
      [-halfLength, bottomY, -halfWidth],
      [halfLength, bottomY, -halfWidth],
      [halfLength, topY, -halfWidth]
    )
  }

  // BACK SIDE (+Z) - mirror of front
  if (doTop && doBottom) {
    addQuad(
      [halfLength - topInset, topY, halfWidth - topInset],
      [halfLength, topChamferY, halfWidth],
      [-halfLength, topChamferY, halfWidth],
      [-halfLength + topInset, topY, halfWidth - topInset]
    )
    addQuad(
      [halfLength, topChamferY, halfWidth],
      [halfLength, bottomChamferY, halfWidth],
      [-halfLength, bottomChamferY, halfWidth],
      [-halfLength, topChamferY, halfWidth]
    )
    addQuad(
      [halfLength, bottomChamferY, halfWidth],
      [halfLength - bottomInset, bottomY, halfWidth - bottomInset],
      [-halfLength + bottomInset, bottomY, halfWidth - bottomInset],
      [-halfLength, bottomChamferY, halfWidth]
    )
  } else if (doTop) {
    addQuad(
      [halfLength - topInset, topY, halfWidth - topInset],
      [halfLength, topChamferY, halfWidth],
      [-halfLength, topChamferY, halfWidth],
      [-halfLength + topInset, topY, halfWidth - topInset]
    )
    addQuad(
      [halfLength, topChamferY, halfWidth],
      [halfLength, bottomY, halfWidth],
      [-halfLength, bottomY, halfWidth],
      [-halfLength, topChamferY, halfWidth]
    )
  } else if (doBottom) {
    addQuad(
      [halfLength, topY, halfWidth],
      [halfLength, bottomChamferY, halfWidth],
      [-halfLength, bottomChamferY, halfWidth],
      [-halfLength, topY, halfWidth]
    )
    addQuad(
      [halfLength, bottomChamferY, halfWidth],
      [halfLength - bottomInset, bottomY, halfWidth - bottomInset],
      [-halfLength + bottomInset, bottomY, halfWidth - bottomInset],
      [-halfLength, bottomChamferY, halfWidth]
    )
  } else {
    addQuad(
      [halfLength, topY, halfWidth],
      [halfLength, bottomY, halfWidth],
      [-halfLength, bottomY, halfWidth],
      [-halfLength, topY, halfWidth]
    )
  }

  // LEFT SIDE (-X)
  if (doTop && doBottom) {
    addQuad(
      [-halfLength + topInset, topY, halfWidth - topInset],
      [-halfLength, topChamferY, halfWidth],
      [-halfLength, topChamferY, -halfWidth],
      [-halfLength + topInset, topY, -halfWidth + topInset]
    )
    addQuad(
      [-halfLength, topChamferY, halfWidth],
      [-halfLength, bottomChamferY, halfWidth],
      [-halfLength, bottomChamferY, -halfWidth],
      [-halfLength, topChamferY, -halfWidth]
    )
    addQuad(
      [-halfLength, bottomChamferY, halfWidth],
      [-halfLength + bottomInset, bottomY, halfWidth - bottomInset],
      [-halfLength + bottomInset, bottomY, -halfWidth + bottomInset],
      [-halfLength, bottomChamferY, -halfWidth]
    )
  } else if (doTop) {
    addQuad(
      [-halfLength + topInset, topY, halfWidth - topInset],
      [-halfLength, topChamferY, halfWidth],
      [-halfLength, topChamferY, -halfWidth],
      [-halfLength + topInset, topY, -halfWidth + topInset]
    )
    addQuad(
      [-halfLength, topChamferY, halfWidth],
      [-halfLength, bottomY, halfWidth],
      [-halfLength, bottomY, -halfWidth],
      [-halfLength, topChamferY, -halfWidth]
    )
  } else if (doBottom) {
    addQuad(
      [-halfLength, topY, halfWidth],
      [-halfLength, bottomChamferY, halfWidth],
      [-halfLength, bottomChamferY, -halfWidth],
      [-halfLength, topY, -halfWidth]
    )
    addQuad(
      [-halfLength, bottomChamferY, halfWidth],
      [-halfLength + bottomInset, bottomY, halfWidth - bottomInset],
      [-halfLength + bottomInset, bottomY, -halfWidth + bottomInset],
      [-halfLength, bottomChamferY, -halfWidth]
    )
  } else {
    addQuad(
      [-halfLength, topY, halfWidth],
      [-halfLength, bottomY, halfWidth],
      [-halfLength, bottomY, -halfWidth],
      [-halfLength, topY, -halfWidth]
    )
  }

  // RIGHT SIDE (+X) - mirror of left
  if (doTop && doBottom) {
    addQuad(
      [halfLength - topInset, topY, -halfWidth + topInset],
      [halfLength, topChamferY, -halfWidth],
      [halfLength, topChamferY, halfWidth],
      [halfLength - topInset, topY, halfWidth - topInset]
    )
    addQuad(
      [halfLength, topChamferY, -halfWidth],
      [halfLength, bottomChamferY, -halfWidth],
      [halfLength, bottomChamferY, halfWidth],
      [halfLength, topChamferY, halfWidth]
    )
    addQuad(
      [halfLength, bottomChamferY, -halfWidth],
      [halfLength - bottomInset, bottomY, -halfWidth + bottomInset],
      [halfLength - bottomInset, bottomY, halfWidth - bottomInset],
      [halfLength, bottomChamferY, halfWidth]
    )
  } else if (doTop) {
    addQuad(
      [halfLength - topInset, topY, -halfWidth + topInset],
      [halfLength, topChamferY, -halfWidth],
      [halfLength, topChamferY, halfWidth],
      [halfLength - topInset, topY, halfWidth - topInset]
    )
    addQuad(
      [halfLength, topChamferY, -halfWidth],
      [halfLength, bottomY, -halfWidth],
      [halfLength, bottomY, halfWidth],
      [halfLength, topChamferY, halfWidth]
    )
  } else if (doBottom) {
    addQuad(
      [halfLength, topY, -halfWidth],
      [halfLength, bottomChamferY, -halfWidth],
      [halfLength, bottomChamferY, halfWidth],
      [halfLength, topY, halfWidth]
    )
    addQuad(
      [halfLength, bottomChamferY, -halfWidth],
      [halfLength - bottomInset, bottomY, -halfWidth + bottomInset],
      [halfLength - bottomInset, bottomY, halfWidth - bottomInset],
      [halfLength, bottomChamferY, halfWidth]
    )
  } else {
    addQuad(
      [halfLength, topY, -halfWidth],
      [halfLength, bottomY, -halfWidth],
      [halfLength, bottomY, halfWidth],
      [halfLength, topY, halfWidth]
    )
  }

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
