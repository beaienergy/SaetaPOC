import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Check } from 'lucide-react'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { InsufficientDataState } from '@/shared/types/domain'
import './InsufficientDataNote.css'

/**
 * Estado insuficiente / gap (guion §1.7): mensaje corto + CTA ("Pedir
 * intervención humana" / "Solicitar documentación"). No existía todavía
 * `shared/ui/InsufficientDataBanner` al construir esta feature, así que vive
 * aquí como variante local pequeña — misma idea que `EmptyState` pero con
 * tono de aviso y una acción simulada (sin backend: solo confirma en la UI).
 */
export function InsufficientDataNote({
  reason,
  suggestedAction,
  className,
}: {
  reason: string
  suggestedAction: InsufficientDataState['suggestedAction']
  className?: string
}) {
  const { t } = useTranslation('summary')
  const [requested, setRequested] = useState(false)

  return (
    <div className={cn('insufficient-note', className)}>
      <AlertTriangle size={14} className="insufficient-note__icon" aria-hidden />
      <div className="insufficient-note__body">
        <p className="insufficient-note__reason">{reason}</p>
        {requested ? (
          <span className="insufficient-note__confirm">
            <Check size={13} aria-hidden />
            {t(
              suggestedAction === 'request_human'
                ? 'insufficient.humanRequested'
                : 'insufficient.documentsRequested',
            )}
          </span>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setRequested(true)}>
            {t(
              suggestedAction === 'request_human'
                ? 'insufficient.requestHuman'
                : 'insufficient.requestDocuments',
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
