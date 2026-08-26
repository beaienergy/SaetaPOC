// Claves de localStorage/sessionStorage centralizadas: un vistazo que sobrevive
// a un F5 y un unico prefijo `saeta.` para toda la app.
export const STORAGE_KEYS = {
  theme: 'saeta.theme',
  role: 'saeta.role',
  locale: 'saeta.locale',
  session: 'saeta.mockSession',
  currentOperation: 'saeta.currentOperation',
} as const
