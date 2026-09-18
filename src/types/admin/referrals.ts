export type ReferralStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface AdminReferralUser {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminReferralPayment {
  id: string
  amount: string | number
  status: string
  transaction_reference: string
  installment_number: number
}

export interface AdminReferral {
  id: string
  referrer: AdminReferralUser
  referred_user: AdminReferralUser
  payment: AdminReferralPayment | null
  bonus_percentage: string | number
  bonus_amount: string | number
  status: ReferralStatus
  is_first_payment: boolean
  created_at: string
  paid_at: string | null
}

export interface AdminReferralListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AdminReferral[]
}

export interface AdminReferralFilters {
  search?: string
  status?: ReferralStatus | ''
  is_first_payment?: '' | 'true' | 'false'
}