import { apiClient } from '../api/client'
import type {
  CreateWalletAddressRequest,
  UpdateWalletAddressRequest,
  Wallet,
  WalletAddress,
} from '../types/wallet'

export async function getWallet(token: string): Promise<Wallet> {
  return apiClient<Wallet>('/v1/wallet/', {
    token,
  })
}

export async function getWalletAddresses(
  token: string,
): Promise<WalletAddress[]> {
  return apiClient<WalletAddress[]>('/v1/wallet/addresses/', {
    token,
  })
}

export async function createWalletAddress(
  token: string,
  data: CreateWalletAddressRequest,
): Promise<WalletAddress> {
  return apiClient<WalletAddress>('/v1/wallet/addresses/', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateWalletAddress(
  token: string,
  id: string,
  data: UpdateWalletAddressRequest,
): Promise<WalletAddress> {
  return apiClient<WalletAddress>(`/v1/wallet/addresses/${id}/`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteWalletAddress(
  token: string,
  id: string,
): Promise<void> {
  await apiClient<unknown>(`/v1/wallet/addresses/${id}/`, {
    method: 'DELETE',
    token,
  })
}