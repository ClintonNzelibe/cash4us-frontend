import type { TransactionType } from '../../../../types/admin/transactions'

interface TransactionTypeBadgeProps {
  type: TransactionType
}

const labels: Record<TransactionType, string> = {
  PAYMENT: 'Membership Payment',
  REFERRAL_BONUS: 'Referral Bonus',
  COMMUNITY_EARNING: 'Community Earning',
  DAILY_EARNING: 'Daily Earning',
  TASK_REWARD: 'Task Reward',
  GIFT_VOUCHER: 'Gift Voucher',
  WITHDRAWAL: 'Withdrawal',
  ADMIN_ADJUSTMENT: 'Admin Adjustment',
}

export default function TransactionTypeBadge({
  type,
}: TransactionTypeBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {labels[type] ?? type}
    </span>
  )
}