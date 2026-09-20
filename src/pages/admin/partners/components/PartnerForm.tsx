import { useEffect, useState } from 'react'
import type {
  AdminPartner,
  PartnerFormData,
} from '../../../../types/admin/partners'

interface PartnerFormProps {
  initialData?: AdminPartner
  loading?: boolean
  error?: string
  submitLabel: string
  onSubmit: (data: PartnerFormData) => Promise<void>
}

export default function PartnerForm({
  initialData,
  loading = false,
  error = '',
  submitLabel,
  onSubmit,
}: PartnerFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  )
  const [website, setWebsite] = useState(initialData?.website ?? '')
  const [logo, setLogo] = useState<File | null>(null)

  useEffect(() => {
    setName(initialData?.name ?? '')
    setDescription(initialData?.description ?? '')
    setWebsite(initialData?.website ?? '')
    setLogo(null)
  }, [initialData])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
      logo,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Partner information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the partner company details.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Partner name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter partner name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Website
            </label>

            <input
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the partner company..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Partner logo
            </label>

            {initialData?.logo && (
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={initialData.logo}
                  alt={initialData.name}
                  className="h-16 w-16 rounded-lg border border-slate-200 object-contain p-2"
                />
                <span className="text-sm text-slate-500">
                  Current logo
                </span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setLogo(event.target.files?.[0] ?? null)
              }
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}