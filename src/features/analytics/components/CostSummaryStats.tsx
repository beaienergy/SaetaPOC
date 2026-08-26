import { useTranslation } from 'react-i18next'
import { Coins, Gauge, ListChecks, TriangleAlert } from 'lucide-react'
import { StatCard } from '@/shared/ui'
import { formatInt, formatPercent } from '@/shared/lib/formatters'
import type { CostPoint, SuccessRateItem, UseCaseCost } from '../types'
import type { Locale } from '@/shared/types'

/** Fila de KPIs sobre los 4 paneles: da el titular del dashboard antes de
 * entrar en el detalle por gráfica (mismo patrón que el resumen de coste del
 * proyecto de referencia). */
export function CostSummaryStats({
  points,
  useCaseCosts,
  successRate,
}: {
  points: CostPoint[]
  useCaseCosts: UseCaseCost[]
  successRate: SuccessRateItem[]
}) {
  const { t, i18n } = useTranslation('analytics')
  const locale = i18n.language as Locale

  const totalCost = points.reduce((sum, p) => sum + p.cost, 0)
  const totalCalls = useCaseCosts.reduce((sum, u) => sum + u.calls, 0)
  const totals = successRate.reduce(
    (acc, s) => ({ success: acc.success + s.success, error: acc.error + s.error }),
    { success: 0, error: 0 },
  )
  const totalRuns = totals.success + totals.error
  const errorRate = totalRuns > 0 ? totals.error / totalRuns : 0
  const topUseCase = [...useCaseCosts].sort((a, b) => b.cost - a.cost)[0]

  return (
    <div className="analytics-stat-row">
      <StatCard
        label={t('cost.stats.totalCost')}
        value={`${formatInt(totalCost, locale)} ${t('cost.unit')}`}
        icon={<Coins size={16} aria-hidden />}
      />
      <StatCard
        label={t('cost.stats.totalCalls')}
        value={formatInt(totalCalls, locale)}
        icon={<ListChecks size={16} aria-hidden />}
      />
      <StatCard
        label={t('cost.stats.errorRate')}
        value={formatPercent(errorRate, true, { locale, digits: 1 })}
        icon={<TriangleAlert size={16} aria-hidden />}
        iconTone={errorRate > 0.03 ? 'warning' : 'success'}
      />
      <StatCard
        label={t('cost.stats.topUseCase')}
        value={topUseCase ? t(`useCase.${topUseCase.agentId}`) : '—'}
        subtitle={topUseCase ? `${formatInt(topUseCase.cost, locale)} ${t('cost.unit')}` : undefined}
        icon={<Gauge size={16} aria-hidden />}
      />
    </div>
  )
}
