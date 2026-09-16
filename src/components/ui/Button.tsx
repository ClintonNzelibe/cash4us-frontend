import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary:
      'bg-[#0F766E] text-white hover:bg-[#115E59] focus:ring-[#0F766E]/20',
    secondary:
      'bg-[#22C55E] text-white hover:bg-[#16A34A] focus:ring-[#22C55E]/20',
    outline:
      'border border-slate-200 bg-white text-slate-700 hover:border-[#0F766E] hover:text-[#0F766E] focus:ring-[#0F766E]/10',
    danger:
      'bg-[#DC2626] text-white hover:bg-red-700 focus:ring-red-500/20',
  }

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}