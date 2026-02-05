/**
 * Parametric Table Builder - 3D Preview Component
 * Camera setup matches the working cabinet project exactly
 */

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useTable } from '../../context/TableContext'
import TableModel from './TableModel'
import ViewControls from './ViewControls'
import RenderStyleSelector from './RenderStyleSelector'
import { RENDER_STYLE_CONFIGS, LIGHTING_PRESETS } from '../../constants/rendering'

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ccc" wireframe />
    </mesh>
  )
}

function Scene() {
  const { state } = useTable()
  const { params, isExploded, isTransparent, showJoinery, renderSettings } = state

  // Get render style config
  const styleConfig = RENDER_STYLE_CONFIGS[renderSettings.style]
  const lightingPreset = LIGHTING_PRESETS[styleConfig.lighting]

  // Scene bounds - table is centered at origin (X=0, Z=0)
  // Table sits on floor (Y=0) with top at Y=height
  const centerX = 0
  const centerZ = 0
  const tableHeight = params.height

  // Camera distance calculation - base + multiplier so larger tables appear larger
  const maxDimension = Math.max(params.length, params.width, params.height)
  const cameraDistance = 40 + maxDimension * 0.9

  // Environment preset based on lighting
  const envPreset = lightingPreset.environment === 'sunset' ? 'sunset' :
                    lightingPreset.environment === 'studio' ? 'studio' : 'warehouse'

  return (
    <>
      {/* Camera - positioned to see full table including legs */}
      <PerspectiveCamera
        makeDefault
        position={[
          centerX + cameraDistance * 0.8,
          tableHeight * 0.35 + cameraDistance * 0.5,
          cameraDistance
        ]}
        fov={35}
      />

      {/* Lights - based on lighting preset */}
      <ambientLight intensity={lightingPreset.ambient} />
      {lightingPreset.lights.map((light, i) => {
        if (light.type === 'directional') {
          return (
            <directionalLight
              key={i}
              position={light.position}
              intensity={light.intensity}
              color={light.color}
              castShadow={light.castShadow}
            />
          )
        }
        if (light.type === 'point') {
          return (
            <pointLight
              key={i}
              position={light.position}
              intensity={light.intensity}
              color={light.color}
            />
          )
        }
        return null
      })}

      {/* Environment for reflections - only for shaded/realistic modes */}
      {styleConfig.lighting !== 'basic' && (
        <Environment preset={envPreset} />
      )}

      {/* Table Model */}
      <Suspense fallback={<LoadingFallback />}>
        <TableModel
          params={params}
          isExploded={isExploded}
          isTransparent={isTransparent || renderSettings.style === 'xray'}
          showJoinery={showJoinery}
          renderSettings={renderSettings}
        />
      </Suspense>

      {/* Controls - left=pan, right=orbit, scroll zoom reversed */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={-1}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.ROTATE
        }}
        minDistance={10}
        maxDistance={300}
        target={[centerX, tableHeight * 0.35, centerZ]}
      />

    </>
  )
}

export default function TablePreview() {
  const { state } = useTable()
  const { renderSettings } = state

  // Hidden line mode uses white background
  const bgColor = renderSettings.style === 'hidden-line' ? '#ffffff' : renderSettings.backgroundColor

  return (
    <div className="relative w-full h-full" style={{ background: bgColor }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Scene />
      </Canvas>

      {/* Render style selector */}
      <RenderStyleSelector />

      {/* View controls overlay */}
      <ViewControls />

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-workshop-500 bg-white/80 px-3 py-2 rounded-md">
        Pan: Left/Middle drag | Orbit: Right drag | Zoom: Scroll
      </div>
    </div>
  )
}
