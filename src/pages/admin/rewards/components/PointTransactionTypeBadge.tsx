import type { PointTransactionType } from '../../../../types/admin/rewards'

interface Props {
  type: PointTransactionType
}

export default function PointTransactionTypeBadge({
  type,
}: Props) {
  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())}
    </span>
  )
}