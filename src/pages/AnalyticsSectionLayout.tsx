import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Gauge, Route, BrainCog } from 'lucide-react'
import { SectionShell } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'

/** Analítica IA (guion §1.3 + §5.6, solo admin — la guarda vive en el router):
 * coste y uso, trazas de ejecución, memoria a largo plazo. */
export default function AnalyticsSectionLayout() {
  const { t } = useTranslation('nav')
  const { opId = '' } = useParams()

  return (
    <SectionShell
      title={t('items.analytics')}
      items={[
        {
          key: 'cost',
          label: t('analyticsNav.cost'),
          to: ROUTES.operationAnalyticsCost(opId),
          icon: <Gauge size={16} aria-hidden />,
        },
        {
          key: 'traces',
          label: t('analyticsNav.traces'),
          to: ROUTES.operationAnalyticsTraces(opId),
          icon: <Route size={16} aria-hidden />,
        },
        {
          key: 'memory',
          label: t('analyticsNav.memory'),
          to: ROUTES.operationAnalyticsMemory(opId),
          icon: <BrainCog size={16} aria-hidden />,
        },
      ]}
    />
  )
}
