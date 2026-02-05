/**
 * Parametric Table Builder - Apron Mesh Component
 * Supports compound angle cuts for splayed legs
 * Includes integrated tenon geometry when joinery is enabled
 */

import { useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import type { ApronProfile, ApronPosition } from '../../types'
import type { CalculatedJoinery } from '../../types/joinery'

interface LegFaceNormals {
  left: THREE.Vector3   // Normal of leg face at left end (local -X)
  right: THREE.Vector3  // Normal of leg face at right end (local +X)
}

interface TenonParams {
  thickness: number
  width: number
  length: number
  shoulderWidth: number
}

interface ApronMeshProps {
  position: ApronPosition
  length: number
  height: number
  thickness: number
  x: number
  y: number
  z: number
  explosionOffset: number
  color: string
  profile: ApronProfile
  rotateY?: number
  splayAngle?: number  // Leg splay angle in degrees (fallback if no normals)
  legFaceNormals?: LegFaceNormals  // Actual leg face normals for precise mating
  // Joinery props
  showTenons?: boolean
  calculatedJoinery?: CalculatedJoinery
  // Render style
  opacity?: number
}

export default function ApronMesh({
  position,
  length,
  height,
  thickness,
  x,
  y,
  z,
  explosionOffset,
  color,
  profile,
  rotateY = 0,
  splayAngle = 0,
  legFaceNormals,
  showTenons = false,
  calculatedJoinery,
  opacity = 1
}: ApronMeshProps) {
  // Calculate explosion direction based on position
  const explosionDir = useMemo(() => {
    switch (position) {
      case 'front': return { x: 0, z: -1 }
      case 'back': return { x: 0, z: 1 }
      case 'left': return { x: -1, z: 0 }
      case 'right': return { x: 1, z: 0 }
    }
  }, [position])

  // Animation
  const spring = useSpring({
    position: [
      x + explosionDir.x * Math.abs(explosionOffset),
      y,
      z + explosionDir.z * Math.abs(explosionOffset)
    ] as [number, number, number],
    config: { mass: 1, tension: 180, friction: 20 }
  })

  // Create tenon parameters from calculated joinery
  const tenonParams: TenonParams | null = useMemo(() => {
    if (!showTenons || !calculatedJoinery) return null
    return {
      thickness: calculatedJoinery.tenonThickness,
      width: calculatedJoinery.tenonWidth,
      length: calculatedJoinery.tenonLength,
      shoulderWidth: calculatedJoinery.shoulderWidth
    }
  }, [showTenons, calculatedJoinery])

  // Create geometry based on profile and splay angle
  const geometry = useMemo(() => {
    // If no splay angle and no leg face normals, use standard geometry
    if ((!splayAngle || splayAngle <= 0) && !legFaceNormals) {
      if (profile === 'straight') {
        return createApronWithTenons(length, height, thickness, tenonParams)
      }
      return createProfiledGeometry(length, height, thickness, profile)
    }

    // For splayed legs, create compound angle geometry using leg face normals
    return createCompoundAngleGeometry(length, height, thickness, position, profile, rotateY, legFaceNormals, tenonParams)
  }, [length, height, thickness, profile, position, rotateY, legFaceNormals, splayAngle, tenonParams])

  // Create edges geometry for visible outlines
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  return (
    <animated.group position={spring.position} rotation={[0, rotateY, 0]}>
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
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#5C4A3A" />
      </lineSegments>
    </animated.group>
  )
}

/**
 * Create apron geometry with integrated tenons at each end
 */
function createApronWithTenons(
  length: number,
  height: number,
  thickness: number,
  tenonParams: TenonParams | null
): THREE.BufferGeometry {
  if (!tenonParams) {
    return new THREE.BoxGeometry(length, height, thickness)
  }

  const { thickness: tenonThick, width: tenonWidth, length: tenonLength, shoulderWidth } = tenonParams

  // Create a merged geometry with apron body + two tenons
  const geometries: THREE.BufferGeometry[] = []

  // Main apron body
  const apronGeo = new THREE.BoxGeometry(length, height, thickness)
  geometries.push(apronGeo)

  // Left tenon (extends in -X direction from left end of apron)
  const leftTenonGeo = new THREE.BoxGeometry(tenonLength, tenonWidth, tenonThick)
  // Position: centered at left end of apron, extending outward
  // X: -length/2 - tenonLength/2 (sticking out from left end)
  // Y: 0 (vertically centered, tenon is shorter than apron by 2*shoulderWidth)
  // Z: 0 (centered on apron thickness)
  leftTenonGeo.translate(-length / 2 - tenonLength / 2, 0, 0)
  geometries.push(leftTenonGeo)

  // Right tenon (extends in +X direction from right end of apron)
  const rightTenonGeo = new THREE.BoxGeometry(tenonLength, tenonWidth, tenonThick)
  rightTenonGeo.translate(length / 2 + tenonLength / 2, 0, 0)
  geometries.push(rightTenonGeo)

  // Merge all geometries
  const mergedGeo = mergeBufferGeometries(geometries)
  return mergedGeo
}

/**
 * Simple geometry merge function
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  let indexOffset = 0

  for (const geo of geometries) {
    const posAttr = geo.getAttribute('position')
    const posArray = posAttr.array as Float32Array

    // Add positions
    for (let i = 0; i < posArray.length; i++) {
      positions.push(posArray[i])
    }

    // Add indices with offset
    const geoIndex = geo.getIndex()
    if (geoIndex) {
      const indexArray = geoIndex.array as Uint16Array | Uint32Array
      for (let i = 0; i < indexArray.length; i++) {
        indices.push(indexArray[i] + indexOffset)
      }
    } else {
      // Non-indexed geometry - create indices
      const vertCount = posAttr.count
      for (let i = 0; i < vertCount; i++) {
        indices.push(i + indexOffset)
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

/**
 * Create profiled geometry (arched, scalloped) without compound angles
 */
function createProfiledGeometry(
  length: number,
  height: number,
  thickness: number,
  profile: ApronProfile
): THREE.BufferGeometry {
  if (profile === 'arched') {
    const shape = new THREE.Shape()
    const archHeight = height * 0.15

    shape.moveTo(-length / 2, height / 2)
    shape.lineTo(length / 2, height / 2)
    shape.lineTo(length / 2, -height / 2 + archHeight)
    shape.quadraticCurveTo(0, -height / 2 - archHeight * 0.5, -length / 2, -height / 2 + archHeight)
    shape.lineTo(-length / 2, height / 2)

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.translate(0, 0, -thickness / 2)
    return geo
  }

  if (profile === 'scalloped') {
    const shape = new THREE.Shape()
    const scallops = 3
    const scallopWidth = length / scallops
    const scallopDepth = height * 0.1

    shape.moveTo(-length / 2, height / 2)
    shape.lineTo(length / 2, height / 2)
    shape.lineTo(length / 2, -height / 2 + scallopDepth)

    for (let i = scallops - 1; i >= 0; i--) {
      const startX = -length / 2 + (i + 1) * scallopWidth
      const endX = -length / 2 + i * scallopWidth
      const midX = (startX + endX) / 2
      shape.quadraticCurveTo(midX, -height / 2 - scallopDepth, endX, -height / 2 + scallopDepth)
    }

    shape.lineTo(-length / 2, height / 2)

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.translate(0, 0, -thickness / 2)
    return geo
  }

  // Default to box
  return new THREE.BoxGeometry(length, height, thickness)
}

/**
 * Create compound angle geometry for aprons meeting splayed legs.
 * Uses actual leg face normals to ensure perfect alignment.
 *
 * The key insight: given the leg face normal, we compute where each
 * apron end vertex should be so the end face lies on the same plane
 * as the leg face.
 */
function createCompoundAngleGeometry(
  length: number,
  height: number,
  thickness: number,
  _position: ApronPosition,
  _profile: ApronProfile,
  rotateY: number,
  legFaceNormals?: { left: THREE.Vector3; right: THREE.Vector3 },
  tenonParams?: TenonParams | null
): THREE.BufferGeometry {
  const halfLength = length / 2
  const halfHeight = height / 2
  const halfThickness = thickness / 2

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

  /**
   * Compute X shift for a point (y, z) on an end face to lie on a plane
   * defined by a normal vector. The plane passes through the nominal end position.
   *
   * For a face with world-space normal N, we first transform to apron-local coords
   * (accounting for rotateY), then solve the plane equation for X.
   */
  function computeXShift(
    worldNormal: THREE.Vector3,
    localY: number,
    localZ: number,
    _isRightEnd: boolean
  ): number {
    // Transform world normal to apron-local coords
    // rotateY means: local coords = Ry(-rotateY) * world coords
    const cosR = Math.cos(-rotateY)
    const sinR = Math.sin(-rotateY)

    // Ry(-rotateY) * worldNormal
    const localNx = worldNormal.x * cosR + worldNormal.z * sinR
    const localNy = worldNormal.y
    const localNz = -worldNormal.x * sinR + worldNormal.z * cosR

    // The apron end face should have the OPPOSITE normal (facing toward the leg)
    // So we negate: apronNormal = -localNormal
    // But for computing the shift, we use the leg face normal direction

    // Plane equation: Nx*x + Ny*y + Nz*z = d
    // At the nominal end (x = ±halfLength, y = 0, z = 0), d = Nx * (±halfLength)
    // For other (y, z), solve for x:
    // x = (d - Ny*y - Nz*z) / Nx = ±halfLength - (Ny*y + Nz*z) / Nx

    // The shift from nominal is: -(Ny*y + Nz*z) / Nx
    if (Math.abs(localNx) < 0.001) {
      // Normal is nearly perpendicular to X - no meaningful shift
      return 0
    }

    // The plane equation gives us the X position for a given (y, z)
    // Shift = -(Ny*y + Nz*z) / Nx
    // The sign depends on which direction the normal points
    const shift = -(localNy * localY + localNz * localZ) / localNx
    return shift
  }

  // Default to no shift if no normals provided
  let LTF_shift = 0, LTB_shift = 0, LBF_shift = 0, LBB_shift = 0
  let RTF_shift = 0, RTB_shift = 0, RBF_shift = 0, RBB_shift = 0

  if (legFaceNormals) {
    // Left end (local -X) meets the leg specified by legFaceNormals.left
    LTF_shift = computeXShift(legFaceNormals.left, halfHeight, -halfThickness, false)
    LTB_shift = computeXShift(legFaceNormals.left, halfHeight, halfThickness, false)
    LBF_shift = computeXShift(legFaceNormals.left, -halfHeight, -halfThickness, false)
    LBB_shift = computeXShift(legFaceNormals.left, -halfHeight, halfThickness, false)

    // Right end (local +X) meets the leg specified by legFaceNormals.right
    RTF_shift = computeXShift(legFaceNormals.right, halfHeight, -halfThickness, true)
    RTB_shift = computeXShift(legFaceNormals.right, halfHeight, halfThickness, true)
    RBF_shift = computeXShift(legFaceNormals.right, -halfHeight, -halfThickness, true)
    RBB_shift = computeXShift(legFaceNormals.right, -halfHeight, halfThickness, true)
  }

  // Define the 8 corners
  // Left end (local -X)
  const LTF: [number, number, number] = [-halfLength + LTF_shift, halfHeight, -halfThickness]
  const LTB: [number, number, number] = [-halfLength + LTB_shift, halfHeight, halfThickness]
  const LBF: [number, number, number] = [-halfLength + LBF_shift, -halfHeight, -halfThickness]
  const LBB: [number, number, number] = [-halfLength + LBB_shift, -halfHeight, halfThickness]

  // Right end (local +X)
  const RTF: [number, number, number] = [halfLength + RTF_shift, halfHeight, -halfThickness]
  const RTB: [number, number, number] = [halfLength + RTB_shift, halfHeight, halfThickness]
  const RBF: [number, number, number] = [halfLength + RBF_shift, -halfHeight, -halfThickness]
  const RBB: [number, number, number] = [halfLength + RBB_shift, -halfHeight, halfThickness]

  // Build the 6 faces of the main apron body
  addQuad(LTB, LTF, RTF, RTB)  // Top
  addQuad(LBF, LBB, RBB, RBF)  // Bottom
  addQuad(LBF, RBF, RTF, LTF)  // Front
  addQuad(RBB, LBB, LTB, RTB)  // Back
  addQuad(LBB, LBF, LTF, LTB)  // Left end
  addQuad(RBF, RBB, RTB, RTF)  // Right end

  // Add tenons if enabled
  if (tenonParams) {
    const { thickness: tenonThick, width: tenonWidth, length: tenonLength } = tenonParams
    const halfTenonWidth = tenonWidth / 2
    const halfTenonThick = tenonThick / 2

    // Left tenon - extends from left end face in -X direction
    // Use the innermost X position (maximum X, closest to table center) so tenon overlaps into apron body
    const leftOuterX = Math.max(LTF[0], LTB[0], LBF[0], LBB[0])
    const leftCenterY = (LTF[1] + LTB[1] + LBF[1] + LBB[1]) / 4
    const leftCenterZ = (LTF[2] + LTB[2] + LBF[2] + LBB[2]) / 4

    // Left tenon vertices (box extending in -X from left end)
    const LT_LTF: [number, number, number] = [leftOuterX, leftCenterY + halfTenonWidth, leftCenterZ - halfTenonThick]
    const LT_LTB: [number, number, number] = [leftOuterX, leftCenterY + halfTenonWidth, leftCenterZ + halfTenonThick]
    const LT_LBF: [number, number, number] = [leftOuterX, leftCenterY - halfTenonWidth, leftCenterZ - halfTenonThick]
    const LT_LBB: [number, number, number] = [leftOuterX, leftCenterY - halfTenonWidth, leftCenterZ + halfTenonThick]
    const LT_RTF: [number, number, number] = [leftOuterX - tenonLength, leftCenterY + halfTenonWidth, leftCenterZ - halfTenonThick]
    const LT_RTB: [number, number, number] = [leftOuterX - tenonLength, leftCenterY + halfTenonWidth, leftCenterZ + halfTenonThick]
    const LT_RBF: [number, number, number] = [leftOuterX - tenonLength, leftCenterY - halfTenonWidth, leftCenterZ - halfTenonThick]
    const LT_RBB: [number, number, number] = [leftOuterX - tenonLength, leftCenterY - halfTenonWidth, leftCenterZ + halfTenonThick]

    // Left tenon faces (5 faces, inner face connects to apron)
    addQuad(LT_LTB, LT_LTF, LT_RTF, LT_RTB)  // Top
    addQuad(LT_LBF, LT_LBB, LT_RBB, LT_RBF)  // Bottom
    addQuad(LT_LBF, LT_RBF, LT_RTF, LT_LTF)  // Front
    addQuad(LT_RBB, LT_LBB, LT_LTB, LT_RTB)  // Back
    addQuad(LT_RBF, LT_RBB, LT_RTB, LT_RTF)  // Outer end

    // Right tenon - extends from right end face in +X direction
    // Use the innermost X position (minimum X, closest to table center) so tenon overlaps into apron body
    const rightOuterX = Math.min(RTF[0], RTB[0], RBF[0], RBB[0])
    const rightCenterY = (RTF[1] + RTB[1] + RBF[1] + RBB[1]) / 4
    const rightCenterZ = (RTF[2] + RTB[2] + RBF[2] + RBB[2]) / 4

    // Right tenon vertices
    const RT_LTF: [number, number, number] = [rightOuterX, rightCenterY + halfTenonWidth, rightCenterZ - halfTenonThick]
    const RT_LTB: [number, number, number] = [rightOuterX, rightCenterY + halfTenonWidth, rightCenterZ + halfTenonThick]
    const RT_LBF: [number, number, number] = [rightOuterX, rightCenterY - halfTenonWidth, rightCenterZ - halfTenonThick]
    const RT_LBB: [number, number, number] = [rightOuterX, rightCenterY - halfTenonWidth, rightCenterZ + halfTenonThick]
    const RT_RTF: [number, number, number] = [rightOuterX + tenonLength, rightCenterY + halfTenonWidth, rightCenterZ - halfTenonThick]
    const RT_RTB: [number, number, number] = [rightOuterX + tenonLength, rightCenterY + halfTenonWidth, rightCenterZ + halfTenonThick]
    const RT_RBF: [number, number, number] = [rightOuterX + tenonLength, rightCenterY - halfTenonWidth, rightCenterZ - halfTenonThick]
    const RT_RBB: [number, number, number] = [rightOuterX + tenonLength, rightCenterY - halfTenonWidth, rightCenterZ + halfTenonThick]

    // Right tenon faces
    addQuad(RT_LTB, RT_LTF, RT_RTF, RT_RTB)  // Top
    addQuad(RT_LBF, RT_LBB, RT_RBB, RT_RBF)  // Bottom
    addQuad(RT_LBF, RT_RBF, RT_RTF, RT_LTF)  // Front
    addQuad(RT_RBB, RT_LBB, RT_LTB, RT_RTB)  // Back
    addQuad(RT_RBF, RT_RBB, RT_RTB, RT_RTF)  // Outer end
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}
