import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { EmptyState, PageHeader, SegmentedControl, StatCard } from '@/shared/ui'
import type { SegmentedOption } from '@/shared/ui'
import {
  DocumentDetailModal,
  GapCard,
  useGaps,
  type GapStatus,
  type KbDocument,
} from '@/features/documents'
import './DocumentsGapsPage.css'

type StatusFilter = GapStatus | 'all'

/**
 * Gaps y contradicciones (guion §5.2.1, UC-05): las incidencias de la
 * operación agrupadas por estado, con el patrón de estado insuficiente
 * (§1.7) en las de documentación pendiente que siguen abiertas. Solstice
 * (operación cerrada, `openIssueCount: 0`) no debería mostrar nada en
 * "Abiertas" — es la propia mock data la que lo garantiza, no un caso
 * especial aquí.
 */
export default function DocumentsGapsPage() {
  const { t } = useTranslation('documents')
  const { opId = '' } = useParams()
  const gaps = useGaps(opId)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [activeDocument, setActiveDocument] = useState<KbDocument | null>(null)

  const counts = useMemo(
    () => ({
      open: gaps.filter((g) => g.status === 'open').length,
      resolved: gaps.filter((g) => g.status === 'resolved').length,
      dismissed: gaps.filter((g) => g.status === 'dismissed').length,
    }),
    [gaps],
  )

  const filtered = statusFilter === 'all' ? gaps : gaps.filter((g) => g.status === statusFilter)

  const filterOptions: SegmentedOption<StatusFilter>[] = [
    { value: 'all', label: t('gaps.filters.all'), count: gaps.length },
    { value: 'open', label: t('gaps.status.open'), count: counts.open },
    { value: 'resolved', label: t('gaps.status.resolved'), count: counts.resolved },
    { value: 'dismissed', label: t('gaps.status.dismissed'), count: counts.dismissed },
  ]

  return (
    <div className="u-stack">
      <PageHeader title={t('gaps.title')} subtitle={t('gaps.subtitle')} />

      <div className="gaps-page__stats">
        <StatCard
          label={t('gaps.stats.open')}
          value={counts.open}
          icon={<AlertTriangle size={16} aria-hidden />}
          iconTone="warning"
        />
        <StatCard
          label={t('gaps.stats.resolved')}
          value={counts.resolved}
          icon={<CheckCircle2 size={16} aria-hidden />}
          iconTone="success"
        />
        <StatCard
          label={t('gaps.stats.dismissed')}
          value={counts.dismissed}
          icon={<XCircle size={16} aria-hidden />}
          iconTone="info"
        />
      </div>

      <SegmentedControl
        options={filterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
        ariaLabel={t('gaps.filters.ariaLabel')}
      />

      {filtered.length === 0 ? (
        <EmptyState message={t('gaps.empty')} />
      ) : (
        <div className="u-stack">
          {filtered.map((issue) => (
            <GapCard key={issue.id} opId={opId} issue={issue} onOpenDocument={setActiveDocument} />
          ))}
        </div>
      )}

      {activeDocument && (
        <DocumentDetailModal document={activeDocument} onClose={() => setActiveDocument(null)} />
      )}
    </div>
  )
}
