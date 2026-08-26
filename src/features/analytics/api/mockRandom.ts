/**
 * PRNG determinista compartido por los tres mocks de Analítica IA (coste,
 * trazas, memoria). Nada de `Math.random()`: los paneles se recalculan en
 * cada render (filtros, cambio de tema) y unos datos que cambiaran solos
 * harían parecer que el dashboard "tiembla" sin motivo. Con una semilla fija
 * por string, el mismo `(seed, index)` da siempre el mismo número.
 */

function hashSeed(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i += 1) {
    h = (Math.imul(h, 31) + text.charCodeAt(i)) >>> 0
  }
  return h
}

/** mulberry32 — pequeño, rápido, suficientemente "orgánico" para datos de demo. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Número pseudoaleatorio estable en [0, 1) para una clave de texto dada. */
export function seededRandom(key: string): number {
  return mulberry32(hashSeed(key))()
}

/** Igual que `seededRandom`, pero acotado a [min, max). */
export function seededRange(key: string, min: number, max: number): number {
  return min + seededRandom(key) * (max - min)
}
