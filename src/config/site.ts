const DEFAULT_PUBLIC_APP_URL = 'https://cash4us.org'

// This value is public and controls links shared outside the application.
// Configure it per deployment without coupling referral links to the API URL.
export const PUBLIC_APP_URL = (
  import.meta.env.VITE_PUBLIC_APP_URL?.trim()
  || DEFAULT_PUBLIC_APP_URL
).replace(/\/+$/, '')
