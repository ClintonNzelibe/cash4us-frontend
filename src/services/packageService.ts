import { apiClient } from '../api/client'
import type {
  MemberCycle,
  Package,
  PackageDetail,
} from '../types/package'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function getPackages(): Promise<Package[]> {
  const response = await apiClient<
    Package[] | PaginatedResponse<Package>
  >('/packages/')

  return Array.isArray(response)
    ? response
    : response.results
}

export async function getPackage(
  slug: string,
): Promise<PackageDetail> {
  return apiClient<PackageDetail>(`/packages/${slug}/`)
}

/*
 * Member-cycle retrieval will be connected when the backend
 * exposes a member-facing cycle endpoint.
 */
export async function getMyPackages(
  token: string,
): Promise<MemberCycle[]> {
  const response = await apiClient<
    MemberCycle[] | PaginatedResponse<MemberCycle>
  >('/packages/my/', {
    token,
  })

  return Array.isArray(response)
    ? response
    : response.results
}