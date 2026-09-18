import { apiClient } from '../api/client'
import type { Referral } from '../types/referral'

export async function getReferrals(
  token: string,
): Promise<Referral[]> {
  return apiClient<Referral[]>('/v1/referrals/', {
    token,
  })
}