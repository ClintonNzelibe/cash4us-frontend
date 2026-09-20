import type { PartnerFilters as PartnerFilterValues } from '../../../../types/admin/partners'

interface PartnerFiltersProps {
  filters: PartnerFilterValues
  onChange: (filters: PartnerFilterValues) => void
}

export default function PartnerFilters({
  filters,
  onChange,
}: PartnerFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center">
      <div className="flex-1">
        <input
          type="text"
          value={filters.search ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value,
            })
          }
          placeholder="Search partners..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <select
        value={
          filters.is_active === ''
            ? ''
            : filters.is_active === undefined
              ? ''
              : String(filters.is_active)
        }
        onChange={(event) => {
          const value = event.target.value

          onChange({
            ...filters,
            is_active:
              value === ''
                ? ''
                : value === 'true',
          })
        }}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  )
}