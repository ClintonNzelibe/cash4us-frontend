export function formatCurrency(
  value: string | number,
  currency = 'USD',
): string {
  const amount =
    typeof value === 'string' ? Number(value) : value

  if (!Number.isFinite(amount)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}