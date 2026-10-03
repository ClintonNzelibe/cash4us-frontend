import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock3,
  LoaderCircle,
  PackageOpen,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { getMyPackages } from '../../services/packageService'
import type { MemberCycle } from '../../types/package'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

export default function MyPackagesPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [cycles, setCycles] = useState<MemberCycle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPackages = useCallback(async (isRefresh = false) => {
    if (!accessToken) {
      setError('Your session has expired. Please log in again.')
      setIsLoading(false)
      return
    }

    try {
      if (isRefresh) setIsRefreshing(true)
      else setIsLoading(true)

      setError(null)
      setCycles(await getMyPackages(accessToken))
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load your membership packages.',
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [accessToken])

  useEffect(() => {
    const initialRequest = window.setTimeout(
      () => void loadPackages(),
      0,
    )

    return () => window.clearTimeout(initialRequest)
  }, [loadPackages])

  const activeCycle = useMemo(
    () => cycles.find((cycle) => cycle.status === 'ACTIVE') ?? null,
    [cycles],
  )

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1F33] px-6 py-8 text-white sm:px-8">
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <Sparkles size={14} />
            Membership
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Packages
          </h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            View your backend-confirmed Cash4Us membership packages.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#0F766E]/40 blur-3xl" />
      </section>

      {isLoading ? (
        <StateCard icon={<LoaderCircle className="animate-spin" size={30} />}>
          Loading your membership packages...
        </StateCard>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800 shadow-sm">
          <AlertTriangle className="mx-auto h-8 w-8" />
          <h2 className="mt-4 text-xl font-bold">Unable to load packages</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6">{error}</p>
          <button
            type="button"
            onClick={() => void loadPackages()}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-rose-700 px-5 text-sm font-semibold text-white hover:bg-rose-800"
          >
            <RefreshCw size={17} />
            Try again
          </button>
        </div>
      ) : activeCycle ? (
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F766E] text-white shadow-sm">
                  <PackageOpen size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F766E]">
                    Active membership
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {activeCycle.package_name || 'Active package'}
                  </h2>
                  {activeCycle.package_price !== undefined && (
                    <p className="mt-1 text-sm text-slate-600">
                      Package value {formatCurrency(activeCycle.package_price)}
                    </p>
                  )}
                </div>
              </div>
              <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                {activeCycle.status}
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Detail label="Tenure" value={`${activeCycle.duration_days ?? '—'} days`} />
              <Detail label="Started" value={formatDate(activeCycle.started_at)} />
              <Detail label="Ends" value={formatDate(activeCycle.ends_at)} />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-sm text-slate-500">
              Status and dates are confirmed by Cash4Us.
            </p>
            <button
              type="button"
              disabled={isRefreshing}
              onClick={() => void loadPackages(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={16} />
              Refresh
            </button>
          </div>
        </section>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#0F766E]">
            <PackageOpen size={30} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No active package
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You don't have an active membership package yet. Explore the
            available packages to get started.
          </p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Explore Packages
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  )
}

function StateCard({
  children,
  icon,
}: {
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
      <div className="text-[#0F766E]">{icon}</div>
      <p className="mt-4 text-sm font-medium">{children}</p>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  const icon = label === 'Tenure'
    ? <Clock3 size={17} />
    : <CalendarDays size={17} />

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}
