import { useId, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useDisclosure } from '@/shared/hooks'
import { i18n } from '@/shared/lib/i18n'
import './Collapsible.css'

interface CollapsibleProps {
  title: ReactNode
  /** A la derecha del título (contador, badge). Va DENTRO del botón: no dispara nada aparte. */
  meta?: ReactNode
  icon?: ReactNode
  defaultOpen?: boolean
  /** Controlado: si viene, manda el padre. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * `mount` → el contenido no se monta cerrado. Obligatorio si dentro hay
   * gráficas: recharts mide 0 con `display:none` y se queda colapsado al volver.
   * `hide` → monta siempre y oculta por CSS; conserva scroll y estado interno.
   */
  strategy?: 'mount' | 'hide'
  /** Sin marco: para apilar varias dentro de un panel que ya es una tarjeta. */
  flush?: boolean
  className?: string
  children: ReactNode
}

/**
 * Caja que se abre y se cierra. La usan el panel lateral del detalle de ticket
 * (Detalles, Versiones, Fuentes), la banda de coste e impacto del admin y las
 * reglas de ingesta del KB.
 */
export function Collapsible({
  title,
  meta,
  icon,
  defaultOpen = true,
  open,
  onOpenChange,
  strategy = 'hide',
  flush = false,
  className,
  children,
}: CollapsibleProps) {
  const local = useDisclosure(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : local.isOpen
  const id = useId()

  const toggle = () => {
    if (!isControlled) local.toggle()
    onOpenChange?.(!isOpen)
  }

  return (
    <section className={cn('collapsible', flush && 'collapsible--flush', className)}>
      <button
        type="button"
        className="collapsible__trigger"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={toggle}
        title={i18n.t(isOpen ? 'common:actions.collapse' : 'common:actions.expand')}
      >
        <ChevronDown
          size={16}
          className={cn('collapsible__chevron', isOpen && 'is-open')}
          aria-hidden
        />
        {icon && (
          <span className="collapsible__icon" aria-hidden>
            {icon}
          </span>
        )}
        <span className="collapsible__title">{title}</span>
        {meta && <span className="collapsible__meta">{meta}</span>}
      </button>
      {(isOpen || strategy === 'hide') && (
        <div id={id} className="collapsible__body" hidden={!isOpen}>
          {children}
        </div>
      )}
    </section>
  )
}
