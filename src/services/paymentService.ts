import { apiClient } from '../api/client'
import type {
  Payment,
  PaymentSubmitRequest,
} from '../types/payment'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function submitPayment(
  data: PaymentSubmitRequest,
  token: string,
): Promise<Payment> {
  const formData = new FormData()

  formData.append('package', data.package)
  formData.append('tenure', data.tenure)
  formData.append(
    'payment_network',
    data.payment_network,
  )
  formData.append(
    'transaction_reference',
    data.transaction_reference,
  )
  formData.append(
    'proof_of_payment',
    data.proof_of_payment,
  )
  formData.append(
    'installment_number',
    String(data.installment_number),
  )

  const response = await fetch(
    `${API_BASE_URL}/payments/submit/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  const contentType =
    response.headers.get('content-type')

  const result = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    const message =
      result?.detail ||
      result?.message ||
      Object.values(result || {})
        .flat()
        .find((value) => typeof value === 'string') ||
      `Payment submission failed with status ${response.status}`

    throw new Error(String(message))
  }

  return result as Payment
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