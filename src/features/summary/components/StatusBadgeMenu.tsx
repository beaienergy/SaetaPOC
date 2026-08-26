import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Badge, type BadgeTone } from '@/shared/ui'
import { useDismissable } from '@/shared/hooks'
import './StatusBadgeMenu.css'

export interface StatusMenuOption<S extends string> {
  value: S
  label: string
  tone: BadgeTone
}

/**
 * Badge de estado editable inline: click abre un menú pequeño con las
 * opciones posibles (guion §5.3.2 — "badges de estado", "edición inline").
 * Genérico sobre el tipo de estado para reutilizarse en Key Issue List
 * (Abierto/Mitigado/Escalado), Seguimiento (Pendiente/En curso/Hecho) y el
 * banco de preguntas (Pendiente/Respondida).
 */
export function StatusBadgeMenu<S extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: S
  options: StatusMenuOption<S>[]
  onChange: (next: S) => void
  ariaLabel: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useDismissable<HTMLSpanElement>(isOpen, () => setIsOpen(false))
  const current = options.find((o) => o.value === value) ?? options[0]

  return (
    <span
      className="status-menu"
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="status-menu__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <Badge tone={current.tone}>{current.label}</Badge>
        <ChevronDown size={12} aria-hidden />
      </button>
      {isOpen && (
        <span className="status-menu__pop" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className="status-menu__option"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              <Badge tone={option.tone}>{option.label}</Badge>
            </button>
          ))}
        </span>
      )}
    </span>
  )
}
