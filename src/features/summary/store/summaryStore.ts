import { create } from 'zustand'
import { sleep } from '@/shared/lib/utils'
import { MOCK_OVERVIEW } from '../api/mockOverview'
import { MOCK_KEY_ISSUES } from '../api/mockKeyIssues'
import { MOCK_TRACKING } from '../api/mockTracking'
import { MOCK_FACTS } from '../api/mockFacts'
import type {
  DealPhase,
  FactsBoard,
  KeyIssue,
  KeyIssueStatus,
  OperationSnapshot,
  OperationTracking,
  QuestionStatus,
  TrackingActionStatus,
} from '../types'

interface SummaryOperationState {
  overview: OperationSnapshot
  keyIssues: KeyIssue[]
  facts: FactsBoard
  tracking: OperationTracking
}

interface SummaryState {
  byOperation: Record<string, SummaryOperationState>
  /** `true` mientras "regenerar" (overview) o "generar borrador" (KIL) están en vuelo. */
  overviewRegenerating: Record<string, boolean>
  keyIssuesGenerating: Record<string, boolean>

  ensureLoaded: (opId: string) => void
  regenerateOverview: (opId: string) => Promise<void>
  updateOverviewText: (opId: string, field: 'perimeter' | 'status', value: string) => void
  updateOverviewList: (opId: string, field: 'parties' | 'keyIssuesHighlight', value: string[]) => void
  generateKeyIssuesDraft: (opId: string) => Promise<void>
  updateIssueStatus: (opId: string, issueId: string, status: KeyIssueStatus) => void
  updateIssue: (opId: string, issueId: string, patch: Partial<Omit<KeyIssue, 'id'>>) => void
  updateActionStatus: (opId: string, actionId: string, status: TrackingActionStatus) => void
  updateQuestionStatus: (opId: string, questionId: string, status: QuestionStatus) => void
  updateFact: (opId: string, factId: string, patch: { text: string; note?: string }) => void
  updatePhase: (opId: string, phase: DealPhase, note?: string) => void
}

function seedOperation(opId: string): SummaryOperationState {
  return {
    // Clonado superficial por fila/lista: evita que dos operaciones compartan
    // el mismo array si alguna vez se muta con `push` en vez de con spread.
    overview: { ...MOCK_OVERVIEW[opId] },
    keyIssues: (MOCK_KEY_ISSUES[opId] ?? []).map((issue) => ({ ...issue })),
    facts: {
      facts: (MOCK_FACTS[opId]?.facts ?? []).map((item) => ({ ...item })),
      inferences: (MOCK_FACTS[opId]?.inferences ?? []).map((item) => ({ ...item })),
      hypotheses: (MOCK_FACTS[opId]?.hypotheses ?? []).map((item) => ({ ...item })),
    },
    tracking: {
      ...MOCK_TRACKING[opId],
      actions: (MOCK_TRACKING[opId]?.actions ?? []).map((a) => ({ ...a })),
      questions: (MOCK_TRACKING[opId]?.questions ?? []).map((q) => ({ ...q })),
    },
  }
}

/**
 * Estado editable/generado del Resumen de la operación (§5.3), scopeado por
 * operación — mismo patrón que `useAgentConfigStore`: sembrado por defecto de
 * los mocks al entrar por primera vez, editable después sin afectar a otras
 * operaciones.
 */
export const useSummaryStore = create<SummaryState>((set, get) => ({
  byOperation: {},
  overviewRegenerating: {},
  keyIssuesGenerating: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({ byOperation: { ...state.byOperation, [opId]: seedOperation(opId) } }))
  },

  regenerateOverview: async (opId) => {
    get().ensureLoaded(opId)
    set((state) => ({ overviewRegenerating: { ...state.overviewRegenerating, [opId]: true } }))
    await sleep(1400)
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        overviewRegenerating: { ...state.overviewRegenerating, [opId]: false },
        byOperation: {
          ...state.byOperation,
          [opId]: { ...op, overview: { ...op.overview, generatedAt: new Date().toISOString() } },
        },
      }
    })
  },

  updateOverviewText: (opId, field, value) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            overview: {
              ...op.overview,
              [field]: { ...op.overview[field], value, insufficient: undefined },
            },
          },
        },
      }
    })
  },

  updateOverviewList: (opId, field, value) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            overview: {
              ...op.overview,
              [field]: { ...op.overview[field], value, insufficient: undefined },
            },
          },
        },
      }
    })
  },

  generateKeyIssuesDraft: async (opId) => {
    get().ensureLoaded(opId)
    set((state) => ({ keyIssuesGenerating: { ...state.keyIssuesGenerating, [opId]: true } }))
    await sleep(1200)
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        keyIssuesGenerating: { ...state.keyIssuesGenerating, [opId]: false },
        byOperation: {
          ...state.byOperation,
          [opId]: { ...op, keyIssues: (MOCK_KEY_ISSUES[opId] ?? []).map((issue) => ({ ...issue })) },
        },
      }
    })
  },

  updateIssueStatus: (opId, issueId, status) => {
    get().updateIssue(opId, issueId, { status })
  },

  updateIssue: (opId, issueId, patch) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            keyIssues: op.keyIssues.map((issue) => (issue.id === issueId ? { ...issue, ...patch } : issue)),
          },
        },
      }
    })
  },

  updateActionStatus: (opId, actionId, status) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            tracking: {
              ...op.tracking,
              actions: op.tracking.actions.map((a) => (a.id === actionId ? { ...a, status } : a)),
            },
          },
        },
      }
    })
  },

  updateQuestionStatus: (opId, questionId, status) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            tracking: {
              ...op.tracking,
              questions: op.tracking.questions.map((q) => (q.id === questionId ? { ...q, status } : q)),
            },
          },
        },
      }
    })
  },
  updatePhase: (opId, phase, note) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            tracking: {
              ...op.tracking,
              phase,
              phaseNote: note?.trim() || undefined,
              phaseChangedAt: new Date().toISOString(),
            },
          },
        },
      }
    })
  },

  updateFact: (opId, factId, patch) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      const applyPatch = (items: FactsBoard['facts']) =>
        items.map((item) => (item.id === factId ? { ...item, ...patch } : item))
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            facts: {
              facts: applyPatch(op.facts.facts),
              inferences: applyPatch(op.facts.inferences),
              hypotheses: applyPatch(op.facts.hypotheses),
            },
          },
        },
      }
    })
  },
}))

/** Lee el snapshot de overview de una operación, sembrando por defecto si hace falta. */
export function useOverviewSnapshot(opId: string): OperationSnapshot {
  useSummaryStore.getState().ensureLoaded(opId)
  return useSummaryStore((state) => state.byOperation[opId]?.overview ?? MOCK_OVERVIEW[opId])
}

export function useOverviewRegenerating(opId: string): boolean {
  return useSummaryStore((state) => state.overviewRegenerating[opId] ?? false)
}

/** Lee la Key Issue List de una operación, sembrando por defecto si hace falta. */
export function useKeyIssues(opId: string): KeyIssue[] {
  useSummaryStore.getState().ensureLoaded(opId)
  return useSummaryStore((state) => state.byOperation[opId]?.keyIssues ?? [])
}

export function useKeyIssuesGenerating(opId: string): boolean {
  return useSummaryStore((state) => state.keyIssuesGenerating[opId] ?? false)
}

/** Lee el tablero de Hechos vs conclusiones de una operación. */
export function useFactsBoard(opId: string): FactsBoard {
  useSummaryStore.getState().ensureLoaded(opId)
  return useSummaryStore((state) => state.byOperation[opId]?.facts ?? MOCK_FACTS[opId])
}

/** Lee el seguimiento (acciones + preguntas) de una operación. */
export function useOperationTracking(opId: string): OperationTracking {
  useSummaryStore.getState().ensureLoaded(opId)
  return useSummaryStore((state) => state.byOperation[opId]?.tracking ?? MOCK_TRACKING[opId])
}
