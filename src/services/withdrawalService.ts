import { apiClient } from '../api/client'
import type {
  Withdrawal,
  WithdrawalPayload,
  WithdrawalEligibility,
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

export async function getWithdrawalEligibility(
  token: string,
): Promise<WithdrawalEligibility> {
  return apiClient<WithdrawalEligibility>('/v1/withdrawals/eligibility/', {
    method: 'GET',
    token,
  })
}
