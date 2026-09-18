import { useCallback, useEffect, useState } from 'react'
import { Eye, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import { getAdminWithdrawals } from '../../../services/adminWithdrawalService'

import type {
  AdminWithdrawal,
  WithdrawalStatus,
} from '../../../types/admin/withdrawals'

import WithdrawalStatusBadge from './components/WithdrawalStatusBadge'
import WithdrawalFilters from './components/WithdrawalFilters'

function formatCurrency(
  value: string | number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—'
  }

  return `₦${Number(value).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  return new Date(value).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function AdminWithdrawalsPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [withdrawals, setWithdrawals] = useState<
    AdminWithdrawal[]
  >([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] =
    useState<WithdrawalStatus | ''>('')
  const [network, setNetwork] = useState('')

  const loadWithdrawals = useCallback(async () => {
    if (!accessToken) return

    try {
      setLoading(true)
      setError('')

      const response = await getAdminWithdrawals(
        accessToken,
        {
          search: search || undefined,
          status: status || undefined,
          network: network || undefined,
        },
      )

      setWithdrawals(response.results ?? [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load withdrawals.',
      )
    } finally {
      setLoading(false)
    }
  }, [
    accessToken,
    search,
    status,
    network,
  ])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadWithdrawals()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [loadWithdrawals])

  const pendingCount = withdrawals.filter(
    (item) => item.status === 'PENDING',
  ).length

  const approvedCount = withdrawals.filter(
    (item) => item.status === 'APPROVED',
  ).length

  const rejectedCount = withdrawals.filter(
    (item) => item.status === 'REJECTED',
  ).length

  const paidCount = withdrawals.filter(
    (item) => item.status === 'PAID',
  ).length

  if (loading && withdrawals.length === 0) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Withdrawals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review member withdrawal requests and manage
            payouts.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadWithdrawals}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? 'animate-spin' : ''
            }
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card>
          <p className="text-sm text-slate-500">
            Total Loaded
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {withdrawals.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-1 text-2xl font-bold text-amber-600">
            {pendingCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Approved
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {approvedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Rejected
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {rejectedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Paid
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {paidCount}
          </p>
        </Card>
      </div>

      <WithdrawalFilters
        search={search}
        status={status}
        network={network}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onNetworkChange={setNetwork}
      />

      <Card className="overflow-hidden p-0">
        {withdrawals.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center px-6 text-center">
            <div>
              <p className="font-semibold text-slate-900">
                No withdrawals found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search or filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">
                      Member
                    </th>

                    <th className="px-5 py-4">
                      Amount
                    </th>

                    <th className="px-5 py-4">
                      Net Payout
                    </th>

                    <th className="px-5 py-4">
                      Network
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Requested
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {withdrawal.user.username ||
                            withdrawal.user.email ||
                            '—'}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {withdrawal.user.email ||
                            '—'}
                        </p>

                        {withdrawal.user
                          .membership_code && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {
                              withdrawal.user
                                .membership_code
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {formatCurrency(
                          withdrawal.amount,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(
                            withdrawal.net_amount,
                          )}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Fee:{' '}
                          {formatCurrency(
                            withdrawal.admin_fee,
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {
                            withdrawal.destination_network
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <WithdrawalStatusBadge
                          status={withdrawal.status}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(
                          withdrawal.requested_at,
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/admin/withdrawals/${withdrawal.id}`,
                            )
                          }
                        >
                          <Eye size={15} />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {withdrawal.user.username ||
                          withdrawal.user.email ||
                          '—'}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {withdrawal.user.email ||
                          '—'}
                      </p>
                    </div>

                    <WithdrawalStatusBadge
                      status={withdrawal.status}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(
                          withdrawal.amount,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Net Payout
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(
                          withdrawal.net_amount,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Network
                      </p>

                      <p className="mt-1 text-sm text-slate-800">
                        {
                          withdrawal.destination_network
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Fee
                      </p>

                      <p className="mt-1 text-sm text-slate-800">
                        {formatCurrency(
                          withdrawal.admin_fee,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      {formatDate(
                        withdrawal.requested_at,
                      )}
                    </p>

                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/admin/withdrawals/${withdrawal.id}`,
                        )
                      }
                    >
                      <Eye size={15} />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}