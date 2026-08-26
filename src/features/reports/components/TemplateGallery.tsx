import { useTranslation } from 'react-i18next'
import { AlertTriangle, Check, ClipboardList, FileText, Landmark } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Pill } from '@/shared/ui'
import { REPORT_TEMPLATES } from '../api/mockReports'
import type { ReportTemplateId } from '../types'
import './TemplateGallery.css'

const TEMPLATE_ICON: Record<ReportTemplateId, typeof FileText> = {
  'executive-summary': FileText,
  'ic-memo': Landmark,
  'status-report': ClipboardList,
  'red-flag-summary': AlertTriangle,
}

interface TemplateGalleryProps {
  selectedId: ReportTemplateId | null
  onSelect: (id: ReportTemplateId) => void
}

/** Paso 1 del flujo (guion §5.5): elegir plantilla. */
export function TemplateGallery({ selectedId, onSelect }: TemplateGalleryProps) {
  const { t } = useTranslation('reports')

  return (
    <div className="report-template-grid">
      {REPORT_TEMPLATES.map((template) => {
        const Icon = TEMPLATE_ICON[template.id]
        const isSelected = template.id === selectedId
        return (
          <button
            key={template.id}
            type="button"
            className={cn('report-template-card', isSelected && 'is-selected')}
            onClick={() => onSelect(template.id)}
            aria-pressed={isSelected}
          >
            <div className="report-template-card__head">
              <span className="report-template-card__icon" aria-hidden>
                <Icon size={18} />
              </span>
              {isSelected && (
                <span className="report-template-card__check" aria-hidden>
                  <Check size={14} />
                </span>
              )}
            </div>
            <div className="report-template-card__name">{template.name}</div>
            <p className="report-template-card__desc">{template.description}</p>
            <div className="report-template-card__foot">
              <Pill variant="outline">{template.audience}</Pill>
              <span className="report-template-card__count">
                {t('templates.sectionsCount', { count: template.sections.length })}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
