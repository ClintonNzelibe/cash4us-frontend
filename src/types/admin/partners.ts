export interface AdminPartner {
  id: string
  name: string
  logo: string | null
  description: string
  website: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PartnerFilters {
  search?: string
  is_active?: boolean | ''
}

export interface PartnerFormData {
  name: string
  description: string
  website: string
  logo?: File | null
}

export interface PartnerStatusPayload {
  is_active: boolean
}