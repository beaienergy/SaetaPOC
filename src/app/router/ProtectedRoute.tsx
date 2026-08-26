import { Navigate, Outlet } from 'react-router-dom'
import { ScreenLoader } from '@/app/layout'
import { useAuthStore } from '@/features/auth'
import { ROUTES } from '@/shared/config/routes'

export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status)

  if (status === 'loading') {
    return <ScreenLoader size={30} />
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}
