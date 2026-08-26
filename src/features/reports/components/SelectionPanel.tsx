import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { Button, Card, CardHeader, Checkbox, Pill } from '@/shared/ui'
import { sectionsFor } from '../api/mockReports'
import type { ReportDraftSelection, ReportSectionKey, ReportSourceOption, ReportTemplate } from '../types'
import './SelectionPanel.css'

interface SelectionPanelProps {
  template: ReportTemplate
  sources: ReportSourceOption[]
  draft: ReportDraftSelection
  isGenerating: boolean
  onToggleSection: (id: ReportSectionKey) => void
  onToggleSource: (id: string) => void
  onGenerate: () => void
  onChangeTemplate: () => void
}

/** Paso 2 del flujo (guion §5.5): elegir secciones y fuentes, y disparar la
 * generación del borrador. */
export function SelectionPanel({
  template,
  sources,
  draft,
  isGenerating,
  onToggleSection,
  onToggleSource,
  onGenerate,
  onChangeTemplate,
}: SelectionPanelProps) {
  const { t } = useTranslation('reports')
  const sections = sectionsFor(template.id)
  const canGenerate = draft.sectionIds.length > 0 && !isGenerating

  return (
    <Card className="report-selection">
      <CardHeader
        title={template.name}
        subtitle={template.description}
        actions={
          <Button variant="ghost" size="sm" onClick={onChangeTemplate}>
            {t('selection.changeTemplate')}
          </Button>
        }
      />

      <div className="report-selection__columns">
        <div className="report-selection__group">
          <div className="u-eyebrow">{t('selection.sectionsTitle')}</div>
          <ul className="report-selection__list">
            {sections.map((section) => (
              <li key={section.id} className="report-selection__item">
                <Checkbox
                  checked={draft.sectionIds.includes(section.id)}
                  onChange={() => onToggleSection(section.id)}
                  label={
                    <span className="report-selection__item-label">
                      <span className="report-selection__item-title">{section.title}</span>
                      <span className="report-selection__item-desc">{section.description}</span>
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="report-selection__group">
          <div className="u-eyebrow">{t('selection.sourcesTitle')}</div>
          <ul className="report-selection__list">
            {sources.map((source) => (
              <li key={source.id} className="report-selection__item">
                <Checkbox
                  checked={draft.sourceIds.includes(source.id)}
                  onChange={() => onToggleSource(source.id)}
                  label={
                    <span className="report-selection__item-label">
                      <span className="report-selection__item-title">{source.label}</span>
                      <Pill size="xs">{source.category}</Pill>
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="report-selection__footer">
        {draft.sectionIds.length === 0 && (
          <span className="report-selection__hint">{t('selection.noSectionsHint')}</span>
        )}
        <Button
          variant="primary"
          icon={<Sparkles size={15} aria-hidden />}
          loading={isGenerating}
          disabled={!canGenerate}
          onClick={onGenerate}
        >
          {isGenerating ? t('selection.generating') : t('selection.generate')}
        </Button>
      </div>
    </Card>
  )
}
