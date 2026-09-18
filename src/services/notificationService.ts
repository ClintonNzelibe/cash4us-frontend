import { apiClient } from '../api/client'
import type {
  Notification,
  UnreadNotificationCount,
} from '../types/notification'

export async function getNotifications(
  token: string,
): Promise<Notification[]> {
  const data = await apiClient<
    Notification[] | { results: Notification[] }
  >('/v1/notifications/', {
    method: 'GET',
    token,
  })

  return Array.isArray(data) ? data : data.results
}

export async function getUnreadNotificationCount(
  token: string,
): Promise<number> {
  const data =
    await apiClient<UnreadNotificationCount>(
      '/v1/notifications/unread-count/',
      {
        method: 'GET',
        token,
      },
    )

  return data.unread_count
}

export async function markNotificationRead(
  token: string,
  notificationId: string,
): Promise<Notification> {
  return apiClient<Notification>(
    `/v1/notifications/${notificationId}/read/`,
    {
      method: 'PATCH',
      token,
    },
  )
}

export async function markAllNotificationsRead(
  token: string,
): Promise<void> {
  await apiClient<{ detail: string; updated: number }>(
    '/v1/notifications/read-all/',
    {
      method: 'POST',
      token,
    },
  )
}