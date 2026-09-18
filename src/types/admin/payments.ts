export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type PaymentNetwork = 'TRC20' | 'BEP20'

export interface AdminPaymentMember {
  id: string
  email: string
  username: string
  membership_code: string | null
}

export interface AdminPaymentPackage {
  id: string
  name: string
  price: string | number
}

export interface AdminPaymentTenure {
  id: string
  duration_days: number
  required_referrals: number
}

export interface AdminPayment {
  id: string
  member: AdminPaymentMember
  package: AdminPaymentPackage | null
  tenure: AdminPaymentTenure | null
  installment_number: number
  installment_group: string
  installment_amount: string | number | null
  payment_network: PaymentNetwork
  status: PaymentStatus
  transaction_reference: string
  proof_of_payment: string | null
  submitted_at: string
  approved_at: string | null
  approved_by_email: string | null
  expires_at: string | null
  remarks: string
  created_at: string
  updated_at: string
}

export interface AdminPaymentListResponse {
  count?: number
  next?: string | null
  previous?: string | null
  results?: AdminPayment[]
}

export interface AdminPaymentActionResponse {
  message: string
  payment: AdminPayment
}