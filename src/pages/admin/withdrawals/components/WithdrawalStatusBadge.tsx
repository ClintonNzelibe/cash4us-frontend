import type { WithdrawalStatus } from '../../../../types/admin/withdrawals'

interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatus
}

const styles: Record<WithdrawalStatus, string> = {
  PENDING:
    'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED:
    'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED:
    'bg-red-50 text-red-700 border-red-200',
  PAID:
    'bg-blue-50 text-blue-700 border-blue-200',
}

export default function WithdrawalStatusBadge({
  status,
}: WithdrawalStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  )
}