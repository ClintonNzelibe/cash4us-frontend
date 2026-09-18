import type { WalletFilters } from '../../../../types/admin/wallets'

interface WalletFiltersProps {
  filters: WalletFilters
  onChange: (filters: WalletFilters) => void
}

export default function WalletFilters({
  filters,
  onChange,
}: WalletFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label
            htmlFor="wallet-search"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Search wallets
          </label>

          <input
            id="wallet-search"
            type="text"
            value={filters.search ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Search by email, username or membership code..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          type="button"
          onClick={() => onChange({})}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear
        </button>
      </div>
    </div>
  )
}