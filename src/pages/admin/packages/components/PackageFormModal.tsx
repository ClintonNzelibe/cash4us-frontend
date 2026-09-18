import { useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'

import Button from '../../../../components/ui/Button'

import type {
  AdminPackage,
  AdminPackagePayload,
} from '../../../../types/admin/packages'

interface PackageFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  packageData?: AdminPackage | null
  isSubmitting: boolean
  error?: string
  onClose: () => void
  onSubmit: (data: AdminPackagePayload) => Promise<void>
}

interface FormState {
  name: string
  slug: string
  price: string
  payment_amount: string
  referral_bonus_percentage: string
  referral_points: string
  description: string
  is_active: boolean
  display_order: string
}

const initialForm: FormState = {
  name: '',
  slug: '',
  price: '',
  payment_amount: '',
  referral_bonus_percentage: '0',
  referral_points: '0',
  description: '',
  is_active: true,
  display_order: '0',
}

function packageToForm(
  packageData?: AdminPackage | null,
): FormState {
  if (!packageData) return initialForm

  return {
    name: packageData.name ?? '',
    slug: packageData.slug ?? '',
    price: String(packageData.price ?? ''),
    payment_amount:
      packageData.payment_amount === null ||
      packageData.payment_amount === undefined
        ? ''
        : String(packageData.payment_amount),
    referral_bonus_percentage: String(
      packageData.referral_bonus_percentage ?? 0,
    ),
    referral_points: String(
      packageData.referral_points ?? 0,
    ),
    description: packageData.description ?? '',
    is_active: packageData.is_active,
    display_order: String(
      packageData.display_order ?? 0,
    ),
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function PackageFormModal({
  isOpen,
  mode,
  packageData,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: PackageFormModalProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [validationError, setValidationError] =
    useState('')

  useEffect(() => {
    if (isOpen) {
      setForm(packageToForm(packageData))
      setValidationError('')
    }
  }, [isOpen, packageData])

  if (!isOpen) return null

  function updateField(
    field: keyof FormState,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug:
        mode === 'create'
          ? slugify(value)
          : current.slug,
    }))
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setValidationError('')

    const price = Number(form.price)
    const paymentAmount =
      form.payment_amount.trim() === ''
        ? null
        : Number(form.payment_amount)

    const referralBonus = Number(
      form.referral_bonus_percentage,
    )

    const referralPoints = Number(form.referral_points)
    const displayOrder = Number(form.display_order)

    if (!form.name.trim()) {
      setValidationError('Package name is required.')
      return
    }

    if (!form.slug.trim()) {
      setValidationError('Package slug is required.')
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setValidationError(
        'Package price must be greater than zero.',
      )
      return
    }

    if (
      paymentAmount !== null &&
      (!Number.isFinite(paymentAmount) ||
        paymentAmount <= 0)
    ) {
      setValidationError(
        'Payment amount must be greater than zero.',
      )
      return
    }

    if (
      !Number.isFinite(referralBonus) ||
      referralBonus < 0 ||
      referralBonus > 100
    ) {
      setValidationError(
        'Referral bonus must be between 0 and 100.',
      )
      return
    }

    if (
      !Number.isFinite(referralPoints) ||
      referralPoints < 0
    ) {
      setValidationError(
        'Referral points cannot be negative.',
      )
      return
    }

    if (
      !Number.isFinite(displayOrder) ||
      displayOrder < 0
    ) {
      setValidationError(
        'Display order cannot be negative.',
      )
      return
    }

    await onSubmit({
      name: form.name.trim(),
      slug: form.slug.trim(),
      price,
      payment_amount: paymentAmount,
      referral_bonus_percentage: referralBonus,
      referral_points: referralPoints,
      description: form.description.trim(),
      is_active: form.is_active,
      display_order: displayOrder,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'create'
                ? 'Create Package'
                : 'Edit Package'}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {mode === 'create'
                ? 'Add a new membership package.'
                : 'Update package information.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {(validationError || error) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  {validationError || error}
                </p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Package Name
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(event.target.value)
                  }
                  placeholder="e.g. Gold Package"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  disabled={isSubmitting}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      'slug',
                      event.target.value,
                    )
                  }
                  placeholder="gold-package"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  disabled={isSubmitting}
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField(
                        'price',
                        event.target.value,
                      )
                    }
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-slate-200 pl-8 pr-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Payment amount */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Payment Amount
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.payment_amount}
                    onChange={(event) =>
                      updateField(
                        'payment_amount',
                        event.target.value,
                      )
                    }
                    placeholder="Optional"
                    className="h-11 w-full rounded-xl border border-slate-200 pl-8 pr-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Referral bonus */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Referral Bonus (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={
                    form.referral_bonus_percentage
                  }
                  onChange={(event) =>
                    updateField(
                      'referral_bonus_percentage',
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  disabled={isSubmitting}
                />
              </div>

              {/* Referral points */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Referral Points
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.referral_points}
                  onChange={(event) =>
                    updateField(
                      'referral_points',
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  disabled={isSubmitting}
                />
              </div>

              {/* Display order */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.display_order}
                  onChange={(event) =>
                    updateField(
                      'display_order',
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  disabled={isSubmitting}
                />
              </div>

              {/* Status */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      updateField(
                        'is_active',
                        event.target.checked,
                      )
                    }
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-700">
                      Active package
                    </span>

                    <span className="block text-xs text-slate-500">
                      Members can use this package when active.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    'description',
                    event.target.value,
                  )
                }
                rows={5}
                placeholder="Describe what this package offers..."
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
              />
            </div>
          </div>

          {/* Footer */}
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
                'Create Package'
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