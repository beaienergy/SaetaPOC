import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, ListChecks, Sparkles } from 'lucide-react'
import { Badge, Button, DataTable, PageHeader, type Column } from '@/shared/ui'
import { downloadCsv } from '@/shared/lib/utils'
import { AgentConfigButton } from '@/features/agent-config'
import {
  useKeyIssues,
  useKeyIssuesGenerating,
  useSummaryStore,
} from '../store/summaryStore'
import type { KeyIssue, KeyIssueStatus } from '../types'
import { KEY_ISSUE_STATUS_TONE, SEVERITY_TONE } from '../lib/tones'
import { CitationList } from './CitationList'
import { StatusBadgeMenu, type StatusMenuOption } from './StatusBadgeMenu'
import { KeyIssueDrawer } from './KeyIssueDrawer'
import './KeyIssuesScreen.css'

const KEY_ISSUE_STATUSES: KeyIssueStatus[] = ['open', 'mitigated', 'escalated']

/**
 * Key Issue List (guion §5.3.2, UC-03): tabla + "Generar borrador"
 * (simulado) + fila con drawer de detalle + badges de estado editables
 * inline + exportar (mock, CSV real vía `downloadCsv`).
 */
export function KeyIssuesScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('summary')
  const issues = useKeyIssues(opId)
  const isGenerating = useKeyIssuesGenerating(opId)
  const generateDraft = useSummaryStore((s) => s.generateKeyIssuesDraft)
  const updateIssueStatus = useSummaryStore((s) => s.updateIssueStatus)
  const [openIssueId, setOpenIssueId] = useState<string | null>(null)
  const openIssue = openIssueId ? (issues.find((issue) => issue.id === openIssueId) ?? null) : null

  const statusOptions: StatusMenuOption<KeyIssueStatus>[] = KEY_ISSUE_STATUSES.map((status) => ({
    value: status,
    label: t(`keyIssues.status.${status}`),
    tone: KEY_ISSUE_STATUS_TONE[status],
  }))

  function handleExport() {
    const header = ['Risk', 'Evidence', 'Impact', 'Owner', 'Mitigation', 'Status']
    const rows = issues.map((issue) => [
      issue.risk,
      issue.evidence.map((c) => `${c.documentName} (${c.locator})`).join('; '),
      issue.impact,
      issue.owner,
      issue.mitigation,
      issue.status,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    downloadCsv(`key-issue-list-${opId}.csv`, csv)
  }

  const columns: Column<KeyIssue>[] = [
    {
      key: 'risk',
      header: t('keyIssues.columns.risk'),
      sortValue: (issue) => issue.risk,
      render: (issue) => <span className="key-issues__risk">{issue.risk}</span>,
    },
    {
      key: 'evidence',
      header: t('keyIssues.columns.evidence'),
      render: (issue) => <CitationList citations={issue.evidence} opId={opId} />,
    },
    {
      key: 'impact',
      header: t('keyIssues.columns.impact'),
      sortValue: (issue) => issue.impact,
      render: (issue) => <Badge tone={SEVERITY_TONE[issue.impact]}>{t(`keyIssues.impact.${issue.impact}`)}</Badge>,
    },
    {
      key: 'owner',
      header: t('keyIssues.columns.owner'),
      sortValue: (issue) => issue.owner,
      render: (issue) => issue.owner,
    },
    {
      key: 'mitigation',
      header: t('keyIssues.columns.mitigation'),
      render: (issue) => <span className="key-issues__mitigation u-clamp-2">{issue.mitigation}</span>,
    },
    {
      key: 'status',
      header: t('keyIssues.columns.status'),
      sortValue: (issue) => issue.status,
      render: (issue) => (
        <StatusBadgeMenu
          value={issue.status}
          options={statusOptions}
          onChange={(status) => updateIssueStatus(opId, issue.id, status)}
          ariaLabel={t('keyIssues.columns.status')}
        />
      ),
    },
  ]

  return (
    <div className="u-stack">
      <PageHeader
        title={t('keyIssues.title')}
        subtitle={t('keyIssues.subtitle')}
        actions={
          <>
            <Button variant="ghost" icon={<Download size={15} aria-hidden />} onClick={handleExport}>
              {t('keyIssues.actions.export')}
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles size={15} aria-hidden />}
              loading={isGenerating}
              onClick={() => generateDraft(opId)}
            >
              {t('keyIssues.actions.generate')}
            </Button>
            <AgentConfigButton opId={opId} agentId="key-issues" />
          </>
        }
      />

      <DataTable
        columns={columns}
        data={issues}
        rowKey={(issue) => issue.id}
        onRowClick={(issue) => setOpenIssueId(issue.id)}
        isLoading={isGenerating}
        emptyIcon={<ListChecks size={28} aria-hidden />}
        emptyMessage={t('keyIssues.empty')}
        minWidth={860}
      />

      {openIssue && <KeyIssueDrawer opId={opId} issue={openIssue} onClose={() => setOpenIssueId(null)} />}
    </div>
  )
}
