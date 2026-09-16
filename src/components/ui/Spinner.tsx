interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({
  size = 'md',
}: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
  }

  return (
    <span
      className={`inline-block animate-spin rounded-full border-slate-200 border-t-[#0F766E] ${sizes[size]}`}
      aria-label="Loading"
    />
  )
}