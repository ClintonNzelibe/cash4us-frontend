interface Props {
  isActive: boolean
}

export default function ResourceStatusBadge({
  isActive,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}