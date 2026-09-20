import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAdvertisingRevenueDetails,
  confirmAdminAdvertisingRevenue,
  cancelAdminAdvertisingRevenue,
} from '../../../services/adminAdvertisingService'

import type { AdminAdvertisingRevenue } from '../../../types/admin/advertising'

import AdvertisingRevenueStatusBadge from './components/AdvertisingRevenueStatusBadge'

export default function AdminAdvertisingRevenueDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [revenue, setRevenue] =
    useState<AdminAdvertisingRevenue | null>(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [cancelRemarks, setCancelRemarks] = useState('')
  const [showCancel, setShowCancel] = useState(false)

  const loadRevenue = async () => {
    if (!id || !accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminAdvertisingRevenueDetails(
        accessToken,
        id,
      )

      setRevenue(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load revenue.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRevenue()
  }, [id, accessToken])

  const handleConfirm = async () => {
    if (!id || !accessToken || !revenue) return

    try {
      setActionLoading(true)
      setError('')

      const response =
        await confirmAdminAdvertisingRevenue(
          accessToken,
          id,
        )

      setRevenue(response.revenue)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to confirm revenue.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!id || !accessToken || !revenue) return

    try {
      setActionLoading(true)
      setError('')

      const response =
        await cancelAdminAdvertisingRevenue(
          accessToken,
          id,
          cancelRemarks,
        )

      setRevenue(response.revenue)
      setShowCancel(false)
      setCancelRemarks('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to cancel revenue.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!revenue) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/revenue')}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Revenue
        </button>

        <Card>
          <div className="p-6 text-sm text-red-600">
            {error || 'Revenue record not found.'}
          </div>
        </Card>
      </div>
    )
  }

  const isPending = revenue.status === 'PENDING'

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/revenue')}
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Revenue
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Revenue Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {revenue.reference || revenue.id}
            </p>
          </div>

          <AdvertisingRevenueStatusBadge
            status={revenue.status}
          />
        </div>
      </div>

      {error && (
        <Card>
          <div className="p-4 text-sm text-red-600">
            {error}
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Amount</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ₦{Number(revenue.amount).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Source</p>

            <p className="mt-2 font-semibold text-slate-900">
              {revenue.source}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Campaign</p>

            <p className="mt-2 font-semibold text-slate-900">
              {revenue.campaign_title || '—'}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Revenue Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Reference
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {revenue.reference || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Received At
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {revenue.received_at
                ? new Date(revenue.received_at).toLocaleString()
                : '—'}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Remarks
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {revenue.remarks || '—'}
            </p>
          </div>

          {revenue.confirmed_at && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Confirmed At
              </p>

              <p className="mt-1 text-sm text-slate-900">
                {new Date(
                  revenue.confirmed_at,
                ).toLocaleString()}
              </p>
            </div>
          )}

          {revenue.confirmed_by_email && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Confirmed By
              </p>

              <p className="mt-1 text-sm text-slate-900">
                {revenue.confirmed_by_email}
              </p>
            </div>
          )}

          {revenue.cancelled_by_email && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Cancelled By
              </p>

              <p className="mt-1 text-sm text-slate-900">
                {revenue.cancelled_by_email}
              </p>
            </div>
          )}
        </div>
      </Card>

      {isPending && (
        <Card>
          <div className="flex flex-col gap-4 p-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Revenue Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pending revenue can be confirmed or cancelled.
              </p>
            </div>

            {showCancel && (
              <textarea
                value={cancelRemarks}
                onChange={(event) =>
                  setCancelRemarks(event.target.value)
                }
                rows={3}
                placeholder="Reason for cancellation"
                disabled={actionLoading}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={actionLoading}
                className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {actionLoading
                  ? 'Processing...'
                  : 'Confirm Revenue'}
              </button>

              {!showCancel ? (
                <button
                  type="button"
                  onClick={() => setShowCancel(true)}
                  disabled={actionLoading}
                  className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  Cancel Revenue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {actionLoading
                    ? 'Cancelling...'
                    : 'Confirm Cancellation'}
                </button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}