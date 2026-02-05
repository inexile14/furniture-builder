/**
 * Manifold 3D CSG Operations
 *
 * Provides robust boolean operations (subtract, union, intersect) for 3D geometry.
 * Uses Google's Manifold library via WASM for guaranteed manifold output.
 */

import Module from 'manifold-3d'
import * as THREE from 'three'

// Use any for the WASM module type to avoid complex generic issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wasm: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let initPromise: Promise<any> | null = null

/**
 * Initialize the Manifold WASM module
 * Call this early in app startup for best performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initManifold(): Promise<any> {
  if (wasm) return wasm

  if (!initPromise) {
    console.log('Starting Manifold WASM initialization...')
    // Configure WASM location - served from public folder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initPromise = Module({
      locateFile: (path: string) => {
        if (path.endsWith('.wasm')) {
          return '/manifold.wasm'  // Served from public folder
        }
        return path
      }
    } as any).then(module => {
      // Must call setup() before using Manifold
      module.setup()
      wasm = module
      console.log('Manifold WASM initialized')
      return module
    }).catch(err => {
      console.error('Manifold WASM failed to initialize:', err)
      throw err
    })
  }

  return initPromise
}

/**
 * Check if Manifold is initialized
 */
export function isManifoldReady(): boolean {
  return wasm !== null
}

/**
 * Convert Three.js BufferGeometry to Manifold mesh
 */
function geometryToManifold(geometry: THREE.BufferGeometry): ReturnType<typeof wasm.Manifold.ofMesh> {
  if (!wasm) {
    throw new Error('Manifold not initialized')
  }

  // Ensure geometry is non-indexed for simplicity, or handle indices
  const geo = geometry.index ? geometry.toNonIndexed() : geometry

  const positions = geo.getAttribute('position')
  const vertCount = positions.count

  if (vertCount === 0) {
    throw new Error('Geometry has no vertices')
  }

  if (vertCount % 3 !== 0) {
    console.warn(`Geometry vertex count (${vertCount}) not divisible by 3, may have issues`)
  }

  // Build vertex array (just positions, 3 floats per vertex)
  const vertProperties = new Float32Array(vertCount * 3)
  for (let i = 0; i < vertCount; i++) {
    vertProperties[i * 3] = positions.getX(i)
    vertProperties[i * 3 + 1] = positions.getY(i)
    vertProperties[i * 3 + 2] = positions.getZ(i)
  }

  // Build triangle indices (every 3 vertices form a triangle)
  const triVerts = new Uint32Array(vertCount)
  for (let i = 0; i < vertCount; i++) {
    triVerts[i] = i
  }

  // Create Manifold mesh
  const mesh = new wasm.Mesh({
    numProp: 3,
    vertProperties,
    triVerts
  })

  const manifold = wasm.Manifold.ofMesh(mesh)

  // Check if the resulting manifold is valid
  const status = manifold.status()
  if (status !== 0) {
    console.warn(`Manifold.ofMesh returned non-zero status: ${status}. Geometry may not be watertight.`)
  }

  return manifold
}

/**
 * Convert Manifold to Three.js BufferGeometry
 */
function manifoldToGeometry(manifold: ReturnType<typeof wasm.Manifold.cube>): THREE.BufferGeometry {
  const mesh = manifold.getMesh()
  const geometry = new THREE.BufferGeometry()

  const numProp = mesh.numProp
  const vertCount = mesh.vertProperties.length / numProp

  const positions = new Float32Array(vertCount * 3)
  for (let i = 0; i < vertCount; i++) {
    positions[i * 3] = mesh.vertProperties[i * numProp]
    positions[i * 3 + 1] = mesh.vertProperties[i * numProp + 1]
    positions[i * 3 + 2] = mesh.vertProperties[i * numProp + 2]
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(new THREE.BufferAttribute(mesh.triVerts, 1))
  geometry.computeVertexNormals()

  return geometry
}

/**
 * Create a box leg with mortise cutouts using Manifold CSG
 * (For square legs)
 */
export function createBoxLegWithMortises(
  legWidth: number,
  legHeight: number,
  legDepth: number,
  mortises: Array<{
    position: [number, number, number]
    size: [number, number, number]
  }>
): THREE.BufferGeometry {
  if (!wasm) {
    throw new Error('Manifold not initialized. Call initManifold() first.')
  }

  // Create the base leg (centered)
  let leg = wasm.Manifold.cube([legWidth, legHeight, legDepth], true)

  // Subtract each mortise
  for (const mortise of mortises) {
    const mortiseBox = wasm.Manifold.cube(mortise.size, true)
      .translate(mortise.position)

    const newLeg = leg.subtract(mortiseBox)
    leg.delete()
    mortiseBox.delete()
    leg = newLeg
  }

  const geometry = manifoldToGeometry(leg)
  leg.delete()

  return geometry
}

/**
 * Cut mortises from any Three.js geometry using Manifold CSG
 * (For tapered, turned, splayed legs, etc.)
 */
export function cutMortisesFromGeometry(
  baseGeometry: THREE.BufferGeometry,
  mortises: Array<{
    position: [number, number, number]
    size: [number, number, number]
  }>
): THREE.BufferGeometry {
  if (!wasm) {
    throw new Error('Manifold not initialized. Call initManifold() first.')
  }

  // Convert Three.js geometry to Manifold
  let leg: ReturnType<typeof wasm.Manifold.ofMesh>
  try {
    leg = geometryToManifold(baseGeometry)
  } catch (error) {
    console.error('Failed to convert geometry to Manifold:', error)
    throw error
  }

  // Check if geometry is empty/invalid
  const volume = leg.getProperties().volume
  if (volume <= 0) {
    console.warn('Converted geometry has zero or negative volume. Geometry may not be watertight.')
  }

  // Subtract each mortise
  for (const mortise of mortises) {
    const mortiseBox = wasm.Manifold.cube(mortise.size, true)
      .translate(mortise.position)

    const newLeg = leg.subtract(mortiseBox)
    leg.delete()
    mortiseBox.delete()
    leg = newLeg
  }

  const geometry = manifoldToGeometry(leg)
  leg.delete()

  return geometry
}

/**
 * Create a square leg with chamfered foot and mortise cutouts
 *
 * The chamfer is at the bottom of the leg, cutting the corners at an angle.
 */
export function createChamferedLegWithMortises(
  legSize: number,
  height: number,
  chamferSize: number,
  mortises: Array<{
    position: [number, number, number]
    size: [number, number, number]
  }>
): THREE.BufferGeometry {
  if (!wasm) {
    throw new Error('Manifold not initialized. Call initManifold() first.')
  }

  const hS = legSize / 2
  const hH = height / 2
  const c = Math.min(chamferSize, hS * 0.9)  // Cap chamfer at 90% of half-size

  // Create main box for the leg
  let leg = wasm.Manifold.cube([legSize, height, legSize], true)

  // Create chamfer cuts at the bottom four corners
  // Each chamfer is a rotated box that cuts the corner
  const chamferCutSize = c * 2  // Size of the cutting box
  const yBottom = -hH
  const chamferY = yBottom + c / 2  // Center the cut box

  // We'll use a different approach: create the chamfered shape by subtracting
  // angled boxes from each corner at the bottom

  // For each corner, create a box rotated 45 degrees to cut the chamfer
  const corners = [
    { x: -hS, z: -hS, rotY: Math.PI / 4 },      // -X, -Z corner
    { x: hS, z: -hS, rotY: -Math.PI / 4 },      // +X, -Z corner
    { x: hS, z: hS, rotY: Math.PI / 4 },        // +X, +Z corner
    { x: -hS, z: hS, rotY: -Math.PI / 4 },      // -X, +Z corner
  ]

  // Actually, a simpler approach: create a smaller box at the bottom and union with main box
  // But Manifold doesn't have chamfer/bevel built-in, so let's use hull or manual vertices

  // Simplest approach: Create the chamfered leg using hull of two rectangles
  // Top rectangle: full size at top
  // Bottom rectangle: inset at very bottom

  // Even simpler: just subtract corner wedges from the bottom
  // Create 4 triangular prism cuts at each bottom edge

  // Let's use a practical approach: create the shape from vertices
  // 12 vertices: 4 at top (full size), 4 at chamfer start, 4 at bottom (inset)

  const yTop = hH
  const yChamferStart = -hH + c
  const inset = c  // How much the bottom is inset

  // Vertices for the chamfered leg (counterclockwise when viewed from outside)
  const vertices = new Float32Array([
    // Top 4 vertices (0-3) - full size
    -hS, yTop, -hS,  // 0: -X, -Z
     hS, yTop, -hS,  // 1: +X, -Z
     hS, yTop,  hS,  // 2: +X, +Z
    -hS, yTop,  hS,  // 3: -X, +Z
    // Chamfer start 4 vertices (4-7) - full size at chamfer transition
    -hS, yChamferStart, -hS,  // 4
     hS, yChamferStart, -hS,  // 5
     hS, yChamferStart,  hS,  // 6
    -hS, yChamferStart,  hS,  // 7
    // Bottom 4 vertices (8-11) - inset
    -hS + inset, yBottom, -hS + inset,  // 8
     hS - inset, yBottom, -hS + inset,  // 9
     hS - inset, yBottom,  hS - inset,  // 10
    -hS + inset, yBottom,  hS - inset,  // 11
  ])

  // Triangles - CCW winding when viewed from outside (outward normals)
  const triangles = new Uint32Array([
    // Top face (+Y normal) - CCW from above
    0, 3, 2,
    0, 2, 1,
    // Bottom face (-Y normal) - CW from above = CCW from below
    8, 9, 10,
    8, 10, 11,
    // Upper side faces (top to chamfer start)
    // Front (-Z): CCW from -Z: 0→4→5→1
    0, 4, 5,
    0, 5, 1,
    // Right (+X): CCW from +X: 1→5→6→2
    1, 5, 6,
    1, 6, 2,
    // Back (+Z): CCW from +Z: 2→6→7→3
    2, 6, 7,
    2, 7, 3,
    // Left (-X): CCW from -X: 3→7→4→0
    3, 7, 4,
    3, 4, 0,
    // Chamfer faces (chamfer start to bottom)
    // Front chamfer (-Z): CCW from -Z: 4→8→9→5
    4, 8, 9,
    4, 9, 5,
    // Right chamfer (+X): CCW from +X: 5→9→10→6
    5, 9, 10,
    5, 10, 6,
    // Back chamfer (+Z): CCW from +Z: 6→10→11→7
    6, 10, 11,
    6, 11, 7,
    // Left chamfer (-X): CCW from -X: 7→11→8→4
    7, 11, 8,
    7, 8, 4,
  ])

  // Create Manifold mesh from vertices and triangles
  const mesh = new wasm.Mesh({
    numProp: 3,
    vertProperties: vertices,
    triVerts: triangles
  })

  leg = wasm.Manifold.ofMesh(mesh)

  // Check validity
  const status = leg.status()
  if (status !== 0) {
    console.warn(`Chamfered leg Manifold status: ${status}`)
  }

  // Subtract each mortise
  for (const mortise of mortises) {
    const mortiseBox = wasm.Manifold.cube(mortise.size, true)
      .translate(mortise.position)

    const newLeg = leg.subtract(mortiseBox)
    leg.delete()
    mortiseBox.delete()
    leg = newLeg
  }

  const geometry = manifoldToGeometry(leg)
  leg.delete()

  return geometry
}

/**
 * Create a splayed leg with Y-compensated top/bottom faces and mortise cutouts
 *
 * Splayed legs need pre-tilted top/bottom faces so they end up horizontal after rotation.
 * This function creates the geometry directly in Manifold to avoid conversion issues.
 */
export function createSplayedLegWithMortises(
  topSize: number,
  bottomSize: number,
  height: number,
  splayAngle: number,
  legPosition: 'FL' | 'FR' | 'BL' | 'BR',
  mortises: Array<{
    position: [number, number, number]
    size: [number, number, number]
  }>
): THREE.BufferGeometry {
  if (!wasm) {
    throw new Error('Manifold not initialized. Call initManifold() first.')
  }

  const t = topSize / 2
  const b = bottomSize / 2
  const splayRad = (splayAngle * Math.PI) / 180

  // Determine rotation angles for this leg position
  const rotations: Record<string, { θx: number; θz: number }> = {
    FL: { θx: splayRad, θz: -splayRad },
    FR: { θx: splayRad, θz: splayRad },
    BL: { θx: -splayRad, θz: -splayRad },
    BR: { θx: -splayRad, θz: splayRad }
  }
  const { θx, θz } = rotations[legPosition]

  // Y adjustment to keep faces horizontal after rotation
  const yAdjust = (x: number, z: number): number => {
    return -x * Math.sin(θz) + z * Math.sin(θx)
  }

  const yTopBase = height / 2
  const yBottomBase = -height / 2

  // 8 vertices: 4 top corners, 4 bottom corners
  // Order: v0(-X,-Z), v1(+X,-Z), v2(+X,+Z), v3(-X,+Z)
  const vertices = new Float32Array([
    // Top 4 vertices (0-3)
    -t, yTopBase + yAdjust(-t, -t), -t,  // v0
     t, yTopBase + yAdjust( t, -t), -t,  // v1
     t, yTopBase + yAdjust( t,  t),  t,  // v2
    -t, yTopBase + yAdjust(-t,  t),  t,  // v3
    // Bottom 4 vertices (4-7)
    -b, yBottomBase + yAdjust(-b, -b), -b,  // v4
     b, yBottomBase + yAdjust( b, -b), -b,  // v5
     b, yBottomBase + yAdjust( b,  b),  b,  // v6
    -b, yBottomBase + yAdjust(-b,  b),  b,  // v7
  ])

  // 12 triangles (6 faces x 2 triangles each)
  // Using counterclockwise winding for outward-facing normals
  const triangles = new Uint32Array([
    // Top face (+Y normal) - v0, v1, v2, v3 counterclockwise from above
    0, 2, 1,
    0, 3, 2,
    // Bottom face (-Y normal) - v4, v5, v6, v7 clockwise from above = counterclockwise from below
    4, 5, 6,
    4, 6, 7,
    // Front face (-Z normal) - v0, v1, v5, v4
    0, 1, 5,
    0, 5, 4,
    // Back face (+Z normal) - v2, v3, v7, v6
    2, 3, 7,
    2, 7, 6,
    // Right face (+X normal) - v1, v2, v6, v5
    1, 2, 6,
    1, 6, 5,
    // Left face (-X normal) - v3, v0, v4, v7
    3, 0, 4,
    3, 4, 7,
  ])

  // Create Manifold mesh
  const mesh = new wasm.Mesh({
    numProp: 3,
    vertProperties: vertices,
    triVerts: triangles
  })

  let leg = wasm.Manifold.ofMesh(mesh)

  // Check validity
  const status = leg.status()
  if (status !== 0) {
    console.warn(`Splayed leg Manifold status: ${status}`)
  }

  // Subtract each mortise
  for (const mortise of mortises) {
    const mortiseBox = wasm.Manifold.cube(mortise.size, true)
      .translate(mortise.position)

    const newLeg = leg.subtract(mortiseBox)
    leg.delete()
    mortiseBox.delete()
    leg = newLeg
  }

  const geometry = manifoldToGeometry(leg)
  leg.delete()

  return geometry
}

// Keep old function name for backwards compatibility
export const createLegWithMortises = createBoxLegWithMortises
