export type TransactionDirection = 'CREDIT' | 'DEBIT'

export type TransactionType =
  | 'PAYMENT'
  | 'REFERRAL_BONUS'
  | 'COMMUNITY_EARNING'
  | 'DAILY_EARNING'
  | 'TASK_REWARD'
  | 'GIFT_VOUCHER'
  | 'WITHDRAWAL'
  | 'ADMIN_ADJUSTMENT'

export interface Transaction {
  id: string
  reference: string
  transaction_type: TransactionType
  transaction_type_display: string
  direction: TransactionDirection
  direction_display: string
  amount: string
  balance_after: string
  created_at: string
}