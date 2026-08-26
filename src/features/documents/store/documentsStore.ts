import { create } from 'zustand'
import { MOCK_DOCUMENTS } from '../api/mockDocuments'
import { MOCK_GAPS } from '../api/mockGaps'
import type { DocumentStatus, GapIssue, GapStatus, KbDocument } from '../types'

interface OperationDocumentsState {
  documents: KbDocument[]
  gaps: GapIssue[]
}

interface DocumentsState {
  byOperation: Record<string, OperationDocumentsState>
  ensureLoaded: (opId: string) => void
  /** Simula el botón de "subir documento" (guion §5.2): sin procesamiento
   * real, añade una entrada mock en estado `pending` y devuelve su id para
   * que quien llama pueda simular la transición a `indexed` con `sleep()`. */
  addUploadedDocument: (opId: string, uploadedBy: string) => string
  setDocumentStatus: (opId: string, documentId: string, status: DocumentStatus) => void
  setGapStatus: (opId: string, gapId: string, status: GapStatus, resolutionNote?: string) => void
}

let uploadSeq = 0

// Nombres de ejemplo para el mock de subida: variados a propósito, para que
// pulsar "subir" varias veces en la demo no repita literalmente el mismo
// documento.
const UPLOAD_NAMES = [
  'Signed NDA Addendum.pdf',
  'Updated Org Chart.pdf',
  'Latest Insurance Certificate.pdf',
  'Q2 Management Accounts.xlsx',
  'Site Visit Report.pdf',
  'Board Resolution — Deal Approval.pdf',
]
const UPLOAD_CATEGORIES: KbDocument['category'][] = [
  'legal',
  'financial',
  'tax',
  'commercial',
  'technical',
  'esg',
  'hr',
]

/**
 * Dataroom + Gaps y contradicciones de una operación (guion §5.2/§5.2.1),
 * cargados de forma perezosa por operación — mismo patrón que
 * `agentConfigStore` — para que editar el estado de un documento o una
 * incidencia en Helios no afecte a Meridian ni a Solstice.
 */
export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({
      byOperation: {
        ...state.byOperation,
        [opId]: {
          documents: [...(MOCK_DOCUMENTS[opId] ?? [])],
          gaps: [...(MOCK_GAPS[opId] ?? [])],
        },
      },
    }))
  },

  addUploadedDocument: (opId, uploadedBy) => {
    uploadSeq += 1
    const id = `doc-upload-${uploadSeq}`
    const now = new Date().toISOString()
    const doc: KbDocument = {
      id,
      name: UPLOAD_NAMES[(uploadSeq - 1) % UPLOAD_NAMES.length],
      category: UPLOAD_CATEGORIES[(uploadSeq - 1) % UPLOAD_CATEGORIES.length],
      version: 'v1',
      uploadedAt: now,
      uploadedBy,
      status: 'pending',
      sizeBytes: 180_000 + ((uploadSeq * 137_000) % 900_000),
      previewText: 'Indexing in progress — preview will be available once processing completes.',
      versions: [{ version: 'v1', uploadedAt: now, uploadedBy }],
    }
    set((state) => {
      const op = state.byOperation[opId] ?? { documents: [], gaps: [] }
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: { ...op, documents: [doc, ...op.documents] },
        },
      }
    })
    return id
  },

  setDocumentStatus: (opId, documentId, status) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            documents: op.documents.map((d) => (d.id === documentId ? { ...d, status } : d)),
          },
        },
      }
    })
  },

  setGapStatus: (opId, gapId, status, resolutionNote) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            gaps: op.gaps.map((g) =>
              g.id === gapId ? { ...g, status, resolutionNote: resolutionNote ?? g.resolutionNote } : g,
            ),
          },
        },
      }
    })
  },
}))

/** Documentos del dataroom de una operación, cargando por defecto si hace falta. */
export function useDocuments(opId: string): KbDocument[] {
  useDocumentsStore.getState().ensureLoaded(opId)
  return useDocumentsStore((state) => state.byOperation[opId]?.documents ?? [])
}

/** Incidencias de Gaps y contradicciones de una operación. */
export function useGaps(opId: string): GapIssue[] {
  useDocumentsStore.getState().ensureLoaded(opId)
  return useDocumentsStore((state) => state.byOperation[opId]?.gaps ?? [])
}

/** Un documento concreto por id, para el chip "documento afectado" de Gaps. */
export function useDocumentById(opId: string, documentId?: string): KbDocument | undefined {
  const documents = useDocuments(opId)
  if (!documentId) return undefined
  return documents.find((d) => d.id === documentId)
}
