import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminMember,
  AdminMemberListResponse,
} from '../types/admin/members'

export function getAdminMembers(
  token: string,
  params?: {
    search?: string
    is_active?: boolean
  },
): Promise<AdminMember[] | AdminMemberListResponse> {
  const searchParams = new URLSearchParams()

  if (params?.search?.trim()) {
    searchParams.set('search', params.search.trim())
  }

  if (params?.is_active !== undefined) {
    searchParams.set(
      'is_active',
      String(params.is_active),
    )
  }

  const query = searchParams.toString()

  return apiClient<AdminMember[] | AdminMemberListResponse>(
    `${ADMIN_ENDPOINTS.members}${query ? `?${query}` : ''}`,
    {
      token,
    },
  )
}

export function getAdminMember(
  id: string,
  token: string,
): Promise<AdminMember> {
  return apiClient<AdminMember>(
    ADMIN_ENDPOINTS.memberDetail(id),
    {
      token,
    },
  )
}

export function updateAdminMemberStatus(
  id: string,
  isActive: boolean,
  token: string,
): Promise<AdminMember> {
  return apiClient<AdminMember>(
    ADMIN_ENDPOINTS.memberStatus(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  )
}