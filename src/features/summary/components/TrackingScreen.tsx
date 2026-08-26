import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListTodo } from 'lucide-react'
import { Badge, DataTable, EmptyState, PageHeader, SegmentedControl, type Column } from '@/shared/ui'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { useOperationTracking, useSummaryStore } from '../store/summaryStore'
import type { SellerQuestion, TrackingAction, TrackingActionStatus } from '../types'
import { QUESTION_STATUS_TONE, TRACKING_STATUS_TONE } from '../lib/tones'
import { CitationList } from './CitationList'
import { PhaseIndicator } from './PhaseIndicator'
import { StatusBadgeMenu, type StatusMenuOption } from './StatusBadgeMenu'
import './TrackingScreen.css'

type Tab = 'actions' | 'questions'

const ACTION_STATUSES: TrackingActionStatus[] = ['pending', 'in-progress', 'done']

/**
 * Seguimiento de la operación (guion §5.3.4, UC-06): tablero de acciones
 * pendientes + banco de preguntas para vendedor/asesores como pestaña dentro
 * de la misma vista (sin ruta propia). Sin tracker de etapas de la propuesta
 * comercial disponible en este repo — se sustituye por `PhaseIndicator`.
 */
export function TrackingScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('summary')
  const tracking = useOperationTracking(opId)
  const updateActionStatus = useSummaryStore((s) => s.updateActionStatus)
  const updateQuestionStatus = useSummaryStore((s) => s.updateQuestionStatus)
  const [tab, setTab] = useState<Tab>('actions')

  const statusOptions: StatusMenuOption<TrackingActionStatus>[] = ACTION_STATUSES.map((status) => ({
    value: status,
    label: t(`tracking.status.${status}`),
    tone: TRACKING_STATUS_TONE[status],
  }))

  const columns: Column<TrackingAction>[] = [
    {
      key: 'action',
      header: t('tracking.columns.action'),
      sortValue: (a) => a.action,
      render: (a) => a.action,
    },
    { key: 'owner', header: t('tracking.columns.owner'), sortValue: (a) => a.owner, render: (a) => a.owner },
    {
      key: 'dueDate',
      header: t('tracking.columns.dueDate'),
      sortValue: (a) => new Date(a.dueDate).getTime(),
      render: (a) => <DueDate date={a.dueDate} />,
    },
    {
      key: 'status',
      header: t('tracking.columns.status'),
      render: (a) => (
        <StatusBadgeMenu
          value={a.status}
          options={statusOptions}
          onChange={(status) => updateActionStatus(opId, a.id, status)}
          ariaLabel={t('tracking.columns.status')}
        />
      ),
    },
  ]

  return (
    <div className="u-stack">
      <PageHeader title={t('tracking.title')} subtitle={t('tracking.subtitle')} />

      <div className="tracking-head">
        <PhaseIndicator phase={tracking.phase} />
        <SegmentedControl<Tab>
          shape="box"
          ariaLabel={t('tracking.tabs.ariaLabel')}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'actions', label: t('tracking.tabs.actions'), count: tracking.actions.length },
            { value: 'questions', label: t('tracking.tabs.questions'), count: tracking.questions.length },
          ]}
        />
      </div>

      {tab === 'actions' ? (
        <DataTable
          columns={columns}
          data={tracking.actions}
          rowKey={(a) => a.id}
          emptyIcon={<ListTodo size={28} aria-hidden />}
          emptyMessage={t('tracking.actionsEmpty')}
          minWidth={720}
        />
      ) : tracking.questions.length === 0 ? (
        <EmptyState message={t('tracking.questionsEmpty')} />
      ) : (
        <div className="question-list">
          {tracking.questions.map((q) => (
            <QuestionCard key={q.id} opId={opId} question={q} onStatusChange={updateQuestionStatus} />
          ))}
        </div>
      )}
    </div>
  )
}

function DueDate({ date }: { date: string }) {
  const { i18n } = useTranslation('summary')
  return <span>{formatDateShort(date, i18n.language as Locale)}</span>
}

function QuestionCard({
  opId,
  question,
  onStatusChange,
}: {
  opId: string
  question: SellerQuestion
  onStatusChange: (opId: string, questionId: string, status: SellerQuestion['status']) => void
}) {
  const { t } = useTranslation('summary')

  return (
    <div className="question-card">
      <div className="question-card__head">
        <div>
          <span className="question-card__topic">{question.topic}</span>
          <p className="question-card__text">{question.question}</p>
        </div>
        <button
          type="button"
          className="question-card__status-btn"
          onClick={() =>
            onStatusChange(opId, question.id, question.status === 'pending' ? 'answered' : 'pending')
          }
          aria-label={t('tracking.toggleStatus')}
        >
          <Badge tone={QUESTION_STATUS_TONE[question.status]}>{t(`tracking.questionStatus.${question.status}`)}</Badge>
        </button>
      </div>

      <CitationList citations={question.evidence} opId={opId} />

      {question.draftAnswer && (
        <div className="question-card__answer">
          <span className="question-card__answer-label">{t('tracking.draftAnswer')}</span>
          {question.draftAnswer}
        </div>
      )}
    </div>
  )
}
