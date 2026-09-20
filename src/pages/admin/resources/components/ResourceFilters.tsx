import type {
  ResourceFilters as ResourceFilterState,
  ResourceType,
} from '../../../../types/admin/resources'

interface Props {
  filters: ResourceFilterState
  onChange: (filters: ResourceFilterState) => void
}

export default function ResourceFilters({
  filters,
  onChange,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="resource-search"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="resource-search"
            type="text"
            value={filters.search || ''}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Search resources..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="resource-type"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Type
          </label>

          <select
            id="resource-type"
            value={filters.resource_type || ''}
            onChange={(event) =>
              onChange({
                ...filters,
                resource_type:
                  event.target.value as ResourceType | '',
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All types</option>
            <option value="PDF">PDF</option>
            <option value="VIDEO">Video</option>
            <option value="FLYER">Flyer</option>
            <option value="DOCUMENT">Document</option>
            <option value="LINK">External Link</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="resource-status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="resource-status"
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
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  )
}