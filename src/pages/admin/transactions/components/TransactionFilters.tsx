import type {
  TransactionDirection,
  TransactionFilters as TransactionFilterState,
  TransactionType,
} from '../../../../types/admin/transactions'

interface TransactionFiltersProps {
  filters: TransactionFilterState
  onChange: (
    filters: TransactionFilterState,
  ) => void
}

const transactionTypes: {
  value: TransactionType
  label: string
}[] = [
  {
    value: 'PAYMENT',
    label: 'Membership Payment',
  },
  {
    value: 'REFERRAL_BONUS',
    label: 'Referral Bonus',
  },
  {
    value: 'COMMUNITY_EARNING',
    label: 'Community Earning',
  },
  {
    value: 'DAILY_EARNING',
    label: 'Daily Earning',
  },
  {
    value: 'TASK_REWARD',
    label: 'Task Reward',
  },
  {
    value: 'GIFT_VOUCHER',
    label: 'Gift Voucher',
  },
  {
    value: 'WITHDRAWAL',
    label: 'Withdrawal',
  },
  {
    value: 'ADMIN_ADJUSTMENT',
    label: 'Admin Adjustment',
  },
]

export default function TransactionFilters({
  filters,
  onChange,
}: TransactionFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label
            htmlFor="transaction-search"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Search transactions
          </label>

          <input
            id="transaction-search"
            type="text"
            value={filters.search ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Email, username, membership code, reference..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="transaction-type"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Transaction Type
          </label>

          <select
            id="transaction-type"
            value={filters.transaction_type ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                transaction_type:
                  event.target.value
                    ? (event.target.value as TransactionType)
                    : undefined,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              All types
            </option>

            {transactionTypes.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="transaction-direction"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Direction
          </label>

          <select
            id="transaction-direction"
            value={filters.direction ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                direction: event.target.value
                  ? (event.target.value as TransactionDirection)
                  : undefined,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              All directions
            </option>

            <option value="CREDIT">
              Credit
            </option>

            <option value="DEBIT">
              Debit
            </option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onChange({})}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}