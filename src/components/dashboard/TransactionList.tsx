import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDateTime } from '../../utils/formatDate'
import type { TransactionSummary } from '../../types/dashboard'

interface TransactionListProps {
  transactions: TransactionSummary[]
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-900">
          Recent Transactions
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Your latest wallet activity
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          No transactions yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((transaction) => {
            const isCredit =
              transaction.direction === 'CREDIT'

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCredit
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {transaction.transaction_type_display}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(transaction.created_at)}
                    </p>
                  </div>
                </div>

                <p
                  className={`shrink-0 text-sm font-semibold ${
                    isCredit
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {isCredit ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}