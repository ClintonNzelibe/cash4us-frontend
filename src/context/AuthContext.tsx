import {
  useCallback,
  useEffect,
  useRef,
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

import { ApiError } from '../api/client'
import { scheduleEffect } from '../utils/scheduleEffect'
import { AuthContext } from './authContextState'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [restoreFailed, setRestoreFailed] = useState(false)
  const authAttempt = useRef(0)

  const restoreSession = useCallback(async () => {
    const attempt = ++authAttempt.current
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    setRestoreFailed(false)
    setIsLoading(true)
    try {
      const currentUser = await getCurrentUser(token)
      if (attempt !== authAttempt.current) return
      setUser(currentUser)
      setAccessToken(getAccessToken())
    } catch (error) {
      if (attempt !== authAttempt.current) return
      if (error instanceof ApiError && error.status === 401) {
        clearTokens()
        setAccessToken(null)
        setUser(null)
      } else {
        setRestoreFailed(true)
      }
    } finally {
      if (attempt === authAttempt.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => scheduleEffect(() => {
    void restoreSession()
  }), [restoreSession])

  async function login(credentials: LoginRequest): Promise<User> {
    const attempt = ++authAttempt.current
    try {
      const response = await loginRequest(credentials)
      if (attempt !== authAttempt.current) throw new Error('Sign-in was cancelled.')
      setTokens(response.access, response.refresh)
      const currentUser = await getCurrentUser(response.access)
      if (attempt !== authAttempt.current) throw new Error('Sign-in was cancelled.')
      setAccessToken(getAccessToken())
      setUser(currentUser)
      return currentUser
    } catch (error) {
      if (attempt === authAttempt.current) {
        clearTokens()
        setAccessToken(null)
        setUser(null)
      }
      throw error
    } finally {
      if (attempt === authAttempt.current) setIsLoading(false)
    }
  }

  async function refreshUser(): Promise<void> {
    const token = getAccessToken()
    if (!token) throw new Error('Your session has expired. Please log in again.')
    const currentUser = await getCurrentUser(token)
    setUser(currentUser)
    setAccessToken(getAccessToken())
  }

  function logout() {
    authAttempt.current++
    setRestoreFailed(false)
    setIsLoading(false)
    clearTokens()
    setAccessToken(null)
    setUser(null)
  }

  if (restoreFailed) {
    return (
      <main className="mx-auto max-w-md space-y-4 px-5 py-16">
        <h1 className="text-xl font-semibold">Unable to reconnect to Cash4Us</h1>
        <p role="alert">Your session is saved. Try again when the connection is available.</p>
        <button className="mr-4 font-semibold text-teal-700 underline" onClick={() => void restoreSession()}>Try again</button>
        <button className="font-semibold text-teal-700 underline" onClick={logout}>Sign out</button>
      </main>
    )
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
