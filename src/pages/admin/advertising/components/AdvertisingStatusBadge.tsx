import type {
  AdvertisingCampaignStatus,
  AdvertisingRevenueStatus,
} from '../../../../types/admin/advertising'

interface Props {
  status:
    | AdvertisingCampaignStatus
    | AdvertisingRevenueStatus
}

const styles: Record<string, string> = {
  DRAFT:
    'bg-slate-100 text-slate-700',
  ACTIVE:
    'bg-emerald-100 text-emerald-700',
  COMPLETED:
    'bg-blue-100 text-blue-700',
  CANCELLED:
    'bg-red-100 text-red-700',
  PENDING:
    'bg-amber-100 text-amber-700',
  CONFIRMED:
    'bg-emerald-100 text-emerald-700',
}

const labels: Record<string, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
}

export default function AdvertisingStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}