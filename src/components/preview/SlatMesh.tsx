/**
 * Parametric Table Builder - Slat Mesh Component
 * Renders vertical slats for Mission style end panels
 */

import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import type { SlatParams } from '../../types'

interface SlatMeshProps {
  slatParams: SlatParams
  // Panel dimensions (the space between legs where slats go)
  panelWidth: number      // Width of the panel (distance between leg inside faces)
  panelHeight: number     // Height from stretcher top to apron bottom
  // Positioning
  position: [number, number, number]  // Center of the slat panel
  rotation?: number       // Y-axis rotation in radians
  color: string
}

export default function SlatMesh({
  slatParams,
  panelWidth,
  panelHeight,
  position,
  rotation = 0,
  color
}: SlatMeshProps) {
  const slats = useMemo(() => {
    if (!slatParams.enabled || slatParams.count <= 0) return []

    const { count, width, spacing } = slatParams

    // Slats extend full height (no gaps at top/bottom)
    const slatHeight = panelHeight

    if (slatHeight <= 0) return []

    // Use fixed spacing between slats, centered in panel
    const gap = spacing ?? 1  // Default 1" spacing
    const totalWidth = count * width + (count - 1) * gap
    const startX = -totalWidth / 2 + width / 2

    const slatData: { x: number; height: number }[] = []

    for (let i = 0; i < count; i++) {
      const x = startX + i * (width + gap)
      slatData.push({ x, height: slatHeight })
    }

    return slatData
  }, [slatParams, panelWidth, panelHeight])

  if (slats.length === 0) return null

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {slats.map((slat, index) => (
        <mesh
          key={index}
          position={[slat.x, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[slatParams.width, slat.height, slatParams.thickness]} />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
            flatShading={true}
            polygonOffset={true}
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
          <Edges threshold={15} color="#5C4A3A" />
        </mesh>
      ))}
    </group>
  )
}
