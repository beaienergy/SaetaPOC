import type { ID } from '@/shared/types'
import type { Citation } from '@/shared/types/domain'

// Chat + historial (guion §5.1, UC-01/R-02): patron NotebookLM de tres
// columnas. Estos tipos son propios de la feature — no se reutilizan fuera de
// `features/chat`, a diferencia de `Citation` (shared/types/domain.ts).

export type ChatRole = 'user' | 'agent'

export interface ChatMessage {
  id: ID
  role: ChatRole
  content: string
  /** ISO date string. */
  createdAt: string
  /** Solo en mensajes de agente: cita/fuente (guion §1.6). */
  citations?: Citation[]
}

export interface ChatConversation {
  id: ID
  /** Vacio hasta el primer mensaje de usuario: la UI cae a un titulo generico
   * ("Nueva conversacion", i18n) mientras tanto. */
  title: string
  /** ISO date string — ultima actividad, usada para agrupar por fecha en el
   * historial (columna izquierda). */
  updatedAt: string
  messages: ChatMessage[]
}

export interface ChatSourceDocument {
  id: ID
  /** Coincide con `Citation.documentId` de las citas de esta operacion: asi
   * el chip de cita y la fila resaltada en la columna de fuentes senalan al
   * mismo documento sin depender de `features/documents` (aun no construida). */
  documentId: ID
  name: string
  category: string
  /** Si el documento entra en el contexto del agente por defecto (columna
   * derecha, checkbox de inclusion). */
  includedByDefault: boolean
}
