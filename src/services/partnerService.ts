import { apiClient } from '../api/client'
import type {
  Partner,
  PartnerListResponse,
} from '../types/partner'

export async function getPartners(
  token: string,
): Promise<Partner[]> {
  const response = await apiClient<
    Partner[] | PartnerListResponse
  >('/v1/partners/', {
    token,
  })

  if (Array.isArray(response)) {
    return response
  }

  return response.results
}