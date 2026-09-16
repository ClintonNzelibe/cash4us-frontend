import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  error?: string
  icon?: ReactNode
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          id={id}
          className={`h-12 w-full rounded-xl border bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
              : 'border-slate-200'
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}