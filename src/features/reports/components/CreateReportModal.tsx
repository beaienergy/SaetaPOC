import { useRef, useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Sparkles, UploadCloud, X } from 'lucide-react'
import { Button, Input, LabeledField, Modal, Textarea } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useReportsStore } from '../store/reportsStore'
import './CreateReportModal.css'

/**
 * Popup "+ Crear nuevo informe" (pedido explícito): nombre, plantilla de
 * documento en drag-and-drop (opcional — no se procesa de verdad, solo se
 * recuerda que se aportó una) y el prompt libre que describe lo que tiene
 * que hacer el agente. Sustituye por completo al paso de "elegir secciones y
 * fuentes" — más simple, y suficiente para lo que pide esta POC.
 */
export function CreateReportModal({
  opId,
  onClose,
  onCreated,
}: {
  opId: string
  onClose: () => void
  onCreated: (cardId: string) => void
}) {
  const { t } = useTranslation('reports')
  const createCustomReport = useReportsStore((s) => s.createCustomReport)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = name.trim().length > 0 && prompt.trim().length > 0 && !isSubmitting

  async function handleSubmit() {
    if (!canSubmit) return
    setIsSubmitting(true)
    const cardId = await createCustomReport(opId, {
      name: name.trim(),
      prompt: prompt.trim(),
      hasTemplateFile: !!fileName,
    })
    onCreated(cardId)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setFileName(file.name)
  }

  return (
    <Modal title={t('create.title')} onClose={onClose} maxWidth={520}>
      <div className="create-report">
        <LabeledField label={t('create.nameLabel')} htmlFor="create-report-name">
          <Input
            id="create-report-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('create.namePlaceholder')}
            autoFocus
          />
        </LabeledField>

        <div className="create-report__field">
          <span className="labeled-field__label">{t('create.templateLabel')}</span>
          <div
            className={cn('create-report__drop', isDragOver && 'is-drag-over', fileName && 'has-file')}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="create-report__file-input"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            {fileName ? (
              <>
                <CheckCircle2 size={18} aria-hidden />
                <span className="create-report__drop-title">{fileName}</span>
                <button
                  type="button"
                  className="create-report__drop-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFileName(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  aria-label={t('create.removeTemplate')}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <UploadCloud size={18} aria-hidden />
                <span className="create-report__drop-title">{t('create.templateDropTitle')}</span>
                <span className="create-report__drop-hint">{t('create.templateDropHint')}</span>
              </>
            )}
          </div>
        </div>

        <LabeledField label={t('create.promptLabel')} htmlFor="create-report-prompt">
          <Textarea
            id="create-report-prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('create.promptPlaceholder')}
          />
        </LabeledField>

        <div className="create-report__actions">
          <Button variant="ghost" onClick={onClose}>
            {t('create.cancel')}
          </Button>
          <Button
            variant="primary"
            icon={<Sparkles size={15} aria-hidden />}
            loading={isSubmitting}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? t('create.generating') : t('create.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
