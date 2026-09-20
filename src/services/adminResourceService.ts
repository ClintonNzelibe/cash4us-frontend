import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminResource,
  ResourceFilters,
  ResourceFormData,
  ResourceStatusPayload,
} from '../types/admin/resources'

interface PaginatedResources {
  count: number
  next: string | null
  previous: string | null
  results: AdminResource[]
}

function buildQuery(filters: ResourceFilters) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.resource_type) {
    params.set('resource_type', filters.resource_type)
  }

  if (filters.is_active !== '') {
    if (filters.is_active !== undefined) {
      params.set('is_active', String(filters.is_active))
    }
  }

  const query = params.toString()

  return query ? `?${query}` : ''
}

function buildFormData(data: ResourceFormData) {
  const formData = new FormData()

  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('resource_type', data.resource_type)
  formData.append('external_link', data.external_link)

  if (data.resource_file) {
    formData.append('resource_file', data.resource_file)
  }

  return formData
}

export async function getAdminResources(
  token: string,
  filters: ResourceFilters = {},
): Promise<AdminResource[] | PaginatedResources> {
  return apiClient<AdminResource[] | PaginatedResources>(
    `${ADMIN_ENDPOINTS.resources}${buildQuery(filters)}`,
    {
      method: 'GET',
      token,
    },
  )
}

export async function getAdminResource(
  token: string,
  id: string,
): Promise<AdminResource> {
  return apiClient<AdminResource>(
    ADMIN_ENDPOINTS.resourceDetail(id),
    {
      method: 'GET',
      token,
    },
  )
}

export async function createAdminResource(
  token: string,
  data: ResourceFormData,
): Promise<AdminResource> {
  return apiClient<AdminResource>(
    ADMIN_ENDPOINTS.resources.replace(/\/$/, '') + '/create/',
    {
      method: 'POST',
      token,
      body: buildFormData(data),
    },
  )
}

export async function updateAdminResource(
  token: string,
  id: string,
  data: ResourceFormData,
): Promise<AdminResource> {
  return apiClient<AdminResource>(
    ADMIN_ENDPOINTS.resourceDetail(id),
    {
      method: 'PUT',
      token,
      body: buildFormData(data),
    },
  )
}

export async function updateAdminResourceStatus(
  token: string,
  id: string,
  data: ResourceStatusPayload,
): Promise<AdminResource> {
  return apiClient<AdminResource>(
    ADMIN_ENDPOINTS.resourceStatus(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    },
  )
}