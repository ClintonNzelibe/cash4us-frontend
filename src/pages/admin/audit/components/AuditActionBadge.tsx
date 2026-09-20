interface AuditActionBadgeProps {
  action: string
}

export default function AuditActionBadge({
  action,
}: AuditActionBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {action}
    </span>
  )
}