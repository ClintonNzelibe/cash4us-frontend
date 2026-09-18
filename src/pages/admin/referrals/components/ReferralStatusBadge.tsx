import type { ReferralStatus } from '../../../../types/admin/referrals'

interface ReferralStatusBadgeProps {
  status: ReferralStatus
}

export default function ReferralStatusBadge({
  status,
}: ReferralStatusBadgeProps) {
  const styles: Record<ReferralStatus, string> = {
    PENDING:
      'bg-amber-50 text-amber-700 border border-amber-200',
    PAID:
      'bg-emerald-50 text-emerald-700 border border-emerald-200',
    CANCELLED:
      'bg-red-50 text-red-700 border border-red-200',
  }

  const labels: Record<ReferralStatus, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}