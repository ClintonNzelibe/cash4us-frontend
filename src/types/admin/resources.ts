export type ResourceType =
  | 'PDF'
  | 'VIDEO'
  | 'FLYER'
  | 'DOCUMENT'
  | 'LINK'

export interface ResourceUploader {
  id: string
  email: string
  username: string
}

export interface AdminResource {
  id: string
  title: string
  description: string
  resource_file: string | null
  external_link: string
  resource_type: ResourceType
  uploaded_by: string | null
  uploaded_by_details: ResourceUploader | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ResourceFilters {
  search?: string
  resource_type?: ResourceType | ''
  is_active?: boolean | ''
}

export interface ResourceFormData {
  title: string
  description: string
  resource_type: ResourceType
  external_link: string
  resource_file?: File | null
}

export interface ResourceStatusPayload {
  is_active: boolean
}