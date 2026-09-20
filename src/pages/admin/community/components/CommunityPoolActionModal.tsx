interface Props {
  title: string
  message: string
  actionLabel: string
  loading?: boolean
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function CommunityPoolActionModal({
  title,
  message,
  actionLabel,
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 ${
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {loading ? 'Processing...' : actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}