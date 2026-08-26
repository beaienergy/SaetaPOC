import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAgentModelUsage, getCostSeries, getSuccessRate, getUseCaseCosts } from '../api/mockCost'
import { CostFilters, type CostDateRange, type CostFilterState } from './CostFilters'
import { CostSummaryStats } from './CostSummaryStats'
import { CostOverTimeChart } from './CostOverTimeChart'
import { CostByUseCaseChart } from './CostByUseCaseChart'
import { AgentUsageChart } from './AgentUsageChart'
import { SuccessRateChart } from './SuccessRateChart'
import './CostDashboard.css'

/**
 * Dashboard de coste y uso (guion §5.6.1): 4 paneles con recharts + fila de
 * KPIs + filtros que funcionan de verdad sobre los datos mock. El filtro de
 * operación deja comparar coste entre `helios`/`meridian`/`solstice` sin
 * salir de la pantalla, aunque la ruta siga anclada a una operación.
 */
export function CostDashboard({ opId }: { opId: string }) {
  const { t } = useTranslation('analytics')
  const [filters, setFilters] = useState<CostFilterState>({
    operationId: opId,
    days: 30 as CostDateRange,
    agentId: 'all',
  })

  const points = useMemo(
    () => getCostSeries(filters.operationId, filters.days),
    [filters.operationId, filters.days],
  )
  const useCaseCosts = useMemo(() => getUseCaseCosts(filters.operationId), [filters.operationId])
  const agentUsage = useMemo(() => getAgentModelUsage(filters.operationId), [filters.operationId])
  const successRate = useMemo(() => getSuccessRate(filters.operationId), [filters.operationId])

  return (
    <div className="u-stack">
      <CostFilters value={filters} onChange={setFilters} />

      <CostSummaryStats points={points} useCaseCosts={useCaseCosts} successRate={successRate} />

      <div className="analytics-cost-grid">
        <CostOverTimeChart points={points} />
        <CostByUseCaseChart items={useCaseCosts} highlightAgentId={filters.agentId} />
        <AgentUsageChart items={agentUsage} highlightAgentId={filters.agentId} />
        <SuccessRateChart items={successRate} highlightAgentId={filters.agentId} />
      </div>

      <p className="analytics-footnote">{t('cost.unitFootnote')}</p>
    </div>
  )
}
