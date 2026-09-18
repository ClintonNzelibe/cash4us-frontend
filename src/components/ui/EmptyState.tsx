import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-md text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}