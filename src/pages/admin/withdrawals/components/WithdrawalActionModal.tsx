import { useEffect, useState } from 'react'

import Button from '../../../../components/ui/Button'
import Modal from '../../../../components/ui/Modal'

import type { WithdrawalStatus } from '../../../../types/admin/withdrawals'

interface WithdrawalActionModalProps {
  open: boolean
  action:
    | 'approve'
    | 'reject'
    | 'paid'
    | null
  status?: WithdrawalStatus
  loading?: boolean
  error?: string
  onClose: () => void
  onConfirm: (remarks: string) => void
}

const titles = {
  approve: 'Approve Withdrawal',
  reject: 'Reject Withdrawal',
  paid: 'Mark Withdrawal as Paid',
}

export default function WithdrawalActionModal({
  open,
  action,
  status,
  loading = false,
  error = '',
  onClose,
  onConfirm,
}: WithdrawalActionModalProps) {
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    if (open) {
      setRemarks('')
    }
  }, [open])

  if (!action) return null

  const isReject = action === 'reject'

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={titles[action]}
    >
      <div className="space-y-4">
        {status && (
          <p className="text-sm text-slate-500">
            Current status:{' '}
            <span className="font-semibold text-slate-700">
              {status}
            </span>
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {isReject
              ? 'Rejection reason'
              : 'Remarks (optional)'}
          </label>

          <textarea
            value={remarks}
            onChange={(event) =>
              setRemarks(event.target.value)
            }
            rows={4}
            placeholder={
              isReject
                ? 'Enter the reason for rejecting this withdrawal...'
                : 'Add remarks if needed...'
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={() => onConfirm(remarks)}
            disabled={
              loading ||
              (isReject && !remarks.trim())
            }
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}