import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/config/storage'

/**
 * Operación activa. Se fija al entrar por `/ma/operations/:opId` (el router
 * llama a `setCurrentOperationId` desde `OperationLayout`) y la usa el header
 * para el desplegable de cambio rápido (guion §1.1) sin tener que leer el
 * parámetro de ruta en cada componente.
 */
interface OperationState {
  currentOperationId: string | null
  setCurrentOperationId: (id: string) => void
}

export const useOperationStore = create<OperationState>()(
  persist(
    (set) => ({
      currentOperationId: null,
      setCurrentOperationId: (id) => set({ currentOperationId: id }),
    }),
    { name: STORAGE_KEYS.currentOperation },
  ),
)
