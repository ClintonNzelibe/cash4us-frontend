import { useState } from 'react'
import type {
  NotificationType,
  SendNotificationPayload,
} from '../../../../types/admin/notifications'

interface NotificationSendFormProps {
  loading?: boolean
  error?: string
  onSubmit: (
    data: SendNotificationPayload,
  ) => Promise<void>
}

const notificationTypes: NotificationType[] = [
  'TASK',
  'POINTS',
  'AWARD',
  'WITHDRAWAL',
  'MEMBERSHIP',
  'SYSTEM',
]

export default function NotificationSendForm({
  loading = false,
  error = '',
  onSubmit,
}: NotificationSendFormProps) {
  const [userId, setUserId] = useState('')
  const [notificationType, setNotificationType] =
    useState<NotificationType>('SYSTEM')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await onSubmit({
      user_id: userId.trim(),
      notification_type: notificationType,
      title: title.trim(),
      message: message.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Notification details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Send a notification directly to a member.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Member ID
            </label>

            <input
              type="text"
              required
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              placeholder="Enter member UUID"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              The backend requires the member's UUID.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notification type
            </label>

            <select
              required
              value={notificationType}
              onChange={(event) =>
                setNotificationType(
                  event.target.value as NotificationType,
                )
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              required
              maxLength={255}
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Notification title"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Message
            </label>

            <textarea
              required
              rows={6}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Write your notification message..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </form>
  )
}