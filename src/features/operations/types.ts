import type { ID } from '@/shared/types'

export type OperationStatus = 'active' | 'closed'

/**
 * Una "carpeta"/operación de M&A (guion §4). Es la unidad de segregación de
 * toda la app: todo lo que vive bajo `/ma/operations/:opId/*` (documentos,
 * chat, KIL, memoria...) está scopeado a un `Operation['id']` y no debe
 * filtrarse entre operaciones — es el argumento visual de R-07/R-08.
 */
export interface Operation {
  id: ID
  /** Nombre anonimizado de la operación, ej. "Project Helios". */
  name: string
  /** Sector/target de la operación, ej. "Utility-scale solar PV portfolio". */
  target: string
  status: OperationStatus
  /** ISO date string. */
  lastActivityAt: string
  documentCount: number
  openIssueCount: number
}
