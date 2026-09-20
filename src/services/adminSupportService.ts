import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminSupportTicket,
  SupportReplyPayload,
  SupportTicketFilters,
} from '../types/admin/support'

interface PaginatedSupportTickets {
  count: number
  next: string | null
  previous: string | null
  results: AdminSupportTicket[]
}

export async function getAdminSupportTickets(
  token: string,
  filters: SupportTicketFilters = {},
): Promise<AdminSupportTicket[] | PaginatedSupportTickets> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  const query = params.toString()

  return apiClient<
    AdminSupportTicket[] | PaginatedSupportTickets
  >(
    `${ADMIN_ENDPOINTS.supportTickets}${
      query ? `?${query}` : ''
    }`,
    {
      method: 'GET',
      token,
    },
  )
}

export async function getAdminSupportTicket(
  token: string,
  id: string,
): Promise<AdminSupportTicket> {
  return apiClient<AdminSupportTicket>(
    ADMIN_ENDPOINTS.supportTicketDetail(id),
    {
      method: 'GET',
      token,
    },
  )
}

export async function replyToAdminSupportTicket(
  token: string,
  id: string,
  payload: SupportReplyPayload,
): Promise<AdminSupportTicket> {
  return apiClient<AdminSupportTicket>(
    ADMIN_ENDPOINTS.supportReply(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    },
  )
}

export async function closeAdminSupportTicket(
  token: string,
  id: string,
): Promise<AdminSupportTicket> {
  return apiClient<AdminSupportTicket>(
    ADMIN_ENDPOINTS.supportClose(id),
    {
      method: 'POST',
      token,
    },
  )
}