import { create } from 'zustand'
import { cloneDefaultConfigs, DEFAULT_AGENT_CONFIGS, MOCK_SKILLS } from '../api/mockAgentConfigs'
import type { AgentConfig, AgentId, Skill } from '../types'

interface OperationAgentState {
  configs: Record<AgentId, AgentConfig>
  skills: Skill[]
}

interface AgentConfigState {
  byOperation: Record<string, OperationAgentState>
  ensureLoaded: (opId: string) => void
  updatePrompt: (opId: string, agentId: AgentId, prompt: string) => void
  resetPrompt: (opId: string, agentId: AgentId) => void
  addSkill: (opId: string, skill: Omit<Skill, 'id'>) => void
  updateSkill: (opId: string, skillId: string, patch: Partial<Omit<Skill, 'id'>>) => void
  removeSkill: (opId: string, skillId: string) => void
}

let skillSeq = 0

/**
 * Estado de los 5 agentes configurables + el pool de Skills, todo scopeado
 * por operación (guion §1.4/§5.2.2): editar el prompt del chat en Helios no
 * puede afectar a Meridian — es el mismo argumento de segregación que el
 * resto de la app, aplicado a la config del agente.
 */
export const useAgentConfigStore = create<AgentConfigState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({
      byOperation: {
        ...state.byOperation,
        [opId]: { configs: cloneDefaultConfigs(), skills: [...(MOCK_SKILLS[opId] ?? [])] },
      },
    }))
  },

  updatePrompt: (opId, agentId, prompt) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            configs: { ...op.configs, [agentId]: { ...op.configs[agentId], prompt } },
          },
        },
      }
    })
  },

  resetPrompt: (opId, agentId) => {
    const defaultPrompt = DEFAULT_AGENT_CONFIGS[agentId].defaultPrompt
    get().updatePrompt(opId, agentId, defaultPrompt)
  },

  addSkill: (opId, skill) => {
    skillSeq += 1
    const newSkill: Skill = { id: `sk-new-${skillSeq}`, ...skill }
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: { ...op, skills: [...op.skills, newSkill] },
        },
      }
    })
  },

  updateSkill: (opId, skillId, patch) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            skills: op.skills.map((s) => (s.id === skillId ? { ...s, ...patch } : s)),
          },
        },
      }
    })
  },

  removeSkill: (opId, skillId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: { ...op, skills: op.skills.filter((s) => s.id !== skillId) },
        },
      }
    })
  },
}))

/** Lee el config de un agente para una operación, cargando por defecto si es
 * la primera vez que se pide (evita tener que llamar a `ensureLoaded` desde
 * cada pantalla). */
export function useAgentConfig(opId: string, agentId: AgentId): AgentConfig {
  useAgentConfigStore.getState().ensureLoaded(opId)
  return useAgentConfigStore(
    (state) => state.byOperation[opId]?.configs[agentId] ?? DEFAULT_AGENT_CONFIGS[agentId],
  )
}

/** Lee el pool de Skills de una operación (guion §5.2.2), cargando por
 * defecto si hace falta. */
export function useOperationSkills(opId: string): Skill[] {
  useAgentConfigStore.getState().ensureLoaded(opId)
  return useAgentConfigStore((state) => state.byOperation[opId]?.skills ?? [])
}
