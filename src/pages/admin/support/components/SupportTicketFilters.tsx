import type {
  SupportTicketFilters as SupportFilters,
  SupportTicketStatus,
} from '../../../../types/admin/support'

interface Props {
  filters: SupportFilters
  onChange: (filters: SupportFilters) => void
}

export default function SupportTicketFilters({
  filters,
  onChange,
}: Props) {
  const handleSearchChange = (
    value: string,
  ) => {
    onChange({
      ...filters,
      search: value,
    })
  }

  const handleStatusChange = (
    value: SupportTicketStatus | '',
  ) => {
    onChange({
      ...filters,
      status: value,
    })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="support-search"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="support-search"
            type="text"
            value={filters.search || ''}
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
            placeholder="Search subject, message, email or username..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="support-status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="support-status"
            value={filters.status || ''}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as SupportTicketStatus | '',
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="REPLIED">Replied</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>
    </div>
  )
}