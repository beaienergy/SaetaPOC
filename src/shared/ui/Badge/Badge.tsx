import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import './Badge.css'

// Tonos semanticos: no una variante por estado de dominio. El mapeo
// (ej. TicketStatus -> tone) vive en la feature correspondiente.
type BadgeSemanticTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

// Tonos categoricos para dimensiones sin carga semantica (origen, sistema…).
// Escala fria a proposito: `danger` es el unico rojo y no debe usarse para
// categorizar, o toda la fila se lee como un fallo.
type BadgeCategoricalTone = 'blue' | 'sky' | 'cyan' | 'indigo' | 'violet' | 'steel' | 'orange' | 'lime'

export type BadgeTone = BadgeSemanticTone | BadgeCategoricalTone

interface BadgeProps {
  tone?: BadgeTone
  dot?: boolean
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', dot = false, children, className }: BadgeProps) {
  return (
    <span className={cn('badge', `badge--${tone}`, className)}>
      {dot && <span className="badge__dot" aria-hidden />}
      {children}
    </span>
  )
}
