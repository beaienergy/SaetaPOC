import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { DEAL_PHASES, type DealPhase } from '../types'
import './PhaseIndicator.css'

/**
 * Indicador de fase de la operación (guion §5.3.4, nota): no hay tracker de
 * etapas de la propuesta comercial disponible en este repo, así que se
 * sustituye por una barra de fases propia y sencilla en vez de reconstruir
 * algo que no se ha visto.
 */
export function PhaseIndicator({ phase, className }: { phase: DealPhase; className?: string }) {
  const { t } = useTranslation('summary')
  const currentIndex = DEAL_PHASES.indexOf(phase)

  return (
    <ol className={cn('phase-indicator', className)}>
      {DEAL_PHASES.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <li
            key={step}
            className={cn('phase-indicator__step', isDone && 'is-done', isCurrent && 'is-current')}
          >
            <span className="phase-indicator__dot" aria-hidden>
              {isDone ? <Check size={11} /> : null}
            </span>
            {t(`tracking.phases.${step}`)}
          </li>
        )
      })}
    </ol>
  )
}
