import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { History } from 'lucide-react'
import { InfoHint, Modal, Pill } from '@/shared/ui'
import { formatBytes, formatDate, formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { CategoryBadge, DocumentStatusBadge } from './DocumentBadges'
import type { KbDocument } from '../types'
import './DocumentDetailModal.css'

/**
 * Panel de detalle de un documento (guion §5.2): metadatos, previsualización
 * (mock), historial de versiones y quién lo subió. Reutiliza `Modal` en vez
 * de construir un drawer nuevo — mismo patrón que el modal de config de
 * agente, y no hay otro componente de panel lateral en `shared/ui` todavía.
 */
export function DocumentDetailModal({ document, onClose }: { document: KbDocument; onClose: () => void }) {
  const { t, i18n } = useTranslation('documents')
  const { t: tCommon } = useTranslation('common')
  const locale = i18n.language as Locale

  return (
    <Modal title={document.name} onClose={onClose} maxWidth={640}>
      <section className="doc-detail__section">
        <div className="doc-detail__meta-grid">
          <MetaItem label={t('detail.category')}>
            <CategoryBadge category={document.category} />
          </MetaItem>
          <MetaItem label={t('detail.status')}>
            <DocumentStatusBadge status={document.status} />
          </MetaItem>
          <MetaItem label={t('detail.version')}>
            <span className="u-mono">{document.version}</span>
          </MetaItem>
          <MetaItem label={t('detail.size')}>{formatBytes(document.sizeBytes, locale)}</MetaItem>
          <MetaItem label={t('detail.uploadedAt')}>{formatDate(document.uploadedAt, locale)}</MetaItem>
          <MetaItem label={t('detail.uploadedBy')}>{document.uploadedBy}</MetaItem>
        </div>
      </section>

      <section className="doc-detail__section">
        <div className="doc-detail__section-head">
          <span className="doc-detail__section-title">{t('detail.preview')}</span>
          <span className="doc-detail__demo-flag">
            <Pill variant="outline" size="xs">
              {tCommon('demo.badge')}
            </Pill>
            <InfoHint text={tCommon('demo.hint')} />
          </span>
        </div>
        <p className="doc-detail__preview-box">{document.previewText}</p>
      </section>

      <section className="doc-detail__section">
        <div className="doc-detail__section-title doc-detail__section-title--icon">
          <History size={14} aria-hidden />
          {t('detail.versionHistory')}
        </div>
        <ul className="doc-detail__versions">
          {document.versions.map((entry) => (
            <li key={entry.version} className="doc-detail__version-row">
              <span className="u-mono doc-detail__version-tag">{entry.version}</span>
              <span className="doc-detail__version-date">{formatDateShort(entry.uploadedAt, locale)}</span>
              <span className="doc-detail__version-by">{entry.uploadedBy}</span>
              {entry.note && <span className="doc-detail__version-note">{entry.note}</span>}
            </li>
          ))}
        </ul>
      </section>
    </Modal>
  )
}

function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="doc-detail__meta-item">
      <span className="doc-detail__meta-label">{label}</span>
      <span className="doc-detail__meta-value">{children}</span>
    </div>
  )
}
