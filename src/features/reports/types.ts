import type { ID } from '@/shared/types'
import type { Citation } from '@/shared/types/domain'

/**
 * 4 plantillas de informe M&A (guion §5.5). Escogidas para cubrir los
 * consumidores habituales de un proceso de DD: stakeholders senior, el propio
 * Comite de Inversion, el equipo de deal interno, y un resumen de riesgos
 * criticos para el lider del deal.
 */
export type ReportTemplateId = 'executive-summary' | 'ic-memo' | 'status-report' | 'red-flag-summary'

/**
 * Claves de seccion: cada plantilla referencia un subconjunto de estas. Son
 * el id estable con el que el generador de borradores (`mockReports.ts`)
 * busca el contenido mock de una operacion para esa seccion — el mismo id se
 * usa como `ReportSection.id`.
 */
export type ReportSectionKey =
  | 'overview'
  | 'risks'
  | 'financials'
  | 'recommendation'
  | 'transaction'
  | 'rationale'
  | 'keyIssues'
  | 'financialAnalysis'
  | 'valuation'
  | 'icRecommendation'
  | 'progress'
  | 'workstreams'
  | 'pendingDocs'
  | 'milestones'
  | 'criticalFindings'
  | 'dealBreakers'
  | 'actions'

export interface ReportSection {
  id: ReportSectionKey
  title: string
  description: string
  /** Preseleccionada al elegir la plantilla; el usuario puede desmarcarla. */
  defaultIncluded: boolean
}

export interface ReportSourceOption {
  id: ID
  /** Nombre del documento tal y como aparece en Documentacion. */
  label: string
  /** Disciplina de DD a la que pertenece (Legal, Financiera, Tecnica...). */
  category: string
  defaultIncluded: boolean
}

export interface ReportTemplate {
  id: ReportTemplateId
  name: string
  description: string
  /** A quien va dirigida esta plantilla — se muestra en la ficha. */
  audience: string
  sections: ReportSection[]
}

export type ReportExportFormat = 'pdf' | 'word' | 'ppt'

export type ReportStatus = 'draft' | 'final'

/** Bloque de contenido del borrador — suficiente para un "editor de texto
 * enriquecido" simplificado (guion §5.5): titulo, parrafo o lista, cada uno
 * con las citas que lo respaldan. */
export type ReportBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string; citationIds: ID[] }
  | { kind: 'bullets'; items: string[]; citationIds: ID[] }

export interface GeneratedReport {
  id: ID
  /** Id de una de las 4 plantillas, o el id de un `CustomReportDef` — ambos
   * son la clave con la que la pantalla de detalle filtra el historial de una
   * "tarjeta" de informe. */
  templateId: string
  /** Titulo mostrado en la vista previa y el historial, ej. "Project Helios — IC Memo". */
  title: string
  /** Version dentro de esta plantilla para esta operacion (1, 2, 3…). */
  version: number
  status: ReportStatus
  generatedAt: string
  generatedBy: string
  sectionIds: ReportSectionKey[]
  sourceIds: ID[]
  body: ReportBlock[]
  citations: Citation[]
}

/**
 * Un informe "a medida" creado desde el popup "Crear nuevo informe" (pedido
 * explícito): nombre + prompt libre + si se subió una plantilla de
 * documento. Aparece como una tarjeta más junto a las 4 plantillas fijas.
 */
export interface CustomReportDef {
  id: ID
  name: string
  prompt: string
  hasTemplateFile: boolean
  createdAt: string
}
