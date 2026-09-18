import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  approveAdminWithdrawal,
  getAdminWithdrawal,
  markAdminWithdrawalPaid,
  rejectAdminWithdrawal,
} from '../../../services/adminWithdrawalService'

import type { AdminWithdrawal } from '../../../types/admin/withdrawals'

import WithdrawalStatusBadge from './components/WithdrawalStatusBadge'
import WithdrawalActionModal from './components/WithdrawalActionModal'

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

export default function AdminWithdrawalDetailsPage() {
  const navigate = useNavigate()

  const { id } = useParams<{
    id: string
  }>()

  const { accessToken } = useAuth()

  const [withdrawal, setWithdrawal] =
    useState<AdminWithdrawal | null>(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(false)

  const [error, setError] = useState('')
  const [modalError, setModalError] =
    useState('')

  const [modalAction, setModalAction] =
    useState<
      'approve' | 'reject' | 'paid' | null
    >(null)

  const loadWithdrawal = useCallback(
    async () => {
      if (!accessToken || !id) return

      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminWithdrawal(
            id,
            accessToken,
          )

        setWithdrawal(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load withdrawal.',
        )
      } finally {
        setLoading(false)
      }
    },
    [accessToken, id],
  )

  useEffect(() => {
    loadWithdrawal()
  }, [loadWithdrawal])

  async function handleAction(
    remarks: string,
  ) {
    if (
      !accessToken ||
      !id ||
      !modalAction
    ) {
      return
    }

    try {
      setActionLoading(true)
      setModalError('')

      let response

      if (modalAction === 'approve') {
        response =
          await approveAdminWithdrawal(
            id,
            accessToken,
            remarks,
          )
      } else if (modalAction === 'reject') {
        response =
          await rejectAdminWithdrawal(
            id,
            accessToken,
            remarks,
          )
      } else {
        response =
          await markAdminWithdrawalPaid(
            id,
            accessToken,
            remarks,
          )
      }

      setWithdrawal(response.withdrawal)
      setModalAction(null)
    } catch (err) {
      setModalError(
        err instanceof Error
          ? err.message
          : 'Failed to process withdrawal.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!withdrawal) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() =>
            navigate('/admin/withdrawals')
          }
        >
          <ArrowLeft size={16} />
          Back to Withdrawals
        </Button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ||
            'Withdrawal not found.'}
        </div>
      </div>
    )
  }

  const canApprove =
    withdrawal.status === 'PENDING'

  const canReject =
    withdrawal.status === 'PENDING'

  const canMarkPaid =
    withdrawal.status === 'APPROVED'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate('/admin/withdrawals')
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Withdrawals
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Withdrawal Details
            </h1>

            <WithdrawalStatusBadge
              status={withdrawal.status}
            />
          </div>

          <p className="mt-1 break-all text-xs text-slate-400">
            {withdrawal.id}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadWithdrawal}
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Withdrawal Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Gross Amount
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {formatCurrency(
                  withdrawal.amount,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Admin Fee
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {formatCurrency(
                  withdrawal.admin_fee,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Net Payout
              </p>

              <p className="mt-1 text-lg font-semibold text-emerald-700">
                {formatCurrency(
                  withdrawal.net_amount,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Network
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {
                  withdrawal.destination_network
                }
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Destination Address
              </p>

              <p className="mt-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-800">
                {
                  withdrawal.destination_address
                }
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Actions
          </h2>

          <div className="mt-5 space-y-3">
            {canApprove && (
              <Button
                className="w-full"
                onClick={() => {
                  setModalError('')
                  setModalAction('approve')
                }}
              >
                Approve Withdrawal
              </Button>
            )}

            {canReject && (
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => {
                  setModalError('')
                  setModalAction('reject')
                }}
              >
                Reject Withdrawal
              </Button>
            )}

            {canMarkPaid && (
              <Button
                className="w-full"
                onClick={() => {
                  setModalError('')
                  setModalAction('paid')
                }}
              >
                Mark as Paid
              </Button>
            )}

            {!canApprove &&
              !canReject &&
              !canMarkPaid && (
                <p className="text-sm text-slate-500">
                  No actions are available for
                  this withdrawal.
                </p>
              )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Member
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-400">
                Username
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {withdrawal.user.username ||
                  '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all font-medium text-slate-900">
                {withdrawal.user.email ||
                  '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Membership Code
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {
                  withdrawal.user
                    .membership_code || '—'
                }
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Cycle
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {withdrawal.cycle?.id ||
                  '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Package
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {withdrawal.cycle?.package
                  ?.name || '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Tenure
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {withdrawal.cycle?.tenure
                  ?.name ||
                  withdrawal.cycle?.tenure
                    ?.duration_months ||
                  withdrawal.cycle?.tenure
                    ?.duration ||
                  '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Processing
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-400">
                Requested
              </p>

              <p className="mt-1 text-sm text-slate-800">
                {formatDate(
                  withdrawal.requested_at,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Processed
              </p>

              <p className="mt-1 text-sm text-slate-800">
                {formatDate(
                  withdrawal.processed_at,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Processed By
              </p>

              <p className="mt-1 break-all text-sm text-slate-800">
                {withdrawal.processed_by
                  ?.email ||
                  withdrawal.processed_by
                    ?.username ||
                  '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Remarks
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                {withdrawal.remarks || '—'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <WithdrawalActionModal
        open={modalAction !== null}
        action={modalAction}
        status={withdrawal.status}
        loading={actionLoading}
        error={modalError}
        onClose={() => {
          if (!actionLoading) {
            setModalAction(null)
            setModalError('')
          }
        }}
        onConfirm={handleAction}
      />
    </div>
  )
}