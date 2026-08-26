import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { FileSearch, ListChecks, GitCompare, ListTodo } from 'lucide-react'
import { SectionShell } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'

/** Resumen de la operación (guion §1.3 + §5.3): overview, KIL, hechos vs
 * conclusiones, seguimiento. */
export default function SummarySectionLayout() {
  const { t } = useTranslation('nav')
  const { opId = '' } = useParams()

  return (
    <SectionShell
      title={t('items.summary')}
      items={[
        {
          key: 'overview',
          label: t('summaryNav.overview'),
          to: ROUTES.operationSummaryOverview(opId),
          icon: <FileSearch size={16} aria-hidden />,
        },
        {
          key: 'keyIssues',
          label: t('summaryNav.keyIssues'),
          to: ROUTES.operationSummaryKeyIssues(opId),
          icon: <ListChecks size={16} aria-hidden />,
        },
        {
          key: 'facts',
          label: t('summaryNav.facts'),
          to: ROUTES.operationSummaryFacts(opId),
          icon: <GitCompare size={16} aria-hidden />,
        },
        {
          key: 'tracking',
          label: t('summaryNav.tracking'),
          to: ROUTES.operationSummaryTracking(opId),
          icon: <ListTodo size={16} aria-hidden />,
        },
      ]}
    />
  )
}
