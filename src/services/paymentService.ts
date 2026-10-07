import { apiClient } from '../api/client'
import type {
  Payment,
  PaymentCreated,
  PaymentSubmitRequest,
} from '../types/payment'

export async function submitPayment(
  data: PaymentSubmitRequest,
  token: string,
): Promise<PaymentCreated> {
  return apiClient<PaymentCreated>('/payments/submit/', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  })
}

export async function getPayments(
  token: string,
): Promise<Payment[]> {
  const response = await apiClient<
    Payment[] | { results: Payment[] }
  >('/payments/', {
    token,
  })

  return Array.isArray(response)
    ? response
    : response.results
}

export async function getPayment(
  id: string,
  token: string,
): Promise<Payment> {
  return apiClient<Payment>(`/payments/${id}/`, {
    token,
  })
}

export async function cancelPayment(
  id: string,
  token: string,
): Promise<Payment> {
  return apiClient<Payment>(`/payments/${id}/cancel/`, {
    method: 'POST',
    token,
  })
}
