import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/features/auth'
import { ErrorBoundary } from './ErrorBoundary'

// Sin react-query ni cliente HTTP: esta POC no tiene backend (alcance
// explicito), asi que no hay nada real que cachear o reintentar. Cada feature
// simula su propia latencia con `sleep()` donde haga falta.
export function AppProviders({ children }: { children: ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return <ErrorBoundary>{children}</ErrorBoundary>
}
