import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Lightbulb, HelpCircle, ArrowRightCircle, MessageSquareText, Pencil } from 'lucide-react'
import { Badge, Button, Card, PageHeader, SegmentedControl, Textarea } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { useFactsBoard, useSummaryStore } from '../store/summaryStore'
import type { FactItem, FactKind } from '../types'
import { FACT_KIND_TONE } from '../lib/tones'
import { CitationList } from './CitationList'
import { FactDiscussionModal } from './FactDiscussionModal'
import './FactsScreen.css'

type FactFilter = FactKind | 'all'

const COLUMNS: { kind: FactKind; icon: typeof CheckCircle2 }[] = [
  { kind: 'fact', icon: CheckCircle2 },
  { kind: 'inference', icon: Lightbulb },
  { kind: 'hypothesis', icon: HelpCircle },
]

/**
 * Hechos vs conclusiones (guion §5.3.3, UC-04): tres bloques separados
 * visualmente — Hechos, Inferencias, Hipótesis — cada uno citado. Comparte
 * `agentId="summary-overview"` con Overview (decisión ya tomada, guion §6):
 * probablemente la pantalla más "vendedora" del guardrail de no-fabricación.
 *
 * Filtro por tipo, edición manual y "discutir en el chat" son pedidos
 * explícitos añadidos sobre la versión original.
 */
export function FactsScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('summary')
  const board = useFactsBoard(opId)
  const [filter, setFilter] = useState<FactFilter>('all')
  const [discussingItem, setDiscussingItem] = useState<FactItem | null>(null)

  const counts: Record<FactKind, number> = {
    fact: board?.facts.length ?? 0,
    inference: board?.inferences.length ?? 0,
    hypothesis: board?.hypotheses.length ?? 0,
  }
  const visibleColumns = filter === 'all' ? COLUMNS : COLUMNS.filter((c) => c.kind === filter)

  return (
    <div className="u-stack">
      <PageHeader
        title={t('facts.title')}
        subtitle={t('facts.subtitle')}
        actions={<AgentConfigButton opId={opId} agentId="summary-overview" />}
      />

      <SegmentedControl<FactFilter>
        shape="box"
        ariaLabel={t('facts.filter.ariaLabel')}
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: t('facts.filter.all'), count: counts.fact + counts.inference + counts.hypothesis },
          { value: 'fact', label: t('facts.columns.fact'), count: counts.fact },
          { value: 'inference', label: t('facts.columns.inference'), count: counts.inference },
          { value: 'hypothesis', label: t('facts.columns.hypothesis'), count: counts.hypothesis },
        ]}
      />

      <div className="facts-board">
        {visibleColumns.map(({ kind, icon: Icon }) => (
          <div key={kind} className={`facts-column facts-column--${kind}`}>
            <div className="facts-column__head">
              <Icon size={15} aria-hidden />
              <span className="facts-column__title">{t(`facts.columns.${kind}`)}</span>
            </div>
            <p className="facts-column__hint">{t(`facts.hints.${kind}`)}</p>
            {(board?.[`${kind}s` as 'facts' | 'inferences' | 'hypotheses'] ?? []).map((item) => (
              <FactCard key={item.id} opId={opId} item={item} onDiscuss={() => setDiscussingItem(item)} />
            ))}
          </div>
        ))}
      </div>

      {discussingItem && (
        <FactDiscussionModal opId={opId} item={discussingItem} onClose={() => setDiscussingItem(null)} />
      )}
    </div>
  )
}

function FactCard({
  opId,
  item,
  onDiscuss,
}: {
  opId: string
  item: FactItem
  onDiscuss: () => void
}) {
  const { t } = useTranslation('summary')
  const { t: tCommon } = useTranslation('common')
  const updateFact = useSummaryStore((s) => s.updateFact)
  const [converted, setConverted] = useState(false)
  const [editing, setEditing] = useState(false)
  const [textDraft, setTextDraft] = useState(item.text)
  const [noteDraft, setNoteDraft] = useState(item.note ?? '')

  function startEdit() {
    setTextDraft(item.text)
    setNoteDraft(item.note ?? '')
    setEditing(true)
  }
  function save() {
    updateFact(opId, item.id, { text: textDraft.trim(), note: noteDraft.trim() || undefined })
    setEditing(false)
  }

  return (
    <Card padded={false} className={`fact-item fact-item--${item.kind}`}>
      <div className="fact-item__body">
        {editing ? (
          <div className="fact-item__editor">
            <Textarea rows={3} value={textDraft} onChange={(e) => setTextDraft(e.target.value)} autoFocus />
            <Textarea
              rows={2}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder={t('facts.notePlaceholder')}
            />
            <div className="fact-item__editor-actions">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                {tCommon('actions.cancel')}
              </Button>
              <Button variant="primary" size="sm" onClick={save}>
                {tCommon('actions.save')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="fact-item__head">
              <Badge tone={FACT_KIND_TONE[item.kind]}>{t(`facts.columns.${item.kind}`)}</Badge>
              <button
                type="button"
                className="fact-item__edit-btn"
                onClick={startEdit}
                aria-label={t('overview.editField')}
                title={t('overview.editField')}
              >
                <Pencil size={13} />
              </button>
            </div>
            <p className="fact-item__text">{item.text}</p>
            {item.note && <p className="fact-item__note">{item.note}</p>}
            <div className="fact-item__foot">
              <CitationList citations={item.citations} opId={opId} />
              <div className="fact-item__foot-actions">
                <button type="button" className="fact-item__discuss" onClick={onDiscuss}>
                  <MessageSquareText size={13} aria-hidden />
                  {t('facts.discussion.cta')}
                </button>
                {!converted ? (
                  <button type="button" className="fact-item__convert" onClick={() => setConverted(true)}>
                    <ArrowRightCircle size={13} aria-hidden />
                    {t('facts.convertToIssue')}
                  </button>
                ) : (
                  <span className="fact-item__converted">{t('facts.converted')}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
