export type NotificationType =
  | 'TASK'
  | 'POINTS'
  | 'AWARD'
  | 'WITHDRAWAL'
  | 'MEMBERSHIP'
  | 'SYSTEM'

export interface Notification {
  id: string
  notification_type: NotificationType
  title: string
  message: string
  is_read: boolean
  created_at: string
  read_at: string | null
}

export interface UnreadNotificationCount {
  unread_count: number
}