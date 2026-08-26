import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import { getFinancialModelData } from '../api/mockFinancialModel'
import { WorkingCopyBanner } from './WorkingCopyBanner'
import { FinancialModelFileList } from './FinancialModelFileList'
import { AuditPanel } from './AuditPanel'
import { SensitivitiesTable } from './SensitivitiesTable'

/**
 * Modelo financiero (guion §5.4, UC-07): banner fijo de "trabajando sobre una
 * copia", lista de modelos cargados, auditoria de consistencia simulada y
 * sensibilidades opcionales. Contenido mock keyed por operacion.
 */
export function FinancialModelScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('financialModel')
  const data = getFinancialModelData(opId)

  return (
    <div className="u-stack">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={<AgentConfigButton opId={opId} agentId="financial-audit" />}
      />

      <WorkingCopyBanner />

      <FinancialModelFileList files={data.files} />

      <AuditPanel opId={opId} findings={data.findings} />

      <SensitivitiesTable rows={data.sensitivities} />
    </div>
  )
}
