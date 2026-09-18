import type { AwardPeriod } from '../../../../types/admin/rewards'

interface Props {
  period: AwardPeriod
}

export default function AwardPeriodBadge({
  period,
}: Props) {
  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
      {period.charAt(0) +
        period.slice(1).toLowerCase()}
    </span>
  )
}