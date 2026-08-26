import { useTranslation } from 'react-i18next'
import { useThemeCycle } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import './ThemeToggle.css'

/** Botón que cicla claro/oscuro/sistema. Un solo icono, sin dropdown (ver
 * `useThemeCycle`). `tone="on-dark"` es para chrome pintado sobre el navy de
 * marca (login, portal), donde `--color-surface`/`--color-border` no leen. */
export function ThemeToggle({ tone = 'default' }: { tone?: 'default' | 'on-dark' }) {
  const { t } = useTranslation('common')
  const { mode, Icon, cycle } = useThemeCycle()

  return (
    <button
      type="button"
      className={cn('theme-toggle', tone === 'on-dark' && 'theme-toggle--on-dark')}
      onClick={cycle}
      aria-label={t(`theme.${mode}`)}
      title={t(`theme.${mode}`)}
    >
      <Icon size={18} />
    </button>
  )
}
