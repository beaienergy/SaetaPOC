import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useDisclosure, useDismissable } from '@/shared/hooks'
import { i18n } from '@/shared/lib/i18n'
import './InfoHint.css'

interface InfoHintProps {
  /** Qué significa el dato. Una o dos frases, sin jerga, ya traducidas. */
  text: string
  /** Etiqueta accesible del disparador. Por defecto, la genérica de i18n. */
  label?: string
  /** Arriba o abajo del icono. El lado horizontal se decide solo. */
  placement?: 'bottom' | 'top'
  size?: number
  className?: string
}

/**
 * El icono ℹ que explica un dato: una métrica del dashboard, una columna del
 * KB, de dónde sale un número del asistente.
 *
 * Abre con puntero, con foco y con clic — el clic es lo que lo hace usable en
 * táctil, donde no hay hover. Cierra con Escape o pulsando fuera.
 * `role="tooltip"` + `aria-describedby` es el emparejamiento correcto: el lector
 * lee el texto como complemento del botón, no como su nombre.
 */
export function InfoHint({
  text,
  label,
  placement = 'bottom',
  size = 14,
  className,
}: InfoHintProps) {
  const { isOpen, open, close, toggle } = useDisclosure()
  const ref = useDismissable<HTMLSpanElement>(isOpen, close)
  const popRef = useRef<HTMLSpanElement>(null)
  // El globo crece hacia la IZQUIERDA del icono, que es lo que necesita el caso
  // normal: la mayoría de los ℹ van al final de un título y hacia la derecha se
  // saldrían de la pantalla. Pero un ℹ al principio de una línea lo deja fuera
  // del área de contenido — con barra lateral, literalmente encima de ella.
  //
  // Se corrige DESPLAZÁNDOLO lo justo para que quepa, no cambiándolo de lado:
  // anclarlo al lado contrario arregla el borde izquierdo y rompe el derecho,
  // que es exactamente lo que pasaba en móvil (nueve de catorce globos).
  const [shift, setShift] = useState(0)
  const id = useId()

  useLayoutEffect(() => {
    if (!isOpen) {
      setShift(0)
      return
    }
    const pop = popRef.current
    const anchor = ref.current
    if (!pop || !anchor) return
    // El límite es el área de contenido (`main`), no la ventana: lo que estorba
    // no es salirse de la pantalla, es meterse debajo del chrome.
    const area = (anchor.closest('main') ?? document.body).getBoundingClientRect()
    const box = pop.getBoundingClientRect()
    const margin = 8
    const outLeft = area.left + margin - box.left
    const outRight = box.right - (area.right - margin)
    // Se mide en `useLayoutEffect`, así que la corrección entra antes de pintar
    // y el globo no llega a verse en el sitio equivocado.
    if (outLeft > 0) setShift(outLeft)
    else if (outRight > 0) setShift(-outRight)
    // `ref` es estable (useDismissable) y solo importa el momento de abrir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <span ref={ref} className={cn('info-hint', `info-hint--${placement}`, className)}>
      <button
        type="button"
        className="info-hint__trigger"
        aria-label={label ?? i18n.t('common:actions.whatIsThis')}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? id : undefined}
        onClick={toggle}
        onPointerEnter={open}
        onPointerLeave={close}
        onFocus={open}
      >
        <Info size={size} aria-hidden />
      </button>
      {isOpen && (
        <span
          ref={popRef}
          role="tooltip"
          id={id}
          className="info-hint__pop"
          style={shift ? { transform: `translateX(${Math.round(shift)}px)` } : undefined}
        >
          {text}
        </span>
      )}
    </span>
  )
}
