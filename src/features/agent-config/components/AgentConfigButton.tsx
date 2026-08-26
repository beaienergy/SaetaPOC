import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'
import { useDisclosure } from '@/shared/hooks'
import { AgentConfigModal } from './AgentConfigModal'
import type { AgentId } from '../types'
import './AgentConfigButton.css'

/**
 * Icono de engranaje (guion §1.4): junto al nombre/salida de todo agente que
 * trabaja en la app. Ver §6 para dónde aparece cada `agentId`.
 */
export function AgentConfigButton({ opId, agentId }: { opId: string; agentId: AgentId }) {
  const { t } = useTranslation('agentConfig')
  const modal = useDisclosure()

  return (
    <>
      <button
        type="button"
        className="agent-config-trigger"
        onClick={modal.open}
        aria-label={t('trigger')}
        title={t('trigger')}
      >
        <Settings size={16} />
      </button>
      {modal.isOpen && <AgentConfigModal opId={opId} agentId={agentId} onClose={modal.close} />}
    </>
  )
}
