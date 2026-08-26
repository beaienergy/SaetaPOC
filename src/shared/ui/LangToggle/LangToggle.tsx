import { useTranslation } from 'react-i18next'
import { SegmentedControl } from '../SegmentedControl/SegmentedControl'
import { cn } from '@/shared/lib/utils'
import './LangToggle.css'

/** Selector ES/EN de dos botones. `tone="on-dark"` para chrome sobre el
 * gradiente de marca, donde el fondo/borde por defecto de `SegmentedControl`
 * no tiene contraste suficiente. */
export function LangToggle({
  size = 'sm',
  tone = 'default',
}: {
  size?: 'sm' | 'md'
  tone?: 'default' | 'on-dark'
}) {
  const { t, i18n } = useTranslation('common')
  const lang = i18n.language.startsWith('en') ? 'en' : 'es'

  return (
    <SegmentedControl
      size={size}
      ariaLabel={t('lang.label')}
      value={lang}
      onChange={(next) => void i18n.changeLanguage(next)}
      className={cn(tone === 'on-dark' && 'lang-toggle--on-dark')}
      options={[
        { value: 'en', label: t('lang.en') },
        { value: 'es', label: t('lang.es') },
      ]}
    />
  )
}
