// Fija cómo escribe cifras cada aplicación.
//
// Existe por una razón concreta: al unificar el formato, el N1 y la consola KPI
// pasaron a compartir implementación, y el N1 está en manos del cliente. Una cifra
// que cambie de forma —aunque sea un decimal o un separador— es una regresión en
// una pantalla que ya se dio por buena, y no se vería en ningún typecheck.
//
// Las dos precisiones son deliberadas y por eso están escritas aquí las dos: en una
// consola de indicadores la décima distingue dos grúas; en una bandeja de tickets,
// «89 %» y «88,8 %» dicen lo mismo y el segundo estorba.

import { describe, expect, it } from 'vitest'
import { formatDecimals, formatInt, formatPercent, formatSigned } from './index'

describe('el porcentaje del N1 no ha cambiado', () => {
  it('sigue siendo entero y pegado al símbolo', () => {
    expect(formatPercent(0.888)).toBe('89%')
    expect(formatPercent(0.5)).toBe('50%')
    expect(formatPercent(1)).toBe('100%')
    expect(formatPercent(0)).toBe('0%')
  })

  it('y admite el porcentaje ya multiplicado, como lo llama el dashboard', () => {
    expect(formatPercent(12.4, false)).toBe('12%')
    expect(formatPercent(87.6, false)).toBe('88%')
  })
})

describe('el porcentaje de la consola KPI', () => {
  it('lleva un decimal y espacio antes del símbolo', () => {
    expect(formatPercent(0.888, true, { digits: 1, space: true })).toBe('88,8 %')
    expect(formatPercent(0.888, true, { digits: 1, space: true, locale: 'en' })).toBe('88.8 %')
  })
})

describe('enteros y decimales', () => {
  it('agrupa los millares según el idioma', () => {
    // No es cosmético: «613.400» y «613,400» son dos números distintos si se leen
    // con el separador del otro idioma.
    expect(formatInt(613400)).toBe('613.400')
    expect(formatInt(613400, 'en')).toBe('613,400')
  })

  it('agrupa también los de cuatro cifras', () => {
    // En español `Intl` no los agrupa por defecto, y en una columna de recuentos
    // «4304» al lado de «57.930» tuerce la lectura. El módulo KPI lo forzaba, y esta
    // prueba existe porque al unificar el formato estuve a punto de perderlo.
    expect(formatInt(4304)).toBe('4.304')
    expect(formatDecimals(4304, 'es', 1)).toBe('4.304,0')
  })

  it('el signo va delante también en el positivo', () => {
    expect(formatSigned(1.4)).toBe('+1,4')
    expect(formatSigned(-0.3)).toBe('-0,3')
    expect(formatSigned(0)).toBe('0,0')
  })
})
