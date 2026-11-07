export interface Package {
  id: string
  name: string
  slug: string
  price: string | number
  payment_amount: string | number
  referral_bonus_percentage: string | number
  referral_points: number
  description: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Tenure {
  id: string
  duration_days: number
  required_referrals: number
  is_active: boolean
}

export interface PackageDetail extends Package {
  tenures?: Tenure[]
}

export interface MemberCycle {
  snapshot_status?: 'SNAPSHOTTED' | 'HISTORICAL_UNVERIFIED'
  legacy_normal_tasks_available?: boolean
  activation_source?: 'ADMIN_GRANT' | 'STANDARD'
  id: string
  package: string
  package_name?: string
  package_price?: string | number
  tenure: string
  duration_days?: number
  required_referrals?: number
  started_at: string
  ends_at: string
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'RETIRED'
  total_bonus_earned: string | number
}
