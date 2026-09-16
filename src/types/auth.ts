export interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  referral_code: string
  date_joined: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface RegisterRequest {
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
  referral_code?: string
}

export interface ApiError {
  detail?: string
  [key: string]: unknown
}