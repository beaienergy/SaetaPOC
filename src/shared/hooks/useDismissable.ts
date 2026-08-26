import { useEffect, useRef } from 'react'
import { useEscape } from './useEscape'

/**
 * Cierra un elemento flotante al pulsar Escape o al hacer clic fuera de él.
 * Devuelve la ref que hay que colgar del contenedor (el disparador incluido,
 * o el propio clic en el botón volvería a abrirlo al instante).
 *
 * Vive aquí y no dentro de `useDisclosure` porque no todo lo que se abre y
 * cierra es un flotante: un modal ya trae su overlay y su propio Escape.
 * Si solo necesitas Escape (chat, modal), usa `useEscape` directamente.
 */
export function useDismissable<T extends HTMLElement>(isOpen: boolean, onDismiss: () => void) {
  const ref = useRef<T>(null)

  useEscape(isOpen, onDismiss)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) onDismiss()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [isOpen, onDismiss])

  return ref
}
