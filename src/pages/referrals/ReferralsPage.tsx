import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  Check,
  ChevronRight,
  Copy,
  Gift,
  Link2,
  Loader2,
  RefreshCw,
  Search,
  Share2,
  Users,
  X,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { getReferrals } from '../../services/referralService'
import type { Referral } from '../../types/referral'

function formatAmount(amount: string) {
  const value = Number(amount)

  if (Number.isNaN(value)) return '0.00'

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(date: string | null) {
  if (!date) return '—'

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) return '—'

  return value.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusClasses(status: Referral['status']) {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-50 text-emerald-700'

    case 'PENDING':
      return 'bg-amber-50 text-amber-700'

    case 'CANCELLED':
      return 'bg-red-50 text-red-700'

    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function ReferralsPage() {
  const { accessToken, user } = useAuth()

  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | Referral['status']
  >('ALL')

  const [selectedReferral, setSelectedReferral] =
    useState<Referral | null>(null)

  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const referralLink = user?.referral_code
    ? `https://cash4us.com/register?ref=${encodeURIComponent(
        user.referral_code,
      )}`
    : ''

  const loadReferrals = useCallback(
    async (refresh = false) => {
      if (!accessToken) {
        setError('Your session has expired. Please log in again.')
        setLoading(false)
        return
      }

      try {
        if (refresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError(null)

        const data = await getReferrals(accessToken)
        setReferrals(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your referrals.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [accessToken],
  )

  useEffect(() => {
    loadReferrals()
  }, [loadReferrals])

  const paidReferrals = useMemo(
    () =>
      referrals.filter(
        (referral) => referral.status === 'PAID',
      ),
    [referrals],
  )

  const totalBonus = useMemo(
    () =>
      paidReferrals.reduce(
        (total, referral) =>
          total + Number(referral.bonus_amount || 0),
        0,
      ),
    [paidReferrals],
  )

  const filteredReferrals = useMemo(() => {
    const query = search.trim().toLowerCase()

    return referrals.filter((referral) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        referral.status === statusFilter

      if (!matchesStatus) return false

      if (!query) return true

      return (
        referral.referred_user_name
          .toLowerCase()
          .includes(query) ||
        referral.package_name
          .toLowerCase()
          .includes(query)
      )
    })
  }, [referrals, search, statusFilter])

  async function handleCopyLink() {
    if (!referralLink) return

    try {
      await navigator.clipboard.writeText(referralLink)

      setCopied(true)
      setError(null)

      window.setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setError('Unable to copy your referral link.')
    }
  }

  async function handleShare() {
    if (!referralLink) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join Cash4Us',
          text: 'Join me on Cash4Us using my referral link.',
          url: referralLink,
        })

        setShared(true)

        window.setTimeout(() => {
          setShared(false)
        }, 1800)

        return
      }

      await navigator.clipboard.writeText(referralLink)

      setCopied(true)
      setError(null)

      window.setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }

      setError('Unable to share your referral link.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#64748B]">
          <Loader2 className="h-5 w-5 animate-spin text-[#0F766E]" />
          Loading referrals...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Referrals
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Referral Rewards
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Track your referral activity and earned bonuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReferrals(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadReferrals()}
            className="w-fit font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Referral Link */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
              <Link2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[#0F172A]">
                Your Referral Link
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#64748B]">
                Share your link and the referral code will be
                automatically added when someone registers.
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-2xl">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5">
                <span className="truncate font-mono text-xs text-[#475569] sm:text-sm">
                  {referralLink}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={!referralLink}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC] disabled:opacity-50 sm:flex-none"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}

                  {copied ? 'Copied' : 'Copy Link'}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!referralLink}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:opacity-50 sm:flex-none"
                >
                  {shared ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}

                  {shared ? 'Shared' : 'Share'}
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-[#94A3B8]">
              Referral code:{' '}
              <span className="font-mono font-semibold text-[#0F766E]">
                {user?.referral_code || '—'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B]">
              Total Referrals
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-bold text-[#0F172A]">
            {referrals.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B]">
              Paid Referrals
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-bold text-[#16A34A]">
            {paidReferrals.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B]">
              Earned Bonuses
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
              <Gift className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-bold text-[#0F766E]">
            ${formatAmount(String(totalBonus))}
          </p>
        </div>
      </div>

      {/* Referral history */}
      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search referrals..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {(['ALL', 'PAID', 'PENDING', 'CANCELLED'] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    statusFilter === status
                      ? 'bg-[#0F766E] text-white'
                      : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {status === 'ALL'
                    ? 'All'
                    : status.charAt(0) +
                      status.slice(1).toLowerCase()}
                </button>
              ),
            )}
          </div>
        </div>

        {filteredReferrals.length === 0 ? (
          <div className="px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
              <Users className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[#0F172A]">
              {referrals.length === 0
                ? 'No referrals yet'
                : 'No matching referrals'}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[#64748B]">
              {referrals.length === 0
                ? 'Your referral activity and bonuses will appear here.'
                : 'Try changing your search or status filter.'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Package</th>
                    <th className="px-5 py-4">Bonus</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredReferrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="transition hover:bg-[#F8FAFC]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                            <Users className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-semibold text-[#0F172A]">
                              {referral.referred_user_name ||
                                'Member'}
                            </p>

                            {referral.is_first_payment && (
                              <p className="mt-0.5 text-xs text-[#64748B]">
                                First payment
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#334155]">
                        {referral.package_name || '—'}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#16A34A]">
                          +$
                          {formatAmount(
                            referral.bonus_amount,
                          )}
                        </p>

                        <p className="mt-0.5 text-xs text-[#94A3B8]">
                          {formatAmount(
                            referral.bonus_percentage,
                          )}
                          %
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            referral.status,
                          )}`}
                        >
                          {referral.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#334155]">
                        {formatDate(referral.created_at)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReferral(referral)
                          }
                          className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#0F766E]"
                          aria-label="View referral details"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#E2E8F0] md:hidden">
              {filteredReferrals.map((referral) => (
                <button
                  key={referral.id}
                  type="button"
                  onClick={() =>
                    setSelectedReferral(referral)
                  }
                  className="flex w-full items-center gap-3 p-4 text-left transition active:bg-[#F8FAFC]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                    <Users className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-[#0F172A]">
                        {referral.referred_user_name ||
                          'Member'}
                      </p>

                      <p className="shrink-0 text-sm font-bold text-[#16A34A]">
                        +$
                        {formatAmount(
                          referral.bonus_amount,
                        )}
                      </p>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="truncate text-xs text-[#64748B]">
                        {referral.package_name || '—'}
                      </p>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClasses(
                          referral.status,
                        )}`}
                      >
                        {referral.status}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Details modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0F766E]">
                  Referral Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0F172A]">
                  {selectedReferral.referred_user_name ||
                    'Member'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReferral(null)
                }
                className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-5 text-center">
              <p className="text-sm text-[#64748B]">
                Referral Bonus
              </p>

              <p className="mt-2 text-3xl font-bold text-[#16A34A]">
                +$
                {formatAmount(
                  selectedReferral.bonus_amount,
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  selectedReferral.status,
                )}`}
              >
                {selectedReferral.status}
              </span>
            </div>

            <div className="mt-5 divide-y divide-[#E2E8F0]">
              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Member
                </span>

                <span className="text-right text-sm font-medium text-[#334155]">
                  {selectedReferral.referred_user_name ||
                    '—'}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Package
                </span>

                <span className="text-right text-sm font-medium text-[#334155]">
                  {selectedReferral.package_name || '—'}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Bonus Rate
                </span>

                <span className="text-sm font-medium text-[#334155]">
                  {formatAmount(
                    selectedReferral.bonus_percentage,
                  )}
                  %
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Created
                </span>

                <span className="text-sm font-medium text-[#334155]">
                  {formatDate(
                    selectedReferral.created_at,
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Paid
                </span>

                <span className="text-sm font-medium text-[#334155]">
                  {formatDate(
                    selectedReferral.paid_at,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}