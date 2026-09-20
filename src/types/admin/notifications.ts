export type NotificationType =
  | 'TASK'
  | 'POINTS'
  | 'AWARD'
  | 'WITHDRAWAL'
  | 'MEMBERSHIP'
  | 'SYSTEM'

export interface AdminNotificationMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminNotification {
  id: string
  member: AdminNotificationMember
  notification_type: NotificationType
  title: string
  message: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface NotificationFilters {
  search?: string
  notification_type?: NotificationType | ''
  is_read?: boolean | ''
  user_id?: string
}

export interface SendNotificationPayload {
  user_id: string
  notification_type: NotificationType
  title: string
  message: string
}