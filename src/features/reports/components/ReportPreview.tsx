import { useTranslation } from 'react-i18next'
import { Badge, Card, CardHeader } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { CitationChipGroup } from './CitationChip'
import type { GeneratedReport, ReportStatus } from '../types'
import './ReportPreview.css'

const STATUS_TONE: Record<ReportStatus, 'neutral' | 'success'> = {
  draft: 'neutral',
  final: 'success',
}

interface ReportPreviewProps {
  report: GeneratedReport
}

/** Paso 3 del flujo (guion §5.5): vista previa del borrador generado — un
 * bloque de texto formateado (no hace falta un editor enriquecido real),
 * con citas inline junto a cada párrafo o lista. */
export function ReportPreview({ report }: ReportPreviewProps) {
  const { t, i18n } = useTranslation('reports')

  return (
    <Card className="report-preview">
      <CardHeader
        title={report.title}
        subtitle={t('preview.meta', {
          version: report.version,
          date: formatDate(report.generatedAt, i18n.language as Locale),
          author: report.generatedBy,
        })}
        actions={<Badge tone={STATUS_TONE[report.status]}>{t(`status.${report.status}`)}</Badge>}
      />

      <div className="report-preview__body">
        {report.body.map((block, i) => {
          if (block.kind === 'heading') {
            return (
              <h3 key={i} className="report-preview__heading">
                {block.text}
              </h3>
            )
          }
          if (block.kind === 'paragraph') {
            return (
              <p key={i} className="report-preview__paragraph">
                {block.text}
                <CitationChipGroup ids={block.citationIds} citations={report.citations} />
              </p>
            )
          }
          return (
            <div key={i} className="report-preview__bullets-wrap">
              <ul className="report-preview__bullets">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
              <CitationChipGroup ids={block.citationIds} citations={report.citations} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
