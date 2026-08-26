import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, FileText } from 'lucide-react'
import { EmptyState, PageHeader } from '@/shared/ui'
import { REPORT_TEMPLATES } from '../api/mockReports'
import { useOperationReports } from '../store/reportsStore'
import { ReportPreview } from './ReportPreview'
import { ExportBar } from './ExportBar'
import { VersionHistory } from './VersionHistory'
import './ReportDetail.css'

/**
 * Detalle de una tarjeta de informe (guion §5.5, pedido explícito): historial
 * a la izquierda con fecha de creación, contenido expandido + exportar a la
 * derecha una vez se pulsa "Ver" en una versión.
 */
export function ReportDetail({
  opId,
  cardId,
  onBack,
}: {
  opId: string
  cardId: string
  onBack: () => void
}) {
  const { t } = useTranslation('reports')
  const { reports, customReports } = useOperationReports(opId)

  const preset = REPORT_TEMPLATES.find((tpl) => tpl.id === cardId)
  const custom = customReports.find((c) => c.id === cardId)
  const cardReports = reports
    .filter((r) => r.templateId === cardId)
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())

  const [activeReportId, setActiveReportId] = useState<string | null>(cardReports[0]?.id ?? null)
  const activeReport = cardReports.find((r) => r.id === activeReportId) ?? null

  return (
    <div className="u-stack">
      <button type="button" className="report-detail__back" onClick={onBack}>
        <ArrowLeft size={15} aria-hidden />
        {t('detail.back')}
      </button>

      <PageHeader title={preset?.name ?? custom?.name ?? ''} subtitle={preset?.description ?? custom?.prompt} />

      <div className="report-detail__layout">
        <div className="report-detail__history">
          <span className="u-eyebrow">{t('history.title')}</span>
          <VersionHistory reports={cardReports} activeReportId={activeReportId} onView={setActiveReportId} />
        </div>

        <div className="report-detail__content">
          {activeReport ? (
            <>
              <ReportPreview report={activeReport} />
              <ExportBar report={activeReport} />
            </>
          ) : (
            <EmptyState icon={<FileText size={28} aria-hidden />} message={t('detail.selectHint')} />
          )}
        </div>
      </div>
    </div>
  )
}
