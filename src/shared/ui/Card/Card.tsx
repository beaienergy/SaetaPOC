import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import './Card.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
}

export function Card({ children, padded = true, className, ...rest }: CardProps) {
  return (
    <div className={cn('card', padded && 'card--padded', className)} {...rest}>
      {children}
    </div>
  )
}
