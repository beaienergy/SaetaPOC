import type { ReactNode } from 'react'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  /** `ReactNode` y no `string`: el dashboard lo usa para saludar por el nombre. */
  subtitle?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
