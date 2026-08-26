import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PageHeader, Card } from '@/shared/ui'
import { AgentConfigButton, SkillList, useAgentConfig } from '@/features/agent-config'
import type { AgentId } from '@/features/agent-config'
import './DocumentsKnowledgePage.css'

const AGENT_IDS: AgentId[] = [
  'chat',
  'summary-overview',
  'key-issues',
  'financial-audit',
  'reports',
]

/**
 * Conocimiento base / Skills del agente (guion §5.2.2, solo admin — la guarda
 * vive en el router). No es la memoria de largo plazo (esa vive en Analítica
 * IA): esto es el conocimiento sembrado de antemano. Misma `SkillList` que el
 * modal de config de agente (§1.4), aquí en vista de listado/gestión; el
 * acceso a cada prompt enlaza al mismo modal, no a un formulario distinto.
 *
 * NOTA para quien construya el resto de `documents`: las claves `documents:
 * knowledge.title` y `documents:knowledge.agentsTitle` ya se usan aquí con
 * fallback en inglés — añádelas a `documents.json` (en/es) en vez de crear
 * otras nuevas para lo mismo.
 */
export default function DocumentsKnowledgePage() {
  const { t: tDocs } = useTranslation('documents')
  const { opId = '' } = useParams()

  return (
    <div className="u-stack">
      <PageHeader
        title={tDocs('knowledge.title', 'Knowledge base')}
        subtitle={tDocs('knowledge.description')}
      />

      <SkillList opId={opId} />

      <Card>
        <div className="kb-agents__title">{tDocs('knowledge.agentsTitle', 'Agent prompts')}</div>
        {AGENT_IDS.map((agentId) => (
          <AgentRow key={agentId} opId={opId} agentId={agentId} />
        ))}
      </Card>
    </div>
  )
}

function AgentRow({ opId, agentId }: { opId: string; agentId: AgentId }) {
  const config = useAgentConfig(opId, agentId)
  return (
    <div className="kb-agents__row">
      <span>{config.agentName}</span>
      <AgentConfigButton opId={opId} agentId={agentId} />
    </div>
  )
}
