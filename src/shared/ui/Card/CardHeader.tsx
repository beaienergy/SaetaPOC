import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { InfoHint } from '@/shared/ui/InfoHint/InfoHint'
import './CardHeader.css'

interface CardHeaderProps {
  title: ReactNode
  /** `title` = --text-lg/600 · `eyebrow` = micro-título uppercase muted. */
  variant?: 'title' | 'eyebrow'
  /** Qué es esto. Si viene, se pinta un ℹ junto al título. */
  hint?: string
  /** Botones o selectores a la derecha. */
  actions?: ReactNode
  icon?: ReactNode
  /** Línea explicativa bajo el título. */
  subtitle?: string
  className?: string
}

/**
 * La fila de cabecera de una tarjeta: título a la izquierda, acciones a la
 * derecha. Estaba escrita dos veces con distinto nombre (`.dash-card__head` y
 * `.mon-card__head`), y ni la vista de documentos ni el detalle de ticket la
 * tenían.
 *
 * Es un subcomponente y no una prop de `Card` porque `Collapsible` necesita
 * exactamente esta misma fila y no puede consumir una prop de `Card`.
 */
export function CardHeader({
  title,
  variant = 'title',
  hint,
  actions,
  icon,
  subtitle,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('card-header', className)}>
      <div className="card-header__main">
        <div className={cn('card-header__title', variant === 'eyebrow' && 'u-eyebrow')}>
          {icon && (
            <span className="card-header__icon" aria-hidden>
              {icon}
            </span>
          )}
          {title}
          {hint && <InfoHint text={hint} />}
        </div>
        {subtitle && <p className="card-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="card-header__actions">{actions}</div>}
    </div>
  )
}
