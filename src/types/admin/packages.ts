export interface AdminTenure {
  id: string
  duration_days: number
  required_referrals: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminPackage {
  id: string
  name: string
  slug: string
  price: string | number
  payment_amount: string | number | null
  referral_bonus_percentage: string | number
  referral_points: number
  description: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  tenures: AdminTenure[]
}

export interface AdminPackageListResponse {
  count?: number
  next?: string | null
  previous?: string | null
  results?: AdminPackage[]
}

export interface AdminPackagePayload {
  name: string
  slug: string
  price: string | number
  payment_amount: string | number | null
  referral_bonus_percentage: string | number
  referral_points: number
  description: string
  is_active: boolean
  display_order: number
}

export interface AdminPackageStatusResponse {
  message: string
  package_id: string
  is_active: boolean
}

export interface AdminTenurePayload {
  duration_days: number
  required_referrals: number
  is_active: boolean
}

export interface AdminTenureStatusResponse {
  message: string
  tenure_id: string
  is_active: boolean
}