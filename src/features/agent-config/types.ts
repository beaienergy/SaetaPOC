import type { ID } from '@/shared/types'

/**
 * Conocimiento experto sembrado de antemano (guion §1.4/§5.2.2), NO la
 * memoria de largo plazo (esa es `features/analytics`, memoria que crece con
 * el uso). Editable solo por admin, scopeada a una operación.
 */
export interface Skill {
  id: ID
  title: string
  description: string
  procedure: string
}

/**
 * Los 5 agentes configurables de la POC (guion §6): uno por pantalla, salvo
 * Hechos vs conclusiones que comparte config con Resumen/overview (decisión
 * confirmada — "puede compartir agente... decidir al construir").
 */
export type AgentId = 'chat' | 'summary-overview' | 'key-issues' | 'financial-audit' | 'reports'

export interface AgentConfig {
  id: AgentId
  agentName: string
  prompt: string
  defaultPrompt: string
  /** Chips de solo lectura (guion §1.4): "gestionado por la plataforma". */
  model: string
  tools: string[]
  middleware: string[]
}
