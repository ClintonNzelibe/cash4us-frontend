import { apiClient } from '../api/client'
import type { Resource, ResourceListResponse } from '../types/resource'

export async function getResources(
  token: string,
): Promise<Resource[]> {
  const response = await apiClient<Resource[] | ResourceListResponse>(
    '/v1/resources/',
    {
      token,
    },
  )

  if (Array.isArray(response)) {
    return response
  }

  return response.results
}