import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminPointAccounts } from '../../../services/adminRewardService'

import type {
  AdminPointAccount,
  RewardFilters as RewardFiltersType,
} from '../../../types/admin/rewards'

import RewardPointsCard from './components/RewardPointsCard'
import RewardFilters from './components/RewardFilters'

export default function AdminPointAccountsPage() {
  const { accessToken } = useAuth()

  const [accounts, setAccounts] =
    useState<AdminPointAccount[]>([])

  const [filters, setFilters] =
    useState<RewardFiltersType>({})

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

        const response = await getAdminPointAccounts(
          accessToken,
          filters,
        )

        setAccounts(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.results)
              ? response.results
              : [],
        )
      } catch (error) {
        setAccounts([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load point accounts.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  )

  const totalLifetime = accounts.reduce(
    (sum, account) =>
      sum + account.lifetime_points,
    0,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Point Accounts
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View member reward point balances and lifetime points.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <RewardPointsCard
          title="Accounts Loaded"
          value={accounts.length}
        />

        <RewardPointsCard
          title="Current Points"
          value={totalBalance.toLocaleString()}
        />

        <RewardPointsCard
          title="Lifetime Points"
          value={totalLifetime.toLocaleString()}
        />
      </div>

      <Card>
        <RewardFilters
          filters={filters}
          onChange={setFilters}
          mode="points"
        />
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : (
        <Card className="overflow-hidden p-0">
          {accounts.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No point accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Member
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Balance
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Lifetime Points
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {account.member.username}
                        </p>
                        <p className="text-xs text-slate-500">
                          {account.member.email}
                        </p>
                        <p className="text-xs text-slate-400">
                          {account.member.membership_code}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-emerald-700">
                        {account.balance.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {account.lifetime_points.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/rewards/points/${account.id}`}
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