import { useTranslation } from 'react-i18next'
import { Clock, User, Zap } from 'lucide-react'
import { Badge, Collapsible } from '@/shared/ui'
import { formatDate, formatInt } from '@/shared/lib/formatters'
import type { BadgeTone } from '@/shared/ui'
import { TraceStepList } from './TraceStepList'
import type { ExecutionTrace, TraceStatus } from '../types'
import type { Locale } from '@/shared/types'
import './ExecutionTraceList.css'

const STATUS_TONE: Record<TraceStatus, BadgeTone> = {
  success: 'success',
  partial: 'warning',
  error: 'danger',
}

/** Una ejecución completa, expandible (guion §5.6.2). */
export function ExecutionTraceCard({ trace }: { trace: ExecutionTrace }) {
  const { t, i18n } = useTranslation('analytics')
  const locale = i18n.language as Locale

  return (
    <Collapsible
      className="trace-card"
      strategy="mount"
      defaultOpen={false}
      title={<span className="trace-card__origin">{trace.originLabel}</span>}
      meta={<Badge tone={STATUS_TONE[trace.status]}>{t(`traces.status.${trace.status}`)}</Badge>}
    >
      <div className="trace-card__meta-row">
        <span className="trace-card__meta">
          <User size={13} aria-hidden /> {trace.triggeredBy}
        </span>
        <span className="trace-card__meta">
          <Clock size={13} aria-hidden /> {formatDate(trace.startedAt, locale)} ·{' '}
          {(trace.durationMs / 1000).toFixed(1)}
          {t('traces.secondsShort')}
        </span>
        <span className="trace-card__meta">
          <Zap size={13} aria-hidden /> {formatInt(trace.totalTokens, locale)} {t('traces.tokensShort')}{' '}
          {t('traces.totalReasoning')}
        </span>
      </div>
      <p className="trace-card__summary">{trace.summary}</p>
      <TraceStepList steps={trace.steps} />
    </Collapsible>
  )
}
