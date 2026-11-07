import { scheduleEffect } from '../../utils/scheduleEffect'
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock3,
  CircleCheck,
  LoaderCircle,
  PackageOpen,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/useAuth'
import { getMyPackages } from '../../services/packageService'
import {
  getRecommitmentEligibility,
  getRecommitmentOptions,
  getRecommitmentOrders,
  getRecommitmentQuote,
} from '../../services/recommitmentService'
import {
  getCycleQualification,
  getPromotionalQualification,
  getPromotionalSettlementPreview,
} from '../../services/taskService'
import type { MemberCycle } from '../../types/package'
import type {
  RecommitmentEligibility,
  RecommitmentOption,
  RecommitmentOrderHistoryItem,
  RecommitmentQuoteResponse,
} from '../../types/recommitment'
import type {
  CycleQualification,
  PromotionalQualification,
  PromotionalSettlementPreview,
} from '../../types/qualification'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

export default function MyPackagesPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [cycles, setCycles] = useState<MemberCycle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qualification, setQualification] = useState<CycleQualification | null>(null)
  const [promotionalQualification, setPromotionalQualification] =
    useState<PromotionalQualification | null>(null)
  const [settlementPreview, setSettlementPreview] =
    useState<PromotionalSettlementPreview | null>(null)
  const [qualificationError, setQualificationError] = useState<string | null>(null)
  const [isQualificationLoading, setIsQualificationLoading] = useState(false)

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

  useEffect(() => scheduleEffect(() => {
    if (!accessToken || !activeCycle) {
      setQualification(null)
      setPromotionalQualification(null)
      setSettlementPreview(null)
      setQualificationError(null)
      setIsQualificationLoading(false)
      return
    }

    const token = accessToken
    let isCurrent = true

    async function loadQualification() {
      setIsQualificationLoading(true)
      setQualificationError(null)

      const [cycleResult, promotionalResult, previewResult] =
        await Promise.allSettled([
          getCycleQualification(token),
          getPromotionalQualification(token),
          activeCycle?.snapshot_status === 'HISTORICAL_UNVERIFIED'
            ? Promise.resolve(null) : getPromotionalSettlementPreview(token),
        ])

      if (!isCurrent) return

      setQualification(
        cycleResult.status === 'fulfilled' ? cycleResult.value : null,
      )
      setPromotionalQualification(
        promotionalResult.status === 'fulfilled' ? promotionalResult.value : null,
      )
      setSettlementPreview(
        previewResult.status === 'fulfilled' ? previewResult.value : null,
      )

      const failedRequest = [cycleResult, promotionalResult, previewResult]
        .find((result) => result.status === 'rejected')
      if (failedRequest?.status === 'rejected') {
        setQualificationError(
          failedRequest.reason instanceof Error
            ? failedRequest.reason.message
            : 'Unable to load qualification details.',
        )
      }

      setIsQualificationLoading(false)
    }

    void loadQualification()

    return () => {
      isCurrent = false
    }
  }), [accessToken, activeCycle])

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
                  {activeCycle.activation_source === 'ADMIN_GRANT' && <p className="mt-2 text-xs font-bold text-teal-800">ADMIN_GRANT · Administrative activation</p>}
                  {activeCycle.snapshot_status === 'HISTORICAL_UNVERIFIED' && <p className="mt-2 text-sm text-slate-600">Legacy membership: {activeCycle.legacy_normal_tasks_available ? 'normal daily tasks remain available under existing earnings rules.' : 'normal-task eligibility requires review.'} Promotional settlement requires verified historical terms. History is retained.</p>}
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

          <QualificationPanel
            cycle={activeCycle}
            qualification={qualification}
            promotionalQualification={promotionalQualification}
            settlementPreview={settlementPreview}
            isLoading={isQualificationLoading}
            error={qualificationError}
          />
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

      {cycles.filter(cycle => cycle.status === 'RETIRED').map(cycle => <p key={cycle.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">RETIRED · Test grant: {cycle.package_name || 'Administrative package'}. Future earnings stopped; history retained.</p>)}
      <RecommitmentReadiness accessToken={accessToken} />
    </div>
  )
}

function RecommitmentReadiness({ accessToken }: { accessToken: string | null }) {
  const [eligibility, setEligibility] = useState<RecommitmentEligibility | null>(null)
  const [options, setOptions] = useState<RecommitmentOption[]>([])
  const [orders, setOrders] = useState<RecommitmentOrderHistoryItem[]>([])
  const [selectedOption, setSelectedOption] = useState<RecommitmentOption | null>(null)
  const [quote, setQuote] = useState<RecommitmentQuoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => scheduleEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const token = accessToken
    let isCurrent = true
    async function loadReadiness() {
      setLoading(true)
      setError(null)
      try {
        const [nextEligibility, nextOptions, nextOrders] = await Promise.all([
          getRecommitmentEligibility(token),
          getRecommitmentOptions(token),
          getRecommitmentOrders(token),
        ])
        if (!isCurrent) return
        setEligibility(nextEligibility)
        setOptions(nextOptions.options)
        setOrders(nextOrders)
        setSelectedOption(nextOptions.options.find((option) => option.eligible) ?? null)
      } catch (requestError) {
        if (!isCurrent) return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load recommitment readiness.')
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    void loadReadiness()
    return () => { isCurrent = false }
  }), [accessToken])

  useEffect(() => scheduleEffect(() => {
    if (!accessToken || !selectedOption) {
      setQuote(null)
      return
    }

    const token = accessToken
    const option = selectedOption
    let isCurrent = true
    async function loadQuote() {
      setQuoteLoading(true)
      try {
        const nextQuote = await getRecommitmentQuote(
          token,
          option.package_id,
          option.tenure_id,
        )
        if (isCurrent) setQuote(nextQuote)
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load the funding plan.')
        }
      } finally {
        if (isCurrent) setQuoteLoading(false)
      }
    }

    void loadQuote()
    return () => { isCurrent = false }
  }), [accessToken, selectedOption])

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-[#0F766E]">
          <PackageOpen size={21} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F766E]">Recommitment readiness</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Plan your next membership cycle</h2>
          <p className="mt-1 text-sm text-slate-500">Review-only funding information from your current Cash4Us records.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
          <LoaderCircle className="animate-spin text-[#0F766E]" size={18} />
          Loading recommitment readiness...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div>
      ) : !eligibility?.source_cycle ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          Recommitment becomes available after a membership cycle is available for review.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Detail label="Current package" value={eligibility.source_cycle.package_name} />
            <Detail label="Cycle status" value={prettyLabel(eligibility.source_cycle.status)} />
            <Detail label="Current tenure" value={`${eligibility.source_cycle.duration_days} days`} />
          </div>

          {!eligibility.available && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {eligibility.blockers.length > 0
                ? eligibility.blockers.map(prettyLabel).join(', ')
                : 'Recommitment is not currently available for this cycle.'}
            </div>
          )}

          {options.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-800" htmlFor="recommitment-option">Available package options</label>
              <select
                id="recommitment-option"
                value={selectedOption ? `${selectedOption.package_id}:${selectedOption.tenure_id}` : ''}
                onChange={(event) => setSelectedOption(options.find((option) => `${option.package_id}:${option.tenure_id}` === event.target.value) ?? null)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
              >
                <option value="">Choose an eligible package option</option>
                {options.map((option) => (
                  <option
                    key={`${option.package_id}:${option.tenure_id}`}
                    value={`${option.package_id}:${option.tenure_id}`}
                    disabled={!option.eligible}
                  >
                    {option.package_name} · {option.duration_days} days{option.eligible ? '' : ` (${option.blockers.map(prettyLabel).join(', ')})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedOption && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Detail label="Package price" value={formatCurrency(selectedOption.package_price)} />
              <Detail label="Total payment" value={formatCurrency(selectedOption.payment_amount)} />
              <Detail label="Configured fee" value={formatCurrency(selectedOption.fee)} />
            </div>
          )}

          {quoteLoading ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-600"><LoaderCircle className="animate-spin text-[#0F766E]" size={16} /> Loading funding plan...</div>
          ) : quote?.quote.available && quote.funding_plan.available ? (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-sm font-semibold text-emerald-900">Funding plan</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Detail label="Eligible wallet funding" value={formatCurrency(quote.funding_plan.potential_wallet_contribution)} />
                <Detail label="External-payment shortfall" value={formatCurrency(quote.funding_plan.external_shortfall ?? '0')} />
                <Detail label="Total required funding" value={formatCurrency(quote.funding_plan.total_required_funding ?? '0')} />
              </div>
              <p className="mt-3 text-xs text-emerald-800">Planning only — no funds are reserved, moved, or charged here.</p>
            </div>
          ) : selectedOption ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {quote?.quote.eligibility.blockers?.map(prettyLabel).join(', ') || 'This option is not currently available.'}
            </div>
          ) : null}

          {orders.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm font-semibold text-slate-800">Existing recommitment orders</p>
              <div className="mt-3 space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-1 rounded-2xl border border-slate-200 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-slate-800">{order.target_package_name} · {order.target_duration_days} days</span>
                    <span className="text-slate-500">{prettyLabel(order.status)} · {formatCurrency(order.target_payment_amount_snapshot)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function QualificationPanel({
  cycle,
  qualification,
  promotionalQualification,
  settlementPreview,
  isLoading,
  error,
}: {
  cycle: MemberCycle
  qualification: CycleQualification | null
  promotionalQualification: PromotionalQualification | null
  settlementPreview: PromotionalSettlementPreview | null
  isLoading: boolean
  error: string | null
}) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  const remainingReferrals = qualification
    ? Math.max(
      qualification.required_referrals - qualification.verified_qualifying_referrals,
      0,
    )
    : null
  const totalDays = cycle.duration_days ?? 0
  const completedDays = qualification?.completed_task_days ?? 0
  const cycleProgress = totalDays > 0
    ? Math.min((completedDays / totalDays) * 100, 100)
    : 0
  const remainingDays = cycle.ends_at
    ? Math.max(
      Math.ceil((new Date(cycle.ends_at).getTime() - now) / 86_400_000),
      0,
    )
    : null

  return (
    <section className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-[#0F766E]">
          <CircleCheck size={21} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F766E]">Qualification status</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {cycle.package_name || 'Membership'} · {cycle.duration_days ?? '—'}-day tenure
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            These status details are evaluated from your membership-cycle records.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <LoaderCircle className="animate-spin text-[#0F766E]" size={18} />
          Loading qualification details...
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Some qualification details are unavailable right now: {error}
            </div>
          )}

          {qualification && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Required referrals" value={String(qualification.required_referrals)} />
              <Detail label="Qualified referrals" value={String(qualification.verified_qualifying_referrals)} />
              <Detail label="Remaining referrals" value={String(remainingReferrals)} />
              <Detail label="Remaining days" value={remainingDays === null ? '—' : String(remainingDays)} />
            </div>
          )}

          {qualification && totalDays > 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-slate-800">Cycle task progress</span>
                <span className="text-slate-500">
                  {completedDays} of {totalDays} completed days
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#0F766E]"
                  style={{ width: `${cycleProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {qualification.missed_task_days} missed and {qualification.pending_task_days} pending task days.
              </p>
            </div>
          )}

          {promotionalQualification && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Promotional qualification</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {promotionalQualification.promotional_qualification_eligible
                      ? 'Your cycle currently meets the promotional qualification criteria.'
                      : promotionalReason(promotionalQualification.eligibility_reason)}
                  </p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                  promotionalQualification.promotional_qualification_eligible
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {promotionalQualification.promotional_qualification_eligible
                    ? 'Eligible'
                    : 'Not eligible yet'}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Detail
                  label="Qualification deadline"
                  value={promotionalQualification.promotional_deadline_at
                    ? formatDate(promotionalQualification.promotional_deadline_at)
                    : 'Not configured'}
                />
                <Detail
                  label="Promotional referrals"
                  value={promotionalQualification.promotional_required_referrals === null
                    ? 'Not configured'
                    : `${promotionalQualification.verified_qualifying_referrals} of ${promotionalQualification.promotional_required_referrals}`}
                />
              </div>
            </div>
          )}

          {settlementPreview?.preview_available && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-sm font-semibold text-emerald-900">Settlement preview</p>
              <p className="mt-1 text-sm text-emerald-800">
                {settlementPreview.settlement_ready
                  ? 'The backend reports this settlement is ready for internal review.'
                  : settlementPreview.blockers.length > 0
                    ? `Not ready: ${settlementPreview.blockers.map(prettyLabel).join(', ')}.`
                    : 'A settlement preview is available, but it is not ready.'}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Detail
                  label="Remaining promotional entitlement"
                  value={formatCurrency(settlementPreview.remaining_promotional_entitlement)}
                />
                <Detail
                  label="Proposed additional credit"
                  value={formatCurrency(settlementPreview.proposed_additional_credit)}
                />
              </div>
              <p className="mt-3 text-xs text-emerald-800">
                Preview only — settlement confirmation is not available here.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function promotionalReason(reason: string) {
  const labels: Record<string, string> = {
    UNVERIFIED_OR_PRE_PROMOTION_CYCLE: 'This cycle does not have verified promotional terms.',
    TENURE_NOT_PROMOTION_ELIGIBLE: 'This tenure is not eligible for the promotional qualification.',
    INCOMPLETE_PROMOTIONAL_TERMS: 'Promotional terms for this cycle are incomplete.',
    CYCLE_NOT_ACTIVE: 'Only an active cycle can qualify for this promotion.',
    QUALIFICATION_DEADLINE_PASSED: 'The promotional qualification deadline has passed.',
    REFERRAL_TARGET_NOT_MET: 'The required qualifying referrals have not yet been met.',
  }

  return labels[reason] ?? prettyLabel(reason)
}

function prettyLabel(value: string) {
  return value.toLowerCase().replace(/_/g, ' ')
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
