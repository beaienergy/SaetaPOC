import { useTranslation } from 'react-i18next'
import { History } from 'lucide-react'
import { Badge, CardHeader, DataTable, Pill } from '@/shared/ui'
import type { Column } from '@/shared/ui'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import type { GeneratedReport, ReportStatus } from '../types'
import './VersionHistory.css'

const STATUS_TONE: Record<ReportStatus, 'neutral' | 'success'> = {
  draft: 'neutral',
  final: 'success',
}

interface VersionHistoryProps {
  reports: GeneratedReport[]
  activeReportId: string | null
  onView: (reportId: string) => void
}

/** Historial de versiones de informes generados (guion §5.5). */
export function VersionHistory({ reports, activeReportId, onView }: VersionHistoryProps) {
  const { t, i18n } = useTranslation('reports')
  const locale = i18n.language as Locale

  const columns: Column<GeneratedReport>[] = [
    {
      key: 'title',
      header: t('history.columns.report'),
      render: (report) => (
        <span className="version-history__title">
          {report.title}
          {report.id === activeReportId && <Pill variant="accent">{t('history.viewing')}</Pill>}
        </span>
      ),
    },
    {
      key: 'version',
      header: t('history.columns.version'),
      align: 'center',
      width: '90px',
      sortValue: (report) => report.version,
      render: (report) => <span className="u-mono">v{report.version}</span>,
    },
    {
      key: 'status',
      header: t('history.columns.status'),
      width: '110px',
      render: (report) => <Badge tone={STATUS_TONE[report.status]}>{t(`status.${report.status}`)}</Badge>,
    },
    {
      key: 'generatedAt',
      header: t('history.columns.generated'),
      width: '160px',
      sortValue: (report) => new Date(report.generatedAt).getTime(),
      render: (report) => formatDateShort(report.generatedAt, locale),
    },
    {
      key: 'generatedBy',
      header: t('history.columns.author'),
      width: '170px',
      render: (report) => report.generatedBy,
    },
  ]

  return (
    <div className="version-history">
      <CardHeader title={t('history.title')} icon={<History size={16} aria-hidden />} />
      <DataTable
        columns={columns}
        data={reports}
        rowKey={(report) => report.id}
        onRowClick={(report) => onView(report.id)}
        emptyMessage={t('history.empty')}
        defaultSort={{ key: 'generatedAt', dir: 'desc' }}
      />
    </div>
  )
}
