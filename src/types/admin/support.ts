export type SupportTicketStatus =
  | 'OPEN'
  | 'REPLIED'
  | 'CLOSED'

export interface AdminSupportMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminSupportTicket {
  id: string
  member: AdminSupportMember
  subject: string
  message: string
  reply: string
  status: SupportTicketStatus
  created_at: string
  updated_at: string
}

export interface SupportTicketFilters {
  search?: string
  status?: SupportTicketStatus | ''
}

export interface SupportReplyPayload {
  reply: string
}