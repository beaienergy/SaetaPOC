import { cn } from '@/shared/lib/utils'
import './RatioBar.css'

interface RatioBarProps {
  /** Parte del total que está "cumplida" (validados, con propuesta, etc.). */
  value: number
  total: number
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

/**
 * Fracción value/total como barra mínima, sin texto. Para cuando el número
 * exacto ("108 de 153") ya vive en el hint o en el aria-label, y la tarjeta
 * solo necesita comunicar la proporción de un vistazo.
 */
export function RatioBar({ value, total, tone = 'primary', className }: RatioBarProps) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0
  return (
    <span className={cn('ratio-bar', `ratio-bar--${tone}`, className)} aria-hidden>
      <span className="ratio-bar__fill" style={{ width: `${pct}%` }} />
    </span>
  )
}
