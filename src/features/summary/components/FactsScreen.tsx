import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Lightbulb, HelpCircle, ArrowRightCircle } from 'lucide-react'
import { Card, PageHeader } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { MOCK_FACTS } from '../api/mockFacts'
import type { FactItem, FactKind } from '../types'
import { CitationList } from './CitationList'
import './FactsScreen.css'

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
 */
export function FactsScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('summary')
  const board = MOCK_FACTS[opId]

  return (
    <div className="u-stack">
      <PageHeader
        title={t('facts.title')}
        subtitle={t('facts.subtitle')}
        actions={<AgentConfigButton opId={opId} agentId="summary-overview" />}
      />

      <div className="facts-board">
        {COLUMNS.map(({ kind, icon: Icon }) => (
          <div key={kind}>
            <div className="facts-column__head">
              <Icon size={15} aria-hidden />
              <span className="facts-column__title">{t(`facts.columns.${kind}`)}</span>
            </div>
            <p className="facts-column__hint">{t(`facts.hints.${kind}`)}</p>
            {(board?.[`${kind}s` as 'facts' | 'inferences' | 'hypotheses'] ?? []).map((item) => (
              <FactCard key={item.id} opId={opId} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function FactCard({ opId, item }: { opId: string; item: FactItem }) {
  const { t } = useTranslation('summary')
  const [converted, setConverted] = useState(false)

  return (
    <Card padded={false} className={`fact-item fact-item--${item.kind}`}>
      <div className="fact-item__body">
        <p className="fact-item__text">{item.text}</p>
        {item.note && <p className="fact-item__note">{item.note}</p>}
        <div className="fact-item__foot">
          <CitationList citations={item.citations} opId={opId} />
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
    </Card>
  )
}
