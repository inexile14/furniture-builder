/**
 * Parametric Table Builder - Mortise Mesh Component
 * Renders a mortise cavity visualization
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { JOINERY_COLORS, JOINERY_VISUALIZATION } from '../../../constants/joinery'

export interface MortiseMeshProps {
  width: number              // Mortise width (in apron thickness direction)
  height: number             // Mortise height (vertical)
  depth: number              // How deep into leg
  position: [number, number, number]
  rotation?: [number, number, number]
  faceNormal?: THREE.Vector3 // For splayed legs - orientation of the mortise
  isThrough?: boolean        // Through-mortise (visible both sides)
}

export default function MortiseMesh({
  width,
  height,
  depth,
  position,
  rotation = [0, 0, 0],
  faceNormal,
  isThrough = false
}: MortiseMeshProps) {
  // Create geometry
  const geometry = useMemo(() => {
    // For through mortise, the depth extends all the way through
    // For blind mortise, it's just the specified depth
    const actualDepth = depth

    const geo = new THREE.BoxGeometry(width, height, actualDepth)

    // If we have a face normal for splayed legs, we need to orient the mortise
    if (faceNormal && (faceNormal.x !== 0 || faceNormal.y !== 0 || faceNormal.z !== 1)) {
      // Compute rotation to align Z-axis with face normal
      const defaultNormal = new THREE.Vector3(0, 0, 1)
      const quaternion = new THREE.Quaternion()
      quaternion.setFromUnitVectors(defaultNormal, faceNormal.clone().normalize())
      geo.applyQuaternion(quaternion)
    }

    return geo
  }, [width, height, depth, faceNormal])

  // Create edges for visibility
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  // Offset position slightly to prevent z-fighting
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1],
    position[2] + JOINERY_VISUALIZATION.mortiseOffset
  ]

  return (
    <group position={adjustedPosition} rotation={rotation}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={JOINERY_COLORS.mortise}
          transparent={true}
          opacity={JOINERY_COLORS.mortiseOpacity}
          roughness={0.9}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={JOINERY_COLORS.joineryEdge} transparent opacity={0.5} />
      </lineSegments>
      {/* For through mortise, show on both sides */}
      {isThrough && (
        <mesh geometry={geometry} position={[0, 0, -depth]}>
          <meshStandardMaterial
            color={JOINERY_COLORS.mortise}
            transparent={true}
            opacity={JOINERY_COLORS.mortiseOpacity}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}
