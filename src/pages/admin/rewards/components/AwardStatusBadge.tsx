import type { AwardStatus } from '../../../../types/admin/rewards'

interface Props {
  status: AwardStatus
}

export default function AwardStatusBadge({
  status,
}: Props) {
  const styles: Record<AwardStatus, string> = {
    DRAFT: 'bg-slate-50 text-slate-600 border-slate-200',
    ACTIVE:
      'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED:
      'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED:
      'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.charAt(0) +
        status.slice(1).toLowerCase()}
    </span>
  )
}