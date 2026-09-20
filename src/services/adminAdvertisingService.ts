import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminAdvertiser,
  AdminCampaign,
  AdminAdvertisingRevenue,
  AdvertisingFilters,
  AdvertiserFormData,
  CampaignFormData,
  RevenueFormData,
} from '../types/admin/advertising'

function getResults<T>(response: T[] | { results?: T[] }): T[] {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.results)) {
    return response.results
  }

  return []
}

// ------------------------------------
// Advertisers
// ------------------------------------

export async function getAdminAdvertisers(
  token: string,
  filters: AdvertisingFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.is_active) {
    params.set('is_active', filters.is_active)
  }

  const query = params.toString()

  return apiClient<
    AdminAdvertiser[] | { results: AdminAdvertiser[] }
  >(
    `${ADMIN_ENDPOINTS.advertisers}${query ? `?${query}` : ''}`,
    {
      token,
    },
  )
}

export async function getAdminAdvertiser(
  token: string,
  id: string,
) {
  return apiClient<AdminAdvertiser>(
    ADMIN_ENDPOINTS.advertiserDetail(id),
    {
      token,
    },
  )
}

export async function createAdminAdvertiser(
  token: string,
  data: AdvertiserFormData,
) {
  return apiClient<AdminAdvertiser>(
    ADMIN_ENDPOINTS.advertiserCreate,
    {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    },
  )
}

export async function updateAdminAdvertiser(
  token: string,
  id: string,
  data: Partial<AdvertiserFormData>,
) {
  return apiClient<AdminAdvertiser>(
    ADMIN_ENDPOINTS.advertiserUpdate(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    },
  )
}

export async function updateAdminAdvertiserStatus(
  token: string,
  id: string,
  isActive: boolean,
) {
  return apiClient<{
    message: string
    advertiser_id: string
    is_active: boolean
  }>(
    ADMIN_ENDPOINTS.advertiserStatus(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  )
}

// ------------------------------------
// Campaigns
// ------------------------------------

export async function getAdminCampaigns(
  token: string,
  filters: AdvertisingFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.advertiser_id) {
    params.set('advertiser_id', filters.advertiser_id)
  }

  const query = params.toString()

  return apiClient<
    AdminCampaign[] | { results: AdminCampaign[] }
  >(
    `${ADMIN_ENDPOINTS.campaigns}${query ? `?${query}` : ''}`,
    {
      token,
    },
  )
}

export async function getAdminCampaign(
  token: string,
  id: string,
) {
  return apiClient<AdminCampaign>(
    ADMIN_ENDPOINTS.campaignDetail(id),
    {
      token,
    },
  )
}

export async function createAdminCampaign(
  token: string,
  data: CampaignFormData,
) {
  return apiClient<AdminCampaign>(
    ADMIN_ENDPOINTS.campaignCreate,
    {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    },
  )
}

export async function updateAdminCampaign(
  token: string,
  id: string,
  data: Partial<CampaignFormData>,
) {
  return apiClient<AdminCampaign>(
    ADMIN_ENDPOINTS.campaignUpdate(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    },
  )
}

// ------------------------------------
// Advertising Revenue
// ------------------------------------

export async function getAdminAdvertisingRevenue(
  token: string,
  filters: AdvertisingFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.source) {
    params.set('source', filters.source)
  }

  if (filters.campaign_id) {
    params.set('campaign_id', filters.campaign_id)
  }

  const query = params.toString()

  return apiClient<
    AdminAdvertisingRevenue[] | {
      results: AdminAdvertisingRevenue[]
    }
  >(
    `${ADMIN_ENDPOINTS.advertisingRevenue}${
      query ? `?${query}` : ''
    }`,
    {
      token,
    },
  )
}

export async function getAdminAdvertisingRevenueDetails(
  token: string,
  id: string,
) {
  return apiClient<AdminAdvertisingRevenue>(
    ADMIN_ENDPOINTS.advertisingRevenueDetail(id),
    {
      token,
    },
  )
}

export async function createAdminAdvertisingRevenue(
  token: string,
  data: RevenueFormData,
) {
  return apiClient<AdminAdvertisingRevenue>(
    ADMIN_ENDPOINTS.advertisingRevenueCreate,
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        ...data,
        campaign: data.campaign || null,
      }),
    },
  )
}

export async function confirmAdminAdvertisingRevenue(
  token: string,
  id: string,
) {
  return apiClient<{
    message: string
    revenue: AdminAdvertisingRevenue
  }>(
    ADMIN_ENDPOINTS.advertisingRevenueConfirm(id),
    {
      method: 'POST',
      token,
    },
  )
}

export async function cancelAdminAdvertisingRevenue(
  token: string,
  id: string,
  remarks = '',
) {
  return apiClient<{
    message: string
    revenue: AdminAdvertisingRevenue
  }>(
    ADMIN_ENDPOINTS.advertisingRevenueCancel(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        remarks,
      }),
    },
  )
}

// ------------------------------------
// Response helper
// ------------------------------------

export { getResults }