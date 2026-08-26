import { useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, UploadCloud } from 'lucide-react'
import { Modal, Spinner } from '@/shared/ui'
import { cn, sleep } from '@/shared/lib/utils'
import { useAuthStore } from '@/features/auth'
import { useDocumentsStore } from '../store/documentsStore'
import './ManualUploadModal.css'

const AUTO_CLOSE_MS = 1100

/**
 * Segundo popup de "Subir manualmente" (pedido explícito): una zona de
 * arrastrar y soltar de verdad — responde a dragenter/dragover/drop, no solo
 * a un clic — aunque, como el resto de la POC, no procesa ningún fichero
 * real: soltar o hacer clic simula la misma subida mock que ya hacía la
 * antigua `UploadDropzone`.
 */
export function ManualUploadModal({
  opId,
  onClose,
  onUploaded,
}: {
  opId: string
  onClose: () => void
  onUploaded: () => void
}) {
  const { t } = useTranslation('documents')
  const user = useAuthStore((s) => s.user)
  const addUploadedDocument = useDocumentsStore((s) => s.addUploadedDocument)
  const setDocumentStatus = useDocumentsStore((s) => s.setDocumentStatus)

  const [isDragOver, setIsDragOver] = useState(false)
  const [status, setStatus] = useState<'idle' | 'working' | 'done'>('idle')

  async function runUpload() {
    if (status !== 'idle') return
    setStatus('working')
    const documentId = addUploadedDocument(opId, user?.name ?? 'Demo user')
    await sleep(1000)
    setDocumentStatus(opId, documentId, 'indexed')
    setStatus('done')
    onUploaded()
    await sleep(AUTO_CLOSE_MS)
    onClose()
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (status === 'idle') setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    void runUpload()
  }

  return (
    <Modal title={t('upload.manual.title')} onClose={onClose} maxWidth={480}>
      <div
        className={cn(
          'manual-upload-drop',
          isDragOver && 'is-drag-over',
          status === 'done' && 'is-done',
        )}
        role="button"
        tabIndex={0}
        onClick={() => void runUpload()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && runUpload()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {status === 'working' && <Spinner size={22} />}
        {status === 'done' && <CheckCircle2 size={22} aria-hidden />}
        {status === 'idle' && <UploadCloud size={22} aria-hidden />}

        <span className="manual-upload-drop__title">
          {status === 'working'
            ? t('upload.manual.working')
            : status === 'done'
              ? t('upload.manual.done')
              : t('upload.dragDrop.title')}
        </span>
        {status === 'idle' && <span className="manual-upload-drop__hint">{t('upload.dragDrop.hint')}</span>}
      </div>
    </Modal>
  )
}
