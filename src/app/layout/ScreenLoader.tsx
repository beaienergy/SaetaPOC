import { Spinner } from '@/shared/ui'

// Espera a pantalla completa para lo que ocurre ANTES de montar el AppShell:
// el chunk de una ruta perezosa y la comprobacion de sesion. Sin CSS propio a
// proposito: en ese momento no hay layout, solo un spinner centrado.
export function ScreenLoader({ size = 28 }: { size?: number }) {
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Spinner size={size} />
    </div>
  )
}
