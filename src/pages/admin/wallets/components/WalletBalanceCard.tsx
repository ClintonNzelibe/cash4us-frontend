import Card from '../../../../components/ui/Card'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

interface WalletBalanceCardProps {
  label: string
  value: string | number
  description?: string
}

export default function WalletBalanceCard({
  label,
  value,
  description,
}: WalletBalanceCardProps) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {formatCurrency(value)}
      </p>

      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </Card>
  )
}