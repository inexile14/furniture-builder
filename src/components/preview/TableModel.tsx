/**
 * Parametric Table Builder - 3D Table Model Component
 * Simplified positioning for proper alignment
 */

import { useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import type { TableParams, LegPosition } from '../../types'
import { WOOD_SPECIES } from '../../constants'
import TopMesh from './TopMesh'
import LegMesh from './LegMesh'
import ApronMesh from './ApronMesh'
import StretcherMesh from './StretcherMesh'
import TrestleMesh from './TrestleMesh'

/**
 * Compute the actual face normal for a splayed/tapered leg's inside face.
 * This accounts for taper, splay rotation, and Y-adjustment for horizontal top/bottom.
 * Returns the world-space normal of the face that meets the apron.
 */
function computeLegFaceNormal(
  legPosition: LegPosition,
  face: '+X' | '-X' | '+Z' | '-Z',
  splayAngle: number,
  topSize: number,
  bottomSize: number,
  legHeight: number
): THREE.Vector3 {
  const splayRad = (splayAngle * Math.PI) / 180
  const t = topSize / 2
  const b = bottomSize / 2

  // Rotation angles for this leg position
  const rotations: Record<LegPosition, { θx: number; θz: number }> = {
    FL: { θx: splayRad, θz: -splayRad },
    FR: { θx: splayRad, θz: splayRad },
    BL: { θx: -splayRad, θz: -splayRad },
    BR: { θx: -splayRad, θz: splayRad }
  }
  const { θx, θz } = rotations[legPosition]

  // Y adjustment function (same as in LegMesh)
  const yAdjust = (x: number, z: number): number => {
    return -x * Math.sin(θz) + z * Math.sin(θx)
  }

  const yTopBase = legHeight / 2
  const yBottomBase = -legHeight / 2

  // Get the 4 corners of the specified face in leg-local coords
  let corners: { top1: THREE.Vector3; top2: THREE.Vector3; bot1: THREE.Vector3; bot2: THREE.Vector3 }

  if (face === '+X') {
    // Right face: v1 (top +X,-Z), v2 (top +X,+Z), and bottom equivalents
    corners = {
      top1: new THREE.Vector3(t, yTopBase + yAdjust(t, -t), -t),
      top2: new THREE.Vector3(t, yTopBase + yAdjust(t, t), t),
      bot1: new THREE.Vector3(b, yBottomBase + yAdjust(b, -b), -b),
      bot2: new THREE.Vector3(b, yBottomBase + yAdjust(b, b), b)
    }
  } else if (face === '-X') {
    // Left face: v0 (top -X,-Z), v3 (top -X,+Z), and bottom equivalents
    corners = {
      top1: new THREE.Vector3(-t, yTopBase + yAdjust(-t, t), t),
      top2: new THREE.Vector3(-t, yTopBase + yAdjust(-t, -t), -t),
      bot1: new THREE.Vector3(-b, yBottomBase + yAdjust(-b, b), b),
      bot2: new THREE.Vector3(-b, yBottomBase + yAdjust(-b, -b), -b)
    }
  } else if (face === '+Z') {
    // Back face: v2 (top +X,+Z), v3 (top -X,+Z), and bottom equivalents
    corners = {
      top1: new THREE.Vector3(t, yTopBase + yAdjust(t, t), t),
      top2: new THREE.Vector3(-t, yTopBase + yAdjust(-t, t), t),
      bot1: new THREE.Vector3(b, yBottomBase + yAdjust(b, b), b),
      bot2: new THREE.Vector3(-b, yBottomBase + yAdjust(-b, b), b)
    }
  } else { // '-Z'
    // Front face: v0 (top -X,-Z), v1 (top +X,-Z), and bottom equivalents
    corners = {
      top1: new THREE.Vector3(-t, yTopBase + yAdjust(-t, -t), -t),
      top2: new THREE.Vector3(t, yTopBase + yAdjust(t, -t), -t),
      bot1: new THREE.Vector3(-b, yBottomBase + yAdjust(-b, -b), -b),
      bot2: new THREE.Vector3(b, yBottomBase + yAdjust(b, -b), -b)
    }
  }

  // Compute face normal from cross product of two edges
  const edge1 = new THREE.Vector3().subVectors(corners.top2, corners.top1)
  const edge2 = new THREE.Vector3().subVectors(corners.bot1, corners.top1)
  const localNormal = new THREE.Vector3().crossVectors(edge1, edge2).normalize()

  // Apply leg rotation to get world-space normal
  // Rotation order: Rx(θx) then Rz(θz)
  const rotationMatrix = new THREE.Matrix4()
  const euler = new THREE.Euler(θx, 0, θz, 'XYZ')
  rotationMatrix.makeRotationFromEuler(euler)

  const worldNormal = localNormal.applyMatrix4(rotationMatrix).normalize()

  return worldNormal
}

interface TableModelProps {
  params: TableParams
  isExploded: boolean
}

export default function TableModel({ params, isExploded }: TableModelProps) {
  // Get wood color
  const woodColor = useMemo(() => {
    const species = WOOD_SPECIES[params.primaryWood]
    return species?.color || '#C9A86C'
  }, [params.primaryWood])

  // Core dimensions
  const legHeight = params.height - params.top.thickness

  // Leg center positions (legs are centered at these X/Z coords)
  const legCenterX = (params.length / 2) - params.legs.insetFromEdge - (params.legs.thickness / 2)
  const legCenterZ = (params.width / 2) - params.legs.insetFromEdge - (params.legs.thickness / 2)

  // Calculate splay adjustments for splayed legs
  const splayAdjustments = useMemo(() => {
    if (params.legs.style !== 'splayed' || !params.legs.splayAngle) {
      return { topOffsetX: 0, topOffsetZ: 0, legYRaise: 0 }
    }
    const splayRad = (params.legs.splayAngle * Math.PI) / 180
    const cosTheta = Math.cos(splayRad)
    const sinTheta = Math.sin(splayRad)
    const halfLegHeight = legHeight / 2

    // Leg top offset: how much the leg top center moves toward table center
    // X shift = (legHeight/2) * sin(θ) * cos(θ)
    // Z shift = (legHeight/2) * sin(θ)
    const topOffsetX = halfLegHeight * sinTheta * cosTheta
    const topOffsetZ = halfLegHeight * sinTheta

    // Leg Y raise: when leg rotates, top drops by legHeight/2 * (1 - cos²(θ))
    // Raise leg position to compensate so top touches tabletop
    const legYRaise = halfLegHeight * (1 - cosTheta * cosTheta)

    return { topOffsetX, topOffsetZ, legYRaise }
  }, [params.legs.style, params.legs.splayAngle, legHeight])

  // Compute actual leg face normals for splayed legs (accounts for taper + splay + yAdjust)
  const legFaceNormals = useMemo(() => {
    if (params.legs.style !== 'splayed' || !params.legs.splayAngle) {
      return null
    }
    const topSize = params.legs.thickness
    const bottomSize = params.legs.taperEndDimension || topSize * 0.6

    // Front apron: left end meets FL's +X face, right end meets FR's -X face
    // Back apron: left end meets BL's +X face, right end meets BR's -X face
    // Left apron: "right" end (local) meets FL's +Z face, "left" end meets BL's -Z face
    // Right apron: "right" end (local) meets FR's +Z face, "left" end meets BR's -Z face
    return {
      front: {
        left: computeLegFaceNormal('FL', '+X', params.legs.splayAngle, topSize, bottomSize, legHeight),
        right: computeLegFaceNormal('FR', '-X', params.legs.splayAngle, topSize, bottomSize, legHeight)
      },
      back: {
        left: computeLegFaceNormal('BL', '+X', params.legs.splayAngle, topSize, bottomSize, legHeight),
        right: computeLegFaceNormal('BR', '-X', params.legs.splayAngle, topSize, bottomSize, legHeight)
      },
      left: {
        right: computeLegFaceNormal('FL', '+Z', params.legs.splayAngle, topSize, bottomSize, legHeight),
        left: computeLegFaceNormal('BL', '-Z', params.legs.splayAngle, topSize, bottomSize, legHeight)
      },
      right: {
        right: computeLegFaceNormal('FR', '+Z', params.legs.splayAngle, topSize, bottomSize, legHeight),
        left: computeLegFaceNormal('BR', '-Z', params.legs.splayAngle, topSize, bottomSize, legHeight)
      }
    }
  }, [params.legs.style, params.legs.splayAngle, params.legs.thickness, params.legs.taperEndDimension, legHeight])

  // Apron lengths - span between leg top SURFACES (not centers)
  // For splayed legs, compute miter shift from actual leg face normals
  const miterShift = useMemo(() => {
    if (!legFaceNormals) return 0
    // Use the front apron's left end normal to compute miter shift
    // The shift is based on how tilted the face is from vertical
    const normal = legFaceNormals.front.left
    // tan(tilt) = -normal.y / normal.x (for a face originally facing +X)
    const tiltAngle = Math.atan2(-normal.y, Math.abs(normal.x))
    return (params.aprons.height / 2) * Math.tan(tiltAngle)
  }, [legFaceNormals, params.aprons.height])

  // Small penetration factor to ensure aprons overlap slightly into legs
  const apronPenetration = params.legs.style === 'splayed' ? 0.02 : 0

  const apronLengthFrontBack = params.legs.style === 'splayed' && params.legs.splayAngle
    ? 2 * (legCenterX - splayAdjustments.topOffsetX) - params.legs.thickness + 2 * miterShift + apronPenetration
    : params.length - (2 * params.legs.insetFromEdge) - (2 * params.legs.thickness)

  const apronLengthSides = params.legs.style === 'splayed' && params.legs.splayAngle
    ? 2 * (legCenterZ - splayAdjustments.topOffsetZ) - params.legs.thickness + 2 * miterShift + apronPenetration
    : params.width - (2 * params.legs.insetFromEdge) - (2 * params.legs.thickness)

  // Leg positions (center of each leg)
  const legPositions = useMemo(() => ({
    FL: { x: -legCenterX, z: -legCenterZ },
    FR: { x: legCenterX, z: -legCenterZ },
    BL: { x: -legCenterX, z: legCenterZ },
    BR: { x: legCenterX, z: legCenterZ }
  }), [legCenterX, legCenterZ])

  // Explosion offsets
  const explosionOffsets = useMemo(() => ({
    top: isExploded ? 8 : 0,
    legs: isExploded ? 4 : 0,
    aprons: isExploded ? 6 : 0
  }), [isExploded])

  // Table top position: bottom of top rests on legs (at y=legHeight)
  // Top mesh is centered, so position at legHeight + thickness/2
  const topSpring = useSpring({
    position: [0, legHeight + (params.top.thickness / 2) + explosionOffsets.top, 0] as [number, number, number],
    config: { mass: 1, tension: 180, friction: 20 }
  })

  // Apron Y position: top of apron is flush with top of legs
  const apronY = legHeight - (params.aprons.height / 2)

  // Trestle tables have a completely different base structure
  const isTrestle = params.style === 'trestle'

  return (
    <group>
      {/* Table Top */}
      <animated.group position={topSpring.position}>
        <TopMesh
          length={params.length}
          width={params.width}
          thickness={params.top.thickness}
          color={woodColor}
          edgeProfile={params.top.edgeProfile}
          cornerRadius={params.top.cornerRadius}
          chamferEdge={params.top.chamferEdge}
          chamferSize={params.top.chamferSize}
          chamferAngle={params.top.chamferAngle}
        />
      </animated.group>

      {isTrestle && params.trestle ? (
        /* Trestle base */
        <TrestleMesh
          trestleParams={params.trestle}
          tableLength={params.length}
          tableHeight={params.height}
          topThickness={params.top.thickness}
          color={woodColor}
        />
      ) : (
        /* Standard leg-based table */
        <>
          {/* Legs */}
          {(['FL', 'FR', 'BL', 'BR'] as const).map((position) => {
            const pos = legPositions[position]
            const explosionDir = {
              FL: { x: -1, z: -1 },
              FR: { x: 1, z: -1 },
              BL: { x: -1, z: 1 },
              BR: { x: 1, z: 1 }
            }[position]

            return (
              <LegMesh
                key={position}
                position={position}
                x={pos.x + (explosionDir.x * explosionOffsets.legs)}
                z={pos.z + (explosionDir.z * explosionOffsets.legs)}
                legParams={params.legs}
                height={legHeight}
                color={woodColor}
                yOffset={splayAdjustments.legYRaise}
              />
            )
          })}

          {/* Front Apron - centered on front leg tops */}
          {params.aprons.sides.front && (
            <ApronMesh
              position="front"
              length={apronLengthFrontBack}
              height={params.aprons.height}
              thickness={params.aprons.thickness}
              y={apronY}
              x={0}
              z={-legCenterZ + splayAdjustments.topOffsetZ}
              explosionOffset={isExploded ? -explosionOffsets.aprons : 0}
              color={woodColor}
              profile={params.aprons.bottomProfile}
              splayAngle={params.legs.style === 'splayed' ? params.legs.splayAngle : 0}
              legFaceNormals={legFaceNormals?.front}
            />
          )}

          {/* Back Apron - centered on back leg tops */}
          {params.aprons.sides.back && (
            <ApronMesh
              position="back"
              length={apronLengthFrontBack}
              height={params.aprons.height}
              thickness={params.aprons.thickness}
              y={apronY}
              x={0}
              z={legCenterZ - splayAdjustments.topOffsetZ}
              explosionOffset={isExploded ? explosionOffsets.aprons : 0}
              color={woodColor}
              profile={params.aprons.bottomProfile}
              splayAngle={params.legs.style === 'splayed' ? params.legs.splayAngle : 0}
              legFaceNormals={legFaceNormals?.back}
            />
          )}

          {/* Left Apron - centered on left leg tops */}
          {params.aprons.sides.left && (
            <ApronMesh
              position="left"
              length={apronLengthSides}
              height={params.aprons.height}
              thickness={params.aprons.thickness}
              y={apronY}
              x={-legCenterX + splayAdjustments.topOffsetX}
              z={0}
              explosionOffset={isExploded ? -explosionOffsets.aprons : 0}
              color={woodColor}
              profile={params.aprons.bottomProfile}
              rotateY={Math.PI / 2}
              splayAngle={params.legs.style === 'splayed' ? params.legs.splayAngle : 0}
              legFaceNormals={legFaceNormals?.left}
            />
          )}

          {/* Right Apron - centered on right leg tops */}
          {params.aprons.sides.right && (
            <ApronMesh
              position="right"
              length={apronLengthSides}
              height={params.aprons.height}
              thickness={params.aprons.thickness}
              y={apronY}
              x={legCenterX - splayAdjustments.topOffsetX}
              z={0}
              explosionOffset={isExploded ? explosionOffsets.aprons : 0}
              color={woodColor}
              profile={params.aprons.bottomProfile}
              rotateY={Math.PI / 2}
              splayAngle={params.legs.style === 'splayed' ? params.legs.splayAngle : 0}
              legFaceNormals={legFaceNormals?.right}
            />
          )}

          {/* Stretchers */}
          {params.stretchers.enabled && params.stretchers.style !== 'none' && (
            <StretcherMesh
              stretcherParams={params.stretchers}
              legParams={params.legs}
              legCenterX={legCenterX}
              legCenterZ={legCenterZ}
              legHeight={legHeight}
              color={woodColor}
            />
          )}
        </>
      )}
    </group>
  )
}
