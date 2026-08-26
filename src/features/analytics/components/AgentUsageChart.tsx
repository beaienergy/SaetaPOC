import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader, Pill } from '@/shared/ui'
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
import type { AgentModelUsage } from '../types'
import type { Locale } from '@/shared/types'

/** Panel 3/4 (guion §5.6.1): consumo por agente/modelo — tokens de entrada y
 * salida por agente, con el modelo usado en cada uno como leyenda. */
export function AgentUsageChart({
  items,
  highlightAgentId,
}: {
  items: AgentModelUsage[]
  highlightAgentId: AgentId | 'all'
}) {
  const { t, i18n } = useTranslation('analytics')
  const c = useChartColors()
  const locale = i18n.language as Locale

  const data = items
    .filter((item) => highlightAgentId === 'all' || highlightAgentId === item.agentId)
    .map((item) => ({ ...item, label: t(`useCase.${item.agentId}`) }))

  return (
    <Card className="analytics-chart-card">
      <CardHeader title={t('cost.usage.title')} hint={t('cost.usage.hint')} />
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis dataKey="label" stroke={c.axis} {...CHART_AXIS} interval={0} angle={-14} textAnchor="end" height={44} />
          <YAxis stroke={c.axis} {...CHART_AXIS} width={CHART_Y_AXIS_WIDTH} />
          <Tooltip
            cursor={CHART_TOOLTIP_CURSOR}
            formatter={(value, name) => [formatInt(Number(value), locale), name]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="tokensIn" name={t('cost.usage.tokensIn')} fill={c.series[1]} radius={[3, 3, 0, 0]} />
          <Bar dataKey="tokensOut" name={t('cost.usage.tokensOut')} fill={c.series[2]} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="analytics-usage-legend">
        {items.map((item) => (
          <div key={item.agentId} className="analytics-usage-legend__row">
            <span className="analytics-usage-legend__agent">{t(`useCase.${item.agentId}`)}</span>
            <Pill variant="outline">{item.model}</Pill>
            <span className="analytics-usage-legend__calls">
              {formatInt(item.calls, locale)} {t('cost.usage.calls')}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
