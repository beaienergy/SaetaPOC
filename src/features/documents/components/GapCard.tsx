import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, FileX, ShieldCheck, UploadCloud, UserRound, X } from 'lucide-react'
import { Button, Collapsible, InsufficientDataBanner } from '@/shared/ui'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { sleep } from '@/shared/lib/utils'
import { useDocumentById, useDocumentsStore } from '../store/documentsStore'
import { GapSeverityBadge, GapStatusBadge, GapTypeIcon } from './GapBadges'
import type { AffectedDocumentRef, GapIssue, KbDocument } from '../types'
import './GapCard.css'

function AffectedDocumentChip({
  opId,
  reference,
  onOpenDocument,
}: {
  opId: string
  reference: AffectedDocumentRef
  onOpenDocument: (doc: KbDocument) => void
}) {
  const { t } = useTranslation('documents')
  const doc = useDocumentById(opId, reference.documentId)

  if (doc) {
    return (
      <button type="button" className="gap-card__doc-chip" onClick={() => onOpenDocument(doc)}>
        {doc.name}
      </button>
    )
  }
  return (
    <span className="gap-card__doc-chip gap-card__doc-chip--missing" title={t('gaps.notUploaded')}>
      <FileX size={12} aria-hidden />
      {reference.documentName}
    </span>
  )
}

/**
 * Una incidencia de Gaps y contradicciones (guion §5.2.1, UC-05): descripción,
 * documentos afectados (enlazados si existen en el dataroom), severidad y
 * estado. Las de tipo "documentación pendiente" y todavía abiertas usan el
 * patrón de estado insuficiente (§1.7) con la acción de solicitar la
 * documentación.
 */
export function GapCard({
  opId,
  issue,
  onOpenDocument,
}: {
  opId: string
  issue: GapIssue
  onOpenDocument: (doc: KbDocument) => void
}) {
  const { t, i18n } = useTranslation('documents')
  const locale = i18n.language as Locale
  const setGapStatus = useDocumentsStore((s) => s.setGapStatus)

  const [pendingAction, setPendingAction] = useState<'docs' | 'human' | null>(null)
  const [requestSent, setRequestSent] = useState<'docs' | 'human' | null>(null)

  async function requestDocumentation() {
    setPendingAction('docs')
    await sleep(900)
    setPendingAction(null)
    setRequestSent('docs')
  }

  async function requestHuman() {
    setPendingAction('human')
    await sleep(900)
    setPendingAction(null)
    setRequestSent('human')
  }

  function markResolved() {
    setGapStatus(
      opId,
      issue.id,
      'resolved',
      t('gaps.resolvedNote', { date: formatDateShort(new Date().toISOString(), locale) }),
    )
  }

  function dismiss() {
    setGapStatus(
      opId,
      issue.id,
      'dismissed',
      t('gaps.dismissedNote', { date: formatDateShort(new Date().toISOString(), locale) }),
    )
  }

  const isOpen = issue.status === 'open'

  return (
    <Collapsible
      className="gap-card"
      defaultOpen={isOpen}
      icon={<GapTypeIcon type={issue.type} />}
      title={<span className="gap-card__title">{issue.title}</span>}
      meta={
        <span className="gap-card__meta">
          <GapSeverityBadge severity={issue.severity} />
          <GapStatusBadge status={issue.status} />
        </span>
      }
    >
      <p className="gap-card__description">{issue.description}</p>

      <div className="gap-card__row">
        <span className="u-eyebrow">{t('gaps.affectedDocuments')}</span>
        <div className="gap-card__docs">
          {issue.affectedDocuments.map((ref, index) => (
            <AffectedDocumentChip
              key={ref.documentId ?? `${issue.id}-missing-${index}`}
              opId={opId}
              reference={ref}
              onOpenDocument={onOpenDocument}
            />
          ))}
        </div>
      </div>

      <div className="gap-card__row gap-card__row--inline">
        <span className="u-eyebrow">{t('gaps.detected')}</span>
        <span className="gap-card__detected-date">{formatDateShort(issue.detectedAt, locale)}</span>
      </div>

      {issue.resolutionNote && (
        <p className="gap-card__resolution">
          <ShieldCheck size={13} aria-hidden />
          {issue.resolutionNote}
        </p>
      )}

      {issue.type === 'missing_documentation' && isOpen && (
        <InsufficientDataBanner
          className="gap-card__insufficient"
          message={t('gaps.insufficientMessage')}
          hint={t('gaps.insufficientHint')}
          primaryAction={{
            label: requestSent === 'docs' ? t('gaps.requestSent') : t('gaps.requestDocumentation'),
            icon: <UploadCloud size={14} aria-hidden />,
            loading: pendingAction === 'docs',
            onClick: requestDocumentation,
          }}
          secondaryAction={{
            label: requestSent === 'human' ? t('gaps.requestSent') : t('gaps.requestHuman'),
            icon: <UserRound size={14} aria-hidden />,
            loading: pendingAction === 'human',
            onClick: requestHuman,
          }}
        />
      )}

      {isOpen && (
        <div className="gap-card__actions">
          <Button variant="success" size="sm" icon={<Check size={14} aria-hidden />} onClick={markResolved}>
            {t('gaps.markResolved')}
          </Button>
          <Button variant="ghost" size="sm" icon={<X size={14} aria-hidden />} onClick={dismiss}>
            {t('gaps.dismiss')}
          </Button>
        </div>
      )}
    </Collapsible>
  )
}
