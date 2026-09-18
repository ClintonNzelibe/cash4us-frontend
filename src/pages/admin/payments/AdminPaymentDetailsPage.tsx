import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileImage,
  XCircle,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import {
  approveAdminPayment,
  getAdminPayment,
  rejectAdminPayment,
} from '../../../services/adminPaymentService'

import type { AdminPayment } from '../../../types/admin/payments'

import PaymentStatusBadge from './components/PaymentStatusBadge'
import PaymentActionModal from './components/PaymentActionModal'
import PaymentProofModal from './components/PaymentProofModal'

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

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || '—'}
      </p>
    </div>
  )
}

export default function AdminPaymentDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [payment, setPayment] = useState<AdminPayment | null>(
    null,
  )

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const [action, setAction] = useState<
    'approve' | 'reject' | null
  >(null)

  const [showProof, setShowProof] = useState(false)

  const loadPayment = useCallback(async () => {
    if (!accessToken || !id) return

    try {
      setLoading(true)
      setError('')

      const response = await getAdminPayment(
        id,
        accessToken,
      )

      setPayment(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load payment.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, id])

  useEffect(() => {
    loadPayment()
  }, [loadPayment])

  const handleAction = async (remarks: string) => {
    if (!accessToken || !payment || !action) return

    try {
      setActionLoading(true)
      setError('')

      const response =
        action === 'approve'
          ? await approveAdminPayment(
              payment.id,
              accessToken,
              remarks,
            )
          : await rejectAdminPayment(
              payment.id,
              accessToken,
              remarks,
            )

      setPayment(response.payment)
      setAction(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Payment action failed.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!payment) {
    return (
      <div className="space-y-5">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/payments')}
        >
          <ArrowLeft size={16} />
          Back to Payments
        </Button>

        <Card>
          <div className="py-10 text-center">
            <p className="font-semibold text-slate-900">
              Payment not found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {error || 'This payment could not be loaded.'}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const canTakeAction = payment.status === 'PENDING'

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/payments')}
        >
          <ArrowLeft size={16} />
          Back to Payments
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Payment Details
            </h1>

            <PaymentStatusBadge status={payment.status} />
          </div>

          <p className="mt-2 break-all text-sm text-slate-500">
            {payment.transaction_reference}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {payment.proof_of_payment && (
            <Button
              variant="outline"
              onClick={() => setShowProof(true)}
            >
              <FileImage size={16} />
              View Proof
            </Button>
          )}

          {canTakeAction && (
            <>
              <Button
                variant="danger"
                onClick={() => setAction('reject')}
              >
                <XCircle size={16} />
                Reject
              </Button>

              <Button
                variant="primary"
                onClick={() => setAction('approve')}
              >
                <CheckCircle2 size={16} />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">
              Payment Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Transaction Reference"
              value={payment.transaction_reference}
            />

            <InfoItem
              label="Payment Network"
              value={payment.payment_network}
            />

            <InfoItem
              label="Installment Number"
              value={`#${payment.installment_number}`}
            />

            <InfoItem
              label="Installment Amount"
              value={formatCurrency(
                payment.installment_amount,
              )}
            />

            <InfoItem
              label="Submitted At"
              value={formatDate(payment.submitted_at)}
            />

            <InfoItem
              label="Approved At"
              value={formatDate(payment.approved_at)}
            />

            <InfoItem
              label="Expires At"
              value={formatDate(payment.expires_at)}
            />

            <InfoItem
              label="Approved By"
              value={payment.approved_by_email || '—'}
            />

            <InfoItem
              label="Created At"
              value={formatDate(payment.created_at)}
            />
          </div>
        </Card>

        <Card>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">
              Member
            </h2>
          </div>

          <div className="space-y-5 pt-5">
            <InfoItem
              label="Username"
              value={payment.member.username}
            />

            <InfoItem
              label="Email"
              value={payment.member.email}
            />

            <InfoItem
              label="Membership Code"
              value={
                payment.member.membership_code || '—'
              }
            />
          </div>
        </Card>

        <Card>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">
              Package
            </h2>
          </div>

          <div className="space-y-5 pt-5">
            <InfoItem
              label="Package Name"
              value={payment.package?.name || '—'}
            />

            <InfoItem
              label="Package Price"
              value={formatCurrency(
                payment.package?.price ?? null,
              )}
            />

            <InfoItem
              label="Tenure"
              value={
                payment.tenure
                  ? `${payment.tenure.duration_days} days`
                  : '—'
              }
            />

            <InfoItem
              label="Required Referrals"
              value={
                payment.tenure?.required_referrals ?? '—'
              }
            />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">
              Payment Remarks
            </h2>
          </div>

          <div className="pt-5">
            {payment.remarks ? (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {payment.remarks}
              </p>
            ) : (
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock3 size={17} />
                No remarks have been added.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">
              Installment Group
            </h2>
          </div>

          <p className="mt-5 break-all text-sm text-slate-600">
            {payment.installment_group}
          </p>
        </Card>
      </div>

      <PaymentActionModal
        payment={payment}
        action={action}
        loading={actionLoading}
        onClose={() => setAction(null)}
        onConfirm={handleAction}
      />

      <PaymentProofModal
        payment={showProof ? payment : null}
        onClose={() => setShowProof(false)}
      />
    </div>
  )
}