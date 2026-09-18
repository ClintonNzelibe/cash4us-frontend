import { useState } from 'react'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  submitting?: boolean
  requireUserId?: boolean
  onClose: () => void
  onConfirm: (
    userId: string,
    remarks: string,
  ) => void
}

export default function AwardActionModal({
  open,
  title,
  description,
  confirmLabel,
  submitting = false,
  requireUserId = false,
  onClose,
  onConfirm,
}: Props) {
  const [userId, setUserId] = useState('')
  const [remarks, setRemarks] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>

        {requireUserId && (
          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Member ID
            </label>

            <input
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              placeholder="Enter member UUID"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        )}

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Remarks
          </label>

          <textarea
            value={remarks}
            onChange={(event) =>
              setRemarks(event.target.value)
            }
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting || (requireUserId && !userId)}
            onClick={() =>
              onConfirm(userId, remarks)
            }
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}