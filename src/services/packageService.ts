import { API_BASE_URL, apiClient } from '../api/client'
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
  const packages: Package[] = []
  let endpoint: string | null = '/packages/'
  const visited = new Set<string>()
  while (endpoint) {
    if (visited.has(endpoint)) throw new Error('Package pagination repeated a page.')
    visited.add(endpoint)
    const response: Package[] | PaginatedResponse<Package> = await apiClient(endpoint)
    if (Array.isArray(response)) return [...packages, ...response]
    packages.push(...response.results)
    if (!response.next) break
    const base = new URL(API_BASE_URL)
    const next: URL = new URL(response.next, `${API_BASE_URL}${endpoint}`)
    if (next.origin !== base.origin || next.pathname !== `${base.pathname}/packages/`) {
      throw new Error('Invalid package pagination URL.')
    }
    endpoint = `/packages/${next.search}`
  }
  return packages
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
