interface ReferralSummaryCardProps {
  title: string
  value: string | number
  description?: string
}

export default function ReferralSummaryCard({
  title,
  value,
  description,
}: ReferralSummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}