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