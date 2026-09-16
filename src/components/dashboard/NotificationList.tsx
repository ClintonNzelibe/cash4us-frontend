import { Bell, CheckCircle2 } from 'lucide-react'
import Card from '../ui/Card'
import { formatDateTime } from '../../utils/formatDate'
import type { NotificationSummary } from '../../types/dashboard'

interface NotificationListProps {
  notifications: NotificationSummary[]
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-900">
          Notifications
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Latest updates from Cash4Us
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          No notifications yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 px-6 py-4 ${
                !notification.is_read
                  ? 'bg-emerald-50/40'
                  : ''
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                {notification.is_read ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Bell size={17} />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {notification.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {notification.message}
                </p>

                <p className="mt-2 text-[11px] text-slate-400">
                  {formatDateTime(notification.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}