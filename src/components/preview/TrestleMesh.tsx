/**
 * Parametric Table Builder - Trestle Mesh Component
 * Renders trestle table base: two end assemblies (foot + leg + head) connected by a stretcher
 */

import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import type { TrestleParams } from '../../types'

interface TrestleMeshProps {
  trestleParams: TrestleParams
  tableLength: number
  tableHeight: number
  topThickness: number
  color: string
}

/**
 * Create foot geometry by extruding a 2D profile
 * Profile is in Y-Z plane (looking from end of table along X axis)
 * Top has flat section at center, then slopes down to ends; bottom has dado cutout
 */
function createFootGeometry(
  length: number,      // Along Z axis (table width direction) - the long dimension
  heightAtCenter: number,  // Y dimension at center (tallest point)
  width: number,       // Along X axis - extrusion depth
  bevelAngle: number,  // Degrees - slope of top surface from flat section to ends
  dadoDepth: number,   // How deep the dado cuts up from bottom
  dadoInset: number,   // How far from each end the dado starts
  flatSectionHalf: number = 4  // Half-width of flat section at top (4" from center each way)
): THREE.BufferGeometry {
  const halfLength = length / 2

  // Calculate height at the ends based on bevel angle
  // Slope starts at flatSectionHalf from center
  const slopeDistance = halfLength - flatSectionHalf
  const dropAtEnd = Math.tan(bevelAngle * Math.PI / 180) * slopeDistance
  const heightAtEnd = Math.max(heightAtCenter - dropAtEnd, dadoDepth + 0.5)

  // The foot pads (parts that touch floor) extend from the ends inward to dadoInset
  const dadoStart = halfLength - dadoInset

  // Create 2D profile shape in Y-Z plane
  const shape = new THREE.Shape()

  // Start at bottom left corner (front end, floor level)
  shape.moveTo(-halfLength, 0)

  // Up left side to top at end height
  shape.lineTo(-halfLength, heightAtEnd)

  // Slope up to start of flat section
  shape.lineTo(-flatSectionHalf, heightAtCenter)

  // Flat section across the top (where leg sits)
  shape.lineTo(flatSectionHalf, heightAtCenter)

  // Slope down to right end
  shape.lineTo(halfLength, heightAtEnd)

  // Down right side to floor
  shape.lineTo(halfLength, 0)

  // Across bottom of right foot pad to dado
  shape.lineTo(dadoStart, 0)

  // Up into dado
  shape.lineTo(dadoStart, dadoDepth)

  // Across dado ceiling
  shape.lineTo(-dadoStart, dadoDepth)

  // Down out of dado
  shape.lineTo(-dadoStart, 0)

  // Back to start (across bottom of left foot pad)
  shape.lineTo(-halfLength, 0)

  // Extrude along X axis
  const extrudeSettings = {
    steps: 1,
    depth: width,
    bevelEnabled: false
  }

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

  // ExtrudeGeometry extrudes along +Z by default, but we drew in Y-Z plane
  // We need to rotate so it extrudes along X instead
  // Actually, ExtrudeGeometry extrudes the shape in its local Z direction
  // Our shape is in the X-Y plane of the shape (first coord = X, second = Y in shape)
  // So it extrudes along Z, which is what we want for the foot width

  // Wait - let me reconsider. The shape coordinates are:
  // shape.moveTo(z, y) - first param is horizontal, second is vertical in the 2D profile
  // ExtrudeGeometry extrudes along the shape's "depth" direction

  // The result: the profile is in X-Y of the geometry, extruded along Z
  // But we want the profile in Z-Y, extruded along X

  // So we need to rotate the geometry: swap X and Z
  geometry.rotateY(Math.PI / 2)

  // Center the geometry
  geometry.translate(0, 0, 0)  // Already centered in Y-Z, need to center in X
  geometry.translate(-width / 2, 0, 0)

  geometry.computeVertexNormals()

  return geometry
}

/**
 * Create head geometry - mirror of foot (flipped vertically)
 * Top is flat (meets tabletop), bottom has flat center section then slopes down to ends
 */
function createHeadGeometry(
  length: number,      // Along Z axis (table width direction)
  heightAtCenter: number,  // Y dimension at center (tallest point)
  width: number,       // Along X axis - extrusion depth
  bevelAngle: number,  // Degrees - slope of bottom surface
  flatSectionHalf: number = 4  // Half-width of flat section at bottom center
): THREE.BufferGeometry {
  const halfLength = length / 2

  // Calculate height at the ends based on bevel angle
  const slopeDistance = halfLength - flatSectionHalf
  const dropAtEnd = Math.tan(bevelAngle * Math.PI / 180) * slopeDistance
  const heightAtEnd = Math.max(heightAtCenter - dropAtEnd, 0.5)

  // Create 2D profile shape - like foot but flipped vertically
  // Top is flat at heightAtCenter, bottom slopes up from ends to flat center section
  const shape = new THREE.Shape()

  // Start at top left corner
  shape.moveTo(-halfLength, heightAtCenter)

  // Across flat top
  shape.lineTo(halfLength, heightAtCenter)

  // Down right side to sloped bottom at end height
  shape.lineTo(halfLength, heightAtCenter - heightAtEnd)

  // Slope up to start of flat section (bottom center)
  shape.lineTo(flatSectionHalf, 0)

  // Flat section across the bottom center (where leg meets)
  shape.lineTo(-flatSectionHalf, 0)

  // Slope down to left end
  shape.lineTo(-halfLength, heightAtCenter - heightAtEnd)

  // Back up to start
  shape.lineTo(-halfLength, heightAtCenter)

  // Extrude along X axis
  const extrudeSettings = {
    steps: 1,
    depth: width,
    bevelEnabled: false
  }

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

  // Rotate so it extrudes along X instead of Z
  geometry.rotateY(Math.PI / 2)
  geometry.translate(-width / 2, 0, 0)

  geometry.computeVertexNormals()

  return geometry
}

export default function TrestleMesh({
  trestleParams,
  tableLength,
  tableHeight,
  topThickness,
  color
}: TrestleMeshProps) {
  const {
    legWidth,
    legThickness,
    legInset,
    footLength,
    footHeight,
    footWidth,
    footBevelAngle,
    footDadoDepth,
    footDadoInset,
    headLength,
    headHeight,
    headWidth,
    headBevelAngle,
    stretcherHeight,
    stretcherThickness
  } = trestleParams

  // Calculate positions
  const totalHeight = tableHeight - topThickness

  // Leg X positions (center of each leg assembly)
  const legX = (tableLength / 2) - legInset

  // Leg height: total height minus foot and head
  const legHeight = totalHeight - footHeight - headHeight

  // Create geometries
  const geometries = useMemo(() => {
    // Foot: profile extruded along X, with sloped top and dado underneath
    // Flat section matches leg width so taper starts at leg edge
    const footGeo = createFootGeometry(
      footLength, footHeight, footWidth,
      footBevelAngle, footDadoDepth, footDadoInset,
      legWidth / 2  // Flat section half-width = half of leg width
    )

    // Leg geometry - rotated so wider dimension is along Z (table width)
    // legWidth goes along Z, legThickness goes along X
    const legGeo = new THREE.BoxGeometry(legThickness, legHeight, legWidth)

    // Head: mirror of foot (flat top, sloped bottom)
    // Flat section matches leg width
    const headGeo = createHeadGeometry(headLength, headHeight, headWidth, footBevelAngle, legWidth / 2)

    // Stretcher geometry - spans between the inside faces of the legs
    // Legs are rotated so legThickness is along X axis
    const stretcherLen = (legX * 2) - legThickness
    const stretcherGeo = new THREE.BoxGeometry(stretcherLen, stretcherHeight, stretcherThickness)

    return { footGeo, legGeo, headGeo, stretcherGeo }
  }, [
    footLength, footHeight, footWidth, footBevelAngle,
    footDadoDepth, footDadoInset,
    legWidth, legHeight, legThickness,
    headLength, headHeight, headWidth, headBevelAngle,
    legX, stretcherHeight, stretcherThickness
  ])

  // Y positions - foot sits on floor, leg sits on foot, head sits on leg
  const footY = 0  // Foot geometry starts at floor level
  const legY = footHeight + (legHeight / 2)  // Leg is centered (BoxGeometry)
  const headY = footHeight + legHeight  // Head geometry starts at Y=0, so no offset needed

  // Stretcher at ~55% of the height from floor to bottom of tabletop
  const stretcherY = totalHeight * 0.55

  return (
    <group>
      {/* Left end assembly */}
      <group position={[-legX, 0, 0]}>
        {/* Foot */}
        <mesh geometry={geometries.footGeo} position={[0, footY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>

        {/* Leg */}
        <mesh geometry={geometries.legGeo} position={[0, legY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>

        {/* Head */}
        <mesh geometry={geometries.headGeo} position={[0, headY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>
      </group>

      {/* Right end assembly */}
      <group position={[legX, 0, 0]}>
        {/* Foot */}
        <mesh geometry={geometries.footGeo} position={[0, footY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>

        {/* Leg */}
        <mesh geometry={geometries.legGeo} position={[0, legY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>

        {/* Head */}
        <mesh geometry={geometries.headGeo} position={[0, headY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>
      </group>

      {/* Center stretcher */}
      <mesh geometry={geometries.stretcherGeo} position={[0, stretcherY, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
        <Edges threshold={10} color="#8B7355" />
      </mesh>
    </group>
  )
}
