import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'
import type {
  AdminPayment,
  AdminPaymentActionResponse,
  AdminPaymentListResponse,
  PaymentNetwork,
  PaymentStatus,
} from '../types/admin/payments'

interface PaymentFilters {
  search?: string
  status?: PaymentStatus
  network?: PaymentNetwork
  installment_number?: number
}

function buildQuery(params?: PaymentFilters) {
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

  if (params.installment_number) {
    query.set(
      'installment_number',
      String(params.installment_number),
    )
  }

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

export function getAdminPayments(
  token: string,
  params?: PaymentFilters,
) {
  return apiClient<AdminPaymentListResponse>(
    `${ADMIN_ENDPOINTS.payments}${buildQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminPayment(
  id: string,
  token: string,
) {
  return apiClient<AdminPayment>(
    ADMIN_ENDPOINTS.paymentDetail(id),
    {
      token,
    },
  )
}

export function approveAdminPayment(
  id: string,
  token: string,
  remarks = '',
) {
  return apiClient<AdminPaymentActionResponse>(
    ADMIN_ENDPOINTS.paymentApprove(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        remarks,
      }),
    },
  )
}

export function rejectAdminPayment(
  id: string,
  token: string,
  remarks = '',
) {
  return apiClient<AdminPaymentActionResponse>(
    ADMIN_ENDPOINTS.paymentReject(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        remarks,
      }),
    },
  )
}