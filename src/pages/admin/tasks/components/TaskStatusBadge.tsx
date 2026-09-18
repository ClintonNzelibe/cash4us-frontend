import type { AdminDailyTask } from '../../../../types/admin/tasks'

interface TaskStatusBadgeProps {
  isActive: AdminDailyTask['is_active']
}

export default function TaskStatusBadge({
  isActive,
}: TaskStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}