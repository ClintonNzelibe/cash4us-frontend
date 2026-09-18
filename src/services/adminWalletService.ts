import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminWallet,
  AdminWalletListResponse,
  WalletFilters,
} from '../types/admin/wallets'

function buildWalletQuery(params?: WalletFilters) {
  if (!params) return ''

  const query = new URLSearchParams()

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

export function getAdminWallets(
  token: string,
  params?: WalletFilters,
) {
  return apiClient<AdminWalletListResponse>(
    `${ADMIN_ENDPOINTS.wallets}${buildWalletQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminWallet(
  id: string,
  token: string,
) {
  return apiClient<AdminWallet>(
    ADMIN_ENDPOINTS.walletDetail(id),
    {
      token,
    },
  )
}