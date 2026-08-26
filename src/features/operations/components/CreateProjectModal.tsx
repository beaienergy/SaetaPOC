import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, FolderSync, Plus } from 'lucide-react'
import { Modal, Button, Input, LabeledField } from '@/shared/ui'
import { sleep } from '@/shared/lib/utils'
import './CreateProjectModal.css'

type ConnectStatus = 'idle' | 'connecting' | 'connected'

/**
 * Popup de "+ Crear Proyecto" (guion, pedido explícito): nombre + conexión a
 * SharePoint. Sin backend real (alcance de esta POC): "conectar" es un sleep
 * que deja un estado visualmente completo, no un botón muerto — igual que el
 * resto de acciones simuladas del repo (`ManualUploadModal`, etc.).
 */
export function CreateProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const { t } = useTranslation('operations')
  const [name, setName] = useState('')
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>('idle')

  async function handleConnect() {
    if (connectStatus !== 'idle') return
    setConnectStatus('connecting')
    await sleep(900)
    setConnectStatus('connected')
  }

  const trimmedName = name.trim()
  const canCreate = trimmedName.length > 0 && connectStatus === 'connected'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canCreate) return
    onCreate(trimmedName)
  }

  return (
    <Modal title={t('newOperation.modalTitle')} onClose={onClose} maxWidth={440}>
      <form className="create-project" onSubmit={handleSubmit}>
        <LabeledField label={t('newOperation.nameLabel')} htmlFor="new-op-name">
          <Input
            id="new-op-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('newOperation.namePlaceholder')}
            autoFocus
          />
        </LabeledField>

        <div>
          <Button
            type="button"
            variant={connectStatus === 'connected' ? 'success' : 'secondary'}
            fullWidth
            icon={
              connectStatus === 'connected' ? (
                <CheckCircle2 size={16} aria-hidden />
              ) : (
                <FolderSync size={16} aria-hidden />
              )
            }
            loading={connectStatus === 'connecting'}
            disabled={connectStatus === 'connected'}
            onClick={handleConnect}
          >
            {connectStatus === 'connected'
              ? t('newOperation.connected')
              : connectStatus === 'connecting'
                ? t('newOperation.connecting')
                : t('newOperation.connect')}
          </Button>
          {connectStatus === 'connected' && (
            <p className="create-project__connected-path">
              {t('newOperation.connectedPath', { name: trimmedName })}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={!canCreate} icon={<Plus size={16} aria-hidden />}>
          {t('newOperation.submit')}
        </Button>
      </form>
    </Modal>
  )
}
