import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { TableParams } from '../../types/table'

interface SaveDesignModalProps {
  params: TableParams
  onSave: (name: string, description?: string) => Promise<void>
  onClose: () => void
  isSaving: boolean
}

export default function SaveDesignModal({
  params,
  onSave,
  onClose,
  isSaving,
}: SaveDesignModalProps) {
  const { isSignedIn } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const styleName = params.style
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter a name for your design')
      return
    }

    try {
      await onSave(name.trim(), description.trim() || undefined)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save design')
    }
  }

  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <h2 className="text-lg font-semibold text-workshop-800 mb-4">
            Sign in to Save
          </h2>
          <p className="text-workshop-600 text-sm mb-4">
            You need to be signed in to save designs.
          </p>
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-workshop-800 mb-4">
          Save Design
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Preview info */}
          <div className="bg-workshop-50 rounded-lg p-3 mb-4 text-sm">
            <div className="text-workshop-600">
              <span className="font-medium">{styleName}</span> Table
            </div>
            <div className="text-workshop-500">
              {params.length}" × {params.width}" × {params.height}"
            </div>
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label
              htmlFor="design-name"
              className="block text-sm font-medium text-workshop-700 mb-1"
            >
              Name *
            </label>
            <input
              id="design-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Dining Table"
              className="w-full px-3 py-2 border border-workshop-300 rounded-lg focus:ring-2 focus:ring-workshop-500 focus:border-workshop-500"
              autoFocus
            />
          </div>

          {/* Description input */}
          <div className="mb-4">
            <label
              htmlFor="design-description"
              className="block text-sm font-medium text-workshop-700 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="design-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes about this design..."
              rows={3}
              className="w-full px-3 py-2 border border-workshop-300 rounded-lg focus:ring-2 focus:ring-workshop-500 focus:border-workshop-500 resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Design'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
