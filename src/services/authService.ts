import { apiClient } from '../api/client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types/auth'

export function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/users/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function register(
  data: RegisterRequest,
): Promise<User> {
  return apiClient<User>('/users/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getCurrentUser(token: string): Promise<User> {
  return apiClient<User>('/users/me/', {
    token,
  })
}

export function updateProfile(
  data: Partial<Pick<User, 'first_name' | 'last_name' | 'username'>>,
  token: string,
): Promise<User> {
  return apiClient<User>('/users/profile/', {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  })
}