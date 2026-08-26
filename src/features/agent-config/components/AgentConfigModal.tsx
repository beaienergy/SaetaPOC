import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateCcw, Save, ShieldCheck } from 'lucide-react'
import { Button, Modal, Pill, Textarea } from '@/shared/ui'
import { useRoleStore } from '@/shared/stores'
import { useAgentConfig, useAgentConfigStore } from '../store/agentConfigStore'
import { SkillList } from './SkillList'
import type { AgentId } from '../types'
import './AgentConfigModal.css'

/**
 * Modal "config de agente" (guion §1.4): Prompt editable, Skills (add/editar/
 * borrar) y chips de solo lectura para Modelo/Tools/Middleware. Un único
 * componente reutilizable — se abre igual desde Chat, Resumen, KIL, Modelo
 * financiero e Informes (ver §6), solo cambia `agentId`.
 */
export function AgentConfigModal({
  opId,
  agentId,
  onClose,
}: {
  opId: string
  agentId: AgentId
  onClose: () => void
}) {
  const { t } = useTranslation('agentConfig')
  const config = useAgentConfig(opId, agentId)
  const updatePrompt = useAgentConfigStore((s) => s.updatePrompt)
  const resetPrompt = useAgentConfigStore((s) => s.resetPrompt)
  const role = useRoleStore((s) => s.role)
  const isAdmin = role === 'admin'

  const [draftPrompt, setDraftPrompt] = useState(config.prompt)
  const [savedFlash, setSavedFlash] = useState(false)

  // Si se cambia de operación/agente con el modal abierto (no debería, pero
  // por si acaso), el borrador sigue al config que se está mirando.
  useEffect(() => setDraftPrompt(config.prompt), [config.prompt])

  const dirty = draftPrompt !== config.prompt

  function handleSave() {
    updatePrompt(opId, agentId, draftPrompt)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  function handleReset() {
    resetPrompt(opId, agentId)
  }

  return (
    <Modal title={config.agentName} onClose={onClose} maxWidth={680}>
      <section className="agent-config__section">
        <div className="agent-config__section-title">{t('prompt.title')}</div>
        <p className="agent-config__section-hint">{t('prompt.hint')}</p>
        <Textarea
          value={draftPrompt}
          rows={8}
          disabled={!isAdmin}
          onChange={(e) => setDraftPrompt(e.target.value)}
          aria-label={t('prompt.title')}
        />
        <div className="agent-config__prompt-actions">
          <Button
            variant="primary"
            size="sm"
            icon={<Save size={14} aria-hidden />}
            disabled={!isAdmin || !dirty}
            onClick={handleSave}
          >
            {t('prompt.save')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} aria-hidden />}
            disabled={!isAdmin}
            onClick={handleReset}
          >
            {t('prompt.reset')}
          </Button>
          {savedFlash && <span className="agent-config__saved">{t('prompt.saved')}</span>}
        </div>
      </section>

      <section className="agent-config__section">
        <div className="agent-config__section-title">{t('skills.title')}</div>
        <p className="agent-config__section-hint">{t('skills.hint')}</p>
        <SkillList opId={opId} readOnly={!isAdmin} />
      </section>

      <section className="agent-config__section">
        <div className="agent-config__section-title">
          <ShieldCheck size={14} aria-hidden style={{ verticalAlign: -2, marginRight: 4 }} />
          {t('readOnly.title')}
        </div>
        <p className="agent-config__section-hint">{t('readOnly.hint')}</p>

        <div className="agent-config__chip-group">
          <span className="agent-config__chip-label">{t('readOnly.model')}</span>
          <Pill variant="outline">{config.model}</Pill>
        </div>
        <div className="agent-config__chip-group">
          <span className="agent-config__chip-label">{t('readOnly.tools')}</span>
          {config.tools.map((tool) => (
            <Pill key={tool} variant="outline">
              {tool}
            </Pill>
          ))}
        </div>
        <div className="agent-config__chip-group">
          <span className="agent-config__chip-label">{t('readOnly.middleware')}</span>
          {config.middleware.map((mw) => (
            <Pill key={mw} variant="outline">
              {mw}
            </Pill>
          ))}
        </div>
      </section>
    </Modal>
  )
}
