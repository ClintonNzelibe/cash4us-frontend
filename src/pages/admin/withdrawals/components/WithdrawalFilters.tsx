import type { WithdrawalStatus } from '../../../../types/admin/withdrawals'

interface WithdrawalFiltersProps {
  search: string
  status: WithdrawalStatus | ''
  network: string
  onSearchChange: (value: string) => void
  onStatusChange: (
    value: WithdrawalStatus | '',
  ) => void
  onNetworkChange: (value: string) => void
}

export default function WithdrawalFilters({
  search,
  status,
  network,
  onSearchChange,
  onStatusChange,
  onNetworkChange,
}: WithdrawalFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <input
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search member, email, code or wallet..."
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value as WithdrawalStatus | '',
          )
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="PAID">Paid</option>
      </select>

      <input
        value={network}
        onChange={(event) =>
          onNetworkChange(event.target.value)
        }
        placeholder="Network (e.g. TRC20)"
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  )
}