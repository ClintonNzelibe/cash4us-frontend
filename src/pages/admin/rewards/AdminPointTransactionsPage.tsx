import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import { getAdminPointTransactions } from '../../../services/adminRewardService'

import type {
  AdminPointTransaction,
  RewardFilters as RewardFiltersType,
} from '../../../types/admin/rewards'

import PointTransactionTypeBadge from './components/PointTransactionTypeBadge'
import RewardFilters from './components/RewardFilters'

export default function AdminPointTransactionsPage() {
  const { accessToken } = useAuth()

  const [transactions, setTransactions] =
    useState<AdminPointTransaction[]>([])

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

        const response =
          await getAdminPointTransactions(
            accessToken,
            filters,
          )

        setTransactions(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.results)
              ? response.results
              : [],
        )
      } catch (error) {
        setTransactions([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load point transactions.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Point Transactions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View the reward points ledger.
        </p>
      </div>

      <Card>
        <RewardFilters
          filters={filters}
          onChange={setFilters}
          mode="transactions"
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
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No point transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Member
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Amount
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Type
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Reference
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Date
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {transaction.member.username}
                        </p>
                        <p className="text-xs text-slate-500">
                          {transaction.member.email}
                        </p>
                      </td>

                      <td
                        className={`px-5 py-4 font-semibold ${
                          transaction.amount >= 0
                            ? 'text-emerald-700'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.amount >= 0
                          ? '+'
                          : ''}
                        {transaction.amount.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <PointTransactionTypeBadge
                          type={
                            transaction.transaction_type
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {transaction.reference || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {new Date(
                          transaction.created_at,
                        ).toLocaleDateString('en-NG')}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/rewards/point-transactions/${transaction.id}`}
                          className="text-sm font-semibold text-emerald-700"
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