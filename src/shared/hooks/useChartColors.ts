import { useEffect, useState } from 'react'
import { useThemeStore } from '@/shared/stores'

// Solo los tokens que piden las graficas hoy (recharts necesita valores
// concretos en `stroke`/`fill`/gradientes). Anadir un color = una linea aqui y
// otra en `read`.
interface ChartColors {
  primary: string
  success: string
  warning: string
  grid: string
  axis: string
  /** Paleta de una gráfica con varias líneas. Cinco: son cuatro grúas y una más. */
  series: string[]
}

function read(): ChartColors {
  const s = getComputedStyle(document.documentElement)
  const get = (name: string) => s.getPropertyValue(name).trim()
  return {
    primary: get('--color-primary'),
    success: get('--color-success'),
    warning: get('--color-warning'),
    grid: get('--color-border'),
    axis: get('--color-text-muted'),
    series: [1, 2, 3, 4, 5].map((n) => get(`--color-series-${n}`)),
  }
}

// Resuelve los tokens de color a valores concretos para recharts y los recalcula
// cuando cambia el tema (recharts no lee CSS variables de forma fiable).
export function useChartColors(): ChartColors {
  const mode = useThemeStore((s) => s.mode)
  const [colors, setColors] = useState<ChartColors>(read)
  useEffect(() => {
    // requestAnimationFrame: espera a que el atributo data-theme se aplique.
    const id = requestAnimationFrame(() => setColors(read()))
    return () => cancelAnimationFrame(id)
  }, [mode])
  return colors
}
