import { useTranslation } from 'react-i18next'
import { Card, Select } from '@/shared/ui'
import { MOCK_OPERATIONS } from '@/features/operations'
import { USE_CASE_ORDER } from '../api/mockCost'
import type { AgentId } from '@/features/agent-config'
import './Filters.css'

export type CostDateRange = 7 | 30 | 90

export interface CostFilterState {
  operationId: string
  days: CostDateRange
  agentId: AgentId | 'all'
}

/** Filtros del dashboard de coste (guion §5.6.1): operación, rango de fechas
 * y agente — funcionan de verdad sobre los propios datos mock, no son
 * decorativos. El filtro de operación permite comparar coste entre las 3
 * operaciones de ejemplo sin salir de la pantalla. */
export function CostFilters({
  value,
  onChange,
}: {
  value: CostFilterState
  onChange: (next: CostFilterState) => void
}) {
  const { t } = useTranslation('analytics')

  return (
    <Card className="analytics-filters">
      <div className="analytics-filters__field">
        <span className="analytics-filters__label">{t('filters.operation')}</span>
        <Select
          aria-label={t('filters.operation')}
          value={value.operationId}
          onChange={(e) => onChange({ ...value, operationId: e.target.value })}
          options={MOCK_OPERATIONS.map((op) => ({ value: op.id, label: op.name }))}
        />
      </div>
      <div className="analytics-filters__field">
        <span className="analytics-filters__label">{t('filters.dateRange')}</span>
        <Select
          aria-label={t('filters.dateRange')}
          value={String(value.days)}
          onChange={(e) => onChange({ ...value, days: Number(e.target.value) as CostDateRange })}
          options={[
            { value: '7', label: t('filters.last7') },
            { value: '30', label: t('filters.last30') },
            { value: '90', label: t('filters.last90') },
          ]}
        />
      </div>
      <div className="analytics-filters__field">
        <span className="analytics-filters__label">{t('filters.agent')}</span>
        <Select
          aria-label={t('filters.agent')}
          value={value.agentId}
          onChange={(e) => onChange({ ...value, agentId: e.target.value as AgentId | 'all' })}
          options={[
            { value: 'all', label: t('filters.allAgents') },
            ...USE_CASE_ORDER.map((id) => ({ value: id, label: t(`useCase.${id}`) })),
          ]}
        />
      </div>
      <span className="analytics-filters__note">{t('filters.unitNote')}</span>
    </Card>
  )
}
