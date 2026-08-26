import { useTranslation } from 'react-i18next'
import { ArrowRightCircle, Cpu, Flag, ShieldCheck, Wrench } from 'lucide-react'
import { formatInt } from '@/shared/lib/formatters'
import type { TraceStep, TraceStepKind } from '../types'
import type { Locale } from '@/shared/types'
import './TraceStepList.css'

const KIND_ICON: Record<TraceStepKind, typeof Cpu> = {
  flow: ArrowRightCircle,
  model: Cpu,
  tool: Wrench,
  middleware: ShieldCheck,
  final: Flag,
}

/**
 * Paso a paso de una traza de ejecución (guion §5.6.2): mezcla eslabones de
 * pipeline ("flow") con turnos de razonamiento interno ("model"/"tool"/
 * "middleware") en una sola línea de tiempo — es justo el punto de la
 * pantalla, que ambos tipos de paso se vean igual de medibles. Inspirado en
 * el patrón visual de `AgentTrace` del proyecto de referencia (pasos con
 * icono + marcador conectado), reconstruido aquí con los 5 tipos propios de
 * esta pantalla en vez de los 4 de ReAct.
 */
export function TraceStepList({ steps }: { steps: TraceStep[] }) {
  const { t, i18n } = useTranslation('analytics')
  const locale = i18n.language as Locale

  return (
    <ol className="trace-steps">
      {steps.map((step) => {
        const Icon = KIND_ICON[step.kind]
        return (
          <li key={step.id} className={`trace-steps__step trace-steps__step--${step.kind}`}>
            <span className="trace-steps__marker" aria-hidden>
              <Icon size={14} />
            </span>
            <div className="trace-steps__body">
              <div className="trace-steps__head">
                <span className="trace-steps__kind u-eyebrow">{t(`traces.step.${step.kind}`)}</span>
                <span className="trace-steps__label">{step.label}</span>
                {step.kind === 'model' && step.tokens !== undefined && (
                  <span className="trace-steps__tokens">
                    {formatInt(step.tokens, locale)} {t('traces.tokensShort')}
                  </span>
                )}
              </div>
              {step.model && <span className="trace-steps__model">{step.model}</span>}
              {step.detail && <p className="trace-steps__detail">{step.detail}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
