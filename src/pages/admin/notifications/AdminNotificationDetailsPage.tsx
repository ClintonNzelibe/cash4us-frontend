import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { getAdminNotification } from '../../../services/adminNotificationService'
import type { AdminNotification } from '../../../types/admin/notifications'

import NotificationTypeBadge from './components/NotificationTypeBadge'

export default function AdminNotificationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [notification, setNotification] =
    useState<AdminNotification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotification = useCallback(async () => {
    if (!accessToken || !id) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminNotification(
        accessToken,
        id,
      )

      setNotification(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load notification.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, id])

  useEffect(() => {
    void loadNotification()
  }, [loadNotification])

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading notification...
      </div>
    )
  }

  if (error || !notification) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/notifications"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Notifications
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Notification not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/notifications"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Notifications
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {notification.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Notification details
            </p>
          </div>

          <NotificationTypeBadge
            type={notification.notification_type}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Member
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Username
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {notification.member.username}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {notification.member.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Membership Code
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {notification.member.membership_code}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                User ID
              </p>

              <p className="mt-1 break-all text-xs text-slate-500">
                {notification.member.id}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">
            Message
          </h2>

          <div className="mt-5 rounded-lg bg-slate-50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {notification.message}
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </p>

              <div className="mt-2">
                {notification.is_read ? (
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    Read
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Unread
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {new Date(
                  notification.created_at,
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Read At
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {notification.read_at
                  ? new Date(
                      notification.read_at,
                    ).toLocaleString()
                  : 'Not read'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}