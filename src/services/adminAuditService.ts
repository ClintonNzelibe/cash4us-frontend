import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'
import type {
  AdminAuditLog,
  AuditLogFilters,
} from '../types/admin/audit'

export async function getAdminAuditLogs(
  token: string,
  filters: AuditLogFilters = {},
): Promise<AdminAuditLog[]> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.action) {
    params.set('action', filters.action)
  }

  if (filters.resource_type) {
    params.set('resource_type', filters.resource_type)
  }

  if (filters.admin_id) {
    params.set('admin_id', filters.admin_id)
  }

  const query = params.toString()

  return apiClient<AdminAuditLog[]>(
    `${ADMIN_ENDPOINTS.auditLogs}${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      token,
    },
  )
}

export async function getAdminAuditLog(
  token: string,
  id: string,
): Promise<AdminAuditLog> {
  return apiClient<AdminAuditLog>(
    ADMIN_ENDPOINTS.auditLogDetail(id),
    {
      method: 'GET',
      token,
    },
  )
}