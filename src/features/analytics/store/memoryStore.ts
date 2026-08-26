import { create } from 'zustand'
import { cloneDefaultProposals } from '../api/mockMemory'
import type { MemoryAuditEntry, MemoryProposal, MemoryProposalStatus } from '../types'

interface MemoryState {
  byOperation: Record<string, MemoryProposal[]>
  ensureLoaded: (opId: string) => void
  approve: (opId: string, proposalId: string, actor: string, note?: string) => void
  reject: (opId: string, proposalId: string, actor: string, note?: string) => void
  revert: (opId: string, proposalId: string, actor: string, note?: string) => void
}

let historySeq = 0

function appendHistory(
  proposal: MemoryProposal,
  status: MemoryProposalStatus,
  entry: Omit<MemoryAuditEntry, 'id'>,
): MemoryProposal {
  historySeq += 1
  return {
    ...proposal,
    status,
    history: [...proposal.history, { id: `h-new-${historySeq}`, ...entry }],
  }
}

function transition(
  set: (fn: (state: MemoryState) => Partial<MemoryState>) => void,
  opId: string,
  proposalId: string,
  status: MemoryProposalStatus,
  action: MemoryAuditEntry['action'],
  actor: string,
  note?: string,
) {
  set((state) => {
    const proposals = state.byOperation[opId]
    if (!proposals) return state
    return {
      byOperation: {
        ...state.byOperation,
        [opId]: proposals.map((p) =>
          p.id === proposalId
            ? appendHistory(p, status, { action, actor, at: new Date().toISOString(), note })
            : p,
        ),
      },
    }
  })
}

/**
 * Estado de las propuestas de memoria de largo plazo (guion §5.6.3), keyed
 * por operación — mismo patrón que `useAgentConfigStore`: seedeado en
 * diferido desde el mock por defecto, y todas las mutaciones (aprobar,
 * rechazar, revertir) quedan registradas en `history` en vez de solo cambiar
 * el estado, porque el trazo de auditoría ES el punto de esta pantalla.
 */
export const useMemoryStore = create<MemoryState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({
      byOperation: { ...state.byOperation, [opId]: cloneDefaultProposals(opId) },
    }))
  },

  approve: (opId, proposalId, actor, note) =>
    transition(set, opId, proposalId, 'approved', 'approved', actor, note),

  reject: (opId, proposalId, actor, note) =>
    transition(set, opId, proposalId, 'rejected', 'rejected', actor, note),

  revert: (opId, proposalId, actor, note) =>
    transition(set, opId, proposalId, 'reverted', 'reverted', actor, note),
}))

/** Lee las propuestas de memoria de una operación, cargando el mock por
 * defecto si es la primera vez que se piden. */
export function useMemoryProposals(opId: string): MemoryProposal[] {
  useMemoryStore.getState().ensureLoaded(opId)
  return useMemoryStore((state) => state.byOperation[opId] ?? [])
}
