/**
 * React hook for Manifold CSG operations
 *
 * Handles async WASM initialization and provides CSG geometry creation.
 */

import { useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  initManifold,
  isManifoldReady,
  createBoxLegWithMortises,
  cutMortisesFromGeometry,
  createSplayedLegWithMortises,
  createChamferedLegWithMortises
} from '../engine/manifold'

interface MortiseDefinition {
  position: [number, number, number]
  size: [number, number, number]
}

/**
 * Hook to initialize Manifold and track ready state
 */
export function useManifoldInit(): boolean {
  const [ready, setReady] = useState(isManifoldReady())

  useEffect(() => {
    if (!ready) {
      initManifold().then(() => setReady(true))
    }
  }, [ready])

  return ready
}

/**
 * Hook to create box leg geometry with mortises using Manifold CSG
 * (For square legs only)
 *
 * Returns null while Manifold is initializing, then returns the geometry.
 */
export function useLegWithMortises(
  legWidth: number,
  legHeight: number,
  legDepth: number,
  mortises: MortiseDefinition[],
  enabled: boolean = true
): THREE.BufferGeometry | null {
  const manifoldReady = useManifoldInit()

  const geometry = useMemo(() => {
    if (!manifoldReady || !enabled || mortises.length === 0) {
      return null
    }

    try {
      return createBoxLegWithMortises(legWidth, legHeight, legDepth, mortises)
    } catch (error) {
      console.error('Manifold CSG error:', error)
      return null
    }
  }, [manifoldReady, legWidth, legHeight, legDepth, mortises, enabled])

  // Clean up geometry on unmount or when it changes
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [geometry])

  return geometry
}

/**
 * Hook to cut mortises from any Three.js geometry using Manifold CSG
 * (For turned legs)
 *
 * Returns null while Manifold is initializing, then returns the geometry with mortises cut out.
 */
export function useGeometryWithMortises(
  baseGeometry: THREE.BufferGeometry | null,
  mortises: MortiseDefinition[],
  enabled: boolean = true
): THREE.BufferGeometry | null {
  const manifoldReady = useManifoldInit()

  const geometry = useMemo(() => {
    if (!manifoldReady) {
      return null
    }
    if (!enabled) {
      return null
    }
    if (!baseGeometry) {
      return null
    }
    if (mortises.length === 0) {
      return null
    }

    try {
      const result = cutMortisesFromGeometry(baseGeometry, mortises)
      return result
    } catch (error) {
      console.error('Manifold CSG error for custom geometry:', error)
      return null
    }
  }, [manifoldReady, baseGeometry, mortises, enabled])

  // Clean up geometry on unmount or when it changes
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [geometry])

  return geometry
}

/**
 * Hook to create chamfered square leg geometry with mortises using Manifold CSG
 * Creates geometry directly in Manifold with chamfered foot
 */
export function useChamferedLegWithMortises(
  legSize: number,
  height: number,
  chamferSize: number,
  mortises: MortiseDefinition[],
  enabled: boolean = true
): THREE.BufferGeometry | null {
  const manifoldReady = useManifoldInit()

  const geometry = useMemo(() => {
    if (!manifoldReady || !enabled || mortises.length === 0) {
      return null
    }

    try {
      return createChamferedLegWithMortises(legSize, height, chamferSize, mortises)
    } catch (error) {
      console.error('Manifold CSG error for chamfered leg:', error)
      return null
    }
  }, [manifoldReady, legSize, height, chamferSize, mortises, enabled])

  // Clean up geometry on unmount or when it changes
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [geometry])

  return geometry
}

/**
 * Hook to create splayed leg geometry with mortises using Manifold CSG
 * Creates geometry directly in Manifold with Y-compensated top/bottom faces
 */
export function useSplayedLegWithMortises(
  topSize: number,
  bottomSize: number,
  height: number,
  splayAngle: number,
  legPosition: 'FL' | 'FR' | 'BL' | 'BR',
  mortises: MortiseDefinition[],
  enabled: boolean = true
): THREE.BufferGeometry | null {
  const manifoldReady = useManifoldInit()

  const geometry = useMemo(() => {
    if (!manifoldReady || !enabled || mortises.length === 0) {
      return null
    }

    try {
      return createSplayedLegWithMortises(
        topSize,
        bottomSize,
        height,
        splayAngle,
        legPosition,
        mortises
      )
    } catch (error) {
      console.error('Manifold CSG error for splayed leg:', error)
      return null
    }
  }, [manifoldReady, topSize, bottomSize, height, splayAngle, legPosition, mortises, enabled])

  // Clean up geometry on unmount or when it changes
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [geometry])

  return geometry
}
