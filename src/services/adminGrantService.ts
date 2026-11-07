import { apiClient } from '../api/client'

export interface PackageGrant {
  id: string
  source: 'ADMIN_GRANT'
  member: string
  package: string
  tenure: string
  cycle: string
  cycle_status: string
  administrator: string
  reason: string
  purchase_reference: string
  idempotency_key: string
  created_at: string
  test_run?: string | null
  retired_at?: string | null
  snapshot: { package_name: string; duration_days: number; administrator_email: string }
}

export interface GrantRequest {
  test_run?: string
  member: string
  package: string
  tenure: string
  reason: string
  purchase_reference: string
  idempotency_key: string
}

export function getMemberGrants(member: string, token: string) {
  return apiClient<{ can_grant: boolean; can_retire: boolean; results: PackageGrant[] }>(
    `/admin/packages/grants/?member=${encodeURIComponent(member)}`, { token },
  )
}

export function createPackageGrant(data: GrantRequest, token: string) {
  return apiClient<{ grant: PackageGrant; replayed: boolean }>('/admin/packages/grants/', {
    token, method: 'POST', body: JSON.stringify(data),
  })
}

export function retireTestGrant(grantId: string, reason: string, token: string) {
  return apiClient<{ status: 'RETIRED'; replayed: boolean }>(`/admin/packages/grants/${grantId}/retire/`, {
    token, method: 'POST', body: JSON.stringify({ reason }),
  })
}
