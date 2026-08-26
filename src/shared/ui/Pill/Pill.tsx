import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import './Pill.css'

interface PillProps {
  children: ReactNode
  /** `soft` = fondo inset · `outline` = solo borde · `accent` = primary sutil. */
  variant?: 'soft' | 'outline' | 'accent'
  /** xs = --text-xs (12px). NO existen 10px ni 11px: eran seis píldoras a mano. */
  size?: 'xs' | 'sm'
  icon?: ReactNode
  className?: string
}

/**
 * Chip neutro: un grupo de acceso, un contador, el nombre de un paso, un ámbito.
 *
 * Deliberadamente NO es una variante de `Badge`. `Badge` es la escala de color
 * semántica y categórica: significa "esta fila está en el estado X" o "pertenece
 * a la categoría Y". `Pill` no dice nada del dominio. Fundirlos permitiría
 * escribir `<Badge tone="danger">Soporte N1</Badge>`, que es exactamente lo que
 * el sistema prohíbe.
 */
export function Pill({ children, variant = 'soft', size = 'xs', icon, className }: PillProps) {
  return (
    <span className={cn('pill', `pill--${variant}`, `pill--${size}`, className)}>
      {icon && (
        <span className="pill__icon" aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
