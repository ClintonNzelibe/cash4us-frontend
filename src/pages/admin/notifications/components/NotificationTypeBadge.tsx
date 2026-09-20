import type { NotificationType } from '../../../../types/admin/notifications'

interface NotificationTypeBadgeProps {
  type: NotificationType
}

export default function NotificationTypeBadge({
  type,
}: NotificationTypeBadgeProps) {
  const labels: Record<NotificationType, string> = {
    TASK: 'Task',
    POINTS: 'Points',
    AWARD: 'Award',
    WITHDRAWAL: 'Withdrawal',
    MEMBERSHIP: 'Membership',
    SYSTEM: 'System',
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {labels[type]}
    </span>
  )
}