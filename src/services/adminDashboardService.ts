import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

export interface AdminDashboardData {
  members: {
    total: number
    active: number
  }
  cycles: {
    active: number
    completed: number
  }
  payments: {
    pending: number
    approved: number
    rejected: number
  }
  withdrawals: {
    pending: number
    approved: number
    paid: number
    rejected: number
  }
  tasks: {
    pending_reviews: number
    completed: number
    rejected: number
  }
}

export function getAdminDashboard(
  token: string,
): Promise<AdminDashboardData> {
  return apiClient<AdminDashboardData>(
    ADMIN_ENDPOINTS.dashboard,
    {
      token,
    },
  )
}