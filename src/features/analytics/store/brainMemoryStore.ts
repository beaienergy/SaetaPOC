import { create } from 'zustand'
import { DEFAULT_BRAIN_MEMORY } from '../api/mockBrainMemory'
import type { BrainMemoryVersion } from '../types'

interface OperationBrainMemory {
  versions: BrainMemoryVersion[]
  activeVersionId: string
}

interface BrainMemoryState {
  byOperation: Record<string, OperationBrainMemory>
  ensureLoaded: (opId: string) => void
  /** Cambia qué versión usa el agente ahora mismo — no borra ni reordena el
   * historial, solo mueve el puntero de "activa" (como un rollback). */
  activateVersion: (opId: string, versionId: string) => void
  /** Editar el texto crea una versión nueva a partir de la activa y la
   * activa — la versión anterior queda intacta en el historial. */
  editActiveVersion: (opId: string, content: string, author: string) => void
}

function seedOperation(opId: string): OperationBrainMemory {
  const versions = (DEFAULT_BRAIN_MEMORY[opId] ?? []).map((v) => ({ ...v }))
  return { versions, activeVersionId: versions[versions.length - 1]?.id ?? '' }
}

/**
 * Documento de memoria del brain (pedido explícito): a diferencia de
 * `useMemoryStore` (propuestas individuales pendientes de aprobación), esto
 * es el texto de contexto que el agente usa hoy, con su propio historial de
 * versiones — scopeado por operación, mismo patrón "lazily seeded" que el
 * resto de stores de la POC.
 */
export const useBrainMemoryStore = create<BrainMemoryState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({ byOperation: { ...state.byOperation, [opId]: seedOperation(opId) } }))
  },

  activateVersion: (opId, versionId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op || !op.versions.some((v) => v.id === versionId)) return state
      return { byOperation: { ...state.byOperation, [opId]: { ...op, activeVersionId: versionId } } }
    })
  },

  editActiveVersion: (opId, content, author) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      const nextVersionNumber = Math.max(0, ...op.versions.map((v) => v.version)) + 1
      const newVersion: BrainMemoryVersion = {
        id: `bm-${opId}-new-${nextVersionNumber}`,
        version: nextVersionNumber,
        content,
        createdAt: new Date().toISOString(),
        createdBy: author,
      }
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: { versions: [...op.versions, newVersion], activeVersionId: newVersion.id },
        },
      }
    })
  },
}))

/** Lee el documento de memoria del brain de una operación, sembrando por
 * defecto si hace falta. */
export function useBrainMemory(opId: string): OperationBrainMemory {
  useBrainMemoryStore.getState().ensureLoaded(opId)
  return useBrainMemoryStore((state) => state.byOperation[opId] ?? { versions: [], activeVersionId: '' })
}
