import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import './WorkingCopyBanner.css'

/**
 * Requisito explicito de la RFP (guion §5.4): "Trabajando sobre una copia — el
 * archivo original no se modifica" debe verse SIEMPRE, sin poder ignorarse —
 * no una nota al pie. `position: sticky` dentro del contenedor de scroll de la
 * pantalla (`.shell__content` en `OperationLayout`, que esta feature no puede
 * tocar) para que quede visible aunque se haga scroll por los hallazgos.
 */
export function WorkingCopyBanner() {
  const { t } = useTranslation('financialModel')

  return (
    <div className="fm-banner" role="status">
      <ShieldCheck size={20} className="fm-banner__icon" aria-hidden />
      <p className="fm-banner__text">
        <strong>{t('banner.title')}</strong> {t('banner.body')}
      </p>
    </div>
  )
}
