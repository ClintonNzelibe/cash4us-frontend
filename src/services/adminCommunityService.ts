import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminCommunityEarning,
  AdminCommunityPool,
  AdminCommunityPoolRevenue,
  CommunityPoolFilters,
  CommunityPoolFormData,
  PaginatedCommunityResponse,
} from '../types/admin/community'

function getResults<T>(
  response: T[] | { results?: T[] },
): T[] {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.results)) {
    return response.results
  }

  return []
}

export async function getAdminCommunityPools(
  token: string,
  filters: CommunityPoolFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  const query = params.toString()

  return apiClient<
    AdminCommunityPool[] |
      PaginatedCommunityResponse<AdminCommunityPool>
  >(
    `${ADMIN_ENDPOINTS.communityPools}${
      query ? `?${query}` : ''
    }`,
    {
      token,
    },
  )
}

export async function getAdminCommunityPool(
  token: string,
  id: string,
) {
  return apiClient<AdminCommunityPool>(
    ADMIN_ENDPOINTS.communityPoolDetail(id),
    {
      token,
    },
  )
}

export async function createAdminCommunityPool(
  token: string,
  data: CommunityPoolFormData,
) {
  return apiClient<AdminCommunityPool>(
    ADMIN_ENDPOINTS.communityPoolCreate,
    {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    },
  )
}

export async function allocateCommunityRevenue(
  token: string,
  poolId: string,
  revenueId: string,
) {
  return apiClient<AdminCommunityPoolRevenue>(
    ADMIN_ENDPOINTS.communityAllocate(poolId),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        revenue_id: revenueId,
      }),
    },
  )
}

export async function closeCommunityPool(
  token: string,
  poolId: string,
) {
  return apiClient<AdminCommunityPool>(
    ADMIN_ENDPOINTS.communityClose(poolId),
    {
      method: 'POST',
      token,
    },
  )
}

export async function distributeCommunityPool(
  token: string,
  poolId: string,
) {
  return apiClient<{
    message: string
    pool: AdminCommunityPool
  }>(
    ADMIN_ENDPOINTS.communityDistribute(poolId),
    {
      method: 'POST',
      token,
    },
  )
}

export async function getCommunityPoolRevenues(
  token: string,
  poolId: string,
) {
  return apiClient<
    AdminCommunityPoolRevenue[] |
      PaginatedCommunityResponse<AdminCommunityPoolRevenue>
  >(
    ADMIN_ENDPOINTS.communityPoolRevenues(poolId),
    {
      token,
    },
  )
}

export async function getCommunityPoolEarnings(
  token: string,
  poolId: string,
) {
  return apiClient<
    AdminCommunityEarning[] |
      PaginatedCommunityResponse<AdminCommunityEarning>
  >(
    ADMIN_ENDPOINTS.communityPoolEarnings(poolId),
    {
      token,
    },
  )
}

export { getResults }