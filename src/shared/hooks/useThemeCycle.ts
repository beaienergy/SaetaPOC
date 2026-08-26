import { Sun, Moon, Monitor, type LucideIcon } from 'lucide-react'
import { useThemeStore } from '@/shared/stores'
import type { ThemeMode } from '@/shared/types'

const THEME_ICON: Record<ThemeMode, LucideIcon> = { light: Sun, dark: Moon, system: Monitor }
const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'system']

/** Un solo botón que cicla light -> dark -> system -> light. Compartido por
 * cualquier chrome que necesite el selector de tema (header, login, portal). */
export function useThemeCycle() {
  const { mode, setMode } = useThemeStore()
  return {
    mode,
    Icon: THEME_ICON[mode],
    cycle: () => setMode(THEME_ORDER[(THEME_ORDER.indexOf(mode) + 1) % THEME_ORDER.length]),
  }
}
