import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { useDismissable } from '@/shared/hooks'
import { ROUTES } from '@/shared/config/routes'
import type { Citation } from '@/shared/types/domain'
import './CitationList.css'

/**
 * Cita/fuente (guion §1.6): chip "[1]" clicable con tooltip/preview del
 * fragmento, presente en toda pantalla con output de IA. Componente pequeño y
 * reutilizable para no duplicar la lógica en cada una de las 4 pantallas de
 * Resumen — el enlace "ver fuente" lleva a Documentación (`documents` no
 * expone todavía una vista de fragmento único, así que apunta a la lista).
 */
export function CitationList({
  citations,
  opId,
  className,
}: {
  citations: Citation[]
  opId: string
  className?: string
}) {
  if (citations.length === 0) return null

  return (
    <span className={cn('citation-list', className)}>
      {citations.map((citation, index) => (
        <CitationChip key={citation.id} citation={citation} index={index + 1} opId={opId} />
      ))}
    </span>
  )
}

function CitationChip({ citation, index, opId }: { citation: Citation; index: number; opId: string }) {
  const { t } = useTranslation('summary')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useDismissable<HTMLSpanElement>(isOpen, () => setIsOpen(false))

  return (
    <span className="citation-chip" ref={ref}>
      <button
        type="button"
        className="citation-chip__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label={t('citation.trigger', { document: citation.documentName })}
        title={citation.documentName}
      >
        [{index}]
      </button>
      {isOpen && (
        <span className="citation-chip__pop" role="dialog" aria-label={citation.documentName}>
          <span className="citation-chip__doc">{citation.documentName}</span>
          <span className="citation-chip__locator">{citation.locator}</span>
          {citation.snippet && <span className="citation-chip__snippet">&ldquo;{citation.snippet}&rdquo;</span>}
          <Link
            to={ROUTES.operationDocuments(opId)}
            className="citation-chip__link"
            onClick={() => setIsOpen(false)}
          >
            {t('citation.viewSource')}
          </Link>
        </span>
      )}
    </span>
  )
}
