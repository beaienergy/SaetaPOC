import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/config/storage'
import type { Role } from '@/shared/types'

/**
 * Simulador de rol (guion §1.5): sin autenticacion real, esto decide que ve el
 * usuario — Analitica IA completa y, dentro de Documentacion, el subapartado
 * de Conocimiento base. A diferencia de TMEIC (donde el rol lo fija la sesion
 * y el toggle se bloquea), aqui es SIEMPRE un interruptor visible en el header:
 * es una affordance de demo, no un control de permisos, y el guion pide que
 * se note como tal.
 */
interface RoleState {
  role: Role
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'admin',
      setRole: (role) => set({ role }),
    }),
    { name: STORAGE_KEYS.role },
  ),
)
