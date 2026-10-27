export interface CycleQualification {
  cycle_id: string
  required_referrals: number
  verified_qualifying_referrals: number
  completed_task_days: number
  missed_task_days: number
  pending_task_days: number
  referral_target_achieved: boolean
  qualification_date: string | null
}

export interface PromotionalQualification {
  cycle_id: string
  promotional_terms_configured: boolean
  promotional_tenure_eligible: boolean
  promotional_qualification_eligible: boolean
  eligibility_reason: string
  promotional_deadline_at: string | null
  promotional_required_referrals: number | null
  verified_qualifying_referrals: number
  qualification_timestamp: string | null
  completed_task_days: number
  missed_task_days: number
  pending_task_days: number
  earned_task_days: number
  missed_earning_days: number
  remaining_unearned_days: number
}

export interface PromotionalSettlementPreview {
  cycle_id: string
  preview_available: boolean
  settlement_ready: boolean
  blockers: string[]
  gross_target_snapshot: string
  daily_earnings_credited: string
  missed_day_deduction: string
  remaining_promotional_entitlement: string
  proposed_additional_credit: string
}
