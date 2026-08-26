import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button/Button'
import './InsufficientDataBanner.css'

interface InsufficientDataAction {
  label: string
  onClick: () => void
  icon?: ReactNode
  loading?: boolean
}

interface InsufficientDataBannerProps {
  /** Frase corta: qué le falta al sistema para completar esto. Ya traducida
   * por quien llama — este componente no tiene namespace de i18n propio. */
  message: string
  hint?: string
  /** Ej. "Solicitar documentación". */
  primaryAction?: InsufficientDataAction
  /** Ej. "Pedir intervención humana". */
  secondaryAction?: InsufficientDataAction
  className?: string
}

/**
 * Estado insuficiente / gap (guion §1.7): banner + CTA reutilizable para
 * cuando el sistema no tiene información suficiente para completar algo —
 * un campo del resumen automático (§5.3.1) o una incidencia de documentación
 * pendiente en Gaps y contradicciones (§5.2.1).
 *
 * Variante propia sobre `EmptyState` en vez de reutilizarlo: `EmptyState` es
 * la ausencia de una LISTA (una tabla sin filas); esto es una afirmación
 * puntual del propio agente dentro de contenido que sí existe ("esto en
 * concreto no lo sé, y así se resuelve"), con hasta dos acciones en vez de
 * una sola. Vive en `shared/ui` porque más de una feature lo necesita con el
 * mismo aspecto exacto — no un formulario nuevo por pantalla.
 */
export function InsufficientDataBanner({
  message,
  hint,
  primaryAction,
  secondaryAction,
  className,
}: InsufficientDataBannerProps) {
  return (
    <div className={cn('insufficient-data-banner', className)} role="status">
      <AlertCircle size={18} className="insufficient-data-banner__icon" aria-hidden />
      <div className="insufficient-data-banner__text">
        <p className="insufficient-data-banner__message">{message}</p>
        {hint && <p className="insufficient-data-banner__hint">{hint}</p>}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="insufficient-data-banner__actions">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              icon={primaryAction.icon}
              loading={primaryAction.loading}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              size="sm"
              icon={secondaryAction.icon}
              loading={secondaryAction.loading}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
