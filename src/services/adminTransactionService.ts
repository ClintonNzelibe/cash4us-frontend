import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminTransaction,
  AdminTransactionListResponse,
  TransactionFilters,
} from '../types/admin/transactions'

function buildTransactionQuery(
  params?: TransactionFilters,
) {
  if (!params) return ''

  const query = new URLSearchParams()

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  if (params.transaction_type) {
    query.set(
      'transaction_type',
      params.transaction_type,
    )
  }

  if (params.direction) {
    query.set(
      'direction',
      params.direction,
    )
  }

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

export function getAdminTransactions(
  token: string,
  params?: TransactionFilters,
) {
  return apiClient<AdminTransactionListResponse>(
    `${ADMIN_ENDPOINTS.transactions}${buildTransactionQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminTransaction(
  id: string,
  token: string,
) {
  return apiClient<AdminTransaction>(
    ADMIN_ENDPOINTS.transactionDetail(id),
    {
      token,
    },
  )
}