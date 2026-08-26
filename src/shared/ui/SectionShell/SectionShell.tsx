import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

export interface SectionNavItem {
  key: string
  label: string
  to: string
  icon?: ReactNode
  /** Solo esta entrada requiere fin exacto de ruta (evita que "overview"
   * quede activo también cuando la ruta real es "key-issues", etc. no aplica
   * aqui salvo para la entrada raiz de la seccion). */
  end?: boolean
}

/**
 * Sidebar secundario contextual (guion §1.3): aparece cuando la sección activa
 * tiene subpantallas — Documentación, Resumen de la operación y Analítica IA.
 * Un solo componente para las tres, con distinto `items`: es exactamente lo
 * que pide el guion ("no es un componente nuevo por sección").
 */
export function SectionShell({ title, items }: { title: string; items: SectionNavItem[] }) {
  return (
    <div className="section-shell">
      <nav className="section-shell__nav" aria-label={title}>
        <span className="section-shell__nav-title">{title}</span>
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn('section-shell__link', isActive && 'section-shell__link--active')
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="section-shell__content">
        <Outlet />
      </div>
    </div>
  )
}
