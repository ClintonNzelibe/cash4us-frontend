export type PointTransactionType =
  | 'TASK_REWARD'
  | 'REFERRAL_REWARD'
  | 'DAILY_ACTIVITY'
  | 'COMMUNITY_REWARD'
  | 'ADMIN_AWARD'
  | 'REDEMPTION'
  | 'ADJUSTMENT'

export type AwardPeriod =
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'ANNUAL'
  | 'CUSTOM'

export type AwardStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'

export interface AdminRewardMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminPointAccount {
  id: string
  member: AdminRewardMember
  balance: number
  lifetime_points: number
  created_at: string
  updated_at: string
}

export interface AdminPointTransaction {
  id: string
  member: AdminRewardMember
  amount: number
  transaction_type: PointTransactionType
  reference: string
  remarks: string
  created_at: string
}

export interface AdminAward {
  id: string
  name: string
  description: string
  criteria: string
  points_required: number
  number_of_winners: number
  award_period: AwardPeriod
  start_date: string | null
  end_date: string | null
  qualification_rules: Record<string, unknown>
  status: AwardStatus
  is_active: boolean
  awarded_count: number
  created_at: string
  updated_at: string
}

export interface AdminUserAward {
  id: string
  member: AdminRewardMember
  award: {
    id: string
    name: string
    points_required: number
    award_period: AwardPeriod
  }
  awarded_by_email: string | null
  awarded_at: string
  qualification_snapshot: Record<string, unknown>
  remarks: string
  period_key: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface RewardFilters {
  search?: string
  transaction_type?: PointTransactionType | ''
  status?: AwardStatus | ''
  is_active?: '' | 'true' | 'false'
  award_id?: string
}

export interface AwardFormData {
  name: string
  description: string
  criteria: string
  points_required: number
  number_of_winners: number
  award_period: AwardPeriod
  start_date: string
  end_date: string
  qualification_rules: string
  status: AwardStatus
  is_active: boolean
}