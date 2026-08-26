import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader } from '@/shared/ui'
import { useChartColors } from '@/shared/hooks'
import { formatInt } from '@/shared/lib/formatters'
import {
  CHART_AXIS,
  CHART_MARGIN,
  CHART_TOOLTIP_CURSOR,
  CHART_TOOLTIP_STYLE,
  CHART_Y_AXIS_WIDTH,
} from '@/shared/lib/charts'
import type { AgentId } from '@/features/agent-config'
import type { UseCaseCost } from '../types'
import type { Locale } from '@/shared/types'

/** Panel 2/4 (guion §5.6.1): coste por caso de uso / agente — mismo orden de
 * magnitud que el ejemplo de la propuesta BEAI (Consulta ~120, Resumen ~240,
 * KIL ~420, Modelo financiero ~310), en unidades de coste arbitrarias. */
export function CostByUseCaseChart({
  items,
  highlightAgentId,
}: {
  items: UseCaseCost[]
  highlightAgentId: AgentId | 'all'
}) {
  const { t, i18n } = useTranslation('analytics')
  const c = useChartColors()
  const locale = i18n.language as Locale

  const data = items.map((item) => ({ ...item, label: t(`useCase.${item.agentId}`) }))

  return (
    <Card className="analytics-chart-card">
      <CardHeader title={t('cost.byUseCase.title')} hint={t('cost.byUseCase.hint')} />
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis dataKey="label" stroke={c.axis} {...CHART_AXIS} interval={0} angle={-14} textAnchor="end" height={44} />
          <YAxis stroke={c.axis} {...CHART_AXIS} width={CHART_Y_AXIS_WIDTH} />
          <Tooltip
            cursor={CHART_TOOLTIP_CURSOR}
            formatter={(value) => [`${formatInt(Number(value), locale)} ${t('cost.unit')}`, t('cost.byUseCase.series')]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Bar dataKey="cost" name={t('cost.byUseCase.series')} radius={[4, 4, 0, 0]}>
            {data.map((item) => (
              <Cell
                key={item.agentId}
                fill={c.primary}
                opacity={highlightAgentId === 'all' || highlightAgentId === item.agentId ? 1 : 0.32}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
