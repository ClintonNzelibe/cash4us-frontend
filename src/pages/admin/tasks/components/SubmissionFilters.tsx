import type {
  SubmissionFilters as SubmissionFilterValues,
  TaskSubmissionStatus,
} from '../../../../types/admin/tasks'

interface SubmissionFiltersProps {
  filters: SubmissionFilterValues
  onChange: (filters: SubmissionFilterValues) => void
}

export default function SubmissionFilters({
  filters,
  onChange,
}: SubmissionFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <input
        value={filters.search ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
        placeholder="Search member, email, code or task..."
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <select
        value={filters.status ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            status:
              event.target.value === ''
                ? undefined
                : (event.target.value as TaskSubmissionStatus),
          })
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={
          filters.requires_admin_review === undefined
            ? ''
            : String(filters.requires_admin_review)
        }
        onChange={(event) => {
          const value = event.target.value

          onChange({
            ...filters,
            requires_admin_review:
              value === ''
                ? undefined
                : value === 'true',
          })
        }}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All review states</option>
        <option value="true">Requires admin review</option>
        <option value="false">No admin review</option>
      </select>
    </div>
  )
}