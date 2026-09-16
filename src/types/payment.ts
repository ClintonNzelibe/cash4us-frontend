export type PaymentNetwork =
  | 'TRC20'
  | 'BEP20'
  | 'ERC20'
  | 'BTC'
  | 'ETH'
  | 'SOL'

export type PaymentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'

export interface PaymentSubmitRequest {
  package: string
  tenure: string
  payment_network: PaymentNetwork
  transaction_reference: string
  proof_of_payment: File
  installment_number: number
}

export interface Payment {
  id: string
  package_name?: string
  tenure_days?: number
  payment_network: PaymentNetwork
  status: PaymentStatus
  transaction_reference?: string
  installment_number?: number
  submitted_at?: string
  approved_at?: string | null
  expires_at?: string | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}