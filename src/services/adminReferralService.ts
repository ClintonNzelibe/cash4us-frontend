import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminReferral,
  AdminReferralFilters,
  AdminReferralListResponse,
} from '../types/admin/referrals'

export async function getAdminReferrals(
  accessToken: string,
  filters: AdminReferralFilters = {},
): Promise<AdminReferralListResponse | AdminReferral[]> {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.append('search', filters.search.trim())
  }

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.is_first_payment) {
    params.append(
      'is_first_payment',
      filters.is_first_payment,
    )
  }

  const query = params.toString()

  const endpoint = query
    ? `${ADMIN_ENDPOINTS.referrals}?${query}`
    : ADMIN_ENDPOINTS.referrals

  return apiClient<AdminReferralListResponse | AdminReferral[]>(
    endpoint,
    {
      method: 'GET',
      token: accessToken,
    },
  )
}

export async function getAdminReferral(
  id: string,
  accessToken: string,
): Promise<AdminReferral> {
  return apiClient<AdminReferral>(
    ADMIN_ENDPOINTS.referralDetail(id),
    {
      method: 'GET',
      token: accessToken,
    },
  )
}