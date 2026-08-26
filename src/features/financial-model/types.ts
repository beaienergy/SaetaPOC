import type { ID } from '@/shared/types'
import type { Severity } from '@/shared/types/domain'

/**
 * Un modelo financiero cargado para la operacion (guion §5.4): el agente
 * trabaja siempre sobre una COPIA de estos archivos, nunca sobre el original
 * (de ahi el banner fijo en la pantalla) — este tipo no representa el
 * original, sino la entrada de la lista "modelos cargados".
 */
export interface FinancialModelFile {
  id: ID
  name: string
  version: string
  /** ISO date string. */
  updatedAt: string
  sizeLabel: string
  /** Numero de pestanas del libro, solo decorativo. */
  sheetCount: number
}

/**
 * Tipo de hallazgo de consistencia (guion §5.4): "formulas rotas, links
 * externos, valores hardcodeados, circularidades" son los 4 explicitos del
 * guion; `cross_tab_inconsistency` se anade para variar el mix (no todos los
 * hallazgos son del mismo tipo).
 */
export type FindingType =
  | 'broken_formula'
  | 'external_link'
  | 'hardcoded_value'
  | 'circularity'
  | 'cross_tab_inconsistency'

/**
 * Un hallazgo de la auditoria de consistencia, siempre referenciado a
 * hoja!celda (guion §5.4) — el mismo patron de "cita a fuente" (§1.6) pero
 * apuntando al propio modelo en vez de a un documento del KB.
 */
export interface AuditFinding {
  id: ID
  type: FindingType
  severity: Severity
  /** Nombre de la pestana, ej. "Sensitivities". */
  sheet: string
  /** Celda o rango, ej. "C14". */
  cell: string
  description: string
  recommendation: string
}

export type ScenarioKey = 'downside' | 'base' | 'upside'

/** Una fila de la tabla de sensibilidades: una asuncion o un resultado, con un
 * valor por escenario. */
export interface SensitivityRow {
  id: ID
  label: string
  kind: 'assumption' | 'result'
  values: Record<ScenarioKey, string>
}

export type AuditStatus = 'not_run' | 'running' | 'done'

/** Todo el contenido mock de la pantalla para una operacion. */
export interface FinancialModelData {
  files: FinancialModelFile[]
  findings: AuditFinding[]
  sensitivities: SensitivityRow[]
}
