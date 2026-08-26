import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { Button, Card, CardHeader, PageHeader, Textarea } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import type { Citation, InsufficientDataState } from '@/shared/types/domain'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/utils'
import { useOverviewRegenerating, useOverviewSnapshot, useSummaryStore } from '../store/summaryStore'
import type { Milestone, SnapshotField as SnapshotFieldT } from '../types'
import { CitationList } from './CitationList'
import { GeneratedMark } from './GeneratedMark'
import { InsufficientDataNote } from './InsufficientDataNote'
import './OverviewScreen.css'

/**
 * Overview / snapshot de la operación (guion §5.3.1, UC-02): ficha generada
 * por el sistema, cada campo con su cita o con el patrón "estado
 * insuficiente" (§1.7). Comparte `agentId="summary-overview"` con Hechos vs
 * conclusiones (§5.3.3) — decisión ya tomada en el guion §6.
 *
 * Los 4 campos de texto/lista son editables a mano (lapicito, pedido
 * explícito): un valor editado sustituye tanto al insuficiente como a la cita
 * — es la persona, no el agente, la fuente de ese dato a partir de ahí.
 */
export function OverviewScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('summary')
  const snapshot = useOverviewSnapshot(opId)
  const isRegenerating = useOverviewRegenerating(opId)
  const regenerateOverview = useSummaryStore((s) => s.regenerateOverview)
  const updateOverviewText = useSummaryStore((s) => s.updateOverviewText)
  const updateOverviewList = useSummaryStore((s) => s.updateOverviewList)

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
          <TextField
            label={t('overview.fields.perimeter')}
            field={snapshot.perimeter}
            opId={opId}
            onSave={(value) => updateOverviewText(opId, 'perimeter', value)}
          />

          <ListField
            label={t('overview.fields.parties')}
            field={snapshot.parties}
            opId={opId}
            onSave={(value) => updateOverviewList(opId, 'parties', value)}
          />

          <SnapshotField
            label={t('overview.fields.milestones')}
            hasValue={!!snapshot.milestones.value?.length}
            citations={snapshot.milestones.citations}
            insufficient={snapshot.milestones.insufficient}
            opId={opId}
          >
            <MilestoneTimeline milestones={snapshot.milestones.value ?? []} />
          </SnapshotField>

          <TextField
            label={t('overview.fields.status')}
            field={snapshot.status}
            opId={opId}
            onSave={(value) => updateOverviewText(opId, 'status', value)}
          />

          <ListField
            label={t('overview.fields.keyIssues')}
            field={snapshot.keyIssuesHighlight}
            opId={opId}
            onSave={(value) => updateOverviewList(opId, 'keyIssuesHighlight', value)}
            footer={
              <Link to={ROUTES.operationSummaryKeyIssues(opId)} className="overview-field__cta">
                {t('overview.viewKeyIssues')}
              </Link>
            }
          />
        </div>
      </Card>
    </div>
  )
}

function FieldShell({
  label,
  onEdit,
  children,
}: {
  label: string
  onEdit?: () => void
  children: ReactNode
}) {
  const { t } = useTranslation('summary')
  return (
    <div className="overview-field">
      <div className="overview-field__label-row">
        <div className="overview-field__label u-eyebrow">{label}</div>
        {onEdit && (
          <button
            type="button"
            className="overview-field__edit-btn"
            onClick={onEdit}
            aria-label={t('overview.editField')}
            title={t('overview.editField')}
          >
            <Pencil size={13} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function EditorActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  const { t: tCommon } = useTranslation('common')
  return (
    <div className="overview-field__editor-actions">
      <Button variant="ghost" size="sm" onClick={onCancel}>
        {tCommon('actions.cancel')}
      </Button>
      <Button variant="primary" size="sm" onClick={onSave}>
        {tCommon('actions.save')}
      </Button>
    </div>
  )
}

function TextField({
  label,
  field,
  opId,
  onSave,
}: {
  label: string
  field: SnapshotFieldT<string>
  opId: string
  onSave: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(field.value ?? '')

  function startEdit() {
    setDraft(field.value ?? '')
    setEditing(true)
  }
  function save() {
    onSave(draft.trim())
    setEditing(false)
  }

  return (
    <FieldShell label={label} onEdit={editing ? undefined : startEdit}>
      {editing ? (
        <div className="overview-field__editor">
          <Textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
          <EditorActions onCancel={() => setEditing(false)} onSave={save} />
        </div>
      ) : field.value ? (
        <div className="overview-field__value">
          <p className="overview-field__text">{field.value}</p>
          <CitationList citations={field.citations} opId={opId} />
        </div>
      ) : (
        field.insufficient && (
          <InsufficientDataNote reason={field.insufficient.reason} suggestedAction={field.insufficient.suggestedAction} />
        )
      )}
    </FieldShell>
  )
}

function ListField({
  label,
  field,
  opId,
  onSave,
  footer,
}: {
  label: string
  field: SnapshotFieldT<string[]>
  opId: string
  onSave: (value: string[]) => void
  footer?: ReactNode
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState((field.value ?? []).join('\n'))

  function startEdit() {
    setDraft((field.value ?? []).join('\n'))
    setEditing(true)
  }
  function save() {
    onSave(
      draft
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    setEditing(false)
  }

  return (
    <FieldShell label={label} onEdit={editing ? undefined : startEdit}>
      {editing ? (
        <div className="overview-field__editor">
          <Textarea rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
          <EditorActions onCancel={() => setEditing(false)} onSave={save} />
        </div>
      ) : field.value?.length ? (
        <div className="overview-field__value">
          <ul className="overview-field__list">
            {field.value.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <CitationList citations={field.citations} opId={opId} />
          {footer}
        </div>
      ) : (
        field.insufficient && (
          <InsufficientDataNote reason={field.insufficient.reason} suggestedAction={field.insufficient.suggestedAction} />
        )
      )}
    </FieldShell>
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
