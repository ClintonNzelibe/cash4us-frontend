import type { TaskFilters as TaskFilterValues } from '../../../../types/admin/tasks'

interface TaskFiltersProps {
  filters: TaskFilterValues
  onChange: (filters: TaskFilterValues) => void
}

export default function TaskFilters({
  filters,
  onChange,
}: TaskFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
      <input
        value={filters.search ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
        placeholder="Search task title, description or platform..."
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <select
        value={
          filters.is_active === undefined
            ? ''
            : String(filters.is_active)
        }
        onChange={(event) => {
          const value = event.target.value

          onChange({
            ...filters,
            is_active:
              value === ''
                ? undefined
                : value === 'true',
          })
        }}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  )
}