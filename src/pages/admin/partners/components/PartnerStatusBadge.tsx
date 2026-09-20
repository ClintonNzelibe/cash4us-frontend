interface PartnerStatusBadgeProps {
  isActive: boolean
}

export default function PartnerStatusBadge({
  isActive,
}: PartnerStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? 'bg-green-50 text-green-700'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          isActive ? 'bg-green-500' : 'bg-slate-400'
        }`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}