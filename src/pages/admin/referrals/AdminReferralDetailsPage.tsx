import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Users,
} from 'lucide-react'

import { getAdminReferral } from '../../../services/adminReferralService'
import type { AdminReferral } from '../../../types/admin/referrals'

import ReferralStatusBadge from './components/ReferralStatusBadge'

export default function AdminReferralDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const accessToken = localStorage.getItem('accessToken')

  const [referral, setReferral] =
    useState<AdminReferral | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    async function loadReferral() {
      if (!id || !accessToken) return

      try {
        setLoading(true)
        setError('')

        const response = await getAdminReferral(
          id,
          accessToken,
        )

        setReferral(response)
      } catch (err: any) {
        console.error('Failed to load referral:', err)

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            'Failed to load referral details.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadReferral()
  }, [accessToken, id])

  const formatAmount = (amount: string | number) => {
    return `₦${Number(amount || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const formatDate = (date: string | null) => {
    if (!date) return '—'

    return new Date(date).toLocaleString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading referral...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/referrals"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to referrals
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!referral) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/referrals"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to referrals
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Referral not found.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/referrals"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to referrals
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Referral Details
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                ID: {referral.id}
              </p>
            </div>
          </div>
        </div>

        <ReferralStatusBadge status={referral.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />

            <h2 className="font-semibold text-slate-900">
              Referrer
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Username
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {referral.referrer.username}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>
              <p className="mt-1 break-all text-sm text-slate-700">
                {referral.referrer.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Membership Code
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {referral.referrer.membership_code}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                User ID
              </p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {referral.referrer.id}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />

            <h2 className="font-semibold text-slate-900">
              Referred User
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Username
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {referral.referred_user.username}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>
              <p className="mt-1 break-all text-sm text-slate-700">
                {referral.referred_user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Membership Code
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {referral.referred_user.membership_code}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                User ID
              </p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {referral.referred_user.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-600" />

          <h2 className="font-semibold text-slate-900">
            Referral Bonus
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Bonus Amount
            </p>

            <p className="mt-1 text-lg font-bold text-emerald-600">
              {formatAmount(referral.bonus_amount)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Bonus Percentage
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {Number(
                referral.bonus_percentage,
              ).toLocaleString()}%
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              First Payment
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {referral.is_first_payment ? 'Yes' : 'No'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(referral.created_at)}
            </p>
          </div>
        </div>
      </div>

      {referral.payment && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />

            <h2 className="font-semibold text-slate-900">
              Related Payment
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Amount
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatAmount(referral.payment.amount)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {referral.payment.status}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Installment
              </p>

              <p className="mt-1 text-sm text-slate-700">
                #{referral.payment.installment_number}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Transaction Reference
              </p>

              <p className="mt-1 break-all text-xs text-slate-600">
                {referral.payment.transaction_reference}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" />

          <h2 className="font-semibold text-slate-900">
            Timeline
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created At
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(referral.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Paid At
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(referral.paid_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}