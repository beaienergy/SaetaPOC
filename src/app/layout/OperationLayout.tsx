import { Suspense, useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { Spinner } from '@/shared/ui'
import { useDisclosure } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { getOperation, useOperationStore } from '@/features/operations'
import { ROUTES } from '@/shared/config/routes'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { OnboardingTour } from './OnboardingTour'
// El CSS del chrome (esqueleto, sidebar y cabecera) vive en
// `shared/styles/app-chrome.css`, cargado siempre desde `shared/styles/index.css`.

/**
 * Shell persistente de una operación (guion §1, "se repite en todo
 * /ma/operations/:id/*"): sidebar primario + header + contenido. Equivalente
 * al `AppShell` del proyecto de referencia, pero scopeado a `:opId` — cada
 * pantalla de dentro hereda el mismo chrome sin tener que volver a montarlo.
 */
export function OperationLayout() {
  const { opId = '' } = useParams()
  const drawer = useDisclosure()
  const setCurrentOperationId = useOperationStore((s) => s.setCurrentOperationId)
  const operation = getOperation(opId)

  useEffect(() => {
    if (operation) setCurrentOperationId(operation.id)
  }, [operation, setCurrentOperationId])

  // Segregación real a nivel de UI (guion §4, R-07/R-08): un id de operación
  // que no existe no enseña ningún chrome ni contenido, vuelve al selector.
  if (!operation) return <Navigate to={ROUTES.operations} replace />

  return (
    <div className="shell">
      <div className={cn('shell__sidebar', drawer.isOpen && 'is-open')}>
        <Sidebar opId={opId} onNavigate={drawer.close} />
      </div>
      {drawer.isOpen && <div className="shell__overlay" onClick={drawer.close} />}

      <div className="shell__main">
        <Header opId={opId} onMenuClick={drawer.open} />
        <main className="shell__content">
          <Suspense
            fallback={
              <div className="shell__fallback">
                <Spinner size={28} />
              </div>
            }
          >
            <div className="shell__content-inner u-fade-in">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>

      <OnboardingTour opId={opId} />
    </div>
  )
}
