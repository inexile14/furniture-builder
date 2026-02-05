/**
 * Parametric Table Builder - Apron Joinery Group Component
 * Renders tenons at both ends of an apron
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import type { ApronPosition, JoineryParams, CornerJointStyle } from '../../../types'
import type { CalculatedJoinery } from '../../../types/joinery'
import TenonMesh from './TenonMesh'

interface LegFaceNormals {
  left: THREE.Vector3
  right: THREE.Vector3
}

interface ApronJoineryGroupProps {
  apronPosition: ApronPosition
  apronLength: number
  apronHeight: number
  apronThickness: number
  joineryParams: JoineryParams
  calculatedJoinery: CalculatedJoinery
  x: number
  y: number
  z: number
  rotateY: number
  isExploded: boolean
  explosionOffset: number
  legFaceNormals?: LegFaceNormals
}

export default function ApronJoineryGroup({
  apronPosition,
  apronLength,
  apronHeight,
  apronThickness,
  joineryParams,
  calculatedJoinery,
  x,
  y,
  z,
  rotateY,
  isExploded,
  explosionOffset,
  legFaceNormals
}: ApronJoineryGroupProps) {
  // Calculate tenon positions at each end of the apron
  const tenonPositions = useMemo(() => {
    const halfLength = apronLength / 2
    const tenonLength = calculatedJoinery.tenonLength

    // Tenon positions relative to apron center
    // Tenons extend PERPENDICULAR to apron length, into the legs
    // The TenonMesh has length along Z, so we rotate -90° (left) or +90° (right) around Y
    // to make the tenon extend along X axis (perpendicular to apron face)

    // Position: tenon center is at apron end, offset by half tenon length INTO the leg
    const leftTenonX = -halfLength - tenonLength / 2
    const rightTenonX = halfLength + tenonLength / 2

    // Determine miter angle based on corner joint style
    const miterAngle = getMiterAngle(joineryParams.cornerJoint)

    // Haunch dimensions if enabled
    const haunch = joineryParams.haunched
      ? {
          width: calculatedJoinery.haunchWidth,
          depth: calculatedJoinery.haunchDepth
        }
      : undefined

    return {
      left: {
        position: [leftTenonX, 0, 0] as [number, number, number],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],  // Rotate so length extends along -X
        faceNormal: legFaceNormals?.left,
        miterAngle,
        haunch
      },
      right: {
        position: [rightTenonX, 0, 0] as [number, number, number],
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],  // Rotate so length extends along +X
        faceNormal: legFaceNormals?.right,
        miterAngle,
        haunch
      }
    }
  }, [
    apronLength,
    calculatedJoinery.tenonLength,
    calculatedJoinery.shoulderWidth,
    calculatedJoinery.haunchWidth,
    calculatedJoinery.haunchDepth,
    joineryParams.cornerJoint,
    joineryParams.haunched,
    legFaceNormals
  ])

  // Determine if through tenon
  const isThrough = joineryParams.legApronJoint === 'through-tenon'

  // Calculate explosion offset direction based on apron position
  const explosionDir = useMemo(() => {
    switch (apronPosition) {
      case 'front': return { x: 0, z: -1 }
      case 'back': return { x: 0, z: 1 }
      case 'left': return { x: -1, z: 0 }
      case 'right': return { x: 1, z: 0 }
    }
  }, [apronPosition])

  // Group position matches apron position (with explosion)
  const groupPosition: [number, number, number] = [
    x + explosionDir.x * Math.abs(explosionOffset),
    y,
    z + explosionDir.z * Math.abs(explosionOffset)
  ]

  return (
    <group position={groupPosition} rotation={[0, rotateY, 0]}>
      {/* Left end tenon */}
      <TenonMesh
        thickness={calculatedJoinery.tenonThickness}
        width={calculatedJoinery.tenonWidth}
        length={calculatedJoinery.tenonLength}
        position={tenonPositions.left.position}
        rotation={tenonPositions.left.rotation}
        faceNormal={tenonPositions.left.faceNormal}
        miterAngle={tenonPositions.left.miterAngle}
        haunch={tenonPositions.left.haunch}
        isThrough={isThrough}
        shoulderWidth={calculatedJoinery.shoulderWidth}
      />

      {/* Right end tenon */}
      <TenonMesh
        thickness={calculatedJoinery.tenonThickness}
        width={calculatedJoinery.tenonWidth}
        length={calculatedJoinery.tenonLength}
        position={tenonPositions.right.position}
        rotation={tenonPositions.right.rotation}
        faceNormal={tenonPositions.right.faceNormal}
        miterAngle={tenonPositions.right.miterAngle}
        haunch={tenonPositions.right.haunch}
        isThrough={isThrough}
        shoulderWidth={calculatedJoinery.shoulderWidth}
      />
    </group>
  )
}

/**
 * Get miter angle based on corner joint style
 */
function getMiterAngle(cornerJoint: CornerJointStyle): number | undefined {
  switch (cornerJoint) {
    case 'mitered':
      return 45
    case 'shortened':
      // Shortened tenons don't need mitering, they just stop short
      return undefined
    case 'stacked':
      // Stacked tenons have one on top of the other, no miter
      return undefined
    default:
      return undefined
  }
}
