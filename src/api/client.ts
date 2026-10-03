import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '../utils/authStorage'

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim()
  || DEFAULT_API_BASE_URL
).replace(/\/+$/, '')

export const API_ORIGIN = new URL(API_BASE_URL).origin

type RequestOptions = RequestInit & {
  token?: string
}

type RefreshResponse = {
  access: string
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  const refreshToken = getRefreshToken()

  if (!refreshToken) return null

  refreshPromise = fetch(`${API_BASE_URL}/users/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) return null

      const data = await response.json() as RefreshResponse

      if (!data.access) return null

      setAccessToken(data.access)
      return data.access
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

function buildHeaders(fetchOptions: RequestInit, token?: string) {
  const headers = new Headers(fetchOptions.headers)

  if (!(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

async function request(
  endpoint: string,
  fetchOptions: RequestInit,
  token?: string,
) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: buildHeaders(fetchOptions, token),
  })
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options

  // Components may hold an expired token in state after a refresh. Prefer
  // the latest token persisted by the shared refresh flow.
  const accessToken = token ? (getAccessToken() || token) : undefined
  let response = await request(endpoint, fetchOptions, accessToken)

  if (response.status === 401 && token) {
    const refreshedAccessToken = await refreshAccessToken()

    if (refreshedAccessToken) {
      response = await request(
        endpoint,
        fetchOptions,
        refreshedAccessToken,
      )
    }
  }

  const contentType = response.headers.get('content-type')
  const data = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `Request failed with status ${response.status}`,
    )
  }

  return data as T
}
