export type WalletNetwork =
  | 'TRC20'
  | 'BEP20'
  | 'ERC20'
  | 'BTC'
  | 'ETH'
  | 'SOL'

export interface AdminWalletAddress {
  id: string
  network: WalletNetwork
  address: string
  is_default: boolean
}

export interface AdminWalletMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminWallet {
  id: string
  member: AdminWalletMember
  balance: string | number
  available_balance: string | number
  pending_balance: string | number
  addresses: AdminWalletAddress[]
  created_at: string
  updated_at: string
}

export interface AdminWalletListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AdminWallet[]
}

export interface WalletFilters {
  search?: string
}