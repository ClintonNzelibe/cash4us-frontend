import { apiClient } from '../api/client'
import type {
  RecommitmentEligibility,
  RecommitmentOptionsResponse,
  RecommitmentOrderHistoryItem,
  RecommitmentQuoteResponse,
} from '../types/recommitment'

export function getRecommitmentEligibility(token: string) {
  return apiClient<RecommitmentEligibility>('/packages/recommitment/eligibility/', {
    method: 'GET',
    token,
  })
}

export function getRecommitmentOptions(token: string) {
  return apiClient<RecommitmentOptionsResponse>('/packages/recommitment/options/', {
    method: 'GET',
    token,
  })
}

export function getRecommitmentQuote(
  token: string,
  targetPackage: string,
  targetTenure: string,
) {
  const params = new URLSearchParams({
    target_package: targetPackage,
    target_tenure: targetTenure,
  })
  return apiClient<RecommitmentQuoteResponse>(
    `/packages/recommitment/quote/?${params.toString()}`,
    { method: 'GET', token },
  )
}

export function getRecommitmentOrders(token: string) {
  return apiClient<RecommitmentOrderHistoryItem[]>('/packages/recommitment/orders/', {
    method: 'GET',
    token,
  })
}
