import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import type {
  AdminCampaign,
  AdvertisingRevenueSource,
  RevenueFormData,
} from '../../../../types/admin/advertising'

interface RevenueFormProps {
  campaigns: AdminCampaign[]
  initialData?: Partial<RevenueFormData>
  onSubmit: (data: RevenueFormData) => Promise<void>
  submitLabel?: string
  loading?: boolean
}

const sources: AdvertisingRevenueSource[] = [
  'CAMPAIGN',
  'PARTNERSHIP',
  'SPONSORSHIP',
  'OTHER',
]

export default function RevenueForm({
  campaigns,
  initialData,
  onSubmit,
  submitLabel = 'Create Revenue',
  loading = false,
}: RevenueFormProps) {
  const [form, setForm] = useState<RevenueFormData>({
    source: initialData?.source || 'CAMPAIGN',
    campaign: initialData?.campaign || '',
    amount: initialData?.amount || 0,
    reference: initialData?.reference || '',
    remarks: initialData?.remarks || '',
    received_at: initialData?.received_at || '',
  })

  const [error, setError] = useState('')

  useEffect(() => {
    setForm({
      source: initialData?.source || 'CAMPAIGN',
      campaign: initialData?.campaign || '',
      amount: initialData?.amount || 0,
      reference: initialData?.reference || '',
      remarks: initialData?.remarks || '',
      received_at: initialData?.received_at || '',
    })
  }, [initialData])

  const updateField = <K extends keyof RevenueFormData>(
    field: K,
    value: RevenueFormData[K],
  ) => {
    setForm((current: RevenueFormData) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError('')

    if (!form.source) {
      setError('Revenue source is required.')
      return
    }

    if (!form.amount || form.amount <= 0) {
      setError('Revenue amount must be greater than zero.')
      return
    }

    if (form.source === 'CAMPAIGN' && !form.campaign) {
      setError('Campaign revenue must be linked to a campaign.')
      return
    }

    try {
      await onSubmit({
        ...form,
        reference: form.reference.trim(),
        remarks: form.remarks.trim(),
        campaign: form.campaign || '',
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save revenue.',
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
            Revenue Source
          </label>

          <select
            value={form.source}
            onChange={(event) =>
              updateField(
                'source',
                event.target.value as AdvertisingRevenueSource,
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount || ''}
            onChange={(event) =>
              updateField('amount', Number(event.target.value))
            }
            disabled={loading}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Campaign
        </label>

        <select
          value={form.campaign}
          onChange={(event) =>
            updateField('campaign', event.target.value)
          }
          disabled={loading || form.source !== 'CAMPAIGN'}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        >
          <option value="">
            {form.source === 'CAMPAIGN'
              ? 'Select campaign'
              : 'Not applicable'}
          </option>

          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.title} — {campaign.advertiser_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Reference
        </label>

        <input
          type="text"
          value={form.reference}
          onChange={(event) =>
            updateField('reference', event.target.value)
          }
          disabled={loading}
          placeholder="Payment or revenue reference"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Received At
        </label>

        <input
          type="datetime-local"
          value={form.received_at}
          onChange={(event) =>
            updateField('received_at', event.target.value)
          }
          disabled={loading}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Remarks
        </label>

        <textarea
          rows={4}
          value={form.remarks}
          onChange={(event) =>
            updateField('remarks', event.target.value)
          }
          disabled={loading}
          placeholder="Additional remarks"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}