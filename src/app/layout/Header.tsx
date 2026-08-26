import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Menu } from 'lucide-react'
import { Select, SegmentedControl, ThemeToggle, LangToggle, UserMenu, Pill } from '@/shared/ui'
import { useRoleStore } from '@/shared/stores'
import type { Role } from '@/shared/types'
import { useAuthStore } from '@/features/auth'
import { MOCK_OPERATIONS, getOperation } from '@/features/operations'
import { ROUTES } from '@/shared/config/routes'

/**
 * Header del shell de operación (guion §1.1): vuelta a /apps (no al login),
 * nombre de la operación con desplegable rápido para cambiar sin pasar por el
 * selector, indicador/selector de rol (§1.5, siempre visible) y controles
 * comunes.
 */
export function Header({ opId, onMenuClick }: { opId: string; onMenuClick: () => void }) {
  const { t } = useTranslation('common')
  const { t: tOps } = useTranslation('operations')
  const location = useLocation()
  const navigate = useNavigate()
  const role = useRoleStore((s) => s.role)
  const setRole = useRoleStore((s) => s.setRole)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const operation = getOperation(opId)

  function switchOperation(nextId: string) {
    // Cambia de operación conservando la sección en la que se estaba (chat,
    // documentos...), sustituyendo solo el segmento :opId de la URL actual.
    const next = location.pathname.replace(`/ma/operations/${opId}`, `/ma/operations/${nextId}`)
    navigate(next)
  }

  return (
    <header className="header">
      <button className="header__menu" onClick={onMenuClick} aria-label={t('actions.menu')}>
        <Menu size={20} />
      </button>

      <Link to={ROUTES.apps} className="header__back" title={t('actions.back')}>
        <ArrowLeft size={16} aria-hidden />
      </Link>

      <label className="header__op-switch">
        <span className="u-visually-hidden">{tOps('title')}</span>
        <Select
          value={opId}
          onChange={(e) => switchOperation(e.target.value)}
          options={MOCK_OPERATIONS.map((op) => ({ value: op.id, label: op.name }))}
        />
      </label>

      {operation?.status === 'closed' && (
        <Pill variant="outline" size="sm">
          {tOps('status.closed')}
        </Pill>
      )}

      <div className="header__spacer" />

      <SegmentedControl<Role>
        size="sm"
        ariaLabel={t('role.label')}
        value={role}
        onChange={setRole}
        options={[
          { value: 'user', label: t('role.user') },
          { value: 'admin', label: t('role.admin') },
        ]}
      />

      <ThemeToggle />
      <LangToggle />

      {user && (
        <UserMenu
          name={user.name}
          email={user.email}
          logoutLabel={t('user.logout')}
          onLogout={() => void logout()}
        />
      )}
    </header>
  )
}
