const DEFAULT_PUBLIC_APP_URL = 'https://cash4us-frontend.vercel.app'

function resolvePublicAppUrl(value?: string): string {
  if (!value) return DEFAULT_PUBLIC_APP_URL

  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()

    // A stale Vercel value must not keep generating links for the retired
    // domain. Other valid deployment origins can remain environment-configured.
    if (hostname === 'cash4us.com' || hostname === 'www.cash4us.com') {
      return DEFAULT_PUBLIC_APP_URL
    }

    return url.origin
  } catch {
    return DEFAULT_PUBLIC_APP_URL
  }
}

// This public value controls links shared outside the application and is kept
// separate from the API URL.
export const PUBLIC_APP_URL = resolvePublicAppUrl(
  import.meta.env.VITE_PUBLIC_APP_URL?.trim(),
)
