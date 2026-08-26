import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { InfoHint } from '@/shared/ui/InfoHint/InfoHint'
import './StatCard.css'

interface Trend {
  value: string
  direction: 'up' | 'down' | 'neutral'
  /**
   * Qué dirección es buena para ESTA métrica. Por defecto 'up', que era el
   * comportamiento único de antes. En una bandeja de trabajo (abiertos,
   * pendientes, fuera de objetivo) subir es malo, y pintarlo verde miente.
   */
  goodDirection?: 'up' | 'down'
}

interface StatCardProps {
  label: string
  value: ReactNode
  /** Nota breve bajo el valor. Úsala solo si aporta: la tarjeta debe leerse de un vistazo. */
  subtitle?: ReactNode
  /** Qué significa el dato. Se pinta como un ℹ abajo a la derecha. */
  hint?: string
  icon?: ReactNode
  iconTone?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend?: Trend
  href?: string
  loading?: boolean
}

const trendIcon = { up: ArrowUpRight, down: ArrowDownRight, neutral: ArrowRight }

function trendTone(trend: Trend): 'is-good' | 'is-bad' | 'is-flat' {
  if (trend.direction === 'neutral') return 'is-flat'
  return trend.direction === (trend.goodDirection ?? 'up') ? 'is-good' : 'is-bad'
}

export function StatCard({
  label,
  value,
  subtitle,
  hint,
  icon,
  iconTone = 'primary',
  trend,
  href,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="card stat-card">
        <Skeleton width={90} height={12} />
        <Skeleton width={70} height={26} />
      </div>
    )
  }

  const TrendIcon = trend ? trendIcon[trend.direction] : null

  // Enlace estirado: el <a> cubre la tarjeta en vez de envolverla, para que el
  // botón del ℹ pueda vivir dentro sin anidar un <button> en un <a>.
  return (
    <div className={cn('card stat-card', href && 'stat-card--link')}>
      {href && <Link to={href} className="stat-card__link" aria-label={label} />}
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {icon && (
          <span className={cn('stat-card__icon', `stat-card__icon--${iconTone}`)} aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__foot">
        <span className="stat-card__foot-main">
          {trend && TrendIcon && (
            <span className={cn('stat-card__trend', trendTone(trend))}>
              <TrendIcon size={14} /> {trend.value}
            </span>
          )}
          {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
        </span>
        {/* Abajo a la derecha: así no compite con el icono principal de arriba. */}
        {hint && <InfoHint text={hint} placement="top" className="stat-card__hint" />}
      </div>
    </div>
  )
}
