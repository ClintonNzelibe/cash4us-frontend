export interface RecommitmentSourceCycle {
  id: string
  package_name: string
  package_rank: number
  duration_days: number
  status: string
}

export interface RecommitmentEligibility {
  available: boolean
  source_cycle: RecommitmentSourceCycle | null
  blockers: string[]
}

export interface RecommitmentOption {
  package_id: string
  package_name: string
  package_rank: number
  package_price: string
  payment_amount: string
  fee: string
  tenure_id: string
  duration_days: number
  required_referrals: number
  eligible: boolean
  blockers: string[]
}

export interface RecommitmentOptionsResponse {
  source_cycle_id: string | null
  options: RecommitmentOption[]
}

export interface RecommitmentFundingPlan {
  available: boolean
  total_required_funding: string | null
  potential_wallet_contribution: string
  external_shortfall: string | null
}

export interface RecommitmentQuote {
  available: boolean
  total_required_funding: string | null
  configured_fee: string | null
  target_package_price_snapshot?: string
  eligibility: { eligible: boolean; blockers: string[] }
  potential_wallet_contribution: string
  external_shortfall: string | null
}

export interface RecommitmentQuoteResponse {
  quote: RecommitmentQuote
  funding_plan: RecommitmentFundingPlan
}

export interface RecommitmentOrderHistoryItem {
  id: string
  source_cycle: string
  target_package: string
  target_package_name: string
  target_duration_days: number
  target_payment_amount_snapshot: string
  target_fee_snapshot: string
  status: string
  quoted_at: string | null
  cancelled_at: string | null
  activated_at: string | null
  created_at: string
}
