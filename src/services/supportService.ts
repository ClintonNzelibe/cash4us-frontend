import { apiClient } from '../api/client'

import type {
  CreateSupportTicketPayload,
  SupportTicket,
} from '../types/support'

export async function getSupportTickets(
  token: string,
): Promise<SupportTicket[]> {
  const response = await apiClient<
    SupportTicket[] | { results: SupportTicket[] }
  >('/v1/support/', {
    method: 'GET',
    token,
  })

  return Array.isArray(response)
    ? response
    : response.results
}

export async function createSupportTicket(
  token: string,
  payload: CreateSupportTicketPayload,
): Promise<SupportTicket> {
  return apiClient<SupportTicket>('/v1/support/', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}