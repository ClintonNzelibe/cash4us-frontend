import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Loader2,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { getTransactions } from '../../services/transactionService'
import type {
  Transaction,
  TransactionDirection,
} from '../../types/transaction'

function formatAmount(amount: string) {
  const value = Number(amount)

  if (Number.isNaN(value)) return '0.00'

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(date: string) {
  const value = new Date(date)

  if (Number.isNaN(value.getTime())) return '—'

  return value.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(date: string) {
  const value = new Date(date)

  if (Number.isNaN(value.getTime())) return ''

  return value.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getDirectionIcon(direction: TransactionDirection) {
  return direction === 'CREDIT' ? ArrowDownLeft : ArrowUpRight
}

export default function TransactionsPage() {
  const { accessToken } = useAuth()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<
    'ALL' | TransactionDirection
  >('ALL')

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)

  const loadTransactions = useCallback(
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

        const data = await getTransactions(accessToken)
        setTransactions(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load transactions.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [accessToken],
  )

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === 'ALL' || transaction.direction === filter

      if (!matchesFilter) return false

      if (!query) return true

      return (
        transaction.reference.toLowerCase().includes(query) ||
        transaction.transaction_type_display
          .toLowerCase()
          .includes(query) ||
        transaction.direction_display
          .toLowerCase()
          .includes(query)
      )
    })
  }, [transactions, search, filter])

  const creditCount = transactions.filter(
    (item) => item.direction === 'CREDIT',
  ).length

  const debitCount = transactions.filter(
    (item) => item.direction === 'DEBIT',
  ).length

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#64748B]">
          <Loader2 className="h-5 w-5 animate-spin text-[#0F766E]" />
          Loading transactions...
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
            Transactions
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Transaction History
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Keep track of money moving in and out of your wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadTransactions(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:bg-[#F8FAFC] disabled:opacity-60"
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
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadTransactions()}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Total Transactions
          </p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-[#64748B]">Credits</p>
          <p className="mt-2 text-2xl font-bold text-[#16A34A]">
            {creditCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-[#64748B]">Debits</p>
          <p className="mt-2 text-2xl font-bold text-[#DC2626]">
            {debitCount}
          </p>
        </div>
      </div>

      {/* Transaction card */}
      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
            />
          </div>

          <div className="flex gap-2">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    filter === item
                      ? 'bg-[#0F766E] text-white'
                      : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {item === 'ALL'
                    ? 'All'
                    : item === 'CREDIT'
                      ? 'Credits'
                      : 'Debits'}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
              <CreditCard className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[#0F172A]">
              {transactions.length === 0
                ? 'No transactions yet'
                : 'No matching transactions'}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[#64748B]">
              {transactions.length === 0
                ? 'Your wallet transactions will appear here once activity occurs.'
                : 'Try changing your search or transaction filter.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-5 py-4">
                      Transaction
                    </th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">
                      Balance After
                    </th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredTransactions.map(
                    (transaction) => {
                      const Icon = getDirectionIcon(
                        transaction.direction,
                      )

                      const isCredit =
                        transaction.direction === 'CREDIT'

                      return (
                        <tr
                          key={transaction.id}
                          className="transition hover:bg-[#F8FAFC]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  isCredit
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-red-50 text-red-600'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-[#0F172A]">
                                  {
                                    transaction.transaction_type_display
                                  }
                                </p>

                                <p className="mt-0.5 font-mono text-xs text-[#94A3B8]">
                                  {transaction.reference}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isCredit
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {
                                transaction.direction_display
                              }
                            </span>
                          </td>

                          <td
                            className={`px-5 py-4 text-sm font-bold ${
                              isCredit
                                ? 'text-[#16A34A]'
                                : 'text-[#DC2626]'
                            }`}
                          >
                            {isCredit ? '+' : '-'}$
                            {formatAmount(
                              transaction.amount,
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#334155]">
                            $
                            {formatAmount(
                              transaction.balance_after,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm text-[#334155]">
                              {formatDate(
                                transaction.created_at,
                              )}
                            </p>
                            <p className="mt-0.5 text-xs text-[#94A3B8]">
                              {formatTime(
                                transaction.created_at,
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTransaction(
                                  transaction,
                                )
                              }
                              className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#0F766E]"
                              aria-label="View transaction details"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#E2E8F0] md:hidden">
              {filteredTransactions.map(
                (transaction) => {
                  const Icon = getDirectionIcon(
                    transaction.direction,
                  )

                  const isCredit =
                    transaction.direction === 'CREDIT'

                  return (
                    <button
                      key={transaction.id}
                      type="button"
                      onClick={() =>
                        setSelectedTransaction(
                          transaction,
                        )
                      }
                      className="flex w-full items-center gap-3 p-4 text-left transition active:bg-[#F8FAFC]"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isCredit
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-[#0F172A]">
                            {
                              transaction.transaction_type_display
                            }
                          </p>

                          <p
                            className={`shrink-0 text-sm font-bold ${
                              isCredit
                                ? 'text-[#16A34A]'
                                : 'text-[#DC2626]'
                            }`}
                          >
                            {isCredit ? '+' : '-'}$
                            {formatAmount(
                              transaction.amount,
                            )}
                          </p>
                        </div>

                        <div className="mt-1 flex justify-between gap-3">
                          <p className="truncate font-mono text-[11px] text-[#94A3B8]">
                            {transaction.reference}
                          </p>

                          <p className="shrink-0 text-xs text-[#94A3B8]">
                            {formatDate(
                              transaction.created_at,
                            )}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
                    </button>
                  )
                },
              )}
            </div>
          </>
        )}
      </section>

      {/* Details modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#0F766E]">
                  Transaction Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0F172A]">
                  {
                    selectedTransaction.transaction_type_display
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-5 text-center">
              <p className="text-sm text-[#64748B]">
                Amount
              </p>

              <p
                className={`mt-2 text-3xl font-bold ${
                  selectedTransaction.direction ===
                  'CREDIT'
                    ? 'text-[#16A34A]'
                    : 'text-[#DC2626]'
                }`}
              >
                {selectedTransaction.direction === 'CREDIT'
                  ? '+'
                  : '-'}
                $
                {formatAmount(
                  selectedTransaction.amount,
                )}
              </p>
            </div>

            <div className="mt-5 divide-y divide-[#E2E8F0]">
              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Reference
                </span>

                <span className="max-w-[60%] break-all text-right font-mono text-xs text-[#334155]">
                  {selectedTransaction.reference}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Type
                </span>

                <span className="text-right text-sm font-medium text-[#334155]">
                  {
                    selectedTransaction.transaction_type_display
                  }
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Direction
                </span>

                <span className="text-sm font-medium text-[#334155]">
                  {selectedTransaction.direction_display}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Balance After
                </span>

                <span className="text-sm font-semibold text-[#334155]">
                  $
                  {formatAmount(
                    selectedTransaction.balance_after,
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="text-sm text-[#64748B]">
                  Date
                </span>

                <span className="text-right text-sm font-medium text-[#334155]">
                  {formatDate(
                    selectedTransaction.created_at,
                  )}
                  <span className="block text-xs font-normal text-[#94A3B8]">
                    {formatTime(
                      selectedTransaction.created_at,
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}