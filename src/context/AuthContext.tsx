import {
  createContext,
  useContext,
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

interface AuthContextValue {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

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

  async function login(credentials: LoginRequest): Promise<string> {
    const response = await loginRequest(credentials)

    setTokens(response.access, response.refresh)
    setAccessToken(response.access)

    const currentUser = await getCurrentUser(response.access)
    setUser(currentUser)

    return response.access
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}