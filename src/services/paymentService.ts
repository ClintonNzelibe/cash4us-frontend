import { API_BASE_URL, apiClient } from '../api/client'
import type {
  Payment,
  PaymentCreated,
  PaymentSubmitRequest,
} from '../types/payment'

export async function submitPayment(
  data: PaymentSubmitRequest,
  token: string,
): Promise<PaymentCreated> {

  const response = await fetch(
    `${API_BASE_URL}/payments/submit/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  const contentType =
    response.headers.get('content-type')

  const result = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    const message = getPaymentSubmissionError(
      result,
      response.status,
    )

    throw new Error(message)
  }

  return result as PaymentCreated
}

function getPaymentSubmissionError(
  result: unknown,
  status: number,
): string {
  if (!result || typeof result !== 'object') {
    return `Payment submission failed with status ${status}`
  }

  const payload = result as Record<string, unknown>
  const detail = payload.detail

  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.join(' ')

  const fieldErrors = Object.entries(payload)
    .flatMap(([field, value]) => {
      const messages = Array.isArray(value) ? value : [value]

      return messages
        .filter((message): message is string => typeof message === 'string')
        .map((message) => `${field}: ${message}`)
    })

  return fieldErrors[0] || `Payment submission failed with status ${status}`
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
