import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminCommunityPools } from '../../../services/adminCommunityService'

import type {
  AdminCommunityPool,
  
} from '../../../types/admin/community'

import CommunityPoolStatusBadge from './components/CommunityPoolStatusBadge'
import CommunityPoolFilters from './components/CommunityPoolFilters'

export default function AdminCommunityPoolsPage() {
  const { accessToken } = useAuth()

  const [pools, setPools] = useState<AdminCommunityPool[]>([])
  

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPools = async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getAdminCommunityPools(
        accessToken,
        
      )

      setPools(
        Array.isArray(response)
          ? response
          : response.results || [],
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load community pools.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPools()
  }, [accessToken])

  if (loading) {
    return <PageLoader />
  }

  const totalAmount = pools.reduce(
    (sum, pool) =>
      sum + Number(pool.total_amount || 0),
    0,
  )

  const distributedAmount = pools.reduce(
    (sum, pool) =>
      sum + Number(pool.distributed_amount || 0),
    0,
  )

  const openCount = pools.filter(
    (pool) => pool.status === 'OPEN',
  ).length

  const distributedCount = pools.filter(
    (pool) => pool.status === 'DISTRIBUTED',
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Community Pools
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage community earnings pools and member
            distributions.
          </p>
        </div>

        <Link
          to="/admin/community/pools/create"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + Create Pool
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Total Pool Value
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ₦{totalAmount.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Distributed
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              ₦{distributedAmount.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Open Pools
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {openCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Distributed Pools
            </p>

            <p className="mt-2 text-2xl font-semibold text-blue-700">
              {distributedCount}
            </p>
          </div>
        </Card>
      </div>

      

      {error && (
        <Card>
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadPools}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pool
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Distributed
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Earnings
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {pools.map((pool) => (
                <tr
                  key={pool.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {pool.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(
                        pool.created_at,
                      ).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    ₦
                    {Number(
                      pool.total_amount || 0,
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    ₦
                    {Number(
                      pool.distributed_amount || 0,
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <CommunityPoolStatusBadge
                      status={pool.status}
                    />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {pool.earnings_count}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/community/pools/${pool.id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {pools.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No community pools found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Create a pool to begin allocating
                      community revenue.
                    </p>
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