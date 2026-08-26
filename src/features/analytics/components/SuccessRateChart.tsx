import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader } from '@/shared/ui'
import { useChartColors } from '@/shared/hooks'
import { formatInt, formatPercent } from '@/shared/lib/formatters'
import {
  CHART_AXIS,
  CHART_MARGIN,
  CHART_TOOLTIP_CURSOR,
  CHART_TOOLTIP_STYLE,
  CHART_Y_AXIS_WIDTH,
} from '@/shared/lib/charts'
import type { AgentId } from '@/features/agent-config'
import type { SuccessRateItem } from '../types'
import type { Locale } from '@/shared/types'

/** Panel 4/4 (guion §5.6.1): tasa de éxito/error por agente. */
export function SuccessRateChart({
  items,
  highlightAgentId,
}: {
  items: SuccessRateItem[]
  highlightAgentId: AgentId | 'all'
}) {
  const { t, i18n } = useTranslation('analytics')
  const c = useChartColors()
  const locale = i18n.language as Locale

  const data = items
    .filter((item) => highlightAgentId === 'all' || highlightAgentId === item.agentId)
    .map((item) => {
      const total = item.success + item.error
      return {
        ...item,
        label: t(`useCase.${item.agentId}`),
        errorRate: total > 0 ? item.error / total : 0,
      }
    })

  return (
    <Card className="analytics-chart-card">
      <CardHeader title={t('cost.successRate.title')} hint={t('cost.successRate.hint')} />
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
          <XAxis type="number" stroke={c.axis} {...CHART_AXIS} />
          <YAxis type="category" dataKey="label" stroke={c.axis} {...CHART_AXIS} width={110} />
          <Tooltip
            cursor={CHART_TOOLTIP_CURSOR}
            formatter={(value, name) => [formatInt(Number(value), locale), name]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="success"
            name={t('cost.successRate.success')}
            stackId="rate"
            fill={c.success}
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="error"
            name={t('cost.successRate.error')}
            stackId="rate"
            fill={c.series[3]}
            radius={[0, 3, 3, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="analytics-success-legend">
        {data.map((item) => (
          <span key={item.agentId} className="analytics-success-legend__item">
            {item.label}: {formatPercent(item.errorRate, true, { locale, digits: 1 })}{' '}
            {t('cost.successRate.errorRateLabel')}
          </span>
        ))}
      </div>
    </Card>
  )
}
