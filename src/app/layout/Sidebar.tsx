import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MessageSquare,
  FolderOpen,
  ClipboardList,
  Calculator,
  FileOutput,
  LineChart,
  type LucideIcon,
} from 'lucide-react'
import { SaetaLogo } from '@/shared/ui'
import { useAuthStore } from '@/features/auth'
import { useRoleStore } from '@/shared/stores'
import { cn, initials } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/config/routes'

interface NavItem {
  key: string
  icon: LucideIcon
  to: string
  adminOnly?: boolean
}

/**
 * Sidebar primario (guion §1.2): un icono/entrada por bloque de negocio.
 * Analítica IA solo aparece para el rol Admin simulado (§1.5) — es UI, no
 * seguridad real, coherente con el resto de la POC.
 */
export function Sidebar({ opId, onNavigate }: { opId: string; onNavigate?: () => void }) {
  const { t } = useTranslation('nav')
  const user = useAuthStore((s) => s.user)
  const role = useRoleStore((s) => s.role)

  const items: NavItem[] = [
    { key: 'chat', icon: MessageSquare, to: ROUTES.operationChat(opId) },
    { key: 'documents', icon: FolderOpen, to: ROUTES.operationDocuments(opId) },
    { key: 'summary', icon: ClipboardList, to: ROUTES.operationSummary(opId) },
    { key: 'financialModel', icon: Calculator, to: ROUTES.operationFinancialModel(opId) },
    { key: 'reports', icon: FileOutput, to: ROUTES.operationReports(opId) },
    { key: 'analytics', icon: LineChart, to: ROUTES.operationAnalytics(opId), adminOnly: true },
  ]

  return (
    <aside className="sidebar">
      <Link to={ROUTES.apps} className="sidebar__brand" title={t('backToOperations')}>
        <SaetaLogo height={22} />
      </Link>

      <nav className="sidebar__nav">
        <div className="sidebar__section">
          <span className="sidebar__section-title">{t('sections.operation')}</span>
          {items
            .filter((item) => !item.adminOnly || role === 'admin')
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.key}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn('sidebar__link', isActive && 'sidebar__link--active')
                  }
                >
                  <Icon size={18} aria-hidden />
                  {t(`items.${item.key}`)}
                </NavLink>
              )
            })}
        </div>
      </nav>

      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <span className="sidebar__avatar">{initials(user.name)}</span>
            <div className="sidebar__user-text">
              <span className="sidebar__user-name">{user.name}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
