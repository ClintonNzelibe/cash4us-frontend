interface WalletStatusBadgeProps {
  isDefault: boolean
}

export default function WalletStatusBadge({
  isDefault,
}: WalletStatusBadgeProps) {
  if (isDefault) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Default
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      Saved
    </span>
  )
}