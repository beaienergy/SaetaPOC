import type { ID } from '@/shared/types'
import type { Citation, InsufficientDataState, Severity } from '@/shared/types/domain'

// Resumen de la operación (guion §5.3): overview/snapshot, Key Issue List,
// Hechos vs conclusiones y Seguimiento + Q&A. Todo el contenido mock vive
// keyed por operación (`'helios' | 'meridian' | 'solstice'`, ver
// `features/operations/api/mockOperations.ts`), como `Record<string, T[]>` —
// mismo patrón que `features/agent-config`.

/**
 * Un campo de la ficha de operación (§5.3.1): valor + citas cuando el agente
 * tiene suficiente documentación. `insufficient` (patrón §1.7) no es
 * excluyente con `value` — un campo puede traer un valor parcial (lo que sí
 * se sabe) y aun así señalar qué falta (ej. hitos conocidos + fecha de cierre
 * todavía no disponible), o no traer valor en absoluto.
 */
export interface SnapshotField<T> {
  value: T | null
  citations: Citation[]
  insufficient?: InsufficientDataState
}

export type MilestoneStatus = 'done' | 'upcoming' | 'at-risk'

export interface Milestone {
  id: ID
  label: string
  /** ISO date string. */
  date: string
  status: MilestoneStatus
}

/**
 * Ficha de operación generada por el sistema (§5.3.1, UC-02): perímetro,
 * partes, hitos, estado, asuntos clave — cada campo citable o marcado como
 * insuficiente.
 */
export interface OperationSnapshot {
  /** ISO datetime del último análisis — se refresca al "regenerar". */
  generatedAt: string
  perimeter: SnapshotField<string>
  parties: SnapshotField<string[]>
  milestones: SnapshotField<Milestone[]>
  status: SnapshotField<string>
  keyIssuesHighlight: SnapshotField<string[]>
}

export type KeyIssueStatus = 'open' | 'mitigated' | 'escalated'

/**
 * Una fila de la Key Issue List (§5.3.2, UC-03): riesgo, evidencia, impacto,
 * responsable, mitigación, estado.
 */
export interface KeyIssue {
  id: ID
  risk: string
  evidence: Citation[]
  impact: Severity
  owner: string
  mitigation: string
  status: KeyIssueStatus
}

export type FactKind = 'fact' | 'inference' | 'hypothesis'

/**
 * Un elemento de Hechos vs conclusiones (§5.3.3, UC-04). `note` es el
 * razonamiento del agente para una inferencia, o qué confirmaría una
 * hipótesis — no aplica a un hecho documentado.
 */
export interface FactItem {
  id: ID
  kind: FactKind
  text: string
  citations: Citation[]
  note?: string
}

export interface FactsBoard {
  facts: FactItem[]
  inferences: FactItem[]
  hypotheses: FactItem[]
}

export type TrackingActionStatus = 'pending' | 'in-progress' | 'done'

/**
 * Una acción de seguimiento (§5.3.4, UC-06).
 */
export interface TrackingAction {
  id: ID
  action: string
  owner: string
  /** ISO date string. */
  dueDate: string
  status: TrackingActionStatus
  citations?: Citation[]
}

export type QuestionStatus = 'pending' | 'answered'

/**
 * Una pregunta del banco "preguntas para vendedor/asesores" (§5.3.4),
 * agrupada por tema, con evidencia relacionada y un borrador de respuesta
 * generado por el agente si ya está respondida (o parcialmente redactado si
 * sigue pendiente).
 */
export interface SellerQuestion {
  id: ID
  topic: string
  question: string
  status: QuestionStatus
  evidence: Citation[]
  draftAnswer?: string
}

/**
 * Fase de la operación (§5.3.4 nota): no hay tracker de etapas de la
 * propuesta comercial disponible en este repo — se sustituye por un
 * indicador de fase propio y sencillo.
 */
export type DealPhase = 'screening' | 'due-diligence' | 'negotiation' | 'closed'

export const DEAL_PHASES: DealPhase[] = ['screening', 'due-diligence', 'negotiation', 'closed']

export interface OperationTracking {
  phase: DealPhase
  actions: TrackingAction[]
  questions: SellerQuestion[]
}
