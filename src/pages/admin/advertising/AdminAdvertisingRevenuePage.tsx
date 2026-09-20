import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAdvertisingRevenue,
} from '../../../services/adminAdvertisingService'

import type {
  AdminAdvertisingRevenue,
  AdvertisingFilters,
} from '../../../types/admin/advertising'

import AdvertisingRevenueStatusBadge from './components/AdvertisingRevenueStatusBadge'
import AdvertisingFiltersComponent from './components/AdvertisingFilters'

export default function AdminAdvertisingRevenuePage() {
  const { accessToken } = useAuth()

  const [revenues, setRevenues] = useState<
    AdminAdvertisingRevenue[]
  >([])

  const [filters, setFilters] =
    useState<AdvertisingFilters>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRevenue = async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getAdminAdvertisingRevenue(
        accessToken,
        filters,
      )

      setRevenues(
        Array.isArray(response)
          ? response
          : response.results || [],
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load advertising revenue.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRevenue()
  }, [accessToken, filters])

  if (loading) {
    return <PageLoader />
  }

  const totalRevenue = revenues.reduce(
    (total, revenue) =>
      total + Number(revenue.amount || 0),
    0,
  )

  const pendingCount = revenues.filter(
    (revenue) => revenue.status === 'PENDING',
  ).length

  const confirmedCount = revenues.filter(
    (revenue) => revenue.status === 'CONFIRMED',
  ).length

  const cancelledCount = revenues.filter(
    (revenue) => revenue.status === 'CANCELLED',
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Advertising Revenue
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage advertising revenue records.
          </p>
        </div>

        <Link
          to="/admin/advertising/revenue/create"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          + Record Revenue
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Total Revenue
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {pendingCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Confirmed
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {confirmedCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>

            <p className="mt-2 text-2xl font-semibold text-red-600">
              {cancelledCount}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <AdvertisingFiltersComponent
        mode="revenue"
        filters={filters}
        onChange={setFilters}
      />

      {/* Error */}
      {error && (
        <Card>
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadRevenue}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Revenue Table */}
      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Revenue Records
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {revenues.length} record
                {revenues.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Campaign
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reference
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Received
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {revenues.map((revenue) => (
                <tr
                  key={revenue.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  {/* Source */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {revenue.source}
                    </span>
                  </td>

                  {/* Campaign */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {revenue.campaign_title || '—'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      ₦
                      {Number(
                        revenue.amount || 0,
                      ).toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <AdvertisingRevenueStatusBadge
                      status={revenue.status}
                    />
                  </td>

                  {/* Reference */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {revenue.reference || '—'}
                    </span>
                  </td>

                  {/* Received */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {revenue.received_at
                        ? new Date(
                            revenue.received_at,
                          ).toLocaleDateString()
                        : '—'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/advertising/revenue/${revenue.id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {revenues.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center"
                  >
                    <div className="mx-auto max-w-sm">
                      <p className="text-sm font-medium text-slate-700">
                        No revenue records found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        There are no advertising revenue
                        records matching the current filters.
                      </p>

                      <Link
                        to="/admin/advertising/revenue/create"
                        className="mt-4 inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                      >
                        Record Revenue
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}