export type WithdrawalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'

export type WithdrawalNetwork = string

export interface AdminWithdrawalMember {
  id?: string
  username?: string
  email?: string
  membership_code?: string
}

export interface AdminWithdrawalPackage {
  id?: string
  name?: string
}

export interface AdminWithdrawalTenure {
  id?: string
  name?: string
  duration?: number
  duration_months?: number
}

export interface AdminWithdrawalCycle {
  id?: string
  status?: string
  package?: AdminWithdrawalPackage | null
  tenure?: AdminWithdrawalTenure | null
}

export interface AdminWithdrawalProcessedBy {
  id?: string
  username?: string
  email?: string
}

export interface AdminWithdrawal {
  id: string
  user: AdminWithdrawalMember
  cycle?: AdminWithdrawalCycle | null
  destination_network: WithdrawalNetwork
  destination_address: string
  amount: string | number
  admin_fee: string | number
  net_amount: string | number
  status: WithdrawalStatus
  processed_by?: AdminWithdrawalProcessedBy | null
  remarks: string
  requested_at: string
  processed_at: string | null
  created_at: string
  updated_at: string
}

export interface AdminWithdrawalListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AdminWithdrawal[]
}

export interface AdminWithdrawalActionResponse {
  message: string
  withdrawal: AdminWithdrawal
}

export interface WithdrawalFilters {
  search?: string
  status?: WithdrawalStatus
  network?: string
}