export interface Partner {
  id: string
  name: string
  logo: string | null
  description: string
  website: string
  is_active: boolean
  created_at: string
}

export interface PartnerListResponse {
  results: Partner[]
}