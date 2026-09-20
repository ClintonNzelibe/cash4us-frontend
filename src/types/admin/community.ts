export type CommunityPoolStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'DISTRIBUTED'

export type CommunityEarningStatus =
  | 'PENDING'
  | 'PAID'
  | 'CANCELLED'

export interface CommunityMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminCommunityPoolRevenue {
  id: string
  revenue: string
  revenue_reference: string
  revenue_status: string
  amount: number | string
  allocated_at: string
}

export interface AdminCommunityEarning {
  id: string
  member: CommunityMember
  amount: number | string
  status: CommunityEarningStatus
  paid_at: string | null
  created_at: string
}

export interface AdminCommunityPool {
  id: string
  name: string
  total_amount: number | string
  distributed_amount: number | string
  status: CommunityPoolStatus
  distribution_date: string | null
  allocated_revenue: AdminCommunityPoolRevenue[]
  earnings: AdminCommunityEarning[]
  earnings_count: number
  created_at: string
  updated_at: string
}

export interface CommunityPoolFormData {
  name: string
}

export interface CommunityPoolFilters {
  search?: string
  status?: CommunityPoolStatus | ''
}

export interface CommunityPoolAllocation {
  id: string
  pool: string
  revenue: string
  revenue_reference: string
  revenue_status: string
  amount: number | string
  allocated_at: string
}

export interface PaginatedCommunityResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}