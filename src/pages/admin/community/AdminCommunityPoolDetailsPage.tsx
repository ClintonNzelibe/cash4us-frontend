import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  allocateCommunityRevenue,
  closeCommunityPool,
  distributeCommunityPool,
  getAdminCommunityPool,
  getCommunityPoolEarnings,
  getCommunityPoolRevenues,
} from '../../../services/adminCommunityService'

import {
  getAdminAdvertisingRevenue,
} from '../../../services/adminAdvertisingService'

import type {
  AdminCommunityEarning,
  AdminCommunityPool,
  AdminCommunityPoolRevenue,
} from '../../../types/admin/community'

import type {
  AdminAdvertisingRevenue,
} from '../../../types/admin/advertising'

import CommunityPoolStatusBadge from './components/CommunityPoolStatusBadge'
import CommunityPoolActionModal from './components/CommunityPoolActionModal'

export default function AdminCommunityPoolDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [pool, setPool] =
    useState<AdminCommunityPool | null>(null)

  const [revenues, setRevenues] =
    useState<AdminCommunityPoolRevenue[]>([])

  const [earnings, setEarnings] =
    useState<AdminCommunityEarning[]>([])

  const [availableRevenue, setAvailableRevenue] =
    useState<AdminAdvertisingRevenue[]>([])

  const [selectedRevenue, setSelectedRevenue] =
    useState('')

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(false)

  const [error, setError] = useState('')
  const [actionError, setActionError] =
    useState('')

  const [modal, setModal] = useState<
    'CLOSE' | 'DISTRIBUTE' | null
  >(null)

  const loadData = async () => {
    if (!id || !accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const [
        poolResponse,
        revenueResponse,
        earningsResponse,
        advertisingRevenueResponse,
      ] = await Promise.all([
        getAdminCommunityPool(
          accessToken,
          id,
        ),
        getCommunityPoolRevenues(
          accessToken,
          id,
        ),
        getCommunityPoolEarnings(
          accessToken,
          id,
        ),
        getAdminAdvertisingRevenue(
          accessToken,
          {
            status: 'CONFIRMED',
          },
        ),
      ])

      setPool(poolResponse)

      setRevenues(
        Array.isArray(revenueResponse)
          ? revenueResponse
          : revenueResponse.results || [],
      )

      setEarnings(
        Array.isArray(earningsResponse)
          ? earningsResponse
          : earningsResponse.results || [],
      )

      const confirmedRevenue =
        Array.isArray(
          advertisingRevenueResponse,
        )
          ? advertisingRevenueResponse
          : advertisingRevenueResponse.results || []

      const allocatedIds = new Set(
        (
          Array.isArray(revenueResponse)
            ? revenueResponse
            : revenueResponse.results || []
        ).map((item) => item.revenue),
      )

      setAvailableRevenue(
        confirmedRevenue.filter(
          (item) => !allocatedIds.has(item.id),
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load community pool.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, accessToken])

  const handleAllocate = async () => {
    if (
      !id ||
      !accessToken ||
      !selectedRevenue
    ) {
      return
    }

    try {
      setActionLoading(true)
      setActionError('')

      await allocateCommunityRevenue(
        accessToken,
        id,
        selectedRevenue,
      )

      setSelectedRevenue('')

      await loadData()
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Failed to allocate revenue.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleClose = async () => {
    if (!id || !accessToken) return

    try {
      setActionLoading(true)
      setActionError('')

      await closeCommunityPool(
        accessToken,
        id,
      )

      setModal(null)

      await loadData()
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Failed to close pool.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleDistribute = async () => {
    if (!id || !accessToken) return

    try {
      setActionLoading(true)
      setActionError('')

      await distributeCommunityPool(
        accessToken,
        id,
      )

      setModal(null)

      await loadData()
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Failed to distribute pool.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!pool) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() =>
            navigate('/admin/community/pools')
          }
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Community Pools
        </button>

        <Card>
          <div className="p-6 text-sm text-red-600">
            {error || 'Community pool not found.'}
          </div>
        </Card>
      </div>
    )
  }

  const canAllocate = pool.status === 'OPEN'
  const canClose =
    pool.status === 'OPEN' &&
    Number(pool.total_amount) > 0
  const canDistribute = pool.status === 'CLOSED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() =>
            navigate('/admin/community/pools')
          }
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Community Pools
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {pool.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Community earnings pool
            </p>
          </div>

          <CommunityPoolStatusBadge
            status={pool.status}
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

      {actionError && (
        <Card>
          <div className="p-4 text-sm text-red-600">
            {actionError}
          </div>
        </Card>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Total Amount
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ₦
              {Number(
                pool.total_amount,
              ).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Distributed Amount
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              ₦
              {Number(
                pool.distributed_amount,
              ).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Revenue Allocations
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {revenues.length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Member Earnings
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {earnings.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <div className="p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Pool Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the pool lifecycle.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {canClose && (
              <button
                type="button"
                onClick={() => setModal('CLOSE')}
                className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
              >
                Close Pool
              </button>
            )}

            {canDistribute && (
              <button
                type="button"
                onClick={() =>
                  setModal('DISTRIBUTE')
                }
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Distribute Pool
              </button>
            )}

            {pool.status === 'OPEN' &&
              Number(pool.total_amount) <= 0 && (
                <p className="text-sm text-amber-600">
                  Add confirmed revenue before
                  closing the pool.
                </p>
              )}
          </div>
        </div>
      </Card>

      {/* Allocate Revenue */}
      {canAllocate && (
        <Card>
          <div className="p-6">
            <h2 className="font-semibold text-slate-900">
              Allocate Confirmed Revenue
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Only confirmed advertising revenue
              that has not already been allocated can
              be added to this pool.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedRevenue}
                onChange={(event) =>
                  setSelectedRevenue(
                    event.target.value,
                  )
                }
                disabled={
                  actionLoading ||
                  availableRevenue.length === 0
                }
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
              >
                <option value="">
                  {availableRevenue.length > 0
                    ? 'Select confirmed revenue'
                    : 'No unallocated confirmed revenue'}
                </option>

                {availableRevenue.map(
                  (revenue) => (
                    <option
                      key={revenue.id}
                      value={revenue.id}
                    >
                      {revenue.reference ||
                        revenue.id}{' '}
                      — ₦
                      {Number(
                        revenue.amount,
                      ).toLocaleString()}
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                onClick={handleAllocate}
                disabled={
                  actionLoading ||
                  !selectedRevenue
                }
                className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading
                  ? 'Allocating...'
                  : 'Allocate Revenue'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Allocated Revenue */}
      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Allocated Revenue
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reference
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Revenue Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Allocated At
                </th>
              </tr>
            </thead>

            <tbody>
              {revenues.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {item.revenue_reference || '—'}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {item.revenue_status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    ₦
                    {Number(
                      item.amount,
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(
                      item.allocated_at,
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}

              {revenues.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No revenue has been allocated to
                    this pool.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Member Earnings */}
      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Member Earnings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Member
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Membership Code
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Paid At
                </th>
              </tr>
            </thead>

            <tbody>
              {earnings.map((earning) => (
                <tr
                  key={earning.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {earning.member.username}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {earning.member.email}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {earning.member.membership_code}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    ₦
                    {Number(
                      earning.amount,
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        earning.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700'
                          : earning.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {earning.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {earning.paid_at
                      ? new Date(
                          earning.paid_at,
                        ).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}

              {earnings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No member earnings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Modal */}
      {modal === 'CLOSE' && (
        <CommunityPoolActionModal
          title="Close Community Pool"
          message={`Are you sure you want to close "${pool.name}"? Once closed, additional revenue cannot be allocated and the pool becomes ready for distribution.`}
          actionLabel="Close Pool"
          loading={actionLoading}
          onConfirm={handleClose}
          onCancel={() => setModal(null)}
        />
      )}

      {modal === 'DISTRIBUTE' && (
        <CommunityPoolActionModal
          title="Distribute Community Pool"
          message={`This will distribute "${pool.name}" equally among members with active cycles. The backend will credit eligible member wallets and mark their earnings as paid.`}
          actionLabel="Distribute Pool"
          loading={actionLoading}
          onConfirm={handleDistribute}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}