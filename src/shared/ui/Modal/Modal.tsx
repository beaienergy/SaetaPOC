import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { i18n } from '@/shared/lib/i18n'
import { useEscape } from '@/shared/hooks'
import './Modal.css'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}

export function Modal({ title, onClose, children, maxWidth = 520 }: ModalProps) {
  useEscape(true, onClose)

  return createPortal(
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label={i18n.t('common:actions.close')}
          >
            <X size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
