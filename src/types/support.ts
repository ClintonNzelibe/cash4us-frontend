export type SupportStatus =
  | 'OPEN'
  | 'REPLIED'
  | 'CLOSED'

export interface SupportTicket {
  id: string
  subject: string
  message: string
  reply: string
  status: SupportStatus
  created_at: string
  replied_at: string | null
  updated_at: string
}

export interface CreateSupportTicketPayload {
  subject: string
  message: string
}