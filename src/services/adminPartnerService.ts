import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'
import type {
  AdminPartner,
  PartnerFilters,
  PartnerFormData,
  PartnerStatusPayload,
} from '../types/admin/partners'

function buildPartnerFormData(data: PartnerFormData): FormData {
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('website', data.website)

  if (data.logo) {
    formData.append('logo', data.logo)
  }

  return formData
}

export async function getAdminPartners(
  token: string,
  filters: PartnerFilters = {},
): Promise<AdminPartner[]> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.is_active !== undefined && filters.is_active !== '') {
    params.set('is_active', String(filters.is_active))
  }

  const query = params.toString()

  return apiClient<AdminPartner[]>(
    `${ADMIN_ENDPOINTS.partners}${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      token,
    },
  )
}

export async function getAdminPartner(
  token: string,
  id: string,
): Promise<AdminPartner> {
  return apiClient<AdminPartner>(
    ADMIN_ENDPOINTS.partnerDetail(id),
    {
      method: 'GET',
      token,
    },
  )
}

export async function createAdminPartner(
  token: string,
  data: PartnerFormData,
): Promise<AdminPartner> {
  const formData = buildPartnerFormData(data)

  return apiClient<AdminPartner>(
    ADMIN_ENDPOINTS.partnerCreate,
    {
      method: 'POST',
      body: formData,
      token,
    },
  )
}

export async function updateAdminPartner(
  token: string,
  id: string,
  data: PartnerFormData,
): Promise<AdminPartner> {
  const formData = buildPartnerFormData(data)

  return apiClient<AdminPartner>(
    ADMIN_ENDPOINTS.partnerDetail(id),
    {
      method: 'PUT',
      body: formData,
      token,
    },
  )
}

export async function updateAdminPartnerStatus(
  token: string,
  id: string,
  data: PartnerStatusPayload,
): Promise<AdminPartner> {
  return apiClient<AdminPartner>(
    ADMIN_ENDPOINTS.partnerStatus(id),
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    },
  )
}