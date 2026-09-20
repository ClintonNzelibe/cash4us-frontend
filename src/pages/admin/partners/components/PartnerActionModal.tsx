interface PartnerActionModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function PartnerActionModal({
  isOpen,
  title,
  message,
  confirmLabel,
  loading = false,
  onConfirm,
  onClose,
}: PartnerActionModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Updating...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}