/**
 * Parametric Table Builder - 3D Preview Component
 * Camera setup matches the working cabinet project exactly
 */

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, GizmoHelper, GizmoViewcube } from '@react-three/drei'
import * as THREE from 'three'
import { useTable } from '../../context/TableContext'
import TableModel from './TableModel'
import ViewControls from './ViewControls'
import { COLORS } from '../../constants'

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
  const { params, isExploded } = state

  // Scene bounds - table is centered at origin (X=0, Z=0)
  // Table sits on floor (Y=0) with top at Y=height
  const centerX = 0
  const centerZ = 0
  const tableHeight = params.height

  // Camera distance calculation - base + multiplier so larger tables appear larger
  const maxDimension = Math.max(params.length, params.width, params.height)
  const cameraDistance = 40 + maxDimension * 0.9

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

      {/* Lights - balanced for good edge definition */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[30, 50, 30]} intensity={0.7} />
      <directionalLight position={[-20, 30, -20]} intensity={0.4} />
      <directionalLight position={[0, -10, 0]} intensity={0.15} />

      {/* Environment for subtle reflections */}
      <Environment preset="studio" />

      {/* Table Model */}
      <Suspense fallback={<LoadingFallback />}>
        <TableModel
          params={params}
          isExploded={isExploded}
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

      {/* Orientation Gizmo - click faces/edges/corners to snap camera view */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube
          color="#e8e2d9"
          hoverColor="#c9a86c"
          textColor="#5c4a3a"
          strokeColor="#8b7355"
          opacity={0.9}
          faces={['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back']}
        />
      </GizmoHelper>
    </>
  )
}

export default function TablePreview() {
  return (
    <div className="relative w-full h-full" style={{ background: COLORS.background }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Scene />
      </Canvas>

      {/* View controls overlay */}
      <ViewControls />

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-workshop-500 bg-white/80 px-3 py-2 rounded-md">
        Pan: Left/Middle drag | Orbit: Right drag | Zoom: Scroll
      </div>
    </div>
  )
}
