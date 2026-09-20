import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import type {
  AdminAdvertiser,
  
  AdvertisingCampaignStatus,
  CampaignFormData,
} from '../../../../types/admin/advertising'

interface CampaignFormProps {
  advertisers: AdminAdvertiser[]
  initialData?: Partial<CampaignFormData>
  onSubmit: (data: CampaignFormData) => Promise<void>
  submitLabel?: string
  loading?: boolean
}

const statuses: AdvertisingCampaignStatus[] = [
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
]

export default function CampaignForm({
  advertisers,
  initialData,
  onSubmit,
  submitLabel = 'Save Campaign',
  loading = false,
}: CampaignFormProps) {
  const [form, setForm] = useState<CampaignFormData>({
    advertiser: initialData?.advertiser || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    campaign_url: initialData?.campaign_url || '',
    status: initialData?.status || 'DRAFT',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
  })

  const [error, setError] = useState('')

  useEffect(() => {
    setForm({
      advertiser: initialData?.advertiser || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      campaign_url: initialData?.campaign_url || '',
      status: initialData?.status || 'DRAFT',
      start_date: initialData?.start_date || '',
      end_date: initialData?.end_date || '',
    })
  }, [initialData])

  const updateField = <K extends keyof CampaignFormData>(
    field: K,
    value: CampaignFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!form.advertiser) {
      setError('Please select an advertiser.')
      return
    }

    if (!form.title.trim()) {
      setError('Campaign title is required.')
      return
    }

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        campaign_url: form.campaign_url.trim(),
        start_date: form.start_date || '',
        end_date: form.end_date || '',
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save campaign.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Advertiser
          </label>

          <select
            value={form.advertiser}
            onChange={(event) =>
              updateField('advertiser', event.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          >
            <option value="">Select advertiser</option>

            {advertisers.map((advertiser) => (
              <option key={advertiser.id} value={advertiser.id}>
                {advertiser.name}
                {advertiser.company_name
                  ? ` — ${advertiser.company_name}`
                  : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                'status',
                event.target.value as AdvertisingCampaignStatus,
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Campaign Title
        </label>

        <input
          type="text"
          value={form.title}
          onChange={(event) =>
            updateField('title', event.target.value)
          }
          disabled={loading}
          placeholder="Enter campaign title"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={(event) =>
            updateField('description', event.target.value)
          }
          disabled={loading}
          rows={4}
          placeholder="Describe the campaign"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Campaign URL
        </label>

        <input
          type="url"
          value={form.campaign_url}
          onChange={(event) =>
            updateField('campaign_url', event.target.value)
          }
          disabled={loading}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            value={form.start_date}
            onChange={(event) =>
              updateField('start_date', event.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <input
            type="date"
            value={form.end_date}
            onChange={(event) =>
              updateField('end_date', event.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}