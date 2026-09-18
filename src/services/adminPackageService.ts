import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminPackage,
  AdminPackageListResponse,
  AdminPackagePayload,
  AdminPackageStatusResponse,
  AdminTenure,
  AdminTenurePayload,
  AdminTenureStatusResponse,
} from '../types/admin/packages'

function buildQuery(params?: {
  search?: string
  is_active?: boolean
}) {
  const searchParams = new URLSearchParams()

  if (params?.search?.trim()) {
    searchParams.set(
      'search',
      params.search.trim(),
    )
  }

  if (params?.is_active !== undefined) {
    searchParams.set(
      'is_active',
      String(params.is_active),
    )
  }

  const query = searchParams.toString()

  return query ? `?${query}` : ''
}

export function getAdminPackages(
  token: string,
  params?: {
    search?: string
    is_active?: boolean
  },
): Promise<
  AdminPackage[] | AdminPackageListResponse
> {
  return apiClient<
    AdminPackage[] | AdminPackageListResponse
  >(
    `${ADMIN_ENDPOINTS.packages}${buildQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminPackage(
  id: string,
  token: string,
): Promise<AdminPackage> {
  return apiClient<AdminPackage>(
    ADMIN_ENDPOINTS.packageDetail(id),
    {
      token,
    },
  )
}

export function createAdminPackage(
  data: AdminPackagePayload,
  token: string,
): Promise<AdminPackage> {
  return apiClient<AdminPackage>(
    ADMIN_ENDPOINTS.packageCreate,
    {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    },
  )
}

export function updateAdminPackage(
  id: string,
  data: Partial<AdminPackagePayload>,
  token: string,
): Promise<AdminPackage> {
  return apiClient<AdminPackage>(
    ADMIN_ENDPOINTS.packageUpdate(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    },
  )
}

export function updateAdminPackageStatus(
  id: string,
  isActive: boolean,
  token: string,
): Promise<AdminPackageStatusResponse> {
  return apiClient<AdminPackageStatusResponse>(
    ADMIN_ENDPOINTS.packageStatus(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  )
}

export function getAdminPackageTenures(
  packageId: string,
  token: string,
): Promise<AdminTenure[]> {
  return apiClient<AdminTenure[]>(
    ADMIN_ENDPOINTS.packageTenures(packageId),
    {
      token,
    },
  )
}

export function createAdminTenure(
  packageId: string,
  data: AdminTenurePayload,
  token: string,
): Promise<AdminTenure> {
  return apiClient<AdminTenure>(
    ADMIN_ENDPOINTS.packageTenures(packageId),
    {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    },
  )
}

export function updateAdminTenure(
  id: string,
  data: Partial<AdminTenurePayload>,
  token: string,
): Promise<AdminTenure> {
  return apiClient<AdminTenure>(
    ADMIN_ENDPOINTS.tenureUpdate(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    },
  )
}

export function updateAdminTenureStatus(
  id: string,
  isActive: boolean,
  token: string,
): Promise<AdminTenureStatusResponse> {
  return apiClient<AdminTenureStatusResponse>(
    ADMIN_ENDPOINTS.tenureStatus(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  )
}