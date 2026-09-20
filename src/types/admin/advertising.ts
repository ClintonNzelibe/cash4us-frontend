export type AdvertisingCampaignStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'

export type AdvertisingRevenueSource =
  | 'CAMPAIGN'
  | 'PARTNERSHIP'
  | 'SPONSORSHIP'
  | 'OTHER'

export type AdvertisingRevenueStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'

export interface AdminAdvertiser {
  id: string
  name: string
  email: string
  phone: string
  company_name: string
  is_active: boolean
  campaign_count: number
  created_at: string
  updated_at: string
}

export interface AdminCampaign {
  id: string
  advertiser: string
  advertiser_name: string
  title: string
  description: string
  campaign_url: string
  status: AdvertisingCampaignStatus
  start_date: string | null
  end_date: string | null
  revenue_count: number
  created_at: string
  updated_at: string
}

export interface AdminAdvertisingRevenue {
  id: string
  source: AdvertisingRevenueSource
  campaign: string | null
  campaign_title: string | null
  amount: number
  status: AdvertisingRevenueStatus
  reference: string
  remarks: string
  received_at: string | null
  confirmed_at: string | null
  confirmed_by_email: string | null
  cancelled_by_email: string | null
  created_at: string
  updated_at: string
}

export interface AdvertisingFilters {
  search?: string
  is_active?: '' | 'true' | 'false'
  status?: AdvertisingCampaignStatus | AdvertisingRevenueStatus | ''
  advertiser_id?: string
  source?: AdvertisingRevenueSource | ''
  campaign_id?: string
}

export interface AdvertiserFormData {
  name: string
  email: string
  phone: string
  company_name: string
}

export interface CampaignFormData {
  advertiser: string
  title: string
  description: string
  campaign_url: string
  status: AdvertisingCampaignStatus
  start_date: string
  end_date: string
}

export interface RevenueFormData {
  source: AdvertisingRevenueSource
  campaign: string
  amount: number
  reference: string
  remarks: string
  received_at: string
}

export interface PaginatedAdvertisingResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}