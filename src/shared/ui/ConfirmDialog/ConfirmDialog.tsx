import type { ReactNode } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui/Button/Button'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  title: string
  /** Qué va a pasar exactamente, y si se puede deshacer. */
  body: ReactNode
  cancelLabel: string
  confirmLabel: string
  /** Aspecto del botón que confirma: `success` para validar, `secondary` para borrar. */
  confirmVariant?: 'primary' | 'secondary' | 'success'
  confirmIcon?: ReactNode
  /** Mientras la mutación está en vuelo: deshabilita y muestra el spinner. */
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * El paso intermedio de una acción que no se puede deshacer: validar una
 * respuesta (se envía al solicitante y cierra el ticket) o borrar un fichero del
 * conocimiento.
 *
 * Vive en `shared/ui` y no en cada feature porque las dos copias que había eran
 * idénticas hasta en el CSS, y lo único que cambiaba entre ellas era el color y
 * el icono del botón de confirmar — que ya son props.
 *
 * NO lleva un `variant="danger"`: en esta consola el rojo está reservado a la
 * prioridad urgente y a los errores, así que un rojo aquí se leería como "algo
 * ha fallado" en vez de "confirma que quieres seguir".
 */
export function ConfirmDialog({
  title,
  body,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'secondary',
  confirmIcon,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirm-dialog">
        <p>{body}</p>
        <div className="confirm-dialog__buttons">
          {/* Cancelar va primero y en `ghost`: la salida sin consecuencias no
              tiene que competir visualmente con la acción que sí las tiene. */}
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} icon={confirmIcon} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
