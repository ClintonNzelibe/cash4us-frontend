import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { sendAdminNotification } from '../../../services/adminNotificationService'
import type { SendNotificationPayload } from '../../../types/admin/notifications'

import NotificationSendForm from './components/NotificationSendForm'

export default function AdminNotificationSendPage() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    data: SendNotificationPayload,
  ) {
    if (!accessToken) {
      setError('Authentication token is unavailable.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const notification =
        await sendAdminNotification(
          accessToken,
          data,
        )

      navigate(
        `/admin/notifications/${notification.id}`,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send notification.',
      )
    } finally {
      setLoading(false)
    }
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

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Send Notification
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Send a notification to a Cash4Us member.
        </p>
      </div>

      <NotificationSendForm
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  )
}