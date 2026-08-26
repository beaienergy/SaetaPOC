import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { useDisclosure, useDismissable } from '@/shared/hooks'
import { ROUTES } from '@/shared/config/routes'
import type { Citation } from '@/shared/types/domain'
import './CitationChip.css'

interface CitationChipProps {
  citation: Citation
  /** Posicion en la lista de citas del mensaje (1-based): pinta "[1]", "[2]"... */
  index: number
  opId: string
}

/**
 * Cita/fuente clicable (guion §1.6): chip "[n]" con tooltip/preview del
 * fragmento. Reutilizable en cualquier pantalla con output de IA — vive en
 * `features/chat` porque es donde se necesita primero, pero no depende de
 * nada propio de chat (solo del tipo `Citation` compartido).
 *
 * El enlace "ver en Documentación" apunta al listado de documentos de la
 * operación (`operationDocuments`): `features/documents` (el detalle de
 * documento en si) todavia no esta construido, asi que es el destino mas
 * concreto disponible sin invadir esa feature.
 */
export function CitationChip({ citation, index, opId }: CitationChipProps) {
  const { t } = useTranslation('chat')
  const { isOpen, toggle, close } = useDisclosure()
  const ref = useDismissable<HTMLSpanElement>(isOpen, close)
  const navigate = useNavigate()

  return (
    <span ref={ref} className="citation-chip">
      <button
        type="button"
        className="citation-chip__trigger"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={t('citation.trigger', { index, document: citation.documentName })}
      >
        [{index}]
      </button>
      {isOpen && (
        <span role="tooltip" className="citation-chip__pop">
          <span className="citation-chip__doc">
            <FileText size={13} aria-hidden />
            {citation.documentName}
          </span>
          <span className="citation-chip__locator">{citation.locator}</span>
          {citation.snippet && (
            <span className="citation-chip__snippet">&ldquo;{citation.snippet}&rdquo;</span>
          )}
          <button
            type="button"
            className="citation-chip__link"
            onClick={() => {
              close()
              navigate(ROUTES.operationDocuments(opId))
            }}
          >
            {t('citation.viewInDocuments')}
          </button>
        </span>
      )}
    </span>
  )
}
