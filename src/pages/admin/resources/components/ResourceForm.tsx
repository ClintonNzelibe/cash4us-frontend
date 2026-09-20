import { useEffect, useState } from 'react'

import type {
  ResourceFormData,
  ResourceType,
} from '../../../../types/admin/resources'

interface Props {
  initialData?: Partial<ResourceFormData>
  loading?: boolean
  submitLabel: string
  onSubmit: (data: ResourceFormData) => Promise<void>
}

const defaultData: ResourceFormData = {
  title: '',
  description: '',
  resource_type: 'DOCUMENT',
  external_link: '',
  resource_file: null,
}

export default function ResourceForm({
  initialData,
  loading = false,
  submitLabel,
  onSubmit,
}: Props) {
  const [formData, setFormData] =
    useState<ResourceFormData>({
      ...defaultData,
      ...initialData,
    })

  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultData,
        ...initialData,
      })
    }
  }, [initialData])

  const updateField = <
    K extends keyof ResourceFormData,
  >(
    field: K,
    value: ResourceFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setError('Title is required.')
      return
    }

    if (
      formData.resource_type === 'LINK' &&
      !formData.external_link.trim()
    ) {
      setError(
        'External link is required for link resources.',
      )
      return
    }

    try {
      setError('')
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        external_link:
          formData.external_link.trim(),
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save resource.',
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label
          htmlFor="resource-title"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Title
        </label>

        <input
          id="resource-title"
          type="text"
          value={formData.title}
          onChange={(event) =>
            updateField('title', event.target.value)
          }
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="resource-description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="resource-description"
          rows={5}
          value={formData.description}
          onChange={(event) =>
            updateField(
              'description',
              event.target.value,
            )
          }
          disabled={loading}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="resource-type"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Resource Type
        </label>

        <select
          id="resource-type"
          value={formData.resource_type}
          onChange={(event) =>
            updateField(
              'resource_type',
              event.target.value as ResourceType,
            )
          }
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        >
          <option value="PDF">PDF</option>
          <option value="VIDEO">Video</option>
          <option value="FLYER">Flyer</option>
          <option value="DOCUMENT">Document</option>
          <option value="LINK">External Link</option>
        </select>
      </div>

      {formData.resource_type === 'LINK' ? (
        <div>
          <label
            htmlFor="external-link"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            External Link
          </label>

          <input
            id="external-link"
            type="url"
            value={formData.external_link}
            onChange={(event) =>
              updateField(
                'external_link',
                event.target.value,
              )
            }
            disabled={loading}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          />
        </div>
      ) : (
        <div>
          <label
            htmlFor="resource-file"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Resource File
          </label>

          <input
            id="resource-file"
            type="file"
            onChange={(event) =>
              updateField(
                'resource_file',
                event.target.files?.[0] || null,
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          />

          {initialData?.resource_file && (
            <p className="mt-2 text-xs text-slate-500">
              A file is already attached. Choose a new
              file only if you want to replace it.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}