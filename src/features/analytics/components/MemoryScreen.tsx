import { useTranslation } from 'react-i18next'
import { Check, X, RotateCcw, Sparkles } from 'lucide-react'
import { Badge, Button, Collapsible, EmptyState, Pill, StatCard, type BadgeTone } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { useAuthStore } from '@/features/auth'
import { DEFAULT_AGENT_CONFIGS } from '@/features/agent-config'
import { useMemoryProposals, useMemoryStore } from '../store/memoryStore'
import type { MemoryProposal, MemoryProposalStatus } from '../types'
import { CitationList } from './CitationChip'
import './MemoryScreen.css'

const STATUS_TONE: Record<MemoryProposalStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  reverted: 'steel',
}

/**
 * Long-term memory (guion §5.6.3) — la pantalla más importante de la POC: el
 * único sitio donde se ve completo el ciclo "usar → aprender → aprobar →
 * mejorar" (R-04). NO es `features/agent-config` (Skills = conocimiento
 * sembrado de antemano, editado a mano); esto es memoria que CRECE con el
 * uso real de los agentes, y nada se incorpora sin aprobación humana.
 */
export function MemoryScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('analytics')
  const proposals = useMemoryProposals(opId)
  const approve = useMemoryStore((s) => s.approve)
  const reject = useMemoryStore((s) => s.reject)
  const revert = useMemoryStore((s) => s.revert)
  const actor = useAuthStore((s) => s.user?.name) ?? 'You'

  const counts = {
    pending: proposals.filter((p) => p.status === 'pending').length,
    approved: proposals.filter((p) => p.status === 'approved').length,
    rejected: proposals.filter((p) => p.status === 'rejected').length,
    reverted: proposals.filter((p) => p.status === 'reverted').length,
  }

  if (proposals.length === 0) {
    return <EmptyState icon={<Sparkles size={28} aria-hidden />} message={t('memory.empty')} />
  }

  return (
    <div className="u-stack">
      <div className="memory-summary">
        <StatCard label={t('memory.status.pending')} value={counts.pending} iconTone="warning" />
        <StatCard label={t('memory.status.approved')} value={counts.approved} iconTone="success" />
        <StatCard label={t('memory.status.rejected')} value={counts.rejected} iconTone="danger" />
        <StatCard label={t('memory.status.reverted')} value={counts.reverted} iconTone="info" />
      </div>

      <div className="memory-list">
        {proposals.map((proposal) => (
          <MemoryCard
            key={proposal.id}
            opId={opId}
            proposal={proposal}
            onApprove={() => approve(opId, proposal.id, actor)}
            onReject={() => reject(opId, proposal.id, actor)}
            onRevert={() => revert(opId, proposal.id, actor)}
          />
        ))}
      </div>
    </div>
  )
}

function MemoryCard({
  opId,
  proposal,
  onApprove,
  onReject,
  onRevert,
}: {
  opId: string
  proposal: MemoryProposal
  onApprove: () => void
  onReject: () => void
  onRevert: () => void
}) {
  const { t, i18n } = useTranslation('analytics')
  const locale = i18n.language as Locale
  const originAgentName = DEFAULT_AGENT_CONFIGS[proposal.originAgentId]?.agentName ?? proposal.originAgentId

  return (
    <div className={`memory-card${proposal.status === 'pending' ? ' memory-card--pending' : ''}`}>
      <Collapsible
        strategy="mount"
        defaultOpen={proposal.status === 'pending'}
        title={<span className="memory-card__title">{proposal.title}</span>}
        meta={
          <span className="memory-card__head-badges">
            <Pill variant="outline">{proposal.category}</Pill>
            <Badge tone={STATUS_TONE[proposal.status]}>{t(`memory.status.${proposal.status}`)}</Badge>
          </span>
        }
      >
        <div className="memory-card__body">
          <div className="memory-card__meta">
            <span>
              {t('memory.originatedBy', { agent: originAgentName, conversation: proposal.originConversation })}
            </span>
            <span>· {formatDate(proposal.createdAt, locale)}</span>
          </div>

          <p className="memory-card__rationale">{proposal.rationale}</p>

          <div className="memory-diff">
            <div className="memory-diff__col memory-diff__col--before">
              <span className="memory-diff__label">{t('memory.before')}</span>
              {proposal.before ? proposal.before : <span className="memory-diff__empty">{t('memory.noPriorEntry')}</span>}
            </div>
            <div className="memory-diff__col memory-diff__col--after">
              <span className="memory-diff__label">{t('memory.after')}</span>
              {proposal.after}
            </div>
          </div>

          <div>
            <span className="memory-card__evidence-label">{t('memory.evidence')}</span>
            <CitationList citations={proposal.evidence} />
          </div>

          {proposal.status === 'pending' && (
            <div className="memory-card__actions">
              <Button variant="success" icon={<Check size={15} aria-hidden />} onClick={onApprove}>
                {t('memory.actions.approve')}
              </Button>
              <Button variant="ghost" icon={<X size={15} aria-hidden />} onClick={onReject}>
                {t('memory.actions.reject')}
              </Button>
            </div>
          )}
          {proposal.status === 'approved' && (
            <div className="memory-card__actions">
              <Button variant="ghost" icon={<RotateCcw size={15} aria-hidden />} onClick={onRevert}>
                {t('memory.actions.revert')}
              </Button>
            </div>
          )}

          <div className="memory-audit">
            <div className="memory-audit__title">{t('memory.auditTrail')}</div>
            {proposal.history.map((entry) => (
              <div key={entry.id} className="memory-audit__entry">
                <span>{t(`memory.auditAction.${entry.action}`)}</span>
                <span className="memory-audit__entry-actor">{entry.actor}</span>
                <span>· {formatDate(entry.at, locale)}</span>
                {entry.note && <span className="memory-audit__entry-note">— {entry.note}</span>}
              </div>
            ))}
          </div>
        </div>
      </Collapsible>
    </div>
  )
}
