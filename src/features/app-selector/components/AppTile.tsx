import type { ReactNode, KeyboardEvent } from 'react'
import { ArrowRight, Clock } from 'lucide-react'
import { Pill } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import './AppSelector.css'

interface AppTileProps {
  /**
   * El icono de la aplicación. Un nodo y no la ruta de una imagen: la portada era
   * una ilustración de 300 KB por ficha, y lo que tiene que decir la cabecera de la
   * ficha —«esto es soporte», «esto son indicadores»— lo dice un icono en 1 KB, sin
   * competir con el nombre que hay justo debajo.
   */
  icon: ReactNode
  name: string
  description: string
  statusLabel: string
  statusIcon?: ReactNode
  variant: 'active' | 'soon'
  ctaLabel?: string
  onOpen?: () => void
}

/**
 * Tarjeta del launcher.
 *
 * `variant="soon"` no es un boton: sin onClick, sin tabIndex, sin hover — el estado
 * «proximamente» tiene que sentirse inerte, no como un enlace roto.
 *
 * La cabecera es un emblema con el icono de la aplicacion sobre un degradado de
 * marca. Antes era una ilustracion a sangre; se retiro porque decia menos que el
 * nombre que tiene debajo y ocupaba 300 KB por ficha.
 */
export function AppTile({
  icon,
  name,
  description,
  statusLabel,
  statusIcon,
  variant,
  ctaLabel,
  onOpen,
}: AppTileProps) {
  const interactive = variant === 'active'

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen?.()
    }
  }

  return (
    <div
      className={cn('app-tile', `app-tile--${variant}`)}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-disabled={!interactive}
      onClick={interactive ? onOpen : undefined}
      onKeyDown={handleKeyDown}
    >
      {/* El emblema. Decorativo: el nombre y la descripción de debajo son los que
          dicen qué es cada aplicación. */}
      <div className="app-tile__emblem" aria-hidden>
        {/* «Próximamente» ya lo dice la pill de abajo; el reloj sustituye al icono
            para que se lea sin tener que leer texto. */}
        {variant === 'soon' ? <Clock size={30} /> : icon}
      </div>

      <div className="app-tile__content">
        <div className="app-tile__body">
          <h2 className="app-tile__name">{name}</h2>
          <p className="app-tile__desc">{description}</p>
        </div>
        <div className="app-tile__foot">
          <Pill
            className={cn('app-tile__pill', interactive && 'app-tile__pill--accent')}
            icon={statusIcon}
          >
            {statusLabel}
          </Pill>
          {interactive && (
            <span className="app-tile__cta">
              {ctaLabel}
              <ArrowRight size={14} aria-hidden />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
