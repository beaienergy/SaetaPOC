import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { REPORT_TEMPLATES } from '../api/mockReports'
import { useOperationReports } from '../store/reportsStore'
import { TemplateGallery, type ReportCardInfo } from './TemplateGallery'
import { CreateReportModal } from './CreateReportModal'
import { ReportDetail } from './ReportDetail'

/**
 * Informes (guion §5.5, UC-08): tarjetas de informe (4 plantillas fijas + los
 * "a medida" ya creados) → detalle con historial + vista previa + exportar.
 * Simplificado a petición explícita: ya no hay paso de elegir secciones y
 * fuentes — generar un informe nuevo solo pasa por el popup "Crear nuevo
 * informe" (nombre + plantilla opcional + prompt).
 */
export function ReportsScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('reports')
  const { customReports } = useOperationReports(opId)
  const [openCardId, setOpenCardId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  if (openCardId) {
    return <ReportDetail opId={opId} cardId={openCardId} onBack={() => setOpenCardId(null)} />
  }

  const cards: ReportCardInfo[] = [
    ...REPORT_TEMPLATES.map((tpl) => ({
      id: tpl.id,
      name: tpl.name,
      description: tpl.description,
      audience: tpl.audience,
    })),
    ...customReports.map((c) => ({ id: c.id, name: c.name, description: c.prompt })),
  ]

  return (
    <div className="u-stack">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={<AgentConfigButton opId={opId} agentId="reports" />}
      />

      <TemplateGallery cards={cards} onOpen={setOpenCardId} onCreateNew={() => setIsCreateOpen(true)} />

      {isCreateOpen && (
        <CreateReportModal
          opId={opId}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(cardId) => {
            setIsCreateOpen(false)
            setOpenCardId(cardId)
          }}
        />
      )}
    </div>
  )
}
