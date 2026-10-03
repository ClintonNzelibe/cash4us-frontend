import { apiClient } from '../api/client'
import type {
  WalletSummary,
  TaskSummary,
  ReferralSummary,
  TransactionSummary,
  NotificationSummary,
} from '../types/dashboard'
import { getMyPackages } from './packageService'

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
    memberCycles,
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

    getMyPackages(token),
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

  const activeCycle = memberCycles.find(
    (cycle) => cycle.status === 'ACTIVE',
  )

  return {
    wallet,
    tasks,
    referrals,
    transactions,
    notifications,
    activePackage: activeCycle
      ? {
          id: activeCycle.id,
          name: activeCycle.package_name || 'Active package',
          price: String(activeCycle.package_price ?? 0),
          duration_days: activeCycle.duration_days ?? 0,
          started_at: activeCycle.started_at,
          ends_at: activeCycle.ends_at,
          status: activeCycle.status,
          total_bonus_earned: String(activeCycle.total_bonus_earned),
        }
      : null,
  }
}
