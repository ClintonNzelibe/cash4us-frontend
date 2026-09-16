import { apiClient } from '../api/client'
import type {
  WalletSummary,
  TaskSummary,
  ReferralSummary,
  TransactionSummary,
  NotificationSummary,
} from '../types/dashboard'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function getDashboardData(token: string) {
  const [
    wallet,
    tasks,
    referralsResponse,
    transactionsResponse,
    notificationsResponse,
  ] = await Promise.all([
    apiClient<WalletSummary>('/v1/wallet/', {
      token,
    }),

    apiClient<TaskSummary>('/v1/tasks/statistics/', {
      token,
    }),

    apiClient<
      ReferralSummary[] | PaginatedResponse<ReferralSummary>
    >('/v1/referrals/', {
      token,
    }),

    apiClient<
      TransactionSummary[] | PaginatedResponse<TransactionSummary>
    >('/transactions/', {
      token,
    }),

    apiClient<
      NotificationSummary[] | PaginatedResponse<NotificationSummary>
    >('/v1/notifications/', {
      token,
    }),
  ])

  const referrals = Array.isArray(referralsResponse)
    ? referralsResponse
    : referralsResponse.results

  const transactions = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : transactionsResponse.results

  const notifications = Array.isArray(notificationsResponse)
    ? notificationsResponse
    : notificationsResponse.results

  return {
    wallet,
    tasks,
    referrals,
    transactions,
    notifications,
    activePackage: null,
  }
}