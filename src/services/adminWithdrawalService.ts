import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminWithdrawal,
  AdminWithdrawalActionResponse,
  AdminWithdrawalListResponse,
  WithdrawalFilters,
} from '../types/admin/withdrawals'

function buildQuery(params?: WithdrawalFilters) {
  if (!params) return ''

  const query = new URLSearchParams()

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  if (params.status) {
    query.set('status', params.status)
  }

  if (params.network) {
    query.set('network', params.network)
  }

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

export function getAdminWithdrawals(
  token: string,
  params?: WithdrawalFilters,
) {
  return apiClient<AdminWithdrawalListResponse>(
    `${ADMIN_ENDPOINTS.withdrawals}${buildQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminWithdrawal(
  id: string,
  token: string,
) {
  return apiClient<AdminWithdrawal>(
    ADMIN_ENDPOINTS.withdrawalDetail(id),
    {
      token,
    },
  )
}

export function approveAdminWithdrawal(
  id: string,
  token: string,
  remarks = '',
) {
  return apiClient<AdminWithdrawalActionResponse>(
    ADMIN_ENDPOINTS.withdrawalApprove(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        remarks,
      }),
    },
  )
}

export function rejectAdminWithdrawal(
  id: string,
  token: string,
  remarks: string,
) {
  return apiClient<AdminWithdrawalActionResponse>(
    ADMIN_ENDPOINTS.withdrawalReject(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        remarks,
      }),
    },
  )
}

export function markAdminWithdrawalPaid(
  id: string,
  token: string,
  remarks = '',
) {
  return apiClient<AdminWithdrawalActionResponse>(
    ADMIN_ENDPOINTS.withdrawalPaid(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        remarks,
      }),
    },
  )
}