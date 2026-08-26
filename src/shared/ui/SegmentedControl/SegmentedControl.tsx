import { useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import './SegmentedControl.css'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  /** Contador a la derecha de la etiqueta. Útil para filtros ("Documentos 14"). */
  count?: number
  icon?: ReactNode
  disabled?: boolean
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** `pill` = radius-full, para el chrome del header. `box` = radius-md, dentro de contenido. */
  shape?: 'pill' | 'box'
  size?: 'sm' | 'md'
  /** Etiqueta accesible del grupo. Obligatoria: un radiogroup sin nombre no se anuncia. */
  ariaLabel: string
  fullWidth?: boolean
  className?: string
}

/**
 * Elegir una opción entre pocas, mutuamente excluyentes: tema, idioma, periodo,
 * ámbito del dashboard, tipo de entrada del KB.
 *
 * Semántica de radiogroup con navegación por flechas (roving tabindex): solo la
 * opción activa entra en el orden de tabulación, y dentro del grupo se navega
 * con las flechas. Es lo que ninguno de los tres segmentados escritos a mano
 * hacía, y la razón principal de haber unificado.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  shape = 'pill',
  size = 'md',
  ariaLabel,
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  const ref = useRef<HTMLDivElement>(null)

  const move = (from: number, step: number) => {
    const enabled = options.filter((o) => !o.disabled)
    if (enabled.length === 0) return
    const positions = options.map((o, i) => ({ o, i })).filter(({ o }) => !o.disabled)
    const at = positions.findIndex(({ i }) => i === from)
    const next = positions[(at + step + positions.length) % positions.length]
    onChange(next.o.value)
    // El foco sigue a la selección: es lo que espera un radiogroup.
    ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next.i]?.focus()
  }

  return (
    <div
      ref={ref}
      className={cn(
        'segmented',
        `segmented--${shape}`,
        `segmented--${size}`,
        fullWidth && 'segmented--block',
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option, index) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={option.disabled}
            className={cn('segmented__option', active && 'is-active')}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault()
                move(index, 1)
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault()
                move(index, -1)
              }
            }}
          >
            {option.icon && (
              <span className="segmented__icon" aria-hidden>
                {option.icon}
              </span>
            )}
            {option.label}
            {option.count !== undefined && <span className="segmented__count">{option.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
