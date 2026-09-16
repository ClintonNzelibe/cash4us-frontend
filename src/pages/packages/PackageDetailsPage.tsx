import {
  ArrowLeft,
  Check,

  Clock3,
  Gift,
  LoaderCircle,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { getPackage } from '../../services/packageService'
import type {
  PackageDetail,
  Tenure,
} from '../../types/package'
import { formatCurrency } from '../../utils/formatCurrency'

export default function PackageDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [packageData, setPackageData] =
    useState<PackageDetail | null>(null)

  const [selectedTenure, setSelectedTenure] =
    useState<Tenure | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return

    const packageSlug = slug

    async function loadPackage() {
        try {
        setIsLoading(true)
        setError('')

        const data = await getPackage(packageSlug)
        setPackageData(data)

        if (data.tenures?.length) {
            setSelectedTenure(data.tenures[0])
        }
        } catch (err) {
        setError(
            err instanceof Error
            ? err.message
            : 'Unable to load package.',
        )
        } finally {
        setIsLoading(false)
        }
    }

    loadPackage()
    }, [slug])
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={30}
            className="animate-spin text-[#0F766E]"
          />
          <p className="text-sm font-medium text-slate-500">
            Loading package...
          </p>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Package unavailable
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || 'This package could not be found.'}
        </p>

        <button
          onClick={() => navigate('/packages')}
          className="mt-5 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Packages
        </button>
      </div>
    )
  }

  const paymentAmount =
    packageData.payment_amount || packageData.price

  const tenures = packageData.tenures ?? []

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      {/* Back */}
      <button
        onClick={() => navigate('/packages')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F766E]"
      >
        <ArrowLeft size={17} />
        Back to packages
      </button>

      {/* Package header */}
      <section className="overflow-hidden rounded-3xl bg-[#0B1F33] p-6 text-white shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <WalletCards size={27} />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              {packageData.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {packageData.description ||
                'Explore the benefits and tenure options available with this package.'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:min-w-[230px]">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Required payment
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(paymentAmount)}
            </p>
          </div>
        </div>
      </section>

      {/* Package information */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Package benefits
          </h2>

          <div className="mt-5 space-y-4">
            <Benefit
              icon={<Gift size={18} />}
              title="Referral bonus"
              value={`${packageData.referral_bonus_percentage}%`}
            />

            <Benefit
              icon={<Users size={18} />}
              title="Referral points"
              value={String(packageData.referral_points)}
            />

            <Benefit
              icon={<ShieldCheck size={18} />}
              title="Membership"
              value="Active cycle"
            />
          </div>
        </div>

        {/* Tenures */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Choose your tenure
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the membership duration that suits you.
            </p>
          </div>

          {tenures.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {tenures.map((tenure) => {
                const selected =
                  selectedTenure?.id === tenure.id

                return (
                  <button
                    key={tenure.id}
                    onClick={() =>
                      setSelectedTenure(tenure)
                    }
                    className={`relative rounded-2xl border p-4 text-left transition ${
                      selected
                        ? 'border-[#0F766E] bg-emerald-50/70 ring-1 ring-[#0F766E]/10'
                        : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check size={14} />
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          selected
                            ? 'bg-white text-[#0F766E]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Clock3 size={18} />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {formatDuration(
                            tenure.duration_days,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {tenure.required_referrals}{' '}
                          required referral
                          {tenure.required_referrals === 1
                            ? ''
                            : 's'}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Tenure options are not currently available
                for this package.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Continue */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {selectedTenure
                ? formatDuration(
                    selectedTenure.duration_days,
                  )
                : 'Select a tenure'}
            </p>

            {selectedTenure && (
              <p className="mt-1 text-xs text-slate-500">
                Requires {selectedTenure.required_referrals}{' '}
                referral
                {selectedTenure.required_referrals === 1
                  ? ''
                  : 's'}
              </p>
            )}
          </div>

          <button
            disabled={!selectedTenure}
            onClick={() => {
              if (!selectedTenure) return

              navigate(
                `/packages/${packageData.slug}/payment`,
                {
                    state: {
                    packageId: packageData.id,
                    packageName: packageData.name,
                    packageAmount:
                        packageData.payment_amount ||
                        packageData.price,
                    tenureId: selectedTenure.id,
                    durationDays: selectedTenure.duration_days,
                    },
                },
              )
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Payment
            <ArrowLeft
              size={17}
              className="rotate-180"
            />
          </button>
        </div>
      </section>
    </div>
  )
}

function Benefit({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-600">
          {title}
        </span>
      </div>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  )
}

function formatDuration(days: number) {
  if (days < 30) {
    return `${days} days`
  }

  if (days === 30) {
    return '30 days'
  }

  if (days === 60) {
    return '60 days'
  }

  if (days === 90) {
    return '90 days'
  }

  if (days % 30 === 0) {
    return `${days / 30} months`
  }

  return `${days} days`
}