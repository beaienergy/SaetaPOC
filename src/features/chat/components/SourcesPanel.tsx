import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FileText, PanelRightClose, PanelRightOpen, Quote } from 'lucide-react'
import { EmptyState } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'
import type { Citation } from '@/shared/types/domain'
import './SourcesPanel.css'

/**
 * Columna derecha del patron NotebookLM (guion §5.1) — reescrita a petición:
 * ya no es la lista completa de documentos de la operación con checkbox de
 * inclusión, sino solo las fuentes que el agente ha citado de verdad en la
 * conversación activa (una por documento, la primera vez que aparece).
 * Clicar una fuente lleva a Documentación — no hay deep-link a un documento
 * concreto porque `features/chat` y `features/documents` se construyeron en
 * paralelo con IDs de documento independientes (ver nota en `CitationChip`).
 * Comprimible hacia la derecha, igual que el historial hacia la izquierda.
 */
export function SourcesPanel({
  opId,
  citations,
  collapsed,
  onToggleCollapsed,
}: {
  opId: string
  citations: Citation[]
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  const { t } = useTranslation('chat')
  const navigate = useNavigate()

  if (collapsed) {
    return (
      <div className="sources-panel sources-panel--rail">
        <button
          type="button"
          className="sources-panel__rail-btn"
          onClick={onToggleCollapsed}
          aria-label={t('sources.expand')}
          title={t('sources.expand')}
        >
          <PanelRightOpen size={16} />
        </button>
        {citations.length > 0 && <span className="sources-panel__rail-count">{citations.length}</span>}
      </div>
    )
  }

  return (
    <div className="sources-panel">
      <div className="sources-panel__header">
        <span className="u-eyebrow">{t('sources.title')}</span>
        <button
          type="button"
          className="sources-panel__collapse-btn"
          onClick={onToggleCollapsed}
          aria-label={t('sources.collapse')}
          title={t('sources.collapse')}
        >
          <PanelRightClose size={15} />
        </button>
      </div>
      <p className="sources-panel__hint">
        {t('sources.hint')}
        {citations.length > 0 && ` ${t('sources.count', { count: citations.length })}.`}
      </p>

      {citations.length === 0 ? (
        <EmptyState icon={<Quote size={22} aria-hidden />} message={t('sources.empty')} />
      ) : (
        <div className="sources-panel__list">
          {citations.map((citation) => (
            <button
              key={citation.documentId}
              type="button"
              className="sources-panel__item"
              onClick={() => navigate(ROUTES.operationDocuments(opId))}
            >
              <span className="sources-panel__item-icon" aria-hidden>
                <FileText size={14} />
              </span>
              <span className="sources-panel__item-body">
                <span className="sources-panel__item-name">{citation.documentName}</span>
                <span className="sources-panel__item-locator">{citation.locator}</span>
              </span>
              <span className="sources-panel__item-cta">{t('sources.openInDocuments')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
