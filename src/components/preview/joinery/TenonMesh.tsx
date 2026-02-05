/**
 * Parametric Table Builder - Tenon Mesh Component
 * Renders a tenon protrusion visualization
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { JOINERY_COLORS, JOINERY_VISUALIZATION } from '../../../constants/joinery'

export interface TenonMeshProps {
  thickness: number          // Tenon thickness (matches mortise width)
  width: number              // Tenon width/height (vertical dimension)
  length: number             // Tenon length (how far it extends)
  position: [number, number, number]
  rotation?: [number, number, number]
  faceNormal?: THREE.Vector3 // For splayed legs - orientation of the tenon
  miterAngle?: number        // For corner joints (degrees)
  haunch?: {
    width: number
    depth: number
  }
  isThrough?: boolean        // Through-tenon extends past leg
  shoulderWidth?: number     // Width of shoulder around tenon
}

export default function TenonMesh({
  thickness,
  width,
  length,
  position,
  rotation = [0, 0, 0],
  faceNormal,
  miterAngle,
  haunch,
  isThrough = false
}: TenonMeshProps) {
  // Create main tenon geometry
  const geometry = useMemo(() => {
    // For through tenon, extend slightly past the leg
    const actualLength = isThrough ? length * 1.1 : length

    // If mitered, we need to angle the end
    if (miterAngle && miterAngle > 0) {
      return createMiteredTenonGeometry(thickness, width, actualLength, miterAngle)
    }

    const geo = new THREE.BoxGeometry(thickness, width, actualLength)

    // If we have a face normal for splayed legs, orient the tenon
    if (faceNormal && (faceNormal.x !== 0 || faceNormal.y !== 0 || faceNormal.z !== 1)) {
      const defaultNormal = new THREE.Vector3(0, 0, 1)
      const quaternion = new THREE.Quaternion()
      quaternion.setFromUnitVectors(defaultNormal, faceNormal.clone().normalize())
      geo.applyQuaternion(quaternion)
    }

    return geo
  }, [thickness, width, length, faceNormal, miterAngle, isThrough])

  // Create haunch geometry if specified
  const haunchGeometry = useMemo(() => {
    if (!haunch) return null

    // Haunch is at the top of the tenon, partially filling the shoulder
    const geo = new THREE.BoxGeometry(thickness, haunch.width, haunch.depth)

    // Position haunch at top of tenon
    geo.translate(0, (width + haunch.width) / 2, (length - haunch.depth) / 2)

    return geo
  }, [haunch, thickness, width, length])

  // Create edges geometry
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  const haunchEdgesGeometry = useMemo(() => {
    if (!haunchGeometry) return null
    return new THREE.EdgesGeometry(haunchGeometry, 15)
  }, [haunchGeometry])

  // Offset position slightly to prevent z-fighting
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1],
    position[2] + JOINERY_VISUALIZATION.tenonOffset
  ]

  return (
    <group position={adjustedPosition} rotation={rotation}>
      {/* Main tenon */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={isThrough ? JOINERY_COLORS.throughTenon : JOINERY_COLORS.tenon}
          transparent={JOINERY_COLORS.tenonOpacity < 1}
          opacity={JOINERY_COLORS.tenonOpacity}
          roughness={0.8}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={JOINERY_COLORS.joineryEdge} transparent opacity={0.6} />
      </lineSegments>

      {/* Haunch if present */}
      {haunchGeometry && haunchEdgesGeometry && (
        <>
          <mesh geometry={haunchGeometry}>
            <meshStandardMaterial
              color={JOINERY_COLORS.tenon}
              roughness={0.8}
              metalness={0}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments geometry={haunchEdgesGeometry}>
            <lineBasicMaterial color={JOINERY_COLORS.joineryEdge} transparent opacity={0.6} />
          </lineSegments>
        </>
      )}
    </group>
  )
}

/**
 * Create tenon geometry with mitered end for corner joints
 */
function createMiteredTenonGeometry(
  thickness: number,
  width: number,
  length: number,
  miterAngle: number
): THREE.BufferGeometry {
  const halfThickness = thickness / 2
  const halfWidth = width / 2
  const miterRad = (miterAngle * Math.PI) / 180

  // The miter cut removes material from one side
  // For a 45° miter, the end is angled
  const miterOffset = halfThickness * Math.tan(miterRad)

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

  // Front face (Z = 0)
  addQuad(
    [-halfThickness, -halfWidth, 0],
    [halfThickness, -halfWidth, 0],
    [halfThickness, halfWidth, 0],
    [-halfThickness, halfWidth, 0]
  )

  // Back face (Z = length, but mitered)
  // The miter removes material from +X side
  addQuad(
    [halfThickness, halfWidth, length - miterOffset],
    [halfThickness, -halfWidth, length - miterOffset],
    [-halfThickness, -halfWidth, length],
    [-halfThickness, halfWidth, length]
  )

  // Top face
  addQuad(
    [-halfThickness, halfWidth, 0],
    [halfThickness, halfWidth, 0],
    [halfThickness, halfWidth, length - miterOffset],
    [-halfThickness, halfWidth, length]
  )

  // Bottom face
  addQuad(
    [-halfThickness, -halfWidth, length],
    [halfThickness, -halfWidth, length - miterOffset],
    [halfThickness, -halfWidth, 0],
    [-halfThickness, -halfWidth, 0]
  )

  // Left face (-X)
  addQuad(
    [-halfThickness, -halfWidth, 0],
    [-halfThickness, halfWidth, 0],
    [-halfThickness, halfWidth, length],
    [-halfThickness, -halfWidth, length]
  )

  // Right face (+X, shorter due to miter)
  addQuad(
    [halfThickness, -halfWidth, length - miterOffset],
    [halfThickness, halfWidth, length - miterOffset],
    [halfThickness, halfWidth, 0],
    [halfThickness, -halfWidth, 0]
  )

  // Miter face (angled)
  addQuad(
    [halfThickness, -halfWidth, length - miterOffset],
    [-halfThickness, -halfWidth, length],
    [-halfThickness, halfWidth, length],
    [halfThickness, halfWidth, length - miterOffset]
  )

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}
