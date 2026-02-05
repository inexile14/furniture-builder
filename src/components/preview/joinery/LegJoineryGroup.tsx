/**
 * Parametric Table Builder - Leg Joinery Group Component
 * Renders all mortises for a single leg
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import type { LegPosition, LegParams, ApronParams, JoineryParams } from '../../../types'
import type { CalculatedJoinery } from '../../../types/joinery'
import MortiseMesh from './MortiseMesh'

interface ApronSides {
  front: boolean
  back: boolean
  left: boolean
  right: boolean
}

interface LegJoineryGroupProps {
  legPosition: LegPosition
  legParams: LegParams
  apronParams: ApronParams
  joineryParams: JoineryParams
  calculatedJoinery: CalculatedJoinery
  legHeight: number
  apronY: number
  isExploded: boolean
  explosionOffset: number
  legFaceNormal?: {
    plusX?: THREE.Vector3
    minusX?: THREE.Vector3
    plusZ?: THREE.Vector3
    minusZ?: THREE.Vector3
  }
}

export default function LegJoineryGroup({
  legPosition,
  legParams,
  apronParams,
  joineryParams,
  calculatedJoinery,
  legHeight,
  apronY,
  isExploded,
  explosionOffset,
  legFaceNormal
}: LegJoineryGroupProps) {
  // Determine which apron faces connect to this leg
  const connectedFaces = useMemo(() => {
    const sides = apronParams.sides
    // Each leg connects to two aprons:
    // FL: front (-Z face) and left (-X face)
    // FR: front (-Z face) and right (+X face)
    // BL: back (+Z face) and left (-X face)
    // BR: back (+Z face) and right (+X face)
    const faceMap: Record<LegPosition, { face1: keyof ApronSides; face2: keyof ApronSides; dir1: '+X' | '-X' | '+Z' | '-Z'; dir2: '+X' | '-X' | '+Z' | '-Z' }> = {
      FL: { face1: 'front', face2: 'left', dir1: '+X', dir2: '+Z' },  // Inside faces point toward center
      FR: { face1: 'front', face2: 'right', dir1: '-X', dir2: '+Z' },
      BL: { face1: 'back', face2: 'left', dir1: '+X', dir2: '-Z' },
      BR: { face1: 'back', face2: 'right', dir1: '-X', dir2: '-Z' }
    }

    const { face1, face2, dir1, dir2 } = faceMap[legPosition]

    return {
      face1: sides[face1] ? { name: face1, direction: dir1 } : null,
      face2: sides[face2] ? { name: face2, direction: dir2 } : null
    }
  }, [legPosition, apronParams.sides])

  // Calculate mortise positions relative to leg center
  const mortisePositions = useMemo(() => {
    const positions: Array<{
      position: [number, number, number]
      rotation: [number, number, number]
      faceNormal?: THREE.Vector3
      direction: '+X' | '-X' | '+Z' | '-Z'
    }> = []

    const legThickness = legParams.thickness
    const halfLeg = legThickness / 2

    // Mortise setback from outer face of leg
    const setback = joineryParams.mortiseSetback

    // Mortise center is positioned:
    // - Inward from leg outer face by setback + mortiseWidth/2
    // - Vertically centered on apron position

    // Y position: centered on apron height
    const mortiseY = apronY - legHeight / 2  // Convert from world Y to leg-local Y

    // Mortise depth into leg
    const mortiseDepthPosition = setback + calculatedJoinery.mortiseWidth / 2

    // Process each connected face
    const processFace = (faceInfo: { name: string; direction: '+X' | '-X' | '+Z' | '-Z' } | null) => {
      if (!faceInfo) return

      const { direction } = faceInfo
      let pos: [number, number, number]
      let rot: [number, number, number] = [0, 0, 0]
      let normal: THREE.Vector3 | undefined

      switch (direction) {
        case '+X':
          // Mortise on +X face (inside face for FL, BL)
          pos = [halfLeg - mortiseDepthPosition, mortiseY, 0]
          rot = [0, Math.PI / 2, 0]
          normal = legFaceNormal?.plusX
          break
        case '-X':
          // Mortise on -X face (inside face for FR, BR)
          pos = [-halfLeg + mortiseDepthPosition, mortiseY, 0]
          rot = [0, -Math.PI / 2, 0]
          normal = legFaceNormal?.minusX
          break
        case '+Z':
          // Mortise on +Z face
          pos = [0, mortiseY, halfLeg - mortiseDepthPosition]
          rot = [0, 0, 0]
          normal = legFaceNormal?.plusZ
          break
        case '-Z':
          // Mortise on -Z face
          pos = [0, mortiseY, -halfLeg + mortiseDepthPosition]
          rot = [0, Math.PI, 0]
          normal = legFaceNormal?.minusZ
          break
      }

      positions.push({ position: pos, rotation: rot, faceNormal: normal, direction })
    }

    processFace(connectedFaces.face1)
    processFace(connectedFaces.face2)

    return positions
  }, [
    connectedFaces,
    legParams.thickness,
    joineryParams.mortiseSetback,
    calculatedJoinery.mortiseWidth,
    apronY,
    legHeight,
    legFaceNormal
  ])

  // Determine if through mortise based on joint type
  const isThrough = joineryParams.legApronJoint === 'through-tenon'

  // If exploded, move mortises with the leg
  const explosionDir = useMemo(() => {
    const dirs: Record<LegPosition, { x: number; z: number }> = {
      FL: { x: -1, z: -1 },
      FR: { x: 1, z: -1 },
      BL: { x: -1, z: 1 },
      BR: { x: 1, z: 1 }
    }
    return dirs[legPosition]
  }, [legPosition])

  const groupPosition: [number, number, number] = isExploded
    ? [explosionDir.x * explosionOffset, 0, explosionDir.z * explosionOffset]
    : [0, 0, 0]

  return (
    <group position={groupPosition}>
      {mortisePositions.map((mortise, index) => (
        <MortiseMesh
          key={`${legPosition}-mortise-${index}`}
          width={calculatedJoinery.mortiseWidth}
          height={calculatedJoinery.mortiseHeight}
          depth={calculatedJoinery.mortiseDepth}
          position={mortise.position}
          rotation={mortise.rotation}
          faceNormal={mortise.faceNormal}
          isThrough={isThrough}
        />
      ))}
    </group>
  )
}
