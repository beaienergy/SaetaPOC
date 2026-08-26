import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Button, Input, LabeledField, Modal, Textarea } from '@/shared/ui'
import { useSummaryStore } from '../store/summaryStore'
import type { KeyIssue, KeyIssueStatus } from '../types'
import { KEY_ISSUE_STATUS_TONE, SEVERITY_TONE } from '../lib/tones'
import { CitationList } from './CitationList'
import { StatusBadgeMenu, type StatusMenuOption } from './StatusBadgeMenu'
import './KeyIssueDrawer.css'

const KEY_ISSUE_STATUSES: KeyIssueStatus[] = ['open', 'mitigated', 'escalated']

/**
 * Detalle de una fila de la Key Issue List (guion §5.3.2): fila
 * expandible/drawer, edición inline de responsable y mitigación, y el mismo
 * badge de estado editable que la tabla.
 */
export function KeyIssueDrawer({
  opId,
  issue,
  onClose,
}: {
  opId: string
  issue: KeyIssue
  onClose: () => void
}) {
  const { t } = useTranslation('summary')
  const { t: tCommon } = useTranslation('common')
  const updateIssue = useSummaryStore((s) => s.updateIssue)
  const [owner, setOwner] = useState(issue.owner)
  const [mitigation, setMitigation] = useState(issue.mitigation)

  const statusOptions: StatusMenuOption<KeyIssueStatus>[] = KEY_ISSUE_STATUSES.map((status) => ({
    value: status,
    label: t(`keyIssues.status.${status}`),
    tone: KEY_ISSUE_STATUS_TONE[status],
  }))

  const dirty = owner !== issue.owner || mitigation !== issue.mitigation

  function handleSave() {
    updateIssue(opId, issue.id, { owner, mitigation })
    onClose()
  }

  return (
    <Modal title={issue.risk} onClose={onClose} maxWidth={560}>
      <div className="key-issue-drawer">
        <div className="key-issue-drawer__row">
          <span className="u-eyebrow">{t('keyIssues.columns.impact')}</span>
          <Badge tone={SEVERITY_TONE[issue.impact]}>{t(`keyIssues.impact.${issue.impact}`)}</Badge>
        </div>

        <div className="key-issue-drawer__row">
          <span className="u-eyebrow">{t('keyIssues.columns.status')}</span>
          <StatusBadgeMenu
            value={issue.status}
            options={statusOptions}
            onChange={(status) => updateIssue(opId, issue.id, { status })}
            ariaLabel={t('keyIssues.columns.status')}
          />
        </div>

        <div className="key-issue-drawer__row">
          <span className="u-eyebrow">{t('keyIssues.columns.evidence')}</span>
          <CitationList citations={issue.evidence} opId={opId} />
        </div>

        <LabeledField label={t('keyIssues.columns.owner')}>
          <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
        </LabeledField>

        <LabeledField label={t('keyIssues.columns.mitigation')}>
          <Textarea rows={4} value={mitigation} onChange={(e) => setMitigation(e.target.value)} />
        </LabeledField>

        <div className="key-issue-drawer__actions">
          <Button variant="ghost" onClick={onClose}>
            {tCommon('actions.cancel')}
          </Button>
          <Button variant="primary" disabled={!dirty} onClick={handleSave}>
            {tCommon('actions.save')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
