import type { Locale } from '@/shared/types'

// Etiqueta BCP-47 que entiende Intl, por locale de la app. Unico sitio donde se
// traduce 'es'/'en' a una etiqueta completa: lo usan los formateadores de fecha
// y de numero.
export const localeTag: Record<Locale, string> = { es: 'es-ES', en: 'en-US' }
