// Tipos de dominio compartidos por varias features (no solo por una): la cita
// de fuente (guion §1.6) y la severidad son el mismo concepto en Chat, KIL,
// Gaps, Modelo financiero y Resumen — un tipo aqui evita que cada feature
// invente su propia forma para lo mismo.

/**
 * Cita/fuente (guion §1.6): todo texto generado por un agente debe poder
 * señalar de qué documento sale. `documentId` referencia un KbDocument de
 * `features/documents`; el chip que lo muestra abre ese documento.
 */
export interface Citation {
  id: string
  documentId: string
  documentName: string
  /** Ej. "p. 12", "cláusula 4.3", "pestaña 'Sensitivities', celda C14". */
  locator: string
  /** Fragmento breve citado, para el tooltip/preview del chip. */
  snippet?: string
}

export type Severity = 'low' | 'medium' | 'high' | 'critical'

/**
 * Estado insuficiente / gap (guion §1.7): cuando un agente no tiene
 * información suficiente para completar un campo, en vez de inventar.
 */
export interface InsufficientDataState {
  reason: string
  suggestedAction: 'request_human' | 'request_documents'
}
