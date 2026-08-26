import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardHeader, PageHeader } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import type { Citation, InsufficientDataState } from '@/shared/types/domain'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/utils'
import { useOverviewRegenerating, useOverviewSnapshot, useSummaryStore } from '../store/summaryStore'
import type { Milestone } from '../types'
import { CitationList } from './CitationList'
import { GeneratedMark } from './GeneratedMark'
import { InsufficientDataNote } from './InsufficientDataNote'
import './OverviewScreen.css'

/**
 * Overview / snapshot de la operación (guion §5.3.1, UC-02): ficha generada
 * por el sistema, cada campo con su cita o con el patrón "estado
 * insuficiente" (§1.7). Comparte `agentId="summary-overview"` con Hechos vs
 * conclusiones (§5.3.3) — decisión ya tomada en el guion §6.
 */
export function OverviewScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('summary')
  const snapshot = useOverviewSnapshot(opId)
  const isRegenerating = useOverviewRegenerating(opId)
  const regenerateOverview = useSummaryStore((s) => s.regenerateOverview)

  return (
    <div className="u-stack">
      <PageHeader
        title={t('overview.title')}
        subtitle={t('overview.subtitle')}
        actions={<AgentConfigButton opId={opId} agentId="summary-overview" />}
      />

      <Card className="overview-card">
        <CardHeader
          title={t('overview.snapshotTitle')}
          actions={
            <GeneratedMark
              generatedAt={snapshot.generatedAt}
              isRegenerating={isRegenerating}
              onRegenerate={() => regenerateOverview(opId)}
            />
          }
        />

        <div className="overview-fields">
          <SnapshotField
            label={t('overview.fields.perimeter')}
            hasValue={!!snapshot.perimeter.value}
            citations={snapshot.perimeter.citations}
            insufficient={snapshot.perimeter.insufficient}
            opId={opId}
          >
            <p className="overview-field__text">{snapshot.perimeter.value}</p>
          </SnapshotField>

          <SnapshotField
            label={t('overview.fields.parties')}
            hasValue={!!snapshot.parties.value?.length}
            citations={snapshot.parties.citations}
            insufficient={snapshot.parties.insufficient}
            opId={opId}
          >
            <ul className="overview-field__list">
              {snapshot.parties.value?.map((party) => <li key={party}>{party}</li>)}
            </ul>
          </SnapshotField>

          <SnapshotField
            label={t('overview.fields.milestones')}
            hasValue={!!snapshot.milestones.value?.length}
            citations={snapshot.milestones.citations}
            insufficient={snapshot.milestones.insufficient}
            opId={opId}
          >
            <MilestoneTimeline milestones={snapshot.milestones.value ?? []} />
          </SnapshotField>

          <SnapshotField
            label={t('overview.fields.status')}
            hasValue={!!snapshot.status.value}
            citations={snapshot.status.citations}
            insufficient={snapshot.status.insufficient}
            opId={opId}
          >
            <p className="overview-field__text">{snapshot.status.value}</p>
          </SnapshotField>

          <SnapshotField
            label={t('overview.fields.keyIssues')}
            hasValue={!!snapshot.keyIssuesHighlight.value?.length}
            citations={snapshot.keyIssuesHighlight.citations}
            insufficient={snapshot.keyIssuesHighlight.insufficient}
            opId={opId}
          >
            <ul className="overview-field__list">
              {snapshot.keyIssuesHighlight.value?.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
            <Link to={ROUTES.operationSummaryKeyIssues(opId)} className="overview-field__cta">
              {t('overview.viewKeyIssues')}
            </Link>
          </SnapshotField>
        </div>
      </Card>
    </div>
  )
}

function SnapshotField({
  label,
  hasValue,
  citations,
  insufficient,
  opId,
  children,
}: {
  label: string
  hasValue: boolean
  citations: Citation[]
  insufficient?: InsufficientDataState
  opId: string
  children: ReactNode
}) {
  return (
    <div className="overview-field">
      <div className="overview-field__label u-eyebrow">{label}</div>
      {hasValue && (
        <div className="overview-field__value">
          {children}
          <CitationList citations={citations} opId={opId} />
        </div>
      )}
      {insufficient && (
        <InsufficientDataNote reason={insufficient.reason} suggestedAction={insufficient.suggestedAction} />
      )}
    </div>
  )
}

function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const { i18n } = useTranslation('summary')
  const locale = i18n.language as Locale

  return (
    <ol className="milestone-timeline">
      {milestones.map((milestone) => (
        <li key={milestone.id} className={cn('milestone-timeline__item', `is-${milestone.status}`)}>
          <span className="milestone-timeline__dot" aria-hidden />
          <span className="milestone-timeline__label">{milestone.label}</span>
          <span className="milestone-timeline__date">{formatDateShort(milestone.date, locale)}</span>
        </li>
      ))}
    </ol>
  )
}
