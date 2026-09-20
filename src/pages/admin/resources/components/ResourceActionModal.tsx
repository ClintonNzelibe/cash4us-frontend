interface Props {
  open: boolean
  loading?: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ResourceActionModal({
  open,
  loading = false,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
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
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}