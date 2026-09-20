import type {
  CommunityPoolFilters,
  CommunityPoolStatus,
} from '../../../../types/admin/community'

interface Props {
  filters: CommunityPoolFilters
  onChange: (filters: CommunityPoolFilters) => void
}

const statuses: CommunityPoolStatus[] = [
  'OPEN',
  'CLOSED',
  'DISTRIBUTED',
]

export default function CommunityPoolFilters({
  filters,
  onChange,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </label>

          <input
            type="text"
            value={filters.search || ''}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Search pool name..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={filters.status || ''}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as
                  | CommunityPoolStatus
                  | '',
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}