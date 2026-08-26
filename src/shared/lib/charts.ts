import type { CSSProperties } from 'react'

/**
 * Configuración común de las gráficas de recharts.
 *
 * Vivía dentro de `features/dashboard` porque solo lo usaban sus tres gráficas.
 * Al migrar las de la Consola KPI a recharts pasó a usarlo una segunda feature,
 * y una feature no importa de otra: sube a `shared`, que es lo que la regla de
 * capas pide y lo que evita que las dos aplicaciones acaben con tooltips y ejes
 * distintos sin que nadie lo decida.
 *
 * Solo va aquí lo que comparten todas. Lo propio de cada gráfica (colores de
 * serie, padding del eje X, alto mínimo) se queda en su componente.
 */

/** Tooltip con los tokens del tema: recharts solo lo acepta como estilo en línea. */
export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 12,
  color: 'var(--color-text)',
}

/** Resalte de la columna bajo el cursor; solo tiene sentido en las de barras. */
export const CHART_TOOLTIP_CURSOR = { fill: 'var(--color-surface-inset)' }

/** Márgenes del área de dibujo: el eje Y ya reserva su propio ancho. */
export const CHART_MARGIN = { top: 4, right: 8, left: 0, bottom: 0 }

/** Ejes sin línea ni marcas: la rejilla ya da la referencia. */
export const CHART_AXIS = { fontSize: 12, tickLine: false, axisLine: false }

/** Por debajo de 40 px los valores de 3 cifras se recortan contra el borde del SVG. */
export const CHART_Y_AXIS_WIDTH = 40
