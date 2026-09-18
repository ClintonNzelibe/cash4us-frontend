import Card from '../../../../components/ui/Card'

interface RewardPointsCardProps {
  title: string
  value: string | number
  description?: string
}

export default function RewardPointsCard({
  title,
  value,
  description,
}: RewardPointsCardProps) {
  return (
    <Card>
      <p className="text-sm text-slate-500">
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
    </Card>
  )
}