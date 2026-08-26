import type { Locale } from '@/shared/types'
import { localeTag } from './locale'

/**
 * Un entero con los separadores de miles del idioma.
 *
 * Estaba escrito en el módulo KPI y en varios `toLocaleString` sueltos. Aquí una
 * vez: «613.400» en español y «613,400» en inglés no es un detalle de estilo, es la
 * diferencia entre leer seiscientos mil y seiscientos coma cuatro.
 */
export const formatInt = (value: number, locale: Locale = 'es'): string =>
  // `useGrouping` FORZADO: en español, `Intl` no agrupa los millares de cuatro
  // cifras por defecto, así que en una columna de recuentos salía «4304» al lado de
  // «57.930» y la lectura se torcía. Aquí son cifras comparables entre sí, no texto
  // corrido. Venía del módulo KPI y se conserva al subirla: es justo el detalle que
  // se pierde en una unificación hecha a ojo.
  new Intl.NumberFormat(localeTag[locale], { maximumFractionDigits: 0, useGrouping: true }).format(
    value,
  )

/** Un decimal fijo. `digits` lo elige quien llama: ver la nota de `formatPercent`. */
export const formatDecimals = (value: number, locale: Locale = 'es', digits = 1): string =>
  new Intl.NumberFormat(localeTag[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: true,
  }).format(value)

/**
 * Con el signo siempre delante, también en el positivo.
 *
 * Es para las variaciones: «+1,4» y «−0,3» se leen de un vistazo, y «1,4» a secas
 * obliga a buscar la flecha para saber hacia dónde va.
 */
export const formatSigned = (value: number, locale: Locale = 'es', digits = 1): string =>
  `${value > 0 ? '+' : ''}${formatDecimals(value, locale, digits)}`

/**
 * Acepta ratio 0..1 o porcentaje 0..100 segun `asRatio`.
 *
 * `digits` por defecto en 0 y el símbolo pegado, que es como lo pinta el N1 desde
 * siempre: «89%». La consola KPI lo pide con un decimal y con espacio —«88,8 %»—
 * porque ahí la décima distingue dos grúas, y en una bandeja de tickets no.
 *
 * Esa diferencia es deliberada y por eso es un PARÁMETRO y no dos funciones: lo que
 * no puede haber son dos implementaciones del mismo redondeo divergiendo en
 * silencio, que es lo que había.
 */
export function formatPercent(
  value: number,
  asRatio = true,
  options: { digits?: number; locale?: Locale; space?: boolean } = {},
): string {
  const { digits = 0, locale = 'es', space = false } = options
  const pct = asRatio ? value * 100 : value
  return `${formatDecimals(pct, locale, digits)}${space ? ' ' : ''}%`
}

export function formatCurrency(value: number, locale: Locale = 'es', currency = 'USD'): string {
  return new Intl.NumberFormat(localeTag[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

// Unidades binarias con nombre decimal (KB, MB), que es lo que muestran los
// sistemas de ticketing. Un decimal a partir de MB: "1,2 MB" se lee mejor que
// "1 MB" y no hace falta más precisión para un adjunto.
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const

export function formatBytes(bytes: number, locale: Locale = 'es'): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024
    unit += 1
  }
  const decimals = unit >= 2 && value < 100 ? 1 : 0
  return `${new Intl.NumberFormat(localeTag[locale], {
    maximumFractionDigits: decimals,
  }).format(value)} ${BYTE_UNITS[unit]}`
}
