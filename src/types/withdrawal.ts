export type WithdrawalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'

export type WithdrawalNetwork =
  | 'TRC20'
  | 'BEP20'
  | 'ERC20'
  | 'BTC'
  | 'ETH'
  | 'SOL'

export interface Withdrawal {
  id: string
  destination_network: WithdrawalNetwork
  destination_address: string
  amount: string
  admin_fee: string
  net_amount: string
  status: WithdrawalStatus
  remarks: string
  requested_at: string
  processed_at: string | null
  created_at: string
  updated_at: string
}

export interface WithdrawalPayload {
  destination_network: WithdrawalNetwork
  destination_address: string
  amount: string
}

export interface WithdrawalEligibility {
  eligible_referral_amount: string
  eligible_task_package_amount: string
  restricted_amount: string
  reserved_amount: string
  total_withdrawable_amount: string
  restriction_reason: string
  next_eligibility_date: string | null
}
