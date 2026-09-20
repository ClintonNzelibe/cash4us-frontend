import type {
  AdvertisingCampaignStatus,
  AdvertisingFilters as AdvertisingFiltersType,
  AdvertisingRevenueSource,
  AdvertisingRevenueStatus,
} from '../../../../types/admin/advertising'

interface Props {
  filters: AdvertisingFiltersType
  onChange: (
    filters: AdvertisingFiltersType,
  ) => void
  mode:
    | 'advertisers'
    | 'campaigns'
    | 'revenue'
}

export default function AdvertisingFiltersComponent({
  filters,
  onChange,
  mode,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Search
        </label>

        <input
          type="text"
          value={filters.search ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value,
            })
          }
          placeholder={
            mode === 'advertisers'
              ? 'Search advertiser...'
              : mode === 'campaigns'
                ? 'Search campaign...'
                : 'Search revenue...'
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
        />
      </div>

      {mode === 'advertisers' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
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
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}

      {mode === 'campaigns' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={filters.status ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as
                  | AdvertisingCampaignStatus
                  | '',
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      )}

      {mode === 'revenue' && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={filters.status ?? ''}
              onChange={(event) =>
                onChange({
                  ...filters,
                  status: event.target.value as
                    | AdvertisingRevenueStatus
                    | '',
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Source
            </label>

            <select
              value={filters.source ?? ''}
              onChange={(event) =>
                onChange({
                  ...filters,
                  source: event.target.value as
                    | AdvertisingRevenueSource
                    | '',
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
            >
              <option value="">All Sources</option>
              <option value="CAMPAIGN">Advertising Campaign</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="SPONSORSHIP">Sponsorship</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}