import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { Button, LabeledField, Modal, Select, Textarea } from '@/shared/ui'
import { useSummaryStore } from '../store/summaryStore'
import { DEAL_PHASES, type DealPhase } from '../types'
import './ChangePhaseModal.css'

/**
 * Edición manual de la fase de la operación (pedido explícito): un único
 * popup que combina elegir la fase nueva, confirmar el cambio y dejar
 * contexto — en vez de dos pasos separados. Sin backend real: el contexto se
 * guarda junto a la fase (`tracking.phaseNote`) y se enseña bajo el stepper,
 * no es solo un campo que desaparece al confirmar.
 */
export function ChangePhaseModal({
  opId,
  currentPhase,
  onClose,
}: {
  opId: string
  currentPhase: DealPhase
  onClose: () => void
}) {
  const { t } = useTranslation('summary')
  const { t: tCommon } = useTranslation('common')
  const updatePhase = useSummaryStore((s) => s.updatePhase)
  const [phase, setPhase] = useState<DealPhase>(currentPhase)
  const [note, setNote] = useState('')

  const isChanged = phase !== currentPhase

  function handleConfirm() {
    if (!isChanged) return
    updatePhase(opId, phase, note)
    onClose()
  }

  return (
    <Modal title={t('tracking.changePhase.title')} onClose={onClose} maxWidth={480}>
      <div className="change-phase">
        <LabeledField label={t('tracking.changePhase.phaseLabel')} htmlFor="change-phase-select">
          <Select
            id="change-phase-select"
            value={phase}
            onChange={(e) => setPhase(e.target.value as DealPhase)}
            options={DEAL_PHASES.map((step) => ({ value: step, label: t(`tracking.phases.${step}`) }))}
          />
        </LabeledField>

        {isChanged && (
          <p className="change-phase__confirm">
            <AlertTriangle size={14} aria-hidden />
            {t('tracking.changePhase.confirmMessage', {
              from: t(`tracking.phases.${currentPhase}`),
              to: t(`tracking.phases.${phase}`),
            })}
          </p>
        )}

        <LabeledField label={t('tracking.changePhase.noteLabel')}>
          <Textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('tracking.changePhase.notePlaceholder')}
          />
        </LabeledField>

        <div className="change-phase__actions">
          <Button variant="ghost" onClick={onClose}>
            {tCommon('actions.cancel')}
          </Button>
          <Button variant="primary" disabled={!isChanged} onClick={handleConfirm}>
            {t('tracking.changePhase.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
