import { useTranslation } from 'react-i18next'
import { AlertTriangle, ClipboardList, FileText, Landmark, Plus, Sparkles } from 'lucide-react'
import { Pill } from '@/shared/ui'
import './TemplateGallery.css'

const PRESET_ICON: Record<string, typeof FileText> = {
  'executive-summary': FileText,
  'ic-memo': Landmark,
  'status-report': ClipboardList,
  'red-flag-summary': AlertTriangle,
}

export interface ReportCardInfo {
  id: string
  name: string
  description: string
  audience?: string
}

interface TemplateGalleryProps {
  cards: ReportCardInfo[]
  onOpen: (id: string) => void
  onCreateNew: () => void
}

/**
 * Tarjetas de informe (guion §5.5): las 4 plantillas fijas + una tarjeta por
 * cada informe "a medida" ya creado, más la tarjeta "+ Crear nuevo informe"
 * al final — pedido explícito, sustituye al antiguo paso 1 de "elegir
 * plantilla para configurar un borrador".
 */
export function TemplateGallery({ cards, onOpen, onCreateNew }: TemplateGalleryProps) {
  const { t } = useTranslation('reports')

  return (
    <div className="report-template-grid">
      {cards.map((card) => {
        const Icon = PRESET_ICON[card.id] ?? Sparkles
        return (
          <button key={card.id} type="button" className="report-template-card" onClick={() => onOpen(card.id)}>
            <span className="report-template-card__icon" aria-hidden>
              <Icon size={18} />
            </span>
            <div className="report-template-card__name">{card.name}</div>
            <p className="report-template-card__desc">{card.description}</p>
            {card.audience && (
              <div className="report-template-card__foot">
                <Pill variant="outline">{card.audience}</Pill>
              </div>
            )}
          </button>
        )
      })}

      <button type="button" className="report-template-card report-template-card--new" onClick={onCreateNew}>
        <span className="report-template-card__new-icon" aria-hidden>
          <Plus size={20} />
        </span>
        {t('create.cta')}
      </button>
    </div>
  )
}
