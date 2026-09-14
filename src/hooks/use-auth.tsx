import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError, type User } from '@/lib/api'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (shopName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Dev-only bypass: set VITE_SKIP_AUTH=true in .env.local to preview the
// app with a fake logged-in user before the Express auth endpoints exist.
// Never set this in a real deployment.
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'
const FAKE_USER: User = {
  id: 'dev-user',
  email: 'dev@example.com',
  shop_name: 'Dev Shop',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(SKIP_AUTH ? FAKE_USER : null)
  const [isLoading, setIsLoading] = useState(!SKIP_AUTH)

  // On load, ask the backend whether the session cookie is still valid.
  useEffect(() => {
    if (SKIP_AUTH) return
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    if (SKIP_AUTH) {
      setUser(FAKE_USER)
      return
    }
    const res = await api.login(email, password)
    setUser(res.user)
  }

  async function signup(shopName: string, email: string, password: string) {
    if (SKIP_AUTH) {
      setUser(FAKE_USER)
      return
    }
    const res = await api.signup(shopName, email, password)
    setUser(res.user)
  }

  async function logout() {
    if (SKIP_AUTH) {
      setUser(null)
      return
    }
    await api.logout().catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export { ApiError }
