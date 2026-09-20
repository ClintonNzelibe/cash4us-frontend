import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import type { CommunityPoolFormData } from '../../../../types/admin/community'

interface Props {
  initialData?: Partial<CommunityPoolFormData>
  onSubmit: (data: CommunityPoolFormData) => Promise<void>
  submitLabel?: string
  loading?: boolean
}

export default function CommunityPoolForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Pool',
  loading = false,
}: Props) {
  const [name, setName] = useState(
    initialData?.name || '',
  )

  const [error, setError] = useState('')

  useEffect(() => {
    setName(initialData?.name || '')
  }, [initialData])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError('')

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Pool name is required.')
      return
    }

    try {
      await onSubmit({
        name: trimmedName,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create community pool.',
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Pool Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          disabled={loading}
          placeholder="e.g. September Community Earnings Pool"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating...' : submitLabel}
        </button>
      </div>
    </form>
  )
}