import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button, PageHeader } from '@/shared/ui'
import { useDisclosure } from '@/shared/hooks'
import {
  DocumentDetailModal,
  DocumentsTable,
  UploadDocumentModal,
  useDocuments,
  type KbDocument,
} from '@/features/documents'

/**
 * Documentación — ingesta de conocimiento (guion §5.2, R-05, E-08): tabla del
 * dataroom de la operación y panel de detalle al abrir un documento. Subir
 * documentación vive en un modal con dos vías (manual / SharePoint), no en
 * una zona de drag & drop en el centro de la pantalla (pedido explícito).
 */
export default function DocumentsPage() {
  const { t } = useTranslation('documents')
  const { opId = '' } = useParams()
  const documents = useDocuments(opId)
  const [activeDocument, setActiveDocument] = useState<KbDocument | null>(null)
  const uploadModal = useDisclosure()

  return (
    <div className="u-stack">
      <PageHeader
        title={t('title')}
        actions={
          <Button variant="accent" size="sm" icon={<Plus size={14} aria-hidden />} onClick={uploadModal.open}>
            {t('upload.cta')}
          </Button>
        }
      />

      <DocumentsTable documents={documents} onOpen={setActiveDocument} />

      {activeDocument && (
        <DocumentDetailModal document={activeDocument} onClose={() => setActiveDocument(null)} />
      )}

      {uploadModal.isOpen && <UploadDocumentModal opId={opId} onClose={uploadModal.close} />}
    </div>
  )
}
