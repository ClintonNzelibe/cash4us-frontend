export type ResourceType =
  | 'PDF'
  | 'VIDEO'
  | 'FLYER'
  | 'DOCUMENT'
  | 'LINK'

export interface Resource {
  id: string
  title: string
  description: string
  resource_type: ResourceType
  resource_file: string | null
  external_link: string
  is_active: boolean
  created_at: string
}

export interface ResourceListResponse {
  results: Resource[]
}