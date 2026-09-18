export type TransactionType =
  | 'PAYMENT'
  | 'REFERRAL_BONUS'
  | 'COMMUNITY_EARNING'
  | 'DAILY_EARNING'
  | 'TASK_REWARD'
  | 'GIFT_VOUCHER'
  | 'WITHDRAWAL'
  | 'ADMIN_ADJUSTMENT'

export type TransactionDirection =
  | 'CREDIT'
  | 'DEBIT'

export interface AdminTransactionMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminTransactionRelatedObject {
  type: string
  id: string
}

export interface AdminTransaction {
  id: string
  member: AdminTransactionMember
  transaction_type: TransactionType
  direction: TransactionDirection
  amount: string | number
  balance_before: string | number
  balance_after: string | number
  reference: string
  description: string
  related_object: AdminTransactionRelatedObject | null
  created_at: string
}

export interface AdminTransactionListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AdminTransaction[]
}

export interface TransactionFilters {
  search?: string
  transaction_type?: TransactionType
  direction?: TransactionDirection
}