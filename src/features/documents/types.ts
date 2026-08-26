import type { ID } from '@/shared/types'
import type { Severity } from '@/shared/types/domain'

/**
 * Categorías de due diligence (guion §5.2): subconjunto razonable de las 11
 * disciplinas citadas en el guion (Legal, Fiscal, Laboral, Técnica, ESG,
 * Comercial, Financiera, Seguros, RRHH, Medioambiental, Propiedad
 * Intelectual) — suficiente para que la tabla se lea como un dataroom de M&A
 * real sin saturar la columna de categoría con 11 valores.
 */
export type DdCategory =
  | 'legal'
  | 'financial'
  | 'tax'
  | 'commercial'
  | 'technical'
  | 'esg'
  | 'hr'

export type DocumentStatus = 'indexed' | 'pending' | 'error'

/** Una entrada del historial de versiones de un documento (panel de detalle). */
export interface DocumentVersionEntry {
  version: string
  /** ISO date string. */
  uploadedAt: string
  uploadedBy: string
  note?: string
}

/** Un documento del dataroom de la operación (guion §5.2, R-05). */
export interface KbDocument {
  id: ID
  name: string
  category: DdCategory
  version: string
  /** ISO date string. */
  uploadedAt: string
  uploadedBy: string
  status: DocumentStatus
  sizeBytes: number
  /** Texto de previsualización mock — nunca se procesó un fichero real. */
  previewText: string
  /** Más reciente primero; incluye la versión actual como primera entrada. */
  versions: DocumentVersionEntry[]
}

/** Tipos de incidencia de Gaps y contradicciones (guion §5.2.1, UC-05). */
export type GapType = 'missing_documentation' | 'incompatible_versions' | 'inconsistency'

export type GapStatus = 'open' | 'resolved' | 'dismissed'

/**
 * Documento afectado por una incidencia. `documentId` solo si el documento
 * existe realmente en el dataroom (permite abrir su detalle) — una
 * incidencia de documentación pendiente referencia lo que FALTA, así que no
 * siempre hay nada que abrir.
 */
export interface AffectedDocumentRef {
  documentId?: ID
  documentName: string
}

/** Una incidencia de Gaps y contradicciones (guion §5.2.1, UC-05). */
export interface GapIssue {
  id: ID
  type: GapType
  title: string
  description: string
  severity: Severity
  status: GapStatus
  /** ISO date string. */
  detectedAt: string
  affectedDocuments: AffectedDocumentRef[]
  /** Quién y por qué, si `status !== 'open'` — trazo mínimo de auditoría. */
  resolutionNote?: string
}
