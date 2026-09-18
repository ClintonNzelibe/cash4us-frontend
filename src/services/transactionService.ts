import { apiClient } from '../api/client'
import type { Transaction } from '../types/transaction'

export async function getTransactions(
  token: string,
): Promise<Transaction[]> {
  return apiClient<Transaction[]>('/transactions/', {
    token,
  })
}

export async function getTransaction(
  token: string,
  id: string,
): Promise<Transaction> {
  return apiClient<Transaction>(`/transactions/${id}/`, {
    token,
  })
}