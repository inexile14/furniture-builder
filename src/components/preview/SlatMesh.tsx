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

    const { count, width, topGap, bottomGap } = slatParams

    // Actual slat height after accounting for gaps
    const slatHeight = panelHeight - topGap - bottomGap

    if (slatHeight <= 0) return []

    // Calculate spacing between slats
    // Total space for slats + gaps between them
    const totalSlatWidth = count * width
    const availableSpace = panelWidth - totalSlatWidth
    const gapBetweenSlats = availableSpace / (count + 1)

    const slatData: { x: number; height: number }[] = []

    for (let i = 0; i < count; i++) {
      // Position each slat
      const x = -panelWidth / 2 + gapBetweenSlats + width / 2 + i * (width + gapBetweenSlats)
      slatData.push({ x, height: slatHeight })
    }

    return slatData
  }, [slatParams, panelWidth, panelHeight])

  if (slats.length === 0) return null

  // Y position: center of the slat panel
  // Slats are centered vertically in the available space
  const yOffset = (slatParams.topGap - slatParams.bottomGap) / 2

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {slats.map((slat, index) => (
        <mesh
          key={index}
          position={[slat.x, yOffset, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[slatParams.width, slat.height, slatParams.thickness]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
          <Edges threshold={15} color="#8B7355" />
        </mesh>
      ))}
    </group>
  )
}
