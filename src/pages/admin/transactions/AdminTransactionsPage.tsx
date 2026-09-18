import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminTransactions } from '../../../services/adminTransactionService'

import type {
  AdminTransaction,
  TransactionFilters,
} from '../../../types/admin/transactions'

import TransactionFiltersComponent from './components/TransactionFilters'
import TransactionDirectionBadge from './components/TransactionDirectionBadge'
import TransactionTypeBadge from './components/TransactionTypeBadge'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function AdminTransactionsPage() {
  const { accessToken } = useAuth()

  const [transactions, setTransactions] =
    useState<AdminTransaction[]>([])

  const [filters, setFilters] =
    useState<TransactionFilters>({})

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
          await getAdminTransactions(
            accessToken,
            filters,
          )

        if (Array.isArray(response)) {
          setTransactions(response)
        } else {
          setTransactions(
            Array.isArray(response?.results)
              ? response.results
              : [],
          )
        }
      } catch (error) {
        setTransactions([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load transactions.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  const stats = useMemo(() => {
    const list = Array.isArray(transactions)
      ? transactions
      : []

    return {
      total: list.length,

      credits: list.filter(
        (item) => item.direction === 'CREDIT',
      ).length,

      debits: list.filter(
        (item) => item.direction === 'DEBIT',
      ).length,

      totalAmount: list.reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0,
      ),
    }
  }, [transactions])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View wallet transaction history across Cash4Us members.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">
            Transactions Loaded
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.total}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Credits
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {stats.credits}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Debits
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {stats.debits}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Loaded Transaction Value
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(stats.totalAmount)}
          </p>
        </Card>
      </div>

      <TransactionFiltersComponent
        filters={filters}
        onChange={setFilters}
      />

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
              No transactions found.
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Member
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Transaction
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Balance After
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Direction
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(
                      (transaction) => (
                        <tr
                          key={transaction.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <Link
                              to={`/admin/transactions/${transaction.id}`}
                              className="font-semibold text-slate-900 hover:text-emerald-700"
                            >
                              {transaction.member.username}
                            </Link>

                            <p className="mt-1 text-xs text-slate-500">
                              {transaction.member.email}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {transaction.member.membership_code}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-mono text-xs font-semibold text-slate-700">
                              {transaction.reference}
                            </p>

                            <div className="mt-2">
                              <TransactionTypeBadge
                                type={
                                  transaction.transaction_type
                                }
                              />
                            </div>

                            {transaction.description && (
                              <p className="mt-2 max-w-xs truncate text-xs text-slate-500">
                                {transaction.description}
                              </p>
                            )}
                          </td>

                          <td
                            className={`px-5 py-4 text-sm font-bold ${
                              transaction.direction ===
                              'CREDIT'
                                ? 'text-emerald-700'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.direction ===
                            'CREDIT'
                              ? '+'
                              : '-'}
                            {formatCurrency(
                              transaction.amount,
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-slate-700">
                            {formatCurrency(
                              transaction.balance_after,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <TransactionDirectionBadge
                              direction={
                                transaction.direction
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {formatDate(
                              transaction.created_at,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {transactions.map(
                  (transaction) => (
                    <Link
                      key={transaction.id}
                      to={`/admin/transactions/${transaction.id}`}
                      className="block p-4 transition hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {transaction.member.username}
                          </p>

                          <p className="mt-1 font-mono text-xs text-slate-500">
                            {transaction.reference}
                          </p>
                        </div>

                        <TransactionDirectionBadge
                          direction={
                            transaction.direction
                          }
                        />
                      </div>

                      <div className="mt-3">
                        <TransactionTypeBadge
                          type={
                            transaction.transaction_type
                          }
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400">
                            Amount
                          </span>

                          <p
                            className={`mt-1 font-bold ${
                              transaction.direction ===
                              'CREDIT'
                                ? 'text-emerald-700'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.direction ===
                            'CREDIT'
                              ? '+'
                              : '-'}
                            {formatCurrency(
                              transaction.amount,
                            )}
                          </p>
                        </div>

                        <div>
                          <span className="text-slate-400">
                            Balance After
                          </span>

                          <p className="mt-1 font-medium text-slate-700">
                            {formatCurrency(
                              transaction.balance_after,
                            )}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(
                          transaction.created_at,
                        )}
                      </p>
                    </Link>
                  ),
                )}
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  )
}