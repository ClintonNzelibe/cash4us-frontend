import type {
  AuditLogFilters as AuditFilterValues,
} from '../../../../types/admin/audit'

interface AuditLogFiltersProps {
  filters: AuditFilterValues
  onChange: (filters: AuditFilterValues) => void
}

export default function AuditLogFilters({
  filters,
  onChange,
}: AuditLogFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <input
        type="text"
        value={filters.search ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
        placeholder="Search audit logs..."
        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <input
        type="text"
        value={filters.action ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            action: event.target.value,
          })
        }
        placeholder="Filter by action..."
        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <input
        type="text"
        value={filters.resource_type ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            resource_type: event.target.value,
          })
        }
        placeholder="Filter by resource type..."
        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  )
}