import type { AgentId } from '@/features/agent-config'
import type { ID } from '@/shared/types'
import type { Citation } from '@/shared/types/domain'

// Analítica IA (guion §5.6, solo admin): tres subpantallas que comparten
// operationId como clave de mock (mismo patrón que el resto de la app) y el
// mismo `AgentId` de 5 valores que ya usa `features/agent-config` para
// identificar "qué agente/caso de uso" generó un coste, una traza o una
// propuesta de memoria — así el dashboard de coste y el resto de la app
// hablan del mismo catálogo de agentes en vez de inventar uno paralelo.

// ---- 5.6.1 · Coste y uso de modelos ----

/** Un punto de la serie "coste en el tiempo". Coste en unidades arbitrarias
 * (guion: "unidad de coste arbitraria, indícalo" — nunca una moneda real). */
export interface CostPoint {
  /** Fecha en formato YYYY-MM-DD. */
  date: string
  cost: number
}

/** Coste por caso de uso / agente (guion: Consulta ~120, Resumen ~240, KIL
 * ~420, Modelo financiero ~310 — mismo orden de magnitud, no literal). */
export interface UseCaseCost {
  agentId: AgentId
  cost: number
  calls: number
}

/** Consumo de tokens por agente/modelo. */
export interface AgentModelUsage {
  agentId: AgentId
  model: string
  calls: number
  tokensIn: number
  tokensOut: number
}

/** Tasa de éxito/error por agente. */
export interface SuccessRateItem {
  agentId: AgentId
  success: number
  error: number
}

// ---- 5.6.2 · Traza de ejecución / razonamiento ----

/**
 * Tipo de paso dentro de una traza. `flow` = eslabón del pipeline macro
 * (entrada, autenticación, flow de ingesta/extracción, agente invocado —
 * inspiración slide 22 de la propuesta BEAI); `model`/`tool`/`middleware` =
 * un turno de razonamiento interno del agente y qué disparó ("turno 1 ·
 * modelo · 1.240 tk", "turno 1 · tool: conocimiento", "turno 2 · middleware:
 * cita…"); `final` = resultado de la ejecución.
 */
export type TraceStepKind = 'flow' | 'model' | 'tool' | 'middleware' | 'final'

export interface TraceStep {
  id: ID
  kind: TraceStepKind
  label: string
  detail?: string
  /** Solo en pasos `model`: qué modelo respondió este turno. */
  model?: string
  /** Solo en pasos `model`: tokens consumidos en el turno. */
  tokens?: number
}

export type TraceStatus = 'success' | 'partial' | 'error'

/** Una ejecución completa de un flow o agente, de principio a fin. */
export interface ExecutionTrace {
  id: ID
  operationId: string
  /** Qué operación/aplicación la originó — ej. "Chat · Agente de consulta". */
  originLabel: string
  agentId?: AgentId
  /** Quién o qué la disparó: un usuario, o un proceso del sistema. */
  triggeredBy: string
  startedAt: string
  durationMs: number
  status: TraceStatus
  /** Suma de tokens de todos los pasos `model` — el argumento central de esta
   * pantalla: el razonamiento interno consume tanto como cualquier llamada. */
  totalTokens: number
  summary: string
  steps: TraceStep[]
}

// ---- 5.6.3 · Long-term memory ----

export type MemoryProposalStatus = 'pending' | 'approved' | 'rejected' | 'reverted'
export type MemoryAuditAction = 'proposed' | 'approved' | 'rejected' | 'reverted'

/** Una entrada del trazo de auditoría — quién hizo qué y cuándo (guion §5.6.3:
 * "aunque sea mock, debe quedar visible el trazo de auditoría"). */
export interface MemoryAuditEntry {
  id: ID
  action: MemoryAuditAction
  /** "Saeta Agent" para `proposed`; nombre de la persona para el resto. */
  actor: string
  at: string
  note?: string
}

/**
 * Propuesta de actualización de memoria de largo plazo. NO confundir con
 * `Skill` de `features/agent-config`: un `Skill` es conocimiento experto
 * sembrado de antemano y editado a mano; un `MemoryProposal` nace del USO
 * real de un agente y solo se incorpora tras aprobación humana.
 */
export interface MemoryProposal {
  id: ID
  operationId: string
  /** Qué se propone añadir/cambiar, en una frase. */
  title: string
  /** Categoría libre para agrupar visualmente (ej. "Patrón de negociación"). */
  category: string
  /** Contenido de memoria antes del cambio. Cadena vacía si es una entrada nueva. */
  before: string
  /** Contenido de memoria propuesto. */
  after: string
  /** Qué agente/flow originó la propuesta. */
  originAgentId: AgentId
  /** Conversación/sesión concreta que la disparó. */
  originConversation: string
  /** Por qué el agente propone este cambio. */
  rationale: string
  evidence: Citation[]
  status: MemoryProposalStatus
  createdAt: string
  history: MemoryAuditEntry[]
}
