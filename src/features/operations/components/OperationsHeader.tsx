import { useTranslation } from 'react-i18next'
import { SaetaLogo, ThemeToggle, LangToggle, UserMenu } from '@/shared/ui'
import { useAuthStore } from '@/features/auth'
import './OperationsHeader.css'

/**
 * Cabecera principal para las pantallas puente pre-shell (selector de
 * operación): antes esta pantalla no tenía ningún chrome propio, lo que la
 * hacía sentir "sin terminar" al lado del resto de la app. Usa los mismos
 * tokens que el header del shell de operación (`app/layout/Header.tsx`), no
 * el tratamiento oscuro a pantalla completa de `/apps` — esta pantalla ya no
 * es la portada de marca, es una pantalla de trabajo más.
 */
export function OperationsHeader() {
  const { t } = useTranslation('common')
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="ops-header">
      <div className="ops-header__side">
        <SaetaLogo height={20} />
      </div>

      <span className="ops-header__title">{t('platformName')}</span>

      <div className="ops-header__side ops-header__side--right">
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
      </div>
    </header>
  )
}
