import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'
import type {
  AdminNotification,
  NotificationFilters,
  SendNotificationPayload,
} from '../types/admin/notifications'

export async function getAdminNotifications(
  token: string,
  filters: NotificationFilters = {},
): Promise<AdminNotification[]> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.notification_type) {
    params.set(
      'notification_type',
      filters.notification_type,
    )
  }

  if (
    filters.is_read !== undefined &&
    filters.is_read !== ''
  ) {
    params.set('is_read', String(filters.is_read))
  }

  if (filters.user_id) {
    params.set('user_id', filters.user_id)
  }

  const query = params.toString()

  return apiClient<AdminNotification[]>(
    `${ADMIN_ENDPOINTS.notifications}${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      token,
    },
  )
}

export async function getAdminNotification(
  token: string,
  id: string,
): Promise<AdminNotification> {
  return apiClient<AdminNotification>(
    ADMIN_ENDPOINTS.notificationDetail(id),
    {
      method: 'GET',
      token,
    },
  )
}

export async function sendAdminNotification(
  token: string,
  data: SendNotificationPayload,
): Promise<AdminNotification> {
  return apiClient<AdminNotification>(
    ADMIN_ENDPOINTS.notificationSend,
    {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    },
  )
}