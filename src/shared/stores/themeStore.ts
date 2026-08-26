import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/config/storage'
import type { ThemeMode } from '@/shared/types'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', resolve(mode))
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => {
        applyTheme(mode)
        set({ mode })
      },
    }),
    {
      name: STORAGE_KEYS.theme,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.mode)
      },
    },
  ),
)
