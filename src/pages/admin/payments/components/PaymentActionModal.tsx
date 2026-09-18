import { useState } from 'react'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import type { AdminPayment, PaymentStatus } from '../../../../types/admin/payments'

interface Props {
  payment: AdminPayment | null
  action: 'approve' | 'reject' | null
  loading: boolean
  onClose: () => void
  onConfirm: (remarks: string) => void
}

export default function PaymentActionModal({
  payment,
  action,
  loading,
  onClose,
  onConfirm,
}: Props) {
  const [remarks, setRemarks] = useState('')

  if (!payment || !action) return null

  const isApprove = action === 'approve'

  const handleClose = () => {
    setRemarks('')
    onClose()
  }

  const handleConfirm = () => {
    onConfirm(remarks.trim())
  }

  const currentStatus: PaymentStatus = payment.status

  return (
    <Modal
      isOpen={Boolean(payment && action)}
      onClose={handleClose}
      title={isApprove ? 'Approve Payment' : 'Reject Payment'}
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Transaction reference
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-slate-900">
            {payment.transaction_reference}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Member</p>
              <p className="mt-1 truncate text-sm font-medium text-slate-800">
                {payment.member.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {currentStatus}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Remarks
            <span className="font-normal text-slate-400">
              {' '}
              (optional)
            </span>
          </label>

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            placeholder={
              isApprove
                ? 'Add any approval remarks...'
                : 'Reason for rejecting this payment...'
            }
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={isApprove ? 'primary' : 'danger'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : isApprove
                ? 'Approve Payment'
                : 'Reject Payment'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}