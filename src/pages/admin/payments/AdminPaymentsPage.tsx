import { useCallback, useEffect, useState } from 'react'
import { Eye, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import { getAdminPayments } from '../../../services/adminPaymentService'

import type {
  AdminPayment,
  PaymentNetwork,
  PaymentStatus,
} from '../../../types/admin/payments'

import PaymentStatusBadge from './components/PaymentStatusBadge'
import PaymentFilters from './components/PaymentFilters'

function formatCurrency(value: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return `₦${Number(value).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string | null) {
  if (!value) return '—'

  return new Date(value).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function AdminPaymentsPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<PaymentStatus | ''>('')
  const [network, setNetwork] = useState<PaymentNetwork | ''>('')
  const [installment, setInstallment] = useState('')

  const loadPayments = useCallback(async () => {
    if (!accessToken) return

    try {
      setLoading(true)
      setError('')

      const response = await getAdminPayments(accessToken, {
        search: search || undefined,
        status: status || undefined,
        network: network || undefined,
        installment_number: installment
          ? Number(installment)
          : undefined,
      })

      setPayments(response.results ?? [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load payments.',
      )
    } finally {
      setLoading(false)
    }
  }, [
    accessToken,
    search,
    status,
    network,
    installment,
  ])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPayments()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [loadPayments])

  const pendingCount = payments.filter(
    (payment) => payment.status === 'PENDING',
  ).length

  const approvedCount = payments.filter(
    (payment) => payment.status === 'APPROVED',
  ).length

  const rejectedCount = payments.filter(
    (payment) => payment.status === 'REJECTED',
  ).length

  if (loading && payments.length === 0) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review member payments and manage payment approvals.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadPayments}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Total Loaded</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {payments.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {pendingCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {approvedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {rejectedCount}
          </p>
        </Card>
      </div>

      <PaymentFilters
        search={search}
        status={status}
        network={network}
        installment={installment}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onNetworkChange={setNetwork}
        onInstallmentChange={setInstallment}
      />

      <Card className="overflow-hidden p-0">
        {payments.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center px-6 text-center">
            <div>
              <p className="font-semibold text-slate-900">
                No payments found
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
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Package</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Network</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {payment.member.username ||
                              payment.member.email}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {payment.member.email}
                          </p>

                          {payment.member.membership_code && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {payment.member.membership_code}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {payment.package?.name ?? '—'}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Installment {payment.installment_number}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(
                            payment.installment_amount,
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {payment.payment_network}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatusBadge
                          status={payment.status}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(payment.submitted_at)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {payment.proof_of_payment && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/payments/${payment.id}`,
                                )
                              }
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                              title="View payment"
                            >
                              <Eye size={16} />
                            </button>
                          )}

                          <Button
                            variant="outline"
                            onClick={() =>
                              navigate(
                                `/admin/payments/${payment.id}`,
                              )
                            }
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {payment.member.username ||
                          payment.member.email}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {payment.member.email}
                      </p>
                    </div>

                    <PaymentStatusBadge
                      status={payment.status}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Package
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {payment.package?.name ?? '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Amount
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(
                          payment.installment_amount,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Network
                      </p>
                      <p className="mt-1 text-sm text-slate-800">
                        {payment.payment_network}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Installment
                      </p>
                      <p className="mt-1 text-sm text-slate-800">
                        #{payment.installment_number}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      {formatDate(payment.submitted_at)}
                    </p>

                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/admin/payments/${payment.id}`,
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