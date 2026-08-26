import { create } from 'zustand'
import { sleep } from '@/shared/lib/utils'
import { buildDraftBody, getTemplate, MOCK_REPORT_SOURCES, MOCK_REPORTS } from '../api/mockReports'
import type { GeneratedReport, ReportDraftSelection, ReportSectionKey, ReportTemplateId } from '../types'

interface OperationReportsState {
  reports: GeneratedReport[]
  draft: ReportDraftSelection
  /** Qué informe se muestra en la vista previa: el recién generado, o uno
   * elegido en el historial de versiones. */
  activeReportId: string | null
  isGenerating: boolean
}

interface ReportsState {
  byOperation: Record<string, OperationReportsState>
  ensureLoaded: (opId: string) => void
  selectTemplate: (opId: string, templateId: ReportTemplateId) => void
  clearTemplate: (opId: string) => void
  toggleSection: (opId: string, sectionId: ReportSectionKey) => void
  toggleSource: (opId: string, sourceId: string) => void
  generateReport: (opId: string) => Promise<void>
  viewReport: (opId: string, reportId: string) => void
}

const GENERATE_DELAY_MS = 1400

let reportSeq = 0

function emptyDraft(): ReportDraftSelection {
  return { templateId: null, sectionIds: [], sourceIds: [] }
}

function seedOperation(opId: string): OperationReportsState {
  const reports = MOCK_REPORTS[opId] ?? []
  return {
    reports,
    draft: emptyDraft(),
    // El historial preexistente arranca mostrando su version mas reciente en
    // la vista previa, para que la pantalla no se abra vacia en Helios/Solstice.
    activeReportId: reports[0]?.id ?? null,
    isGenerating: false,
  }
}

/**
 * Estado de Informes (guion §5.5), scopeado por operación — mismo patrón de
 * "lazily seeded, keyed by operationId" que `agentConfigStore`. Guarda dos
 * cosas: la plantilla/secciones/fuentes que el usuario está configurando
 * ahora ("el borrador en curso") y la lista de informes ya generados
 * (historial de versiones), para que ninguna de las dos se pierda si el
 * usuario navega fuera de la pantalla y vuelve.
 */
export const useReportsStore = create<ReportsState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    set((state) => ({ byOperation: { ...state.byOperation, [opId]: seedOperation(opId) } }))
  },

  selectTemplate: (opId, templateId) => {
    const template = getTemplate(templateId)
    const sources = MOCK_REPORT_SOURCES[opId] ?? []
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            draft: {
              templateId,
              sectionIds: template.sections.filter((s) => s.defaultIncluded).map((s) => s.id),
              sourceIds: sources.filter((s) => s.defaultIncluded).map((s) => s.id),
            },
          },
        },
      }
    })
  },

  clearTemplate: (opId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return { byOperation: { ...state.byOperation, [opId]: { ...op, draft: emptyDraft() } } }
    })
  },

  toggleSection: (opId, sectionId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      const sectionIds = op.draft.sectionIds.includes(sectionId)
        ? op.draft.sectionIds.filter((id) => id !== sectionId)
        : [...op.draft.sectionIds, sectionId]
      return {
        byOperation: { ...state.byOperation, [opId]: { ...op, draft: { ...op.draft, sectionIds } } },
      }
    })
  },

  toggleSource: (opId, sourceId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      const sourceIds = op.draft.sourceIds.includes(sourceId)
        ? op.draft.sourceIds.filter((id) => id !== sourceId)
        : [...op.draft.sourceIds, sourceId]
      return {
        byOperation: { ...state.byOperation, [opId]: { ...op, draft: { ...op.draft, sourceIds } } },
      }
    })
  },

  generateReport: async (opId) => {
    const op = get().byOperation[opId]
    if (!op || !op.draft.templateId || op.isGenerating) return
    const { templateId, sectionIds, sourceIds } = op.draft

    set((state) => ({
      byOperation: { ...state.byOperation, [opId]: { ...state.byOperation[opId], isGenerating: true } },
    }))

    // Sin backend real: simula la latencia de redaccion del agente (guion,
    // convenciones tecnicas — "usa sleep() para simular latencia").
    await sleep(GENERATE_DELAY_MS)

    const template = getTemplate(templateId)
    const existingVersions = (get().byOperation[opId]?.reports ?? []).filter((r) => r.templateId === templateId)
    const { body, citations } = buildDraftBody(opId, templateId, sectionIds)

    reportSeq += 1
    const newReport: GeneratedReport = {
      id: `${opId}-rep-new-${reportSeq}`,
      templateId,
      title: `${template.name}`,
      version: existingVersions.length + 1,
      status: 'draft',
      generatedAt: new Date().toISOString(),
      generatedBy: 'You',
      sectionIds,
      sourceIds,
      body,
      citations,
    }

    set((state) => {
      const current = state.byOperation[opId]
      if (!current) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...current,
            reports: [newReport, ...current.reports],
            activeReportId: newReport.id,
            isGenerating: false,
          },
        },
      }
    })
  },

  viewReport: (opId, reportId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return { byOperation: { ...state.byOperation, [opId]: { ...op, activeReportId: reportId } } }
    })
  },
}))

/** Lee todo el estado de Informes de una operación, cargando el seed por
 * defecto si es la primera vez que se pide. */
export function useOperationReports(opId: string): OperationReportsState {
  useReportsStore.getState().ensureLoaded(opId)
  return useReportsStore(
    (state) =>
      state.byOperation[opId] ?? {
        reports: [],
        draft: emptyDraft(),
        activeReportId: null,
        isGenerating: false,
      },
  )
}
