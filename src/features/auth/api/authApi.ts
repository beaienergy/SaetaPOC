import { sleep } from '@/shared/lib/utils'
import { STORAGE_KEYS } from '@/shared/config/storage'
import type { Credentials, User } from '../types'

/**
 * Sesión simulada del navegador. No hay backend en esta POC (instrucción
 * explícita del alcance): la única validación es contra una credencial
 * hardcodeada en el propio repo (puerta simbólica, no seguridad real — ver
 * CLAUDE.md). `sessionStorage` y no `localStorage` a propósito: una pestaña
 * nueva arranca sin sesión (la demo siempre empieza por el login), pero un F5
 * no echa a nadie a media navegación.
 */

const DEMO_EMAIL = 'admin@saeta.com'
const DEMO_PASSWORD = 'saeta'
function readMockSession(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.session)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function writeMockSession(user: User): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user))
  } catch {
    // Sin persistencia la sesión dura lo que la página: se puede navegar
    // igual, solo se pierde al recargar.
  }
}

function clearMockSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.session)
  } catch {
    // Nada que limpiar si no se pudo escribir.
  }
}

function nameFromEmail(email: string): string {
  const local = email.trim().split('@')[0] || 'Demo User'
  return local
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export const authApi = {
  async login(credentials: Credentials): Promise<User> {
    await sleep(400)
    const email = credentials.email.trim()
    if (email.toLowerCase() !== DEMO_EMAIL || credentials.password !== DEMO_PASSWORD) {
      throw new Error('Credenciales incorrectas')
    }
    const user: User = { name: nameFromEmail(email), email }
    writeMockSession(user)
    return user
  },

  async logout(): Promise<void> {
    clearMockSession()
  },

  async verify(): Promise<User> {
    const user = readMockSession()
    if (!user) throw new Error('No hay sesión activa')
    return user
  },
}
