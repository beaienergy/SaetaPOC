import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { useDisclosure, useDismissable } from '@/shared/hooks'
import type { Citation } from '@/shared/types/domain'
import './CitationChip.css'

/**
 * Cita/fuente (guion §1.6): chip "[n]" clicable con preview del fragmento.
 * Vive en `features/analytics` y no en `shared/ui` porque, a fecha de este
 * grupo de pantallas, `features/documents` (donde vive el documento citado)
 * todavía no existe en el repo — en vez de enlazar a una ruta que no
 * resuelve, el chip abre un popover con el fragmento in-place. El día que
 * exista `features/documents`, este es el componente candidato a subir a
 * `shared/ui` y ganar un `onOpen` que navegue de verdad.
 */
export function CitationChip({ citation, index }: { citation: Citation; index: number }) {
  const { t } = useTranslation('analytics')
  const { isOpen, toggle, close } = useDisclosure()
  const ref = useDismissable<HTMLSpanElement>(isOpen, close)

  return (
    <span className="citation-chip" ref={ref}>
      <button
        type="button"
        className="citation-chip__trigger"
        aria-expanded={isOpen}
        aria-label={t('citation.label', { index: index + 1, document: citation.documentName })}
        onClick={toggle}
      >
        [{index + 1}]
      </button>
      {isOpen && (
        <span className="citation-chip__pop" role="tooltip">
          <span className="citation-chip__pop-head">
            <FileText size={13} aria-hidden />
            <span className="citation-chip__pop-doc">{citation.documentName}</span>
          </span>
          <span className="citation-chip__pop-locator">{citation.locator}</span>
          {citation.snippet && <p className="citation-chip__pop-snippet">"{citation.snippet}"</p>}
        </span>
      )}
    </span>
  )
}

export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null
  return (
    <span className="citation-list">
      {citations.map((c, i) => (
        <CitationChip key={c.id} citation={c} index={i} />
      ))}
    </span>
  )
}
