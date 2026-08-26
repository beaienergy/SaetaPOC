import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { getTemplate, MOCK_REPORT_SOURCES } from '../api/mockReports'
import { useOperationReports, useReportsStore } from '../store/reportsStore'
import { TemplateGallery } from './TemplateGallery'
import { SelectionPanel } from './SelectionPanel'
import { ReportPreview } from './ReportPreview'
import { CitationsPanel } from './CitationsPanel'
import { VersionHistory } from './VersionHistory'
import { ExportBar } from './ExportBar'
import './ReportsScreen.css'

/**
 * Informes (guion §5.5, UC-08): elegir plantilla → elegir secciones/fuentes →
 * generar borrador (simulado) → vista previa con panel de citas → historial
 * de versiones → exportar (mock).
 */
export function ReportsScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('reports')
  const { reports, draft, activeReportId, isGenerating } = useOperationReports(opId)
  const selectTemplate = useReportsStore((s) => s.selectTemplate)
  const clearTemplate = useReportsStore((s) => s.clearTemplate)
  const toggleSection = useReportsStore((s) => s.toggleSection)
  const toggleSource = useReportsStore((s) => s.toggleSource)
  const generateReport = useReportsStore((s) => s.generateReport)
  const viewReport = useReportsStore((s) => s.viewReport)

  const activeReport = reports.find((r) => r.id === activeReportId) ?? reports[0] ?? null
  const sources = MOCK_REPORT_SOURCES[opId] ?? []

  return (
    <div className="u-stack">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={<AgentConfigButton opId={opId} agentId="reports" />}
      />

      <div>
        <div className="reports-screen__section-title">{t('draftSectionTitle')}</div>
        {draft.templateId ? (
          <SelectionPanel
            template={getTemplate(draft.templateId)}
            sources={sources}
            draft={draft}
            isGenerating={isGenerating}
            onToggleSection={(id) => toggleSection(opId, id)}
            onToggleSource={(id) => toggleSource(opId, id)}
            onGenerate={() => generateReport(opId)}
            onChangeTemplate={() => clearTemplate(opId)}
          />
        ) : (
          <TemplateGallery selectedId={null} onSelect={(id) => selectTemplate(opId, id)} />
        )}
      </div>

      {activeReport && (
        <>
          <div className="reports-screen__preview-row">
            <ReportPreview report={activeReport} />
            <CitationsPanel citations={activeReport.citations} />
          </div>
          <ExportBar report={activeReport} />
        </>
      )}

      {reports.length > 0 && (
        <div>
          <div className="reports-screen__section-title">{t('history.title')}</div>
          <VersionHistory reports={reports} activeReportId={activeReport?.id ?? null} onView={(id) => viewReport(opId, id)} />
        </div>
      )}
    </div>
  )
}
