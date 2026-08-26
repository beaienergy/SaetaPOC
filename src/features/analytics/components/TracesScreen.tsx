import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Route } from 'lucide-react'
import { EmptyState } from '@/shared/ui'
import { getExecutionTraces } from '../api/mockTraces'
import { TraceFilters, type TraceFilterState } from './TraceFilters'
import { ExecutionTraceCard } from './ExecutionTraceCard'
import './ExecutionTraceList.css'

/**
 * Traza de ejecución / razonamiento (guion §5.6.2): log expandible de cada
 * ejecución de un flow o agente, con qué operación la originó, qué modelo se
 * usó en cada paso interno, y el resultado — demuestra que el razonamiento
 * interno es tan observable como cualquier llamada directa.
 */
export function TracesScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('analytics')
  const [filters, setFilters] = useState<TraceFilterState>({
    operationId: opId,
    agentId: 'all',
    status: 'all',
  })

  const traces = useMemo(() => {
    const all = getExecutionTraces(filters.operationId)
    return all.filter((trace) => {
      if (filters.agentId !== 'all' && trace.agentId !== filters.agentId) return false
      if (filters.status !== 'all' && trace.status !== filters.status) return false
      return true
    })
  }, [filters])

  return (
    <div className="u-stack">
      <TraceFilters value={filters} onChange={setFilters} />

      {traces.length === 0 ? (
        <EmptyState icon={<Route size={28} aria-hidden />} message={t('traces.empty')} />
      ) : (
        <div className="trace-list">
          {traces.map((trace) => (
            <ExecutionTraceCard key={trace.id} trace={trace} />
          ))}
        </div>
      )}
    </div>
  )
}
