import {
  ArrowRight,
  CheckCircle2,
  Gift,
  LoaderCircle,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getPackages } from '../../services/packageService'
import type { Package } from '../../types/package'
import { formatCurrency } from '../../utils/formatCurrency'

export default function PackagesPage() {
  const navigate = useNavigate()

  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPackages() {
      try {
        setIsLoading(true)
        setError('')

        const data = await getPackages()
        setPackages(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load packages.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPackages()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={30}
            className="animate-spin text-[#0F766E]"
          />
          <p className="text-sm font-medium text-slate-500">
            Loading packages...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <WalletCards size={24} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Unable to load packages
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1F33] px-6 py-8 text-white sm:px-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <Sparkles size={14} />
            Cash4Us Membership
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Choose your package
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Select a membership package and explore its
            available tenure options.
          </p>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0F766E]/40 blur-3xl" />
        <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-[#22C55E]/20 blur-3xl" />
      </section>

      {packages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <WalletCards size={27} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            No packages available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are currently no active packages available.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              packageData={pkg}
              featured={index === 2}
              onClick={() =>
                navigate(`/packages/${pkg.slug}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PackageCard({
  packageData,
  featured,
  onClick,
}: {
  packageData: Package
  featured: boolean
  onClick: () => void
}) {
  const amount =
    packageData.payment_amount || packageData.price

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
        featured
          ? 'border-[#0F766E] ring-1 ring-[#0F766E]/10'
          : 'border-slate-200'
      }`}
    >
      {featured && (
        <div className="absolute right-5 top-5 rounded-full bg-[#0F766E] px-3 py-1 text-[11px] font-bold text-white">
          Popular
        </div>
      )}

      <div className="p-6 sm:p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#0F766E]">
          <WalletCards size={23} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          {packageData.name}
        </h2>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
          {packageData.description ||
            'Join this package and start your Cash4Us journey.'}
        </p>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Required payment
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {formatCurrency(amount)}
          </p>
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
          <Feature
            icon={<Gift size={16} />}
            label={`${packageData.referral_bonus_percentage}% referral bonus`}
          />

          <Feature
            icon={<Users size={16} />}
            label={`${packageData.referral_points} referral points`}
          />

          <Feature
            icon={<CheckCircle2 size={16} />}
            label="Multiple tenure options"
          />
        </div>
      </div>

      <div className="mt-auto border-t border-slate-100 p-6 sm:p-7">
        <button
          onClick={onClick}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          View Package
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  )
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0F766E]">
        {icon}
      </span>

      <span>{label}</span>
    </div>
  )
}