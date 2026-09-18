export type ReferralStatus =
  | 'PENDING'
  | 'PAID'
  | 'CANCELLED'

export interface Referral {
  id: string
  referrer_name: string
  referred_user_name: string
  package_name: string
  bonus_percentage: string
  bonus_amount: string
  status: ReferralStatus
  is_first_payment: boolean
  created_at: string
  paid_at: string | null
}