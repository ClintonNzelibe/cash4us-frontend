export interface DashboardData {
  wallet: WalletSummary
  activePackage: ActivePackage | null
  tasks: TaskSummary
  referrals: ReferralSummary[]
  transactions: TransactionSummary[]
  notifications: NotificationSummary[]
}

export interface WalletSummary {
  id: string
  balance: string
  available_balance: string
  pending_balance: string
}

export interface ActivePackage {
  id: string
  name: string
  price: string
  duration_days: number
  started_at: string
  ends_at: string
  status: string
  total_bonus_earned: string
}

export interface TaskSummary {
  tasks_assigned: number
  tasks_completed: number
  tasks_missed: number
  tasks_approved: number
  tasks_rejected: number
  daily_task_streak: number
  overall_completion_rate: number
  minimum_completion_threshold: string
  meets_minimum_completion_threshold: boolean
}

export interface ReferralSummary {
  id: string
  referrer_name: string
  referred_user_name: string
  package_name: string
  bonus_percentage: string
  bonus_amount: string
  status: string
  is_first_payment: boolean
  created_at: string
  paid_at: string | null
}

export interface TransactionSummary {
  id: string
  reference: string
  transaction_type: string
  transaction_type_display: string
  direction: string
  direction_display: string
  amount: string
  balance_after: string
  created_at: string
}

export interface NotificationSummary {
  id: string
  notification_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  read_at: string | null
}