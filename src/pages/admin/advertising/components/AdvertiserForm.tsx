import { useState } from 'react'

import type { AdvertiserFormData } from '../../../../types/admin/advertising'

interface Props {
  initialData?: Partial<AdvertiserFormData>
  submitting?: boolean
  submitLabel?: string
  onSubmit: (
    data: AdvertiserFormData,
  ) => Promise<void>
}

export default function AdvertiserForm({
  initialData,
  submitting = false,
  submitLabel = 'Save Advertiser',
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<AdvertiserFormData>({
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      company_name:
        initialData?.company_name ?? '',
    })

  const updateField = (
    field: keyof AdvertiserFormData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            required
            value={form.name}
            onChange={(event) =>
              updateField('name', event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            placeholder="Advertiser name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Company Name
          </label>

          <input
            value={form.company_name}
            onChange={(event) =>
              updateField(
                'company_name',
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField('email', event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            value={form.phone}
            onChange={(event) =>
              updateField('phone', event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}