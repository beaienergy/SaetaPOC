import { useTranslation } from 'react-i18next'
import { Eye } from 'lucide-react'
import { Badge, EmptyState } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { cn } from '@/shared/lib/utils'
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

/**
 * Historial de versiones de una tarjeta de informe (guion §5.5), como
 * columna izquierda del detalle (pedido explícito): fecha de creación +
 * botón "Ver" que expande el contenido a la derecha.
 */
export function VersionHistory({ reports, activeReportId, onView }: VersionHistoryProps) {
  const { t, i18n } = useTranslation('reports')
  const locale = i18n.language as Locale

  if (reports.length === 0) {
    return <EmptyState message={t('history.empty')} />
  }

  return (
    <ul className="version-history">
      {reports.map((report) => {
        const isActive = report.id === activeReportId
        return (
          <li key={report.id} className={cn('version-history__item', isActive && 'is-active')}>
            <div className="version-history__item-head">
              <span className="u-mono">v{report.version}</span>
              <Badge tone={STATUS_TONE[report.status]}>{t(`status.${report.status}`)}</Badge>
            </div>
            <span className="version-history__item-date">{formatDate(report.generatedAt, locale)}</span>
            <span className="version-history__item-author">{report.generatedBy}</span>
            <button
              type="button"
              className="version-history__item-view"
              onClick={() => onView(report.id)}
              aria-pressed={isActive}
            >
              <Eye size={13} aria-hidden />
              {isActive ? t('history.viewing') : t('history.view')}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
