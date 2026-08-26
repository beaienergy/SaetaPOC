import { create } from 'zustand'
import { sleep } from '@/shared/lib/utils'
import type { AuditStatus } from '../types'

const AUDIT_DELAY_MS = 1600

interface OperationAuditState {
  status: AuditStatus
  /** ISO date string del ultimo "Auditar" completado, si lo hay. */
  lastRunAt?: string
}

interface FinancialAuditState {
  byOperation: Record<string, OperationAuditState>
  ensureLoaded: (opId: string) => void
  runAudit: (opId: string) => Promise<void>
}

/**
 * "Se ha auditado ya esta operacion" (guion §5.4), scopeada por operacion.
 * Helios y Meridian arrancan con una auditoria previa ya hecha (`done`), para
 * que el panel de hallazgos se vea sin interaccion — Solstice arranca en
 * `not_run` a proposito: es la operacion cerrada y mas ligera, y deja ver el
 * flujo completo de "Auditar" (`sleep()` simulando latencia) al menos una vez
 * en la demo.
 */
const SEEDED_STATUS: Record<string, OperationAuditState> = {
  helios: { status: 'done', lastRunAt: '2026-08-20T09:15:00.000Z' },
  meridian: { status: 'done', lastRunAt: '2026-08-15T16:40:00.000Z' },
  solstice: { status: 'not_run' },
}

export const useFinancialAuditStore = create<FinancialAuditState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({
      byOperation: {
        ...state.byOperation,
        [opId]: SEEDED_STATUS[opId] ?? { status: 'not_run' },
      },
    }))
  },

  runAudit: async (opId) => {
    set((state) => ({
      byOperation: { ...state.byOperation, [opId]: { ...state.byOperation[opId], status: 'running' } },
    }))
    await sleep(AUDIT_DELAY_MS)
    set((state) => ({
      byOperation: {
        ...state.byOperation,
        [opId]: { status: 'done', lastRunAt: new Date().toISOString() },
      },
    }))
  },
}))

/** Lee el estado de auditoria de una operacion, cargando el valor semilla si
 * hace falta (mismo patron que `useAgentConfig`). */
export function useFinancialAuditStatus(opId: string): OperationAuditState {
  useFinancialAuditStore.getState().ensureLoaded(opId)
  return useFinancialAuditStore(
    (state) => state.byOperation[opId] ?? SEEDED_STATUS[opId] ?? { status: 'not_run' },
  )
}
