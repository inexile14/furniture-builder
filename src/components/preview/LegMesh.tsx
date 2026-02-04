/**
 * Parametric Table Builder - Leg Mesh Component
 * Supports square, tapered, turned, and splayed legs
 */

import { useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import type { LegParams, LegPosition } from '../../types'

interface LegMeshProps {
  position: LegPosition
  x: number
  z: number
  legParams: LegParams
  height: number
  color: string
  yOffset?: number  // Additional Y offset for splayed legs to raise top to meet tabletop
}

export default function LegMesh({ position, x, z, legParams, height, color, yOffset = 0 }: LegMeshProps) {
  // Animation
  const spring = useSpring({
    position: [x, height / 2 + yOffset, z] as [number, number, number],
    config: { mass: 1, tension: 180, friction: 20 }
  })

  // Create geometry based on leg style
  const geometry = useMemo(() => {
    const { style, thickness } = legParams

    switch (style) {
      case 'tapered': {
        return createTaperedLegGeometry(
          thickness,
          legParams.taperEndDimension || thickness * 0.65,
          height,
          legParams.taperStartFromTop || 6,
          legParams.taperSides || 'inside',
          position
        )
      }

      case 'turned': {
        return createTurnedLegGeometry(
          thickness,
          legParams.minDiameter || thickness * 0.5,
          height,
          legParams.pommelLength || 6
        )
      }

      case 'splayed': {
        // Splayed legs need special geometry with horizontal top/bottom faces
        return createSplayedLegGeometry(
          thickness,
          legParams.taperEndDimension || thickness * 0.6,
          height,
          legParams.splayAngle || 8,
          position
        )
      }

      case 'square':
      default: {
        const chamferSize = legParams.chamferSize || legParams.chamfer || 0
        const chamferFoot = legParams.chamferFoot || false
        return createSquareLegGeometry(thickness, height, chamferSize, chamferFoot)
      }
    }
  }, [legParams, height, position])

  // Calculate rotation for splayed legs
  const rotation = useMemo(() => {
    if (legParams.style !== 'splayed' || !legParams.splayAngle) {
      return [0, 0, 0] as [number, number, number]
    }

    const splayRad = (legParams.splayAngle * Math.PI) / 180
    // Legs splay outward toward corners
    // X rotation: positive = tilt forward, negative = tilt backward
    // Z rotation: positive = tilt right, negative = tilt left
    const rotations: Record<LegPosition, [number, number, number]> = {
      FL: [splayRad, 0, -splayRad],   // Forward + left
      FR: [splayRad, 0, splayRad],    // Forward + right
      BL: [-splayRad, 0, -splayRad],  // Backward + left
      BR: [-splayRad, 0, splayRad]    // Backward + right
    }

    return rotations[position]
  }, [legParams.style, legParams.splayAngle, position])

  // Create edges geometry for visible outlines
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  return (
    <animated.group position={spring.position} rotation={rotation}>
      <mesh geometry={geometry} castShadow receiveShadow>
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
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#5C4A3A" />
      </lineSegments>
    </animated.group>
  )
}

/**
 * Create tapered leg geometry with FLAT faces
 *
 * The leg is a rectangular prism that:
 * - Starts at full size (topSize x topSize) at the top
 * - Stays full size for taperStart distance from top
 * - Tapers linearly to bottomSize x bottomSize at the bottom
 *
 * For 'inside' taper: only the two inside faces taper (traditional Shaker)
 * For 'all' taper: all four faces taper
 */
function createTaperedLegGeometry(
  topSize: number,
  bottomSize: number,
  height: number,
  taperStart: number,
  taperSides: 'inside' | 'all',
  position: LegPosition
): THREE.BufferGeometry {
  const t = topSize / 2    // half of top size
  const b = bottomSize / 2 // half of bottom size

  // Y coordinates (centered around 0)
  const yTop = height / 2
  const yTaper = height / 2 - taperStart  // where taper begins
  const yBottom = -height / 2

  // For 4-sided taper, all corners move inward equally
  // For 2-sided taper, only inside corners move

  let corners: {
    top: { v0: [number, number], v1: [number, number], v2: [number, number], v3: [number, number] },
    taper: { v0: [number, number], v1: [number, number], v2: [number, number], v3: [number, number] },
    bottom: { v0: [number, number], v1: [number, number], v2: [number, number], v3: [number, number] }
  }

  if (taperSides === 'all') {
    // All corners taper equally
    corners = {
      top:    { v0: [-t, -t], v1: [t, -t], v2: [t, t], v3: [-t, t] },
      taper:  { v0: [-t, -t], v1: [t, -t], v2: [t, t], v3: [-t, t] },
      bottom: { v0: [-b, -b], v1: [b, -b], v2: [b, b], v3: [-b, b] }
    }
  } else {
    // 2-sided taper: determine which corner is "inside" based on leg position
    // Inside corner tapers, other corners stay at full size
    // FL: inside is +X, +Z (v2)
    // FR: inside is -X, +Z (v3)
    // BL: inside is +X, -Z (v1)
    // BR: inside is -X, -Z (v0)

    const insideCorner = {
      FL: 2, // +X, +Z
      FR: 3, // -X, +Z
      BL: 1, // +X, -Z
      BR: 0  // -X, -Z
    }[position]

    // For 2-sided taper, the inside corner and its two adjacent edges taper
    // This means two faces taper (the two inside faces)
    corners = {
      top:    { v0: [-t, -t], v1: [t, -t], v2: [t, t], v3: [-t, t] },
      taper:  { v0: [-t, -t], v1: [t, -t], v2: [t, t], v3: [-t, t] },
      bottom: { v0: [-t, -t], v1: [t, -t], v2: [t, t], v3: [-t, t] }
    }

    // Move the inside corner inward at the bottom
    if (insideCorner === 0) {
      corners.bottom.v0 = [-b, -b]
      corners.bottom.v1 = [t, -b]  // edge toward v1 tapers in Z
      corners.bottom.v3 = [-b, t]  // edge toward v3 tapers in X
    } else if (insideCorner === 1) {
      corners.bottom.v1 = [b, -b]
      corners.bottom.v0 = [-t, -b] // edge toward v0 tapers in Z
      corners.bottom.v2 = [b, t]   // edge toward v2 tapers in X
    } else if (insideCorner === 2) {
      corners.bottom.v2 = [b, b]
      corners.bottom.v1 = [b, -t]  // edge toward v1 tapers in Z
      corners.bottom.v3 = [-t, b]  // edge toward v3 tapers in X
    } else { // insideCorner === 3
      corners.bottom.v3 = [-b, b]
      corners.bottom.v0 = [-b, -t] // edge toward v0 tapers in X
      corners.bottom.v2 = [t, b]   // edge toward v2 tapers in Z
    }
  }

  // Build geometry with separate vertices per face for flat shading
  const vertices: number[] = []
  const indices: number[] = []
  let vertexIndex = 0

  // Helper to add a quad (two triangles) with its own vertices
  function addQuad(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) {
    // Add 4 vertices
    vertices.push(...p0, ...p1, ...p2, ...p3)
    // Two triangles: 0-1-2 and 0-2-3
    indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2)
    indices.push(vertexIndex, vertexIndex + 2, vertexIndex + 3)
    vertexIndex += 4
  }

  // Top cap
  addQuad(
    [corners.top.v0[0], yTop, corners.top.v0[1]],
    [corners.top.v1[0], yTop, corners.top.v1[1]],
    [corners.top.v2[0], yTop, corners.top.v2[1]],
    [corners.top.v3[0], yTop, corners.top.v3[1]]
  )

  // Bottom cap (reverse winding)
  addQuad(
    [corners.bottom.v3[0], yBottom, corners.bottom.v3[1]],
    [corners.bottom.v2[0], yBottom, corners.bottom.v2[1]],
    [corners.bottom.v1[0], yBottom, corners.bottom.v1[1]],
    [corners.bottom.v0[0], yBottom, corners.bottom.v0[1]]
  )

  // Upper section sides (from top to taper start) - all straight
  // Front face (-Z)
  addQuad(
    [corners.top.v0[0], yTop, corners.top.v0[1]],
    [corners.taper.v0[0], yTaper, corners.taper.v0[1]],
    [corners.taper.v1[0], yTaper, corners.taper.v1[1]],
    [corners.top.v1[0], yTop, corners.top.v1[1]]
  )
  // Right face (+X)
  addQuad(
    [corners.top.v1[0], yTop, corners.top.v1[1]],
    [corners.taper.v1[0], yTaper, corners.taper.v1[1]],
    [corners.taper.v2[0], yTaper, corners.taper.v2[1]],
    [corners.top.v2[0], yTop, corners.top.v2[1]]
  )
  // Back face (+Z)
  addQuad(
    [corners.top.v2[0], yTop, corners.top.v2[1]],
    [corners.taper.v2[0], yTaper, corners.taper.v2[1]],
    [corners.taper.v3[0], yTaper, corners.taper.v3[1]],
    [corners.top.v3[0], yTop, corners.top.v3[1]]
  )
  // Left face (-X)
  addQuad(
    [corners.top.v3[0], yTop, corners.top.v3[1]],
    [corners.taper.v3[0], yTaper, corners.taper.v3[1]],
    [corners.taper.v0[0], yTaper, corners.taper.v0[1]],
    [corners.top.v0[0], yTop, corners.top.v0[1]]
  )

  // Lower section sides (from taper start to bottom) - tapered
  // Front face (-Z)
  addQuad(
    [corners.taper.v0[0], yTaper, corners.taper.v0[1]],
    [corners.bottom.v0[0], yBottom, corners.bottom.v0[1]],
    [corners.bottom.v1[0], yBottom, corners.bottom.v1[1]],
    [corners.taper.v1[0], yTaper, corners.taper.v1[1]]
  )
  // Right face (+X)
  addQuad(
    [corners.taper.v1[0], yTaper, corners.taper.v1[1]],
    [corners.bottom.v1[0], yBottom, corners.bottom.v1[1]],
    [corners.bottom.v2[0], yBottom, corners.bottom.v2[1]],
    [corners.taper.v2[0], yTaper, corners.taper.v2[1]]
  )
  // Back face (+Z)
  addQuad(
    [corners.taper.v2[0], yTaper, corners.taper.v2[1]],
    [corners.bottom.v2[0], yBottom, corners.bottom.v2[1]],
    [corners.bottom.v3[0], yBottom, corners.bottom.v3[1]],
    [corners.taper.v3[0], yTaper, corners.taper.v3[1]]
  )
  // Left face (-X)
  addQuad(
    [corners.taper.v3[0], yTaper, corners.taper.v3[1]],
    [corners.bottom.v3[0], yBottom, corners.bottom.v3[1]],
    [corners.bottom.v0[0], yBottom, corners.bottom.v0[1]],
    [corners.taper.v0[0], yTaper, corners.taper.v0[1]]
  )

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

/**
 * Create splayed leg geometry with horizontal top and bottom faces
 *
 * When a leg is rotated for splay, its top/bottom faces become angled.
 * This function pre-tilts the top/bottom faces in the opposite direction
 * so they end up horizontal after the rotation is applied.
 *
 * The adjustment for each vertex: Δy = -x * tan(θz) - z * tan(θx)
 * where θx is the X rotation and θz is the Z rotation for this leg position.
 */
function createSplayedLegGeometry(
  topSize: number,
  bottomSize: number,
  height: number,
  splayAngle: number,
  position: LegPosition
): THREE.BufferGeometry {
  const t = topSize / 2
  const b = bottomSize / 2
  const splayRad = (splayAngle * Math.PI) / 180

  // Determine rotation angles for this leg position
  // FL: [+θ, 0, -θ], FR: [+θ, 0, +θ], BL: [-θ, 0, -θ], BR: [-θ, 0, +θ]
  const rotations: Record<LegPosition, { θx: number; θz: number }> = {
    FL: { θx: splayRad, θz: -splayRad },
    FR: { θx: splayRad, θz: splayRad },
    BL: { θx: -splayRad, θz: -splayRad },
    BR: { θx: -splayRad, θz: splayRad }
  }
  const { θx, θz } = rotations[position]

  // Y adjustment function: compensate for rotation so faces end up horizontal
  // When rotated by R = Rz(θz) · Rx(θx), world Y = x·sin(θz) + y·cos(θx)·cos(θz) - z·sin(θx)·cos(θz)
  // For top face to be at constant world Y, local y must vary:
  // y_local ≈ Y_target - x·sin(θz) + z·sin(θx)  (for small angles)
  // So: Δy = -x·sin(θz) + z·sin(θx)
  const yAdjust = (x: number, z: number): number => {
    return -x * Math.sin(θz) + z * Math.sin(θx)
  }

  // Base Y coordinates
  const yTopBase = height / 2
  const yBottomBase = -height / 2

  // Corner positions in XZ plane
  // v0: (-X, -Z), v1: (+X, -Z), v2: (+X, +Z), v3: (-X, +Z)
  const topCorners = {
    v0: { x: -t, z: -t, y: yTopBase + yAdjust(-t, -t) },
    v1: { x: t, z: -t, y: yTopBase + yAdjust(t, -t) },
    v2: { x: t, z: t, y: yTopBase + yAdjust(t, t) },
    v3: { x: -t, z: t, y: yTopBase + yAdjust(-t, t) }
  }

  const bottomCorners = {
    v0: { x: -b, z: -b, y: yBottomBase + yAdjust(-b, -b) },
    v1: { x: b, z: -b, y: yBottomBase + yAdjust(b, -b) },
    v2: { x: b, z: b, y: yBottomBase + yAdjust(b, b) },
    v3: { x: -b, z: b, y: yBottomBase + yAdjust(-b, b) }
  }

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

  // Top cap (with Y adjustments for horizontal after rotation)
  addQuad(
    [topCorners.v0.x, topCorners.v0.y, topCorners.v0.z],
    [topCorners.v1.x, topCorners.v1.y, topCorners.v1.z],
    [topCorners.v2.x, topCorners.v2.y, topCorners.v2.z],
    [topCorners.v3.x, topCorners.v3.y, topCorners.v3.z]
  )

  // Bottom cap (with Y adjustments for horizontal after rotation)
  addQuad(
    [bottomCorners.v3.x, bottomCorners.v3.y, bottomCorners.v3.z],
    [bottomCorners.v2.x, bottomCorners.v2.y, bottomCorners.v2.z],
    [bottomCorners.v1.x, bottomCorners.v1.y, bottomCorners.v1.z],
    [bottomCorners.v0.x, bottomCorners.v0.y, bottomCorners.v0.z]
  )

  // Side faces connecting top to bottom
  // Front face (-Z)
  addQuad(
    [topCorners.v0.x, topCorners.v0.y, topCorners.v0.z],
    [bottomCorners.v0.x, bottomCorners.v0.y, bottomCorners.v0.z],
    [bottomCorners.v1.x, bottomCorners.v1.y, bottomCorners.v1.z],
    [topCorners.v1.x, topCorners.v1.y, topCorners.v1.z]
  )
  // Right face (+X)
  addQuad(
    [topCorners.v1.x, topCorners.v1.y, topCorners.v1.z],
    [bottomCorners.v1.x, bottomCorners.v1.y, bottomCorners.v1.z],
    [bottomCorners.v2.x, bottomCorners.v2.y, bottomCorners.v2.z],
    [topCorners.v2.x, topCorners.v2.y, topCorners.v2.z]
  )
  // Back face (+Z)
  addQuad(
    [topCorners.v2.x, topCorners.v2.y, topCorners.v2.z],
    [bottomCorners.v2.x, bottomCorners.v2.y, bottomCorners.v2.z],
    [bottomCorners.v3.x, bottomCorners.v3.y, bottomCorners.v3.z],
    [topCorners.v3.x, topCorners.v3.y, topCorners.v3.z]
  )
  // Left face (-X)
  addQuad(
    [topCorners.v3.x, topCorners.v3.y, topCorners.v3.z],
    [bottomCorners.v3.x, bottomCorners.v3.y, bottomCorners.v3.z],
    [bottomCorners.v0.x, bottomCorners.v0.y, bottomCorners.v0.z],
    [topCorners.v0.x, topCorners.v0.y, topCorners.v0.z]
  )

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

/**
 * Create square leg geometry with optional foot chamfer
 * Uses manual geometry when chamfered, BoxGeometry when not
 */
function createSquareLegGeometry(
  size: number,
  height: number,
  chamferSize: number = 0,
  chamferFoot: boolean = false
): THREE.BufferGeometry {
  // If no foot chamfer, use simple box
  if (!chamferFoot || chamferSize <= 0) {
    const box = new THREE.BoxGeometry(size, height, size)
    const geometry = box.toNonIndexed()
    geometry.computeVertexNormals()
    return geometry
  }

  // Create geometry with chamfered bottom edges
  const hS = size / 2  // half size
  const hH = height / 2  // half height
  const c = Math.min(chamferSize, hS, 1)  // chamfer size, capped

  const vertices: number[] = []
  const indices: number[] = []
  let idx = 0

  function addQuad(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) {
    vertices.push(...p0, ...p1, ...p2, ...p3)
    indices.push(idx, idx + 1, idx + 2)
    indices.push(idx, idx + 2, idx + 3)
    idx += 4
  }

  // Y levels
  const yTop = hH
  const yBottomChamfer = -hH + c  // Where chamfer starts
  const yBottom = -hH

  // Top face
  addQuad(
    [-hS, yTop, -hS], [hS, yTop, -hS], [hS, yTop, hS], [-hS, yTop, hS]
  )

  // Bottom face (inset by chamfer)
  addQuad(
    [-hS + c, yBottom, hS - c], [hS - c, yBottom, hS - c],
    [hS - c, yBottom, -hS + c], [-hS + c, yBottom, -hS + c]
  )

  // Side faces (from top to chamfer start)
  // Front (-Z)
  addQuad(
    [-hS, yTop, -hS], [-hS, yBottomChamfer, -hS],
    [hS, yBottomChamfer, -hS], [hS, yTop, -hS]
  )
  // Right (+X)
  addQuad(
    [hS, yTop, -hS], [hS, yBottomChamfer, -hS],
    [hS, yBottomChamfer, hS], [hS, yTop, hS]
  )
  // Back (+Z)
  addQuad(
    [hS, yTop, hS], [hS, yBottomChamfer, hS],
    [-hS, yBottomChamfer, hS], [-hS, yTop, hS]
  )
  // Left (-X)
  addQuad(
    [-hS, yTop, hS], [-hS, yBottomChamfer, hS],
    [-hS, yBottomChamfer, -hS], [-hS, yTop, -hS]
  )

  // Chamfer faces (4 sides, connecting outer edge to inset bottom)
  // Front chamfer
  addQuad(
    [-hS, yBottomChamfer, -hS], [-hS + c, yBottom, -hS + c],
    [hS - c, yBottom, -hS + c], [hS, yBottomChamfer, -hS]
  )
  // Right chamfer
  addQuad(
    [hS, yBottomChamfer, -hS], [hS - c, yBottom, -hS + c],
    [hS - c, yBottom, hS - c], [hS, yBottomChamfer, hS]
  )
  // Back chamfer
  addQuad(
    [hS, yBottomChamfer, hS], [hS - c, yBottom, hS - c],
    [-hS + c, yBottom, hS - c], [-hS, yBottomChamfer, hS]
  )
  // Left chamfer
  addQuad(
    [-hS, yBottomChamfer, hS], [-hS + c, yBottom, hS - c],
    [-hS + c, yBottom, -hS + c], [-hS, yBottomChamfer, -hS]
  )

  // Corner chamfer triangles (4 corners)
  function addTri(p0: [number, number, number], p1: [number, number, number], p2: [number, number, number]) {
    vertices.push(...p0, ...p1, ...p2)
    indices.push(idx, idx + 1, idx + 2)
    idx += 3
  }

  // Front-left corner
  addTri(
    [-hS, yBottomChamfer, -hS],
    [-hS, yBottomChamfer, -hS + c],
    [-hS + c, yBottom, -hS + c]
  )
  addTri(
    [-hS, yBottomChamfer, -hS],
    [-hS + c, yBottom, -hS + c],
    [-hS + c, yBottomChamfer, -hS]
  )

  // Front-right corner
  addTri(
    [hS, yBottomChamfer, -hS],
    [hS - c, yBottom, -hS + c],
    [hS, yBottomChamfer, -hS + c]
  )
  addTri(
    [hS, yBottomChamfer, -hS],
    [hS - c, yBottomChamfer, -hS],
    [hS - c, yBottom, -hS + c]
  )

  // Back-right corner
  addTri(
    [hS, yBottomChamfer, hS],
    [hS, yBottomChamfer, hS - c],
    [hS - c, yBottom, hS - c]
  )
  addTri(
    [hS, yBottomChamfer, hS],
    [hS - c, yBottom, hS - c],
    [hS - c, yBottomChamfer, hS]
  )

  // Back-left corner
  addTri(
    [-hS, yBottomChamfer, hS],
    [-hS + c, yBottom, hS - c],
    [-hS, yBottomChamfer, hS - c]
  )
  addTri(
    [-hS, yBottomChamfer, hS],
    [-hS + c, yBottomChamfer, hS],
    [-hS + c, yBottom, hS - c]
  )

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

/**
 * Create turned leg geometry using lathe
 */
function createTurnedLegGeometry(
  maxDiameter: number,
  minDiameter: number,
  height: number,
  pommelLength: number
): THREE.BufferGeometry {
  const segments = 16
  const heightSegments = 32

  const points: THREE.Vector2[] = []

  for (let i = 0; i <= heightSegments; i++) {
    const t = i / heightSegments
    const y = (t - 0.5) * height

    let radius: number
    const distFromTop = (0.5 - t) * height + height / 2

    if (distFromTop < pommelLength) {
      radius = maxDiameter / 2
    } else {
      const turnedT = (distFromTop - pommelLength) / (height - pommelLength)
      const swellPoint = 0.25
      const minPoint = 0.75

      if (turnedT < swellPoint) {
        const localT = turnedT / swellPoint
        radius = (maxDiameter / 2) * (1 - 0.1 * localT)
      } else if (turnedT < minPoint) {
        const localT = (turnedT - swellPoint) / (minPoint - swellPoint)
        radius = maxDiameter / 2 * 0.9 - (maxDiameter / 2 * 0.9 - minDiameter / 2) * localT
      } else {
        const localT = (turnedT - minPoint) / (1 - minPoint)
        radius = minDiameter / 2 * (1 + 0.2 * Math.sin(localT * Math.PI))
      }
    }

    points.push(new THREE.Vector2(radius, y))
  }

  return new THREE.LatheGeometry(points, segments)
}
