import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Network } from 'lucide-react'
import { SaetaLogo, Pill, ThemeToggle, LangToggle, UserMenu } from '@/shared/ui'
import { useAuthStore } from '@/features/auth'
import { firstName } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/config/routes'
import { AppTile } from './AppTile'
import './AppSelector.css'

/**
 * Selector de aplicaciones (guion §3): traducción a producto del diagrama "un
 * núcleo, muchos casos de uso" — vale la pena que la propia POC cuente esa
 * historia de reutilización, no solo el pitch de venta. Solo dos tarjetas por
 * ahora: "M&A Platform" (activa) y "Next Applications" (deshabilitada).
 */
export function AppSelectorScreen() {
  const { t } = useTranslation('appSelector')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="app-selector-page">
      <div className="app-selector-page__glow app-selector-page__glow--a" aria-hidden />
      <div className="app-selector-page__glow app-selector-page__glow--b" aria-hidden />
      <div className="app-selector-page__grid-pattern" aria-hidden />

      <header className="app-selector-page__topbar">
        <div className="app-selector-page__brand">
          <SaetaLogo height={20} />
          <Pill variant="soft" className="app-selector-page__label">
            {t('label')}
          </Pill>
        </div>

        <div className="app-selector-page__toolbar">
          <ThemeToggle tone="on-dark" />
          <LangToggle tone="on-dark" />
          {user && (
            <UserMenu
              tone="on-dark"
              name={user.name}
              email={user.email}
              logoutLabel={tCommon('user.logout')}
              onLogout={() => void logout()}
            />
          )}
        </div>
      </header>

      <main className="app-selector-page__main">
        <div className="app-selector-page__hero">
          <h1 className="app-selector-page__greeting">
            {t('greeting', { name: user ? `, ${firstName(user.name)}` : '' })}
          </h1>
          <p className="app-selector-page__subtitle">{t('subtitle')}</p>
        </div>

        <div className="app-selector-grid">
          <AppTile
            variant="active"
            icon={<Network size={30} />}
            name={t('apps.ma.name')}
            description={t('apps.ma.description')}
            statusLabel={t('apps.ma.status')}
            ctaLabel={t('apps.ma.cta')}
            onOpen={() => navigate(ROUTES.operations)}
          />
          <AppTile
            variant="soon"
            icon={<Network size={30} />}
            name={t('apps.next.name')}
            description={t('apps.next.description')}
            statusLabel={t('apps.next.status')}
          />
        </div>
      </main>
    </div>
  )
}
