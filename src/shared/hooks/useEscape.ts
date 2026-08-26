import { useEffect } from 'react'

/**
 * Cierra con Escape, y solo con Escape.
 *
 * Es la mitad de `useDismissable` que sirve por sí sola: en un menú, cerrar al
 * pulsar fuera es lo correcto; en un chat o un modal, es hostil (pinchas la
 * tabla para leer un dato y pierdes el panel). El mismo `useEffect` estaba
 * escrito a mano en `Modal` y dentro de `useDismissable`.
 */
export function useEscape(isOpen: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onEscape])
}
