import { create } from 'zustand'
import { sleep } from '@/shared/lib/utils'
import { MOCK_REPORTS } from '../api/mockReports'
import type { CustomReportDef, GeneratedReport } from '../types'

interface OperationReportsState {
  reports: GeneratedReport[]
  customReports: CustomReportDef[]
  isCreating: boolean
}

interface CreateCustomReportInput {
  name: string
  prompt: string
  hasTemplateFile: boolean
}

interface ReportsState {
  byOperation: Record<string, OperationReportsState>
  ensureLoaded: (opId: string) => void
  /** Crea la tarjeta "a medida" y simula la redacción del primer borrador en
   * el mismo paso — devuelve el id de la tarjeta para que la pantalla pueda
   * abrir directamente su detalle. */
  createCustomReport: (opId: string, input: CreateCustomReportInput) => Promise<string>
}

const CREATE_DELAY_MS = 1400

let customSeq = 0
let reportSeq = 0

function seedOperation(opId: string): OperationReportsState {
  return {
    reports: (MOCK_REPORTS[opId] ?? []).map((report) => ({ ...report })),
    customReports: [],
    isCreating: false,
  }
}

/**
 * Estado de Informes (guion §5.5), scopeado por operación. Simplificado a
 * petición explícita del usuario: ya no hay paso de "elegir secciones y
 * fuentes" — una tarjeta (plantilla fija o "a medida") solo guarda su
 * historial de versiones generadas; generar una nueva solo ocurre desde el
 * popup "Crear nuevo informe".
 */
export const useReportsStore = create<ReportsState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({ byOperation: { ...state.byOperation, [opId]: seedOperation(opId) } }))
  },

  createCustomReport: async (opId, input) => {
    get().ensureLoaded(opId)
    set((state) => ({
      byOperation: { ...state.byOperation, [opId]: { ...state.byOperation[opId], isCreating: true } },
    }))

    // Sin backend real: simula la latencia de redaccion del agente a partir
    // del prompt libre, igual que el resto de generaciones simuladas del repo.
    await sleep(CREATE_DELAY_MS)

    customSeq += 1
    const customId = `${opId}-custom-${customSeq}`
    const customDef: CustomReportDef = {
      id: customId,
      name: input.name,
      prompt: input.prompt,
      hasTemplateFile: input.hasTemplateFile,
      createdAt: new Date().toISOString(),
    }

    reportSeq += 1
    const report: GeneratedReport = {
      id: `${customId}-v${reportSeq}`,
      templateId: customId,
      title: input.name,
      version: 1,
      status: 'draft',
      generatedAt: new Date().toISOString(),
      generatedBy: 'You',
      sectionIds: [],
      sourceIds: [],
      body: [
        { kind: 'heading', text: input.name },
        { kind: 'paragraph', text: `Instructions given to the agent: "${input.prompt}"`, citationIds: [] },
        {
          kind: 'paragraph',
          text:
            'This is a simulated draft for the demo — no backend or real document indexing sits behind it. ' +
            'A production agent would generate this section by section, citing the operation\'s indexed ' +
            (input.hasTemplateFile
              ? 'documentation and following the structure of the uploaded template.'
              : 'documentation.'),
          citationIds: [],
        },
      ],
      citations: [],
    }

    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            isCreating: false,
            customReports: [...op.customReports, customDef],
            reports: [report, ...op.reports],
          },
        },
      }
    })

    return customId
  },
}))

/** Lee todo el estado de Informes de una operación, cargando el seed por
 * defecto si es la primera vez que se pide. */
export function useOperationReports(opId: string): OperationReportsState {
  useReportsStore.getState().ensureLoaded(opId)
  return useReportsStore(
    (state) => state.byOperation[opId] ?? { reports: [], customReports: [], isCreating: false },
  )
}
