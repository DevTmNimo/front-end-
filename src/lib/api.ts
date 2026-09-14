const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface User {
  id: string
  email: string
  shop_name: string
}

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// credentials: 'include' sends/receives the session cookie the Go backend
// sets on login — no token to manage on the client.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.message ?? 'Something went wrong', res.status)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (shopName: string, email: string, password: string) =>
    request<{ user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ shop_name: shopName, email, password }),
    }),

  // Called on app load to check whether the session cookie is still valid.
  me: () => request<{ user: User }>('/auth/me'),

  logout: () => request<void>('/auth/logout', { method: 'POST' }),

  // OAuth is a redirect flow, not a fetch: the backend sets the session
  // cookie after the provider callback, then redirects back to the app.
  oauthUrl: (provider: 'google' | 'facebook') => `${API_URL}/auth/${provider}`,
}

export { ApiError }
