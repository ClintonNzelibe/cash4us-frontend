import { useEffect, useState } from 'react'

import Button from '../../../../components/ui/Button'
import Modal from '../../../../components/ui/Modal'

interface SubmissionActionModalProps {
  open: boolean
  action: 'approve' | 'reject' | null
  loading?: boolean
  error?: string
  onClose: () => void
  onConfirm: (comment: string) => void
}

const titles = {
  approve: 'Approve Task Submission',
  reject: 'Reject Task Submission',
}

export default function SubmissionActionModal({
  open,
  action,
  loading = false,
  error = '',
  onClose,
  onConfirm,
}: SubmissionActionModalProps) {
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (open) {
      setComment('')
    }
  }, [open])

  if (!action) {
    return null
  }

  const isReject = action === 'reject'

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={titles[action]}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {isReject
              ? 'Rejection comment'
              : 'Admin comment (optional)'}
          </label>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            rows={4}
            placeholder={
              isReject
                ? 'Enter the reason for rejecting this submission...'
                : 'Add a comment if needed...'
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
            onClick={() => onConfirm(comment)}
            disabled={
              loading ||
              (isReject && !comment.trim())
            }
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}