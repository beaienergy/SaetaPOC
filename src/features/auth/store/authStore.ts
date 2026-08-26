import { create } from 'zustand'
import { authApi } from '../api/authApi'
import type { AuthStatus, Credentials, User } from '../types'

interface AuthState {
  status: AuthStatus
  user: User | null
  bootstrap: () => Promise<void>
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,

  bootstrap: async () => {
    try {
      const user = await authApi.verify()
      set({ status: 'authenticated', user })
    } catch {
      set({ status: 'unauthenticated', user: null })
    }
  },

  login: async (credentials) => {
    const user = await authApi.login(credentials)
    set({ status: 'authenticated', user })
  },

  logout: async () => {
    await authApi.logout()
    set({ status: 'unauthenticated', user: null })
  },
}))
