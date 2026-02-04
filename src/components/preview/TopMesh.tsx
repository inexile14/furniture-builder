/**
 * Parametric Table Builder - Table Top Mesh
 * Supports rectangular tops with optional rounded corners and edge profiles
 */

import * as THREE from 'three'
import { useMemo } from 'react'
import { Edges, Line, Text } from '@react-three/drei'
import type { EdgeProfile, ChamferEdge, Style } from '../../types'

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
  // Style for special rendering
  style?: Style
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
 * Create a rounded rectangle shape for extrusion
 */
function createRoundedRectShape(
  halfLength: number,
  halfWidth: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape()
  const r = Math.min(radius, halfLength, halfWidth)

  shape.moveTo(-halfLength + r, -halfWidth)
  shape.lineTo(halfLength - r, -halfWidth)
  shape.absarc(halfLength - r, -halfWidth + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(halfLength, halfWidth - r)
  shape.absarc(halfLength - r, halfWidth - r, r, 0, Math.PI / 2, false)
  shape.lineTo(-halfLength + r, halfWidth)
  shape.absarc(-halfLength + r, halfWidth - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(-halfLength, -halfWidth + r)
  shape.absarc(-halfLength + r, -halfWidth + r, r, Math.PI, Math.PI * 1.5, false)

  return shape
}

/**
 * Create a chamfered table top geometry.
 * Uses ExtrudeGeometry with bevel for rounded corners, manual BufferGeometry for square corners.
 */
function createChamferedTopGeometry(
  length: number,
  width: number,
  thickness: number,
  chamferEdge: ChamferEdge,
  chamferSize: number,
  chamferAngle: number,
  cornerRadius: number
): THREE.BufferGeometry {
  const hL = length / 2
  const hW = width / 2

  // Calculate chamfer dimensions
  const angleRad = (chamferAngle * Math.PI) / 180
  const cV = Math.min(chamferSize, thickness)
  const cH = cV / Math.tan(angleRad)

  const doTop = chamferEdge === 'top' || chamferEdge === 'both'
  const doBottom = chamferEdge === 'bottom' || chamferEdge === 'both'

  // If there's a corner radius, use custom geometry for single-sided chamfer
  if (cornerRadius && cornerRadius > 0) {
    const r = Math.min(cornerRadius, hL, hW)

    if (doTop && doBottom) {
      // Both chamfers - use standard bevel on both ends
      const shape = createRoundedRectShape(hL, hW, r)
      const extrudeDepth = Math.max(0.01, thickness - 2 * cV)

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: extrudeDepth,
        bevelEnabled: true,
        bevelThickness: cV,
        bevelSize: cH,
        bevelSegments: 1,
        curveSegments: 8
      })

      geo.rotateX(-Math.PI / 2)
      return geo
    } else if (doBottom || doTop) {
      // Single-sided chamfer - build geometry manually
      // Generate perimeter points for outer and inner rectangles
      const segPerCorner = 8
      const outerPoints: [number, number][] = []
      const innerR = Math.max(0.1, r - cH)
      const innerHL = hL - cH
      const innerHW = hW - cH
      const innerPoints: [number, number][] = []

      function addArcPoints(arr: [number, number][], cx: number, cz: number, radius: number, startAngle: number) {
        for (let i = 0; i <= segPerCorner; i++) {
          const angle = startAngle + (Math.PI / 2) * (i / segPerCorner)
          arr.push([cx + radius * Math.cos(angle), cz + radius * Math.sin(angle)])
        }
      }

      // Outer perimeter (counter-clockwise from bottom-left)
      addArcPoints(outerPoints, -hL + r, -hW + r, r, Math.PI)
      addArcPoints(outerPoints, hL - r, -hW + r, r, -Math.PI / 2)
      addArcPoints(outerPoints, hL - r, hW - r, r, 0)
      addArcPoints(outerPoints, -hL + r, hW - r, r, Math.PI / 2)

      // Inner perimeter
      addArcPoints(innerPoints, -innerHL + innerR, -innerHW + innerR, innerR, Math.PI)
      addArcPoints(innerPoints, innerHL - innerR, -innerHW + innerR, innerR, -Math.PI / 2)
      addArcPoints(innerPoints, innerHL - innerR, innerHW - innerR, innerR, 0)
      addArcPoints(innerPoints, -innerHL + innerR, innerHW - innerR, innerR, Math.PI / 2)

      const hT = thickness / 2
      const numPoints = outerPoints.length

      // Build geometry
      const vertices: number[] = []
      const indices: number[] = []

      // Y levels
      const yTop = hT
      const yTopInner = doTop ? hT - cV : hT
      const yBottomInner = doBottom ? -hT + cV : -hT
      const yBottom = -hT

      // Add vertices for each level and track indices
      // Level 0: Top outer (if doTop) or top at outer dimensions
      // Level 1: Top inner (chamfer transition) or same as level 0
      // Level 2: Bottom inner (chamfer transition) or same as level 3
      // Level 3: Bottom outer (if doBottom) or bottom at outer dimensions

      const topOuter: number[] = []
      const topInner: number[] = []
      const bottomInner: number[] = []
      const bottomOuter: number[] = []

      for (let i = 0; i < numPoints; i++) {
        const [ox, oz] = outerPoints[i]
        const [ix, iz] = innerPoints[i]

        if (doTop) {
          topOuter.push(vertices.length / 3)
          vertices.push(ox, yTop, oz)
          topInner.push(vertices.length / 3)
          vertices.push(ix, yTopInner, iz)
        } else {
          topOuter.push(vertices.length / 3)
          vertices.push(ox, yTop, oz)
          topInner.push(topOuter[topOuter.length - 1]) // Same vertex
        }

        if (doBottom) {
          bottomInner.push(vertices.length / 3)
          vertices.push(ox, yBottomInner, oz)
          bottomOuter.push(vertices.length / 3)
          vertices.push(ix, yBottom, iz)
        } else {
          bottomInner.push(vertices.length / 3)
          vertices.push(ox, yBottom, oz)
          bottomOuter.push(bottomInner[bottomInner.length - 1]) // Same vertex
        }
      }

      // Create side faces (quads as two triangles)
      for (let i = 0; i < numPoints; i++) {
        const next = (i + 1) % numPoints

        // Top chamfer face (if doTop)
        if (doTop) {
          indices.push(topOuter[i], topOuter[next], topInner[next])
          indices.push(topOuter[i], topInner[next], topInner[i])
        }

        // Vertical side face
        const sideTop = doTop ? topInner : topOuter
        const sideBottom = doBottom ? bottomInner : bottomOuter
        indices.push(sideTop[i], sideTop[next], sideBottom[next])
        indices.push(sideTop[i], sideBottom[next], sideBottom[i])

        // Bottom chamfer face (if doBottom)
        if (doBottom) {
          indices.push(bottomInner[i], bottomInner[next], bottomOuter[next])
          indices.push(bottomInner[i], bottomOuter[next], bottomOuter[i])
        }
      }

      // Top surface - use ShapeGeometry for triangulation
      const topShape = doTop
        ? createRoundedRectShape(innerHL, innerHW, innerR)
        : createRoundedRectShape(hL, hW, r)
      const topGeo = new THREE.ShapeGeometry(topShape, 8)
      const topPositions = topGeo.attributes.position
      const topIndices = topGeo.index!
      const topY = doTop ? yTopInner : yTop
      const topBaseIndex = vertices.length / 3

      for (let i = 0; i < topPositions.count; i++) {
        vertices.push(topPositions.getX(i), topY, topPositions.getY(i))
      }
      for (let i = 0; i < topIndices.count; i++) {
        indices.push(topBaseIndex + topIndices.getX(i))
      }

      // Bottom surface
      const bottomShape = doBottom
        ? createRoundedRectShape(innerHL, innerHW, innerR)
        : createRoundedRectShape(hL, hW, r)
      const bottomGeo = new THREE.ShapeGeometry(bottomShape, 8)
      const bottomPositions = bottomGeo.attributes.position
      const bottomIndices = bottomGeo.index!
      const bottomY = yBottom
      const bottomBaseIndex = vertices.length / 3

      for (let i = 0; i < bottomPositions.count; i++) {
        vertices.push(bottomPositions.getX(i), bottomY, bottomPositions.getY(i))
      }
      // Reverse winding for bottom face
      for (let i = 0; i < bottomIndices.count; i += 3) {
        indices.push(bottomBaseIndex + bottomIndices.getX(i))
        indices.push(bottomBaseIndex + bottomIndices.getX(i + 2))
        indices.push(bottomBaseIndex + bottomIndices.getX(i + 1))
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      geo.setIndex(indices)
      geo.computeVertexNormals()

      topGeo.dispose()
      bottomGeo.dispose()

      return geo
    } else {
      // No chamfer - simple rounded rect extrusion
      const shape = createRoundedRectShape(hL, hW, r)
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: false,
        curveSegments: 8
      })
      geo.rotateX(-Math.PI / 2)
      geo.translate(0, -thickness / 2, 0)
      return geo
    }
  }

  // For square corners, use manual BufferGeometry (existing code)
  const hT = thickness / 2
  const actualCv = cV
  const actualCh = cH

  const vertices: number[] = []
  const indices: number[] = []

  function addQuad(v0: number[], v1: number[], v2: number[], v3: number[]) {
    const baseIndex = vertices.length / 3
    vertices.push(...v0, ...v1, ...v2, ...v3)
    indices.push(baseIndex, baseIndex + 1, baseIndex + 2)
    indices.push(baseIndex, baseIndex + 2, baseIndex + 3)
  }

  const yTopOuter = hT
  const yTopInner = doTop ? hT - actualCv : hT
  const yBottomInner = doBottom ? -hT + actualCv : -hT
  const yBottomOuter = -hT

  const outerX = hL
  const outerZ = hW
  const topInsetX = doTop ? hL - actualCh : hL
  const topInsetZ = doTop ? hW - actualCh : hW
  const bottomInsetX = doBottom ? hL - actualCh : hL
  const bottomInsetZ = doBottom ? hW - actualCh : hW

  // TOP SURFACE
  if (doTop) {
    addQuad(
      [-topInsetX, yTopInner, -topInsetZ],
      [topInsetX, yTopInner, -topInsetZ],
      [topInsetX, yTopInner, topInsetZ],
      [-topInsetX, yTopInner, topInsetZ]
    )
  } else {
    addQuad(
      [-outerX, yTopOuter, -outerZ],
      [outerX, yTopOuter, -outerZ],
      [outerX, yTopOuter, outerZ],
      [-outerX, yTopOuter, outerZ]
    )
  }

  // BOTTOM SURFACE
  if (doBottom) {
    addQuad(
      [-bottomInsetX, yBottomOuter, bottomInsetZ],
      [bottomInsetX, yBottomOuter, bottomInsetZ],
      [bottomInsetX, yBottomOuter, -bottomInsetZ],
      [-bottomInsetX, yBottomOuter, -bottomInsetZ]
    )
  } else {
    addQuad(
      [-outerX, yBottomOuter, outerZ],
      [outerX, yBottomOuter, outerZ],
      [outerX, yBottomOuter, -outerZ],
      [-outerX, yBottomOuter, -outerZ]
    )
  }

  // TOP CHAMFER FACES
  if (doTop) {
    addQuad([-outerX, yTopOuter, -outerZ], [outerX, yTopOuter, -outerZ], [topInsetX, yTopInner, -topInsetZ], [-topInsetX, yTopInner, -topInsetZ])
    addQuad([outerX, yTopOuter, outerZ], [-outerX, yTopOuter, outerZ], [-topInsetX, yTopInner, topInsetZ], [topInsetX, yTopInner, topInsetZ])
    addQuad([-outerX, yTopOuter, outerZ], [-outerX, yTopOuter, -outerZ], [-topInsetX, yTopInner, -topInsetZ], [-topInsetX, yTopInner, topInsetZ])
    addQuad([outerX, yTopOuter, -outerZ], [outerX, yTopOuter, outerZ], [topInsetX, yTopInner, topInsetZ], [topInsetX, yTopInner, -topInsetZ])
  }

  // BOTTOM CHAMFER FACES
  if (doBottom) {
    addQuad([-outerX, yBottomInner, -outerZ], [-bottomInsetX, yBottomOuter, -bottomInsetZ], [bottomInsetX, yBottomOuter, -bottomInsetZ], [outerX, yBottomInner, -outerZ])
    addQuad([outerX, yBottomInner, outerZ], [bottomInsetX, yBottomOuter, bottomInsetZ], [-bottomInsetX, yBottomOuter, bottomInsetZ], [-outerX, yBottomInner, outerZ])
    addQuad([-outerX, yBottomInner, outerZ], [-bottomInsetX, yBottomOuter, bottomInsetZ], [-bottomInsetX, yBottomOuter, -bottomInsetZ], [-outerX, yBottomInner, -outerZ])
    addQuad([outerX, yBottomInner, -outerZ], [bottomInsetX, yBottomOuter, -bottomInsetZ], [bottomInsetX, yBottomOuter, bottomInsetZ], [outerX, yBottomInner, outerZ])
  }

  // VERTICAL SIDE FACES
  const sideTopY = yTopInner
  const sideBottomY = yBottomInner

  addQuad([-outerX, sideTopY, -outerZ], [-outerX, sideBottomY, -outerZ], [outerX, sideBottomY, -outerZ], [outerX, sideTopY, -outerZ])
  addQuad([outerX, sideTopY, outerZ], [outerX, sideBottomY, outerZ], [-outerX, sideBottomY, outerZ], [-outerX, sideTopY, outerZ])
  addQuad([-outerX, sideTopY, outerZ], [-outerX, sideBottomY, outerZ], [-outerX, sideBottomY, -outerZ], [-outerX, sideTopY, -outerZ])
  addQuad([outerX, sideTopY, -outerZ], [outerX, sideBottomY, -outerZ], [outerX, sideBottomY, outerZ], [outerX, sideTopY, outerZ])

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()

  return geo
}

/**
 * Create edge line points for chamfered geometry
 */
function createChamferEdgePoints(
  length: number,
  width: number,
  thickness: number,
  chamferEdge: ChamferEdge,
  chamferSize: number,
  chamferAngle: number
): { topRect: [number, number, number][], bottomRect: [number, number, number][], chamferLines: [number, number, number][][] } {
  const hL = length / 2
  const hW = width / 2
  const hT = thickness / 2

  // chamferSize is the vertical distance
  const angleRad = (chamferAngle * Math.PI) / 180
  const cV = Math.min(chamferSize, thickness)
  const actualCh = cV / Math.tan(angleRad)

  const doTop = chamferEdge === 'top' || chamferEdge === 'both'
  const doBottom = chamferEdge === 'bottom' || chamferEdge === 'both'

  // Y levels
  const yTopOuter = hT
  const yTopInner = doTop ? hT - cV : hT
  const yBottomInner = doBottom ? -hT + cV : -hT
  const yBottomOuter = -hT

  // Inset dimensions
  const topInsetX = doTop ? hL - actualCh : hL
  const topInsetZ = doTop ? hW - actualCh : hW
  const bottomInsetX = doBottom ? hL - actualCh : hL
  const bottomInsetZ = doBottom ? hW - actualCh : hW

  // Top rectangle - the usable top surface
  const topRect: [number, number, number][] = doTop ? [
    [-topInsetX, yTopInner, -topInsetZ],
    [topInsetX, yTopInner, -topInsetZ],
    [topInsetX, yTopInner, topInsetZ],
    [-topInsetX, yTopInner, topInsetZ],
    [-topInsetX, yTopInner, -topInsetZ]
  ] : [
    [-hL, yTopOuter, -hW],
    [hL, yTopOuter, -hW],
    [hL, yTopOuter, hW],
    [-hL, yTopOuter, hW],
    [-hL, yTopOuter, -hW]
  ]

  // Bottom rectangle - the bottom surface
  const bottomRect: [number, number, number][] = doBottom ? [
    [-bottomInsetX, yBottomOuter, -bottomInsetZ],
    [bottomInsetX, yBottomOuter, -bottomInsetZ],
    [bottomInsetX, yBottomOuter, bottomInsetZ],
    [-bottomInsetX, yBottomOuter, bottomInsetZ],
    [-bottomInsetX, yBottomOuter, -bottomInsetZ]
  ] : [
    [-hL, yBottomOuter, -hW],
    [hL, yBottomOuter, -hW],
    [hL, yBottomOuter, hW],
    [-hL, yBottomOuter, hW],
    [-hL, yBottomOuter, -hW]
  ]

  const chamferLines: [number, number, number][][] = []

  // Vertical corner edges (at outer dimensions, between chamfer levels)
  chamferLines.push([[-hL, yTopInner, -hW], [-hL, yBottomInner, -hW]])
  chamferLines.push([[hL, yTopInner, -hW], [hL, yBottomInner, -hW]])
  chamferLines.push([[hL, yTopInner, hW], [hL, yBottomInner, hW]])
  chamferLines.push([[-hL, yTopInner, hW], [-hL, yBottomInner, hW]])

  if (doTop) {
    // Outer top edge rectangle (at very top)
    const outerTopRect: [number, number, number][] = [
      [-hL, yTopOuter, -hW],
      [hL, yTopOuter, -hW],
      [hL, yTopOuter, hW],
      [-hL, yTopOuter, hW],
      [-hL, yTopOuter, -hW]
    ]
    chamferLines.push(outerTopRect)
  }

  // Note: No outer bottom rect for bottom chamfer - the outer corners don't exist
  // (the chamfer cuts them off, leaving only the inset bottom face)

  return { topRect, bottomRect, chamferLines }
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
  chamferAngle = 45,
  style
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

  // Create outline points for explicit edge lines (rounded corners)
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

  // Create edge lines for chamfered geometry
  const chamferEdgeData = useMemo(() => {
    if (edgeProfile !== 'chamfered' || chamferSize <= 0) {
      return null
    }
    return createChamferEdgePoints(length, width, thickness, chamferEdge, chamferSize, chamferAngle)
  }, [length, width, thickness, edgeProfile, chamferEdge, chamferSize, chamferAngle])

  const hasRoundedCorners = cornerRadius && cornerRadius > 0
  const hasChamfer = edgeProfile === 'chamfered' && chamferSize > 0

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
        {/* Auto-edges for: simple box OR rounded corners with chamfer */}
        {(!hasRoundedCorners && !hasChamfer) && <Edges threshold={15} color="#8B7355" />}
        {(hasRoundedCorners && hasChamfer) && <Edges threshold={15} color="#8B7355" />}
      </mesh>

      {/* Explicit edge lines for rounded corners WITHOUT chamfer */}
      {hasRoundedCorners && !hasChamfer && topOutline && (
        <>
          <Line points={topOutline} color="#8B7355" lineWidth={1} />
          <Line points={bottomOutline!} color="#8B7355" lineWidth={1} />
          {verticalEdges!.map((edge, i) => (
            <Line key={i} points={edge} color="#8B7355" lineWidth={1} />
          ))}
        </>
      )}

      {/* Explicit edge lines for chamfered geometry WITHOUT rounded corners */}
      {hasChamfer && !hasRoundedCorners && chamferEdgeData && (
        <>
          <Line points={chamferEdgeData.topRect} color="#8B7355" lineWidth={1} />
          <Line points={chamferEdgeData.bottomRect} color="#8B7355" lineWidth={1} />
          {chamferEdgeData.chamferLines.map((line, i) => (
            <Line key={`chamfer-${i}`} points={line} color="#8B7355" lineWidth={1} />
          ))}
        </>
      )}

      {/* "Jeremy" text on Shaker table top */}
      {style === 'shaker' && (
        <Text
          position={[0, thickness / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={Math.min(length, width) * 0.12}
          color="#4A3728"
          anchorX="center"
          anchorY="middle"
        >
          Jeremy
        </Text>
      )}
    </group>
  )
}
