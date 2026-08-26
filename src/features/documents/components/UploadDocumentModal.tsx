import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Link2, UploadCloud } from 'lucide-react'
import { Modal, Spinner } from '@/shared/ui'
import { sleep } from '@/shared/lib/utils'
import { useDocumentsStore } from '../store/documentsStore'
import { ManualUploadModal } from './ManualUploadModal'
import './UploadDocumentModal.css'

/**
 * Modal de "Subir documentación" (pedido explícito): dos vías, ninguna
 * procesa un fichero real. "Subir manualmente" abre un segundo popup con una
 * zona de arrastrar y soltar (`ManualUploadModal`) — pedido explícito
 * también, en vez de subir directamente desde esta tarjeta. "Conectar con
 * SharePoint" simula una sincronización más larga y añade varios documentos
 * de golpe, para contar la historia del conector sin implementarlo de verdad
 * (la RFP lo pide como fuente documental preferente).
 */
export function UploadDocumentModal({ opId, onClose }: { opId: string; onClose: () => void }) {
  const { t } = useTranslation('documents')
  const addUploadedDocument = useDocumentsStore((s) => s.addUploadedDocument)
  const setDocumentStatus = useDocumentsStore((s) => s.setDocumentStatus)

  const [manualOpen, setManualOpen] = useState(false)
  const [manualDone, setManualDone] = useState(false)
  const [sharepointWorking, setSharepointWorking] = useState(false)
  const [sharepointCount, setSharepointCount] = useState<number | null>(null)

  async function handleSharePoint() {
    if (sharepointWorking) return
    setSharepointWorking(true)
    await sleep(1600)
    const ids = [
      addUploadedDocument(opId, 'SharePoint sync'),
      addUploadedDocument(opId, 'SharePoint sync'),
    ]
    await sleep(500)
    ids.forEach((id) => setDocumentStatus(opId, id, 'indexed'))
    setSharepointWorking(false)
    setSharepointCount(ids.length)
  }

  return (
    <>
      <Modal title={t('upload.modalTitle')} onClose={onClose} maxWidth={560}>
        <div className="upload-modal__options">
          <button
            type="button"
            className="upload-modal__option"
            onClick={() => setManualOpen(true)}
            disabled={manualDone}
          >
            <span className="upload-modal__option-icon" aria-hidden>
              <UploadCloud size={18} />
            </span>
            <span className="upload-modal__option-title">{t('upload.manual.title')}</span>
            <span className="upload-modal__option-desc">{t('upload.manual.description')}</span>
            {manualDone && (
              <span className="upload-modal__option-status is-done">
                <CheckCircle2 size={13} /> {t('upload.manual.done')}
              </span>
            )}
          </button>

          <button
            type="button"
            className="upload-modal__option"
            onClick={handleSharePoint}
            disabled={sharepointWorking || sharepointCount !== null}
          >
            <span className="upload-modal__option-icon" aria-hidden>
              <Link2 size={18} />
            </span>
            <span className="upload-modal__option-title">{t('upload.sharepoint.title')}</span>
            <span className="upload-modal__option-desc">{t('upload.sharepoint.description')}</span>
            {sharepointWorking && (
              <span className="upload-modal__option-status">
                <Spinner size={13} /> {t('upload.sharepoint.working')}
              </span>
            )}
            {sharepointCount !== null && (
              <span className="upload-modal__option-status is-done">
                <CheckCircle2 size={13} /> {t('upload.sharepoint.done', { count: sharepointCount })}
              </span>
            )}
          </button>
        </div>
      </Modal>

      {manualOpen && (
        <ManualUploadModal
          opId={opId}
          onClose={() => setManualOpen(false)}
          onUploaded={() => setManualDone(true)}
        />
      )}
    </>
  )
}
