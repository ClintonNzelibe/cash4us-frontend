import type { TransactionDirection } from '../../../../types/admin/transactions'

interface TransactionDirectionBadgeProps {
  direction: TransactionDirection
}

export default function TransactionDirectionBadge({
  direction,
}: TransactionDirectionBadgeProps) {
  const isCredit = direction === 'CREDIT'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isCredit
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      {isCredit ? 'Credit' : 'Debit'}
    </span>
  )
}