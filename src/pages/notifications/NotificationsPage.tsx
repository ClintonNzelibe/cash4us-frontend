import {
  Award,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Info,
  Loader2,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/notificationService'
import type {
  Notification,
  NotificationType,
} from '../../types/notification'

const typeConfig: Record<
  NotificationType,
  {
    icon: typeof Bell
    background: string
    text: string
    label: string
  }
> = {
  TASK: {
    icon: Check,
    background: 'bg-emerald-50',
    text: 'text-[#0F766E]',
    label: 'Task',
  },
  POINTS: {
    icon: Trophy,
    background: 'bg-amber-50',
    text: 'text-amber-600',
    label: 'Points',
  },
  AWARD: {
    icon: Award,
    background: 'bg-purple-50',
    text: 'text-purple-600',
    label: 'Award',
  },
  WITHDRAWAL: {
    icon: CircleDollarSign,
    background: 'bg-blue-50',
    text: 'text-blue-600',
    label: 'Withdrawal',
  },
  MEMBERSHIP: {
    icon: Users,
    background: 'bg-indigo-50',
    text: 'text-indigo-600',
    label: 'Membership',
  },
  SYSTEM: {
    icon: Info,
    background: 'bg-slate-100',
    text: 'text-slate-600',
    label: 'System',
  },
}

function formatNotificationDate(value: string) {
  const date = new Date(value)
  const now = new Date()

  const diff =
    Math.floor(
      (now.getTime() - date.getTime()) / 1000,
    )

  if (diff < 60) {
    return 'Just now'
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `${minutes}m ago`
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `${hours}h ago`
  }

  if (diff < 172800) {
    return 'Yesterday'
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year:
      date.getFullYear() !== now.getFullYear()
        ? 'numeric'
        : undefined,
  })
}

function NotificationIcon({
  type,
}: {
  type: NotificationType
}) {
  const config = typeConfig[type] || typeConfig.SYSTEM
  const Icon = config.icon

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.background} ${config.text}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  )
}

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: Notification
  onOpen: (notification: Notification) => void
}) {
  const config =
    typeConfig[notification.notification_type] ||
    typeConfig.SYSTEM

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={`group flex w-full items-start gap-4 border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 sm:px-5 ${
        notification.is_read
          ? 'bg-white hover:bg-slate-50'
          : 'bg-emerald-50/40 hover:bg-emerald-50/70'
      }`}
    >
      <NotificationIcon
        type={notification.notification_type}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-2">
            {!notification.is_read && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0F766E]" />
            )}

            <h3
              className={`truncate text-sm ${
                notification.is_read
                  ? 'font-medium text-slate-700'
                  : 'font-semibold text-[#0F172A]'
              }`}
            >
              {notification.title}
            </h3>
          </div>

          <span className="shrink-0 text-xs text-slate-400">
            {formatNotificationDate(
              notification.created_at,
            )}
          </span>
        </div>

        <p
          className={`mt-1 line-clamp-2 text-sm leading-5 ${
            notification.is_read
              ? 'text-slate-500'
              : 'text-slate-600'
          }`}
        >
          {notification.message}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wide ${config.text}`}
          >
            {config.label}
          </span>

          <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  )
}

function NotificationModal({
  notification,
  onClose,
  onMarkRead,
}: {
  notification: Notification
  onClose: () => void
  onMarkRead: () => void
}) {
  const config =
    typeConfig[notification.notification_type] ||
    typeConfig.SYSTEM

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <NotificationIcon
              type={notification.notification_type}
            />

            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}
              >
                {config.label}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#0F172A]">
                Notification
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-base font-semibold text-[#0F172A]">
            {notification.title}
          </h3>

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
            {notification.message}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />

            {new Date(
              notification.created_at,
            ).toLocaleString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>

          {!notification.is_read && (
            <button
              type="button"
              onClick={onMarkRead}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              <Check className="h-4 w-4" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { accessToken } = useAuth()

  const [notifications, setNotifications] =
    useState<Notification[]>([])

  const [unreadCount, setUnreadCount] =
    useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [isMarkingAll, setIsMarkingAll] =
    useState(false)

  const [error, setError] = useState('')

  const [filter, setFilter] = useState<
    'ALL' | 'UNREAD'
  >('ALL')

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)

  const loadData = async () => {
    if (!accessToken) return

    try {
      setIsLoading(true)
      setError('')

      const [notificationsData, unreadData] =
        await Promise.all([
          getNotifications(accessToken),
          getUnreadNotificationCount(accessToken),
        ])

      setNotifications(notificationsData)
      setUnreadCount(unreadData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load notifications.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [accessToken])

  const filteredNotifications = useMemo(() => {
    if (filter === 'UNREAD') {
      return notifications.filter(
        (notification) => !notification.is_read,
      )
    }

    return notifications
  }, [filter, notifications])

  const handleOpen = async (
    notification: Notification,
  ) => {
    setSelectedNotification(notification)

    if (
      notification.is_read ||
      !accessToken
    ) {
      return
    }

    try {
      const updated =
        await markNotificationRead(
          accessToken,
          notification.id,
        )

      setNotifications((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      )

      setUnreadCount((current) =>
        Math.max(current - 1, 0),
      )

      setSelectedNotification(updated)
    } catch {
      // Keep the notification open even if marking it
      // read fails.
    }
  }

  const handleMarkAllRead = async () => {
    if (!accessToken || unreadCount === 0) {
      return
    }

    try {
      setIsMarkingAll(true)

      await markAllNotificationsRead(accessToken)

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
          read_at:
            notification.read_at ||
            new Date().toISOString(),
        })),
      )

      setUnreadCount(0)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to mark notifications as read.',
      )
    } finally {
      setIsMarkingAll(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />

          <div className="h-16 rounded-2xl bg-white" />

          <div className="overflow-hidden rounded-2xl bg-white">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 border-b border-slate-100 p-5"
              >
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-7">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">
          Stay up to date
        </p>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Important updates about your Cash4Us
              account.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isMarkingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}

              Mark all as read
            </button>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
              <Bell className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Total notifications
              </p>

              <p className="mt-0.5 text-xl font-bold text-[#0F172A]">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Unread
              </p>

              <p className="mt-0.5 text-xl font-bold text-[#0F172A]">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notification list */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Your notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View updates and account activity.
            </p>
          </div>

          <div className="flex w-fit rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'ALL'
                  ? 'bg-[#0F766E] text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter('UNREAD')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'UNREAD'
                  ? 'bg-[#0F766E] text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                    filter === 'UNREAD'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-[#0F766E]'
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <Bell className="h-6 w-6 text-slate-300" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              {filter === 'UNREAD'
                ? 'No unread notifications'
                : 'No notifications yet'}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              {filter === 'UNREAD'
                ? 'You are all caught up.'
                : 'Important account updates will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {filteredNotifications.map(
              (notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onOpen={handleOpen}
                />
              ),
            )}
          </div>
        )}
      </section>

      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() =>
            setSelectedNotification(null)
          }
          onMarkRead={() => {
            if (accessToken) {
              void handleOpen(selectedNotification)
            }
          }}
        />
      )}
    </div>
  )
}