import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  login as loginRequest,
} from '../services/authService'

import type { LoginRequest, User } from '../types/auth'

import {
  clearTokens,
  getAccessToken,
  setTokens,
} from '../utils/authStorage'

import { AuthContext } from './authContextState'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken(),
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const token = getAccessToken()

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser(token)
        setUser(currentUser)
        setAccessToken(getAccessToken())
      } catch {
        clearTokens()
        setAccessToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function login(credentials: LoginRequest): Promise<User> {
    const response = await loginRequest(credentials)

    setTokens(response.access, response.refresh)
    setAccessToken(response.access)

    const currentUser = await getCurrentUser(response.access)
    setUser(currentUser)

    return currentUser
  }

  async function refreshUser(): Promise<void> {
    const token = getAccessToken()
    if (!token) throw new Error('Your session has expired. Please log in again.')
    const currentUser = await getCurrentUser(token)
    setUser(currentUser)
    setAccessToken(getAccessToken())
  }

  function logout() {
    clearTokens()
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: Boolean(user && accessToken),
        login,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
