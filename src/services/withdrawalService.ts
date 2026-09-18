import { apiClient } from '../api/client'
import type {
  Withdrawal,
  WithdrawalPayload,
} from '../types/withdrawal'

export async function getWithdrawals(
  token: string,
): Promise<Withdrawal[]> {
  return apiClient<Withdrawal[]>('/v1/withdrawals/', {
    method: 'GET',
    token,
  })
}

export async function createWithdrawal(
  token: string,
  payload: WithdrawalPayload,
): Promise<Withdrawal> {
  return apiClient<Withdrawal>('/v1/withdrawals/', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}