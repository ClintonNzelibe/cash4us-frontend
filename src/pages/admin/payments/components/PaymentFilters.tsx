import type {
  PaymentNetwork,
  PaymentStatus,
} from '../../../../types/admin/payments'

interface Props {
  search: string
  status: PaymentStatus | ''
  network: PaymentNetwork | ''
  installment: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: PaymentStatus | '') => void
  onNetworkChange: (value: PaymentNetwork | '') => void
  onInstallmentChange: (value: string) => void
}

export default function PaymentFilters({
  search,
  status,
  network,
  installment,
  onSearchChange,
  onStatusChange,
  onNetworkChange,
  onInstallmentChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Email, username, membership code..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as PaymentStatus | '',
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Network
          </label>

          <select
            value={network}
            onChange={(e) =>
              onNetworkChange(
                e.target.value as PaymentNetwork | '',
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All networks</option>
            <option value="TRC20">TRC20</option>
            <option value="BEP20">BEP20</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Installment
          </label>

          <select
            value={installment}
            onChange={(e) => onInstallmentChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All installments</option>
            <option value="1">Installment 1</option>
            <option value="2">Installment 2</option>
            <option value="3">Installment 3</option>
            <option value="4">Installment 4</option>
            <option value="5">Installment 5</option>
            <option value="6">Installment 6</option>
            <option value="7">Installment 7</option>
            <option value="8">Installment 8</option>
            <option value="9">Installment 9</option>
            <option value="10">Installment 10</option>
          </select>
        </div>
      </div>
    </div>
  )
}