export interface AdminAuditAdmin {
  id: string
  email: string
  username: string
}

export interface AdminAuditLog {
  id: string
  admin: string
  admin_details: AdminAuditAdmin
  action: string
  resource_type: string
  resource_id: string
  description: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface AuditLogFilters {
  search?: string
  action?: string
  resource_type?: string
  admin_id?: string
}