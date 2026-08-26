import { ChevronDown, LogOut } from 'lucide-react'
import { cn, initials } from '@/shared/lib/utils'
import { useDisclosure, useDismissable } from '@/shared/hooks'
import './UserMenu.css'

// Avatar + popover con el usuario y "cerrar sesion". Estaba duplicado en el
// header del N1 y en el portal, y `docs/06` dejo escrito que al aparecer un
// tercer sitio tocaba extraerlo. El tercero es el Asistente KPI.
//
// El usuario llega por PROPS y no de `features/auth`: `shared` no puede importar
// de `features` (regla de capas, la valida ESLint). Cada pantalla le pasa lo que
// ya tiene de su store.
//
// `tone` sigue el mismo patron que `ThemeToggle` y `LangToggle`: `on-dark` para
// chrome de marca fijo (el portal), donde los tokens del tema no valen porque el
// fondo es navy en claro y en oscuro.
interface UserMenuProps {
  name: string
  email: string
  logoutLabel: string
  onLogout: () => void
  tone?: 'default' | 'on-dark'
}

export function UserMenu({ name, email, logoutLabel, onLogout, tone = 'default' }: UserMenuProps) {
  const menu = useDisclosure()
  const ref = useDismissable<HTMLDivElement>(menu.isOpen, menu.close)

  return (
    <div className="user-menu" ref={ref}>
      <button
        className={cn('user-menu__btn', tone === 'on-dark' && 'user-menu__btn--on-dark')}
        onClick={menu.toggle}
        aria-expanded={menu.isOpen}
        aria-label={name}
      >
        <span
          className={cn('user-menu__avatar', tone === 'on-dark' && 'user-menu__avatar--on-dark')}
        >
          {initials(name)}
        </span>
        <ChevronDown size={14} />
      </button>
      {menu.isOpen && (
        <div className="user-menu__pop" role="menu">
          <div className="user-menu__info">
            <strong>{name}</strong>
            <span>{email}</span>
          </div>
          <button className="user-menu__item" onClick={onLogout} role="menuitem">
            <LogOut size={16} />
            {logoutLabel}
          </button>
        </div>
      )}
    </div>
  )
}
