import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { TableParams } from '../../types/table'

interface Design {
  id: string
  name: string
  description?: string | null
  style?: string | null
  params: unknown
  createdAt: Date
  updatedAt: Date
}

interface MyDesignsPanelProps {
  designs: Design[]
  isLoading: boolean
  onLoad: (design: Design) => void
  onDelete: (id: string) => Promise<{ deleted: boolean }>
  onClose: () => void
}

export default function MyDesignsPanel({
  designs,
  isLoading,
  onLoad,
  onDelete,
  onClose,
}: MyDesignsPanelProps) {
  const { isSignedIn } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatStyle = (style?: string | null) => {
    if (!style) return 'Custom'
    return style
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-workshop-800">My Designs</h2>
          <button
            onClick={onClose}
            className="text-workshop-500 hover:text-workshop-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-workshop-600 mb-2">Sign in to view your saved designs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-workshop-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-workshop-800">My Designs</h2>
        <button
          onClick={onClose}
          className="text-workshop-500 hover:text-workshop-700 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-workshop-500">Loading designs...</div>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-workshop-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-workshop-600 text-sm">No saved designs yet</p>
            <p className="text-workshop-500 text-xs mt-1">
              Use the Save button to save your current design
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-workshop-50 border border-workshop-200 rounded-lg p-4 hover:border-workshop-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-workshop-800">{design.name}</h3>
                    <p className="text-xs text-workshop-500">
                      {formatStyle(design.style)} • {formatDate(design.updatedAt)}
                    </p>
                  </div>
                </div>

                {design.description && (
                  <p className="text-sm text-workshop-600 mb-3 line-clamp-2">
                    {design.description}
                  </p>
                )}

                <div className="text-xs text-workshop-500 mb-3">
                  {(design.params as TableParams).length}" × {(design.params as TableParams).width}" × {(design.params as TableParams).height}"
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {confirmDelete === design.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(design.id)}
                        disabled={deletingId === design.id}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
                      >
                        {deletingId === design.id ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        disabled={deletingId === design.id}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-workshop-700 bg-workshop-200 hover:bg-workshop-300 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onLoad(design)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-workshop-600 hover:bg-workshop-700 rounded transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => setConfirmDelete(design.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
