import { useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'

import Button from '../../../../components/ui/Button'

import type {
  AdminTenure,
  AdminTenurePayload,
} from '../../../../types/admin/packages'

interface TenureFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  tenure?: AdminTenure | null
  isSubmitting: boolean
  error?: string
  onClose: () => void
  onSubmit: (data: AdminTenurePayload) => Promise<void>
}

interface FormState {
  duration_days: string
  required_referrals: string
  is_active: boolean
}

const initialForm: FormState = {
  duration_days: '',
  required_referrals: '0',
  is_active: true,
}

export default function TenureFormModal({
  isOpen,
  mode,
  tenure,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: TenureFormModalProps) {
  const [form, setForm] =
    useState<FormState>(initialForm)

  const [validationError, setValidationError] =
    useState('')

  useEffect(() => {
    if (!isOpen) return

    if (tenure) {
      setForm({
        duration_days: String(
          tenure.duration_days ?? '',
        ),
        required_referrals: String(
          tenure.required_referrals ?? 0,
        ),
        is_active: tenure.is_active,
      })
    } else {
      setForm(initialForm)
    }

    setValidationError('')
  }, [isOpen, tenure])

  if (!isOpen) return null

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setValidationError('')

    const durationDays = Number(form.duration_days)
    const requiredReferrals = Number(
      form.required_referrals,
    )

    if (
      !Number.isFinite(durationDays) ||
      durationDays <= 0
    ) {
      setValidationError(
        'Duration must be greater than zero.',
      )
      return
    }

    if (
      !Number.isFinite(requiredReferrals) ||
      requiredReferrals < 0
    ) {
      setValidationError(
        'Required referrals cannot be negative.',
      )
      return
    }

    await onSubmit({
      duration_days: durationDays,
      required_referrals: requiredReferrals,
      is_active: form.is_active,
    })
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'create'
                ? 'Add Tenure'
                : 'Edit Tenure'}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Configure the package duration and referral
              requirement.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 sm:p-6">
            {(validationError || error) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  {validationError || error}
                </p>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Duration (Days)
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={form.duration_days}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    duration_days:
                      event.target.value,
                  }))
                }
                placeholder="e.g. 30"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Required Referrals
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={form.required_referrals}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    required_referrals:
                      event.target.value,
                  }))
                }
                placeholder="e.g. 5"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    is_active: event.target.checked,
                  }))
                }
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-700">
                  Active tenure
                </span>

                <span className="block text-xs text-slate-500">
                  Members can use this tenure when active.
                </span>
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="mr-2 animate-spin"
                  />
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Add Tenure'
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}