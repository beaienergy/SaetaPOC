import type { ReactNode } from 'react'
import './EmptyState.css'

interface EmptyStateProps {
  icon?: ReactNode
  message: string
  hint?: string
}

export function EmptyState({ icon, message, hint }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <p className="empty-state__message">{message}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
    </div>
  )
}
