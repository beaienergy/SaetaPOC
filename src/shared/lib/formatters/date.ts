import type { Locale } from '@/shared/types'
import { localeTag } from './locale'

// Dos variantes de fecha en toda la app: `full` para fichas de detalle (con ano,
// donde hay sitio) y `short` para columnas estrechas de tabla (sin ano). Anadir
// una tercera es anadir una linea aqui.
const DATE_OPTIONS = {
  full: { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  short: { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

type DateVariant = keyof typeof DATE_OPTIONS

// Construir un Intl.DateTimeFormat no es gratis y estas funciones se llaman una
// vez por fila de tabla: se memoiza uno por locale y variante.
const cache = new Map<string, Intl.DateTimeFormat>()

function formatter(locale: Locale, variant: DateVariant): Intl.DateTimeFormat {
  const key = `${locale}.${variant}`
  const cached = cache.get(key)
  if (cached) return cached
  const created = new Intl.DateTimeFormat(localeTag[locale], DATE_OPTIONS[variant])
  cache.set(key, created)
  return created
}

function toDate(value: string | Date): Date {
  return typeof value === 'string' ? new Date(value) : value
}

// Fecha con ano: "23 jul 2026, 14:05".
export function formatDate(value: string | Date, locale: Locale = 'es'): string {
  return formatter(locale, 'full').format(toDate(value))
}

// Fecha sin ano, para columnas estrechas: "23 jul, 14:05" / "Jul 23, 2:05 PM".
export function formatDateShort(value: string | Date, locale: Locale = 'es'): string {
  return formatter(locale, 'short').format(toDate(value))
}

// Tiempo relativo compacto: "hace 5 m", "hace 2 h", "hace 3 d".
export function formatRelativeTime(value: string | Date, locale: Locale = 'es'): string {
  const diffMs = Date.now() - toDate(value).getTime()
  const min = Math.round(diffMs / 60000)
  const prefix = locale === 'es' ? 'hace' : ''
  const suffix = locale === 'es' ? '' : 'ago'
  const wrap = (n: number, unit: string) =>
    [prefix, `${n} ${unit}`, suffix].filter(Boolean).join(' ')

  if (min < 1) return locale === 'es' ? 'ahora' : 'just now'
  if (min < 60) return wrap(min, 'm')
  const hours = Math.round(min / 60)
  if (hours < 24) return wrap(hours, 'h')
  return wrap(Math.round(hours / 24), 'd')
}
