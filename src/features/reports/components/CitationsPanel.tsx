import { useTranslation } from 'react-i18next'
import { Quote } from 'lucide-react'
import { Card, CardHeader, EmptyState } from '@/shared/ui'
import type { Citation } from '@/shared/types/domain'
import './CitationsPanel.css'

interface CitationsPanelProps {
  citations: Citation[]
}

/** Panel de citas junto a la vista previa (guion §5.5/§1.6): todas las
 * fuentes que respaldan el borrador activo, numeradas igual que los chips
 * "[n]" inline del cuerpo del informe. */
export function CitationsPanel({ citations }: CitationsPanelProps) {
  const { t } = useTranslation('reports')

  return (
    <Card className="citations-panel">
      <CardHeader title={t('citations.title')} icon={<Quote size={16} aria-hidden />} />
      {citations.length === 0 ? (
        <EmptyState message={t('citations.empty')} />
      ) : (
        <ul className="citations-panel__list">
          {citations.map((citation, i) => (
            <li key={citation.id} className="citations-panel__item">
              <span className="citations-panel__index">{i + 1}</span>
              <div className="citations-panel__body">
                <span className="citations-panel__doc">{citation.documentName}</span>
                <span className="citations-panel__locator">{citation.locator}</span>
                {citation.snippet && <p className="citations-panel__snippet">“{citation.snippet}”</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
