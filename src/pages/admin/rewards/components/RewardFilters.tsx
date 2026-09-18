import type {
  PointTransactionType,
  RewardFilters,
  AwardStatus,
} from '../../../../types/admin/rewards'

interface Props {
  filters: RewardFilters
  onChange: (filters: RewardFilters) => void
  mode: 'points' | 'transactions' | 'awards' | 'user-awards'
}

export default function RewardFilters({
  filters,
  onChange,
  mode,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Search
        </label>

        <input
          value={filters.search ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value,
            })
          }
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {mode === 'transactions' && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Transaction Type
          </label>

          <select
            value={filters.transaction_type ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                transaction_type:
                  event.target.value as PointTransactionType | '',
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option value="">All types</option>
            <option value="TASK_REWARD">Task Reward</option>
            <option value="REFERRAL_REWARD">
              Referral Reward
            </option>
            <option value="DAILY_ACTIVITY">
              Daily Activity
            </option>
            <option value="COMMUNITY_REWARD">
              Community Reward
            </option>
            <option value="ADMIN_AWARD">Admin Award</option>
            <option value="REDEMPTION">Redemption</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>
      )}

      {mode === 'awards' && (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={filters.status ?? ''}
              onChange={(event) =>
                onChange({
                  ...filters,
                  status: event.target.value as AwardStatus | '',
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Active
            </label>

            <select
              value={filters.is_active ?? ''}
              onChange={(event) =>
                onChange({
                  ...filters,
                  is_active: event.target.value as
                    | ''
                    | 'true'
                    | 'false',
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}