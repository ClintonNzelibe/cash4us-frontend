import { apiClient } from '../api/client'
import type { Referral } from '../types/referral'

export async function getReferrals(
  token: string,
): Promise<Referral[]> {
  const response = await apiClient<Referral[] | { results: Referral[] }>('/v1/referrals/', {
    token,
  })
  return Array.isArray(response) ? response : response.results
}