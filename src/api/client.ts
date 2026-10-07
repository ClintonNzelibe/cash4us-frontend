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

function collectErrorMessages(value: unknown): string[] {
  if (typeof value === 'string') return [value]

  if (Array.isArray(value)) {
    return value.flatMap(collectErrorMessages)
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectErrorMessages)
  }

  return []
}

function getApiErrorMessage(data: unknown, status: number): string {
  const fallback = `Request failed with status ${status}`

  if (!data || typeof data !== 'object') return fallback

  const payload = data as Record<string, unknown>
  const detail = collectErrorMessages(payload.detail)
  if (detail.length > 0) return detail.join(' ')

  const message = collectErrorMessages(payload.message)
  if (message.length > 0) return message.join(' ')

  const fieldErrors = Object.entries(payload)
    .filter(([field]) => field !== 'detail' && field !== 'message')
    .flatMap(([field, value]) =>
      collectErrorMessages(value).map((error) => `${field}: ${error}`),
    )

  return fieldErrors.join(' ') || fallback
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
    throw new Error(getApiErrorMessage(data, response.status))
  }

  return data as T
}
