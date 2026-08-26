import { useTranslation } from 'react-i18next'
import { Card, Select } from '@/shared/ui'
import { MOCK_OPERATIONS } from '@/features/operations'
import { USE_CASE_ORDER } from '../api/mockCost'
import type { AgentId } from '@/features/agent-config'
import type { TraceStatus } from '../types'
import './Filters.css'

export interface TraceFilterState {
  operationId: string
  agentId: AgentId | 'all'
  status: TraceStatus | 'all'
}

/** Filtros de la traza de ejecución (guion §5.6.2): operación, agente y
 * estado — sobre el propio listado mock, igual que en Coste y uso. */
export function TraceFilters({
  value,
  onChange,
}: {
  value: TraceFilterState
  onChange: (next: TraceFilterState) => void
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
      <div className="analytics-filters__field">
        <span className="analytics-filters__label">{t('filters.status')}</span>
        <Select
          aria-label={t('filters.status')}
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as TraceStatus | 'all' })}
          options={[
            { value: 'all', label: t('filters.allStatuses') },
            { value: 'success', label: t('traces.status.success') },
            { value: 'partial', label: t('traces.status.partial') },
            { value: 'error', label: t('traces.status.error') },
          ]}
        />
      </div>
    </Card>
  )
}
