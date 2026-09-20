import type { AdvertisingRevenueStatus } from '../../../../types/admin/advertising'

interface Props {
  status: AdvertisingRevenueStatus
}

const styles: Record<
  AdvertisingRevenueStatus,
  string
> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const labels: Record<
  AdvertisingRevenueStatus,
  string
> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

export default function AdvertisingRevenueStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}