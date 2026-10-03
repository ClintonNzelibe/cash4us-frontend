export type PaymentNetwork =
  | 'TRC20'
  | 'BEP20'

export type PaymentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'

export interface PaymentSubmitRequest {
  package: string
  tenure: string
  payment_network: 'BEP20'
  installment_number: number
}

export interface Payment {
  id: string
  package?: string
  tenure?: string
  package_name?: string
  tenure_days?: number
  payment_network: PaymentNetwork
  status: PaymentStatus
  transaction_reference?: string
  installment_number?: number
  deposit_address?: string
  expected_amount?: string
  received_amount?: string | null
  token_contract?: string
  confirmations?: number | null
  blockchain_tx_hash?: string
  verification_expires_at?: string | null
  verification_error?: string
  submitted_at?: string
  approved_at?: string | null
  expires_at?: string | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface PaymentCreated extends Payment {
  package: string
  tenure: string
  package_name: string
  tenure_days: number
  payment_network: 'BEP20'
  transaction_reference: string
  installment_number: number
  expected_amount: string
  deposit_address: string
  verification_expires_at: string
  submitted_at: string
}
