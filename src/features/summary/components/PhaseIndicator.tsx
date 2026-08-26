import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { DEAL_PHASES, type DealPhase } from '../types'
import './PhaseIndicator.css'

/**
 * Indicador de fase de la operación (guion §5.3.4, nota): no hay tracker de
 * etapas de la propuesta comercial disponible en este repo, así que se
 * sustituye por un stepper propio y sencillo — a ancho completo y con los
 * pasos conectados entre sí (pedido explícito), para que se lea de un
 * vistazo en qué fase está la operación.
 */
export function PhaseIndicator({ phase, className }: { phase: DealPhase; className?: string }) {
  const { t } = useTranslation('summary')
  const currentIndex = DEAL_PHASES.indexOf(phase)

  return (
    <ol className={cn('phase-stepper', className)}>
      {DEAL_PHASES.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <li
            key={step}
            className={cn('phase-stepper__step', isDone && 'is-done', isCurrent && 'is-current')}
          >
            <span className="phase-stepper__dot" aria-hidden>
              {isDone ? <Check size={13} /> : index + 1}
            </span>
            <span className="phase-stepper__label">{t(`tracking.phases.${step}`)}</span>
          </li>
        )
      })}
    </ol>
  )
}
