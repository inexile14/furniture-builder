/**
 * Parametric Table Builder - Trestle Mesh Component
 * Renders trestle table base: two end assemblies (foot + leg + shoulder) connected by a stretcher
 */

import { useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import type { TrestleParams } from '../../types'

interface TrestleMeshProps {
  trestleParams: TrestleParams
  tableLength: number
  tableHeight: number
  topThickness: number
  color: string
  showJoinery?: boolean
  explosionOffset?: number
  opacity?: number
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
 * Create shoulder geometry - mirror of foot (flipped vertically)
 * Top is flat (meets tabletop), bottom has flat center section then slopes down to ends
 */
function createShoulderGeometry(
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

/**
 * Create double tenon geometry - two tenons side by side
 * Tenons extend from Y=0 in the specified direction
 */
function createDoubleTenon(
  tenonThickness: number,  // X dimension of each tenon
  tenonWidth: number,      // Z dimension of each tenon
  tenonLength: number,     // Y dimension (how far it extends)
  spacing: number,         // Distance between tenon centers along Z
  direction: 'up' | 'down'
): THREE.BufferGeometry {
  const ySign = direction === 'up' ? 1 : -1

  // Create two box geometries and merge them
  const tenon1 = new THREE.BoxGeometry(tenonThickness, tenonLength, tenonWidth)
  tenon1.translate(0, ySign * tenonLength / 2, -spacing / 2)

  const tenon2 = new THREE.BoxGeometry(tenonThickness, tenonLength, tenonWidth)
  tenon2.translate(0, ySign * tenonLength / 2, spacing / 2)

  // Merge the two geometries
  const positions1 = tenon1.getAttribute('position').array as Float32Array
  const positions2 = tenon2.getAttribute('position').array as Float32Array
  const index1 = tenon1.getIndex()!.array as Uint16Array
  const index2 = tenon2.getIndex()!.array as Uint16Array

  const mergedPositions = new Float32Array(positions1.length + positions2.length)
  mergedPositions.set(positions1, 0)
  mergedPositions.set(positions2, positions1.length)

  const vertexOffset = positions1.length / 3
  const mergedIndices = new Uint16Array(index1.length + index2.length)
  mergedIndices.set(index1, 0)
  for (let i = 0; i < index2.length; i++) {
    mergedIndices[index1.length + i] = index2[i] + vertexOffset
  }

  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3))
  merged.setIndex(new THREE.BufferAttribute(mergedIndices, 1))
  merged.computeVertexNormals()

  return merged
}

export default function TrestleMesh({
  trestleParams,
  tableLength,
  tableHeight,
  topThickness,
  color,
  showJoinery = false,
  explosionOffset = 0,
  opacity = 1
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
    shoulderLength,
    shoulderHeight,
    shoulderWidth,
    shoulderBevelAngle,
    stretcherHeight,
    stretcherThickness
  } = trestleParams

  // Calculate positions
  const totalHeight = tableHeight - topThickness

  // Leg X positions (center of each leg assembly)
  const legX = (tableLength / 2) - legInset

  // Leg height: total height minus foot and shoulder
  const legHeight = totalHeight - footHeight - shoulderHeight

  // Joinery dimensions based on leg/stretcher sizes
  const joineryDims = useMemo(() => {
    // Double tenon for leg-to-foot and leg-to-shoulder
    // Tenons are oriented along X (legThickness direction), spaced along Z (legWidth direction)
    const legTenonThickness = legThickness * 0.3  // ~1/3 of leg thickness
    const legTenonWidth = legWidth * 0.25  // Each tenon is 1/4 of leg width
    const legTenonLength = 1.5  // How far tenon extends into foot/shoulder
    const legTenonSpacing = legWidth * 0.4  // Distance between two tenon centers

    // Single tenon for stretcher-to-leg
    const stretcherTenonThickness = stretcherThickness * 0.35
    const stretcherTenonWidth = stretcherHeight * 0.7
    const stretcherTenonLength = legThickness * 0.8  // Through-tenon goes most of the way through leg

    return {
      legTenonThickness,
      legTenonWidth,
      legTenonLength,
      legTenonSpacing,
      stretcherTenonThickness,
      stretcherTenonWidth,
      stretcherTenonLength
    }
  }, [legThickness, legWidth, stretcherThickness, stretcherHeight])

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

    // Shoulder: mirror of foot (flat top, sloped bottom)
    // Flat section matches leg width
    const shoulderGeo = createShoulderGeometry(shoulderLength, shoulderHeight, shoulderWidth, shoulderBevelAngle, legWidth / 2)

    // Stretcher geometry - spans between the inside faces of the legs
    // Legs are rotated so legThickness is along X axis
    const stretcherLen = (legX * 2) - legThickness
    const stretcherGeo = new THREE.BoxGeometry(stretcherLen, stretcherHeight, stretcherThickness)

    // Double tenon geometry for leg ends (extends in -Y from bottom, +Y from top)
    const { legTenonThickness, legTenonWidth, legTenonLength, legTenonSpacing } = joineryDims
    const legBottomTenonGeo = createDoubleTenon(
      legTenonThickness, legTenonWidth, legTenonLength, legTenonSpacing, 'down'
    )
    const legTopTenonGeo = createDoubleTenon(
      legTenonThickness, legTenonWidth, legTenonLength, legTenonSpacing, 'up'
    )

    // Single tenon geometry for stretcher ends
    const { stretcherTenonThickness, stretcherTenonWidth, stretcherTenonLength } = joineryDims
    const stretcherTenonGeo = new THREE.BoxGeometry(
      stretcherTenonLength, stretcherTenonWidth, stretcherTenonThickness
    )

    return {
      footGeo, legGeo, shoulderGeo, stretcherGeo,
      legBottomTenonGeo, legTopTenonGeo, stretcherTenonGeo
    }
  }, [
    footLength, footHeight, footWidth, footBevelAngle,
    footDadoDepth, footDadoInset,
    legWidth, legHeight, legThickness,
    shoulderLength, shoulderHeight, shoulderWidth, shoulderBevelAngle,
    legX, stretcherHeight, stretcherThickness,
    joineryDims
  ])

  // Y positions - foot sits on floor, leg sits on foot, shoulder sits on leg
  const footY = 0  // Foot geometry starts at floor level
  const legY = footHeight + (legHeight / 2)  // Leg is centered (BoxGeometry)
  const shoulderY = footHeight + legHeight  // Shoulder geometry starts at Y=0, so no offset needed

  // Stretcher at ~55% of the height from floor to bottom of tabletop
  const stretcherY = totalHeight * 0.55

  // Tenon positions
  const legBottomTenonY = footHeight  // Bottom of leg
  const legTopTenonY = footHeight + legHeight  // Top of leg
  // Stretcher tenons extend from each end of the stretcher toward the legs
  const stretcherLen = (legX * 2) - legThickness
  const stretcherLeftTenonX = -stretcherLen / 2 - joineryDims.stretcherTenonLength / 2
  const stretcherRightTenonX = stretcherLen / 2 + joineryDims.stretcherTenonLength / 2

  // Explosion animation springs
  const springConfig = { mass: 1, tension: 180, friction: 20 }

  // Feet explode downward
  const footSpring = useSpring({
    y: footY - explosionOffset * 0.8,
    config: springConfig
  })

  // Legs stay in place (center of explosion)
  const legSpring = useSpring({
    y: legY,
    config: springConfig
  })

  // Shoulders explode upward
  const shoulderSpring = useSpring({
    y: shoulderY + explosionOffset * 0.8,
    config: springConfig
  })

  // Stretcher explodes forward (in -Z direction)
  const stretcherSpring = useSpring({
    z: -explosionOffset * 0.6,
    config: springConfig
  })

  // Leg tenons stay attached to the leg (they're part of the leg)
  // Bottom tenon is at leg bottom, top tenon is at leg top
  const legBottomTenonSpring = useSpring({
    y: legBottomTenonY,  // Stays with leg
    config: springConfig
  })

  const legTopTenonSpring = useSpring({
    y: legTopTenonY,  // Stays with leg
    config: springConfig
  })

  return (
    <group>
      {/* Left end assembly */}
      <group position={[-legX, 0, 0]}>
        {/* Foot */}
        <animated.mesh geometry={geometries.footGeo} position-y={footSpring.y} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </animated.mesh>

        {/* Leg */}
        <animated.mesh geometry={geometries.legGeo} position-y={legSpring.y} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </animated.mesh>

        {/* Leg tenons (double tenon at top and bottom) */}
        {showJoinery && (
          <>
            <animated.mesh geometry={geometries.legBottomTenonGeo} position-y={legBottomTenonSpring.y} castShadow>
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
              <Edges threshold={10} color="#8B7355" />
            </animated.mesh>
            <animated.mesh geometry={geometries.legTopTenonGeo} position-y={legTopTenonSpring.y} castShadow>
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
              <Edges threshold={10} color="#8B7355" />
            </animated.mesh>
          </>
        )}

        {/* Shoulder */}
        <animated.mesh geometry={geometries.shoulderGeo} position-y={shoulderSpring.y} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </animated.mesh>
      </group>

      {/* Right end assembly */}
      <group position={[legX, 0, 0]}>
        {/* Foot */}
        <animated.mesh geometry={geometries.footGeo} position-y={footSpring.y} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </animated.mesh>

        {/* Leg */}
        <animated.mesh geometry={geometries.legGeo} position-y={legSpring.y} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </animated.mesh>

        {/* Leg tenons (double tenon at top and bottom) */}
        {showJoinery && (
          <>
            <animated.mesh geometry={geometries.legBottomTenonGeo} position-y={legBottomTenonSpring.y} castShadow>
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
              <Edges threshold={10} color="#8B7355" />
            </animated.mesh>
            <animated.mesh geometry={geometries.legTopTenonGeo} position-y={legTopTenonSpring.y} castShadow>
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
              <Edges threshold={10} color="#8B7355" />
            </animated.mesh>
          </>
        )}

        {/* Shoulder */}
        <animated.mesh geometry={geometries.shoulderGeo} position-y={shoulderSpring.y} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </animated.mesh>
      </group>

      {/* Center stretcher */}
      <animated.group position-z={stretcherSpring.z}>
        <mesh geometry={geometries.stretcherGeo} position={[0, stretcherY, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
          <Edges threshold={10} color="#8B7355" />
        </mesh>

        {/* Stretcher tenons (single tenon at each end) */}
        {showJoinery && (
          <>
            <mesh geometry={geometries.stretcherTenonGeo} position={[stretcherLeftTenonX, stretcherY, 0]} castShadow>
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
              <Edges threshold={10} color="#8B7355" />
            </mesh>
            <mesh geometry={geometries.stretcherTenonGeo} position={[stretcherRightTenonX, stretcherY, 0]} castShadow>
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
              <Edges threshold={10} color="#8B7355" />
            </mesh>
          </>
        )}
      </animated.group>
    </group>
  )
}
