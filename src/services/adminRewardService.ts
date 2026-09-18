import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminAward,
  AdminPointAccount,
  AdminPointTransaction,
  AdminUserAward,
  AwardFormData,
  RewardFilters,
} from '../types/admin/rewards'

export async function getAdminPointAccounts(
  accessToken: string,
  filters: RewardFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.append('search', filters.search.trim())
  }

  const query = params.toString()

  return apiClient<any>(
    query
      ? `${ADMIN_ENDPOINTS.pointAccounts}?${query}`
      : ADMIN_ENDPOINTS.pointAccounts,
    {
      method: 'GET',
      token: accessToken,
    },
  ) as Promise<
    { results: AdminPointAccount[]; count: number } |
      AdminPointAccount[]
  >
}

export async function getAdminPointAccount(
  id: string,
  accessToken: string,
) {
  return apiClient<AdminPointAccount>(
    ADMIN_ENDPOINTS.pointAccountDetail(id),
    {
      method: 'GET',
      token: accessToken,
    },
  )
}

export async function getAdminPointTransactions(
  accessToken: string,
  filters: RewardFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.append('search', filters.search.trim())
  }

  if (filters.transaction_type) {
    params.append(
      'transaction_type',
      filters.transaction_type,
    )
  }

  const query = params.toString()

  return apiClient<any>(
    query
      ? `${ADMIN_ENDPOINTS.pointTransactions}?${query}`
      : ADMIN_ENDPOINTS.pointTransactions,
    {
      method: 'GET',
      token: accessToken,
    },
  ) as Promise<
    { results: AdminPointTransaction[]; count: number } |
      AdminPointTransaction[]
  >
}

export async function getAdminPointTransaction(
  id: string,
  accessToken: string,
) {
  return apiClient<AdminPointTransaction>(
    ADMIN_ENDPOINTS.pointTransactionDetail(id),
    {
      method: 'GET',
      token: accessToken,
    },
  )
}

export async function getAdminLeaderboard(
  accessToken: string,
  limit = 10,
) {
  return apiClient<any>(
    `${ADMIN_ENDPOINTS.leaderboard}?limit=${limit}`,
    {
      method: 'GET',
      token: accessToken,
    },
  ) as Promise<AdminPointAccount[] | { results: AdminPointAccount[] }>
}

export async function getAdminAwards(
  accessToken: string,
  filters: RewardFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.append('search', filters.search.trim())
  }

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.is_active) {
    params.append('is_active', filters.is_active)
  }

  const query = params.toString()

  return apiClient<any>(
    query
      ? `${ADMIN_ENDPOINTS.awards}?${query}`
      : ADMIN_ENDPOINTS.awards,
    {
      method: 'GET',
      token: accessToken,
    },
  ) as Promise<
    { results: AdminAward[]; count: number } | AdminAward[]
  >
}

export async function getAdminAward(
  id: string,
  accessToken: string,
) {
  return apiClient<AdminAward>(
    ADMIN_ENDPOINTS.awardDetail(id),
    {
      method: 'GET',
      token: accessToken,
    },
  )
}

export async function createAdminAward(
  data: AwardFormData,
  accessToken: string,
) {
  const payload = {
    ...data,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    qualification_rules: data.qualification_rules
      ? JSON.parse(data.qualification_rules)
      : {},
  }

  return apiClient<AdminAward>(
    ADMIN_ENDPOINTS.awards + 'create/',
    {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    },
  )
}

export async function updateAdminAward(
  id: string,
  data: AwardFormData,
  accessToken: string,
) {
  const payload = {
    ...data,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    qualification_rules: data.qualification_rules
      ? JSON.parse(data.qualification_rules)
      : {},
  }

  return apiClient<AdminAward>(
    `${ADMIN_ENDPOINTS.awards}${id}/update/`,
    {
      method: 'PATCH',
      token: accessToken,
      body: JSON.stringify(payload),
    },
  )
}

export async function updateAdminAwardStatus(
  id: string,
  isActive: boolean,
  accessToken: string,
) {
  return apiClient<{
    message: string
    award_id: string
    is_active: boolean
  }>(
    ADMIN_ENDPOINTS.awardStatus(id),
    {
      method: 'PATCH',
      token: accessToken,
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  )
}

export async function getAdminUserAwards(
  accessToken: string,
  filters: RewardFilters = {},
) {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.append('search', filters.search.trim())
  }

  if (filters.award_id) {
    params.append('award_id', filters.award_id)
  }

  const query = params.toString()

  return apiClient<any>(
    query
      ? `${ADMIN_ENDPOINTS.userAwards}?${query}`
      : ADMIN_ENDPOINTS.userAwards,
    {
      method: 'GET',
      token: accessToken,
    },
  ) as Promise<
    { results: AdminUserAward[]; count: number } |
      AdminUserAward[]
  >
}

export async function getAdminUserAward(
  id: string,
  accessToken: string,
) {
  return apiClient<AdminUserAward>(
    ADMIN_ENDPOINTS.userAwardDetail(id),
    {
      method: 'GET',
      token: accessToken,
    },
  )
}

export async function awardUser(
  awardId: string,
  userId: string,
  remarks: string,
  accessToken: string,
) {
  return apiClient<{
    message: string
    award: AdminUserAward
  }>(
    `/admin/rewards/awards/${awardId}/award-user/`,
    {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({
        user_id: userId,
        remarks,
      }),
    },
  )
}

export async function processWeeklyAward(
  awardId: string,
  accessToken: string,
) {
  return apiClient<{
    message: string
    awarded_count: number
    awards: AdminUserAward[]
  }>(
    `/admin/rewards/awards/${awardId}/process-weekly/`,
    {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({}),
    },
  )
}