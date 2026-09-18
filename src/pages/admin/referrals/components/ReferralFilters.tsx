import type {
  AdminReferralFilters,
  ReferralStatus,
} from '../../../../types/admin/referrals'

interface ReferralFiltersProps {
  filters: AdminReferralFilters
  onChange: (filters: AdminReferralFilters) => void
}

export default function ReferralFilters({
  filters,
  onChange,
}: ReferralFiltersProps) {
  const updateFilter = (
    key: keyof AdminReferralFilters,
    value: string,
  ) => {
    onChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Search
        </label>

        <input
          type="text"
          value={filters.search ?? ''}
          onChange={(event) =>
            updateFilter('search', event.target.value)
          }
          placeholder="Search member, email or code..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Status
        </label>

        <select
          value={filters.status ?? ''}
          onChange={(event) =>
            updateFilter(
              'status',
              event.target.value as ReferralStatus | '',
            )
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          First Payment
        </label>

        <select
          value={filters.is_first_payment ?? ''}
          onChange={(event) =>
            updateFilter(
              'is_first_payment',
              event.target.value as '' | 'true' | 'false',
            )
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">All referrals</option>
          <option value="true">First payment</option>
          <option value="false">Not first payment</option>
        </select>
      </div>
    </div>
  )
}