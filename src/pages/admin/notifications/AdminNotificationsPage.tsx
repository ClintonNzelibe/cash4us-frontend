import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { getAdminNotifications } from '../../../services/adminNotificationService'
import type {
  AdminNotification,
  NotificationFilters as NotificationFilterValues,
} from '../../../types/admin/notifications'

import NotificationTypeBadge from './components/NotificationTypeBadge'
import NotificationFilters from './components/NotificationFilters'

export default function AdminNotificationsPage() {
  const { accessToken } = useAuth()

  const [notifications, setNotifications] = useState<
    AdminNotification[]
  >([])
  const [filters, setFilters] =
    useState<NotificationFilterValues>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = useCallback(async () => {
    if (!accessToken) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminNotifications(
        accessToken,
        filters,
      )

      setNotifications(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load notifications.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, filters])

  useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and send member notifications.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadNotifications()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>

          <Link
            to="/admin/notifications/send"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus size={16} />
            Send Notification
          </Link>
        </div>
      </div>

      <NotificationFilters
        filters={filters}
        onChange={setFilters}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notification
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Member
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading notifications...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No notifications found.
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="max-w-sm px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {notification.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {notification.message}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {notification.member.username}
                      </p>

                      <p className="text-xs text-slate-500">
                        {notification.member.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <NotificationTypeBadge
                        type={notification.notification_type}
                      />
                    </td>

                    <td className="px-5 py-4">
                      {notification.is_read ? (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Unread
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(
                        notification.created_at,
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/notifications/${notification.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}