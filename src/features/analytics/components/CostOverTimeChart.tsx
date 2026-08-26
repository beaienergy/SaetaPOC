import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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
import type { CostPoint } from '../types'
import type { Locale } from '@/shared/types'

/** Panel 1/4 del dashboard de coste (guion §5.6.1): coste en el tiempo. */
export function CostOverTimeChart({ points }: { points: CostPoint[] }) {
  const { t, i18n } = useTranslation('analytics')
  const c = useChartColors()
  const locale = i18n.language as Locale

  const total = useMemo(() => points.reduce((sum, p) => sum + p.cost, 0), [points])

  const tickFormatter = (value: string) => {
    const d = new Date(value)
    return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <Card className="analytics-chart-card">
      <CardHeader
        title={t('cost.overTime.title')}
        hint={t('cost.overTime.hint')}
        actions={
          <span className="analytics-chart-card__total">
            {t('cost.overTime.total')}: {formatInt(total, locale)} {t('cost.unit')}
          </span>
        }
      />
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={points} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="analytics-cost-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.primary} stopOpacity={0.35} />
              <stop offset="100%" stopColor={c.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="date"
            stroke={c.axis}
            {...CHART_AXIS}
            tickFormatter={tickFormatter}
            minTickGap={24}
          />
          <YAxis stroke={c.axis} {...CHART_AXIS} width={CHART_Y_AXIS_WIDTH} />
          <Tooltip
            cursor={CHART_TOOLTIP_CURSOR}
            labelFormatter={(value) => tickFormatter(String(value))}
            formatter={(value) => [`${formatInt(Number(value), locale)} ${t('cost.unit')}`, t('cost.overTime.series')]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Area
            type="monotone"
            dataKey="cost"
            name={t('cost.overTime.series')}
            stroke={c.primary}
            fill="url(#analytics-cost-fill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
