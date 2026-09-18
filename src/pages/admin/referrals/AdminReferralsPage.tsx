import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import Button from '../../../components/ui/Button'

import { useAuth } from '../../../context/AuthContext'

import { getAdminReferrals } from '../../../services/adminReferralService'

import type {
  AdminReferral,
  AdminReferralFilters,
} from '../../../types/admin/referrals'

import ReferralStatusBadge from './components/ReferralStatusBadge'
import ReferralFiltersComponent from './components/ReferralFilters'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatDate(value: string | null) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default function AdminReferralsPage() {
  const { accessToken } = useAuth()

  const [referrals, setReferrals] = useState<AdminReferral[]>([])
  const [filters, setFilters] =
    useState<AdminReferralFilters>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminReferrals(
          accessToken,
          filters,
        )

        if (Array.isArray(response)) {
          setReferrals(response)
        } else {
          setReferrals(
            Array.isArray(response?.results)
              ? response.results
              : [],
          )
        }
      } catch (error) {
        setReferrals([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load referrals.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  const paidReferrals = referrals.filter(
    (referral) => referral.status === 'PAID',
  ).length

  const pendingReferrals = referrals.filter(
    (referral) => referral.status === 'PENDING',
  ).length

  const totalBonus = referrals.reduce(
    (sum, referral) =>
      sum + Number(referral.bonus_amount || 0),
    0,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Referrals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor referral bonuses and referral activity.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setFilters({ ...filters })
          }}
        >
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">
            Referrals Loaded
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {referrals.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Paid Referrals
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {paidReferrals}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Pending Referrals
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {pendingReferrals}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Total Bonus
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalBonus)}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <ReferralFiltersComponent
        filters={filters}
        onChange={setFilters}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <PageLoader />
      ) : (
        <Card className="overflow-hidden p-0">
          {referrals.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No referrals found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Referrer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Referred User
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Bonus
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      First Payment
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {referral.referrer.username}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {referral.referrer.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {referral.referrer.membership_code}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {referral.referred_user.username}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {referral.referred_user.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {referral.referred_user.membership_code}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {formatCurrency(
                            referral.bonus_amount,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {Number(
                            referral.bonus_percentage,
                          ).toLocaleString()}
                          %
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <ReferralStatusBadge
                          status={referral.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            referral.is_first_payment
                              ? 'font-medium text-emerald-700'
                              : 'text-slate-500'
                          }
                        >
                          {referral.is_first_payment
                            ? 'Yes'
                            : 'No'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(referral.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/referrals/${referral.id}`}
                          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}