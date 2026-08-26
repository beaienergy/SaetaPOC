import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useRoleStore } from '@/shared/stores'
import { ROUTES } from '@/shared/config/routes'

/**
 * Guarda de UI para Analítica IA y Conocimiento base (guion §1.5 / §5.2.2 /
 * §5.6): "toda la pantalla oculta/deshabilitada si el usuario simulado no es
 * admin". Es una affordance de demo, no seguridad — entrar por URL directa
 * como Usuario simplemente devuelve al chat de la operación, igual que
 * ocultar el enlace del sidebar.
 */
export function RequireAdmin() {
  const { opId = '' } = useParams()
  const role = useRoleStore((s) => s.role)

  if (role !== 'admin') return <Navigate to={ROUTES.operationChat(opId)} replace />

  return <Outlet />
}
