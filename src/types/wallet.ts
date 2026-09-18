export type WalletNetwork =
  | 'TRC20'
  | 'BEP20'
  | 'ERC20'
  | 'BTC'
  | 'ETH'
  | 'SOL'

export interface WalletAddress {
  id: string
  network: WalletNetwork
  address: string
  is_default: boolean
  created_at: string
}

export interface Wallet {
  id: string
  balance: string
  available_balance: string
  pending_balance: string
  addresses: WalletAddress[]
  created_at: string
  updated_at: string
}

export interface CreateWalletAddressRequest {
  network: WalletNetwork
  address: string
}

export interface UpdateWalletAddressRequest {
  address?: string
  is_default?: boolean
}