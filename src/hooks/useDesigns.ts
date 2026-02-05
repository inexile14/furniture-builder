import { useAuth } from '@clerk/clerk-react'
import { trpc } from '../lib/trpc'
import type { TableParams } from '../types/table'

// Helper type to convert TableParams to a passthrough-compatible type
type PassthroughParams = TableParams & { [key: string]: unknown }

export function useDesigns() {
  const { isSignedIn } = useAuth()

  // List user's designs
  const {
    data: designs,
    isLoading,
    refetch,
  } = trpc.designs.list.useQuery(undefined, {
    enabled: isSignedIn,
  })

  // Create a new design
  const createMutation = trpc.designs.create.useMutation({
    onSuccess: () => refetch(),
  })

  // Update a design
  const updateMutation = trpc.designs.update.useMutation({
    onSuccess: () => refetch(),
  })

  // Delete a design
  const deleteMutation = trpc.designs.delete.useMutation({
    onSuccess: () => refetch(),
  })

  const saveDesign = async (
    name: string,
    params: TableParams,
    options?: {
      description?: string
      thumbnail?: string
    }
  ) => {
    return createMutation.mutateAsync({
      name,
      params: params as PassthroughParams,
      description: options?.description,
      thumbnail: options?.thumbnail,
      furnitureType: 'table',
      style: params.style,
    })
  }

  const updateDesign = async (
    id: string,
    params: TableParams,
    options?: {
      name?: string
      thumbnail?: string
    }
  ) => {
    return updateMutation.mutateAsync({
      id,
      params: params as PassthroughParams,
      ...options,
    })
  }

  const deleteDesign = async (id: string) => {
    return deleteMutation.mutateAsync({ id })
  }

  return {
    designs: designs ?? [],
    isLoading,
    saveDesign,
    updateDesign,
    deleteDesign,
    isSaving: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function useDesign(id: string | undefined) {
  const { isSignedIn } = useAuth()

  return trpc.designs.get.useQuery(
    { id: id! },
    {
      enabled: isSignedIn && !!id,
    }
  )
}
