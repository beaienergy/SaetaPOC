import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { useDisclosure, useDismissable } from '@/shared/hooks'
import type { Citation } from '@/shared/types/domain'
import './CitationChip.css'

interface CitationChipProps {
  citation: Citation
  /** Posición dentro del panel de citas del informe activo (1-based). */
  index: number
}

/**
 * Chip de cita reutilizable (guion §1.6): "[n]" clicable con
 * tooltip/preview del fragmento citado — versión simplificada de "abre el
 * fragmento en Documentación" (Documentación todavía no existe como
 * pantalla real en este repo). Vive en `features/reports` porque es el
 * primer sitio de la POC que necesita citas inline; otra pantalla que las
 * necesite puede construir la suya sobre el mismo patrón.
 */
export function CitationChip({ citation, index }: CitationChipProps) {
  const { t } = useTranslation('reports')
  const { isOpen, close, toggle } = useDisclosure()
  const ref = useDismissable<HTMLSpanElement>(isOpen, close)

  return (
    <span ref={ref} className="citation-chip">
      <button
        type="button"
        className="citation-chip__trigger"
        aria-expanded={isOpen}
        aria-label={t('citations.open', { document: citation.documentName })}
        onClick={toggle}
      >
        [{index}]
      </button>
      {isOpen && (
        <span role="tooltip" className="citation-chip__pop">
          <span className="citation-chip__pop-doc">{citation.documentName}</span>
          <span className="citation-chip__pop-locator">{citation.locator}</span>
          {citation.snippet && <span className="citation-chip__pop-snippet">“{citation.snippet}”</span>}
        </span>
      )}
    </span>
  )
}

export function CitationChipGroup({
  ids,
  citations,
}: {
  ids: string[]
  citations: Citation[]
}) {
  const resolved = ids
    .map((id) => {
      const index = citations.findIndex((c) => c.id === id)
      return index === -1 ? null : { citation: citations[index], index: index + 1 }
    })
    .filter((v): v is { citation: Citation; index: number } => v !== null)

  if (resolved.length === 0) return null

  return (
    <span className={cn('citation-chip-group')}>
      {resolved.map(({ citation, index }) => (
        <CitationChip key={citation.id} citation={citation} index={index} />
      ))}
    </span>
  )
}
