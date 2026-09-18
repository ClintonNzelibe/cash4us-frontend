export interface AdminMemberWallet {
  id: string
  balance: string | number
  available_balance: string | number
  pending_balance: string | number
}

export interface AdminMemberCycle {
  id: string
  package: string
  package_id: string
  tenure_days: number
  started_at: string | null
  ends_at: string | null
  status: string
  total_bonus_earned: string | number
}

export interface AdminMemberReferrals {
  total: number
  paid: number
  pending: number
}

export interface AdminMemberTaskStatistics {
  [key: string]: unknown
}

export interface AdminMember {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  membership_code: string
  referral_code: string
  is_active: boolean
  date_joined: string
  wallet: AdminMemberWallet | null
  current_cycle: AdminMemberCycle | null
  referrals: AdminMemberReferrals
  task_statistics: AdminMemberTaskStatistics
}

export interface AdminMemberListResponse {
  count?: number
  next?: string | null
  previous?: string | null
  results?: AdminMember[]
}

export interface AdminMemberStatusPayload {
  is_active: boolean
}