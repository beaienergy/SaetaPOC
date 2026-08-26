import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown, Filter, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { i18n } from '@/shared/lib/i18n'
import { useDismissable } from '@/shared/hooks'
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState'
import { SkeletonRows } from '@/shared/ui/Skeleton/Skeleton'
import { Checkbox } from '@/shared/ui/Field/Field'
import { Button } from '@/shared/ui/Button/Button'
import './DataTable.css'

export interface ColumnFilterOption {
  value: string
  label: string
}

/**
 * Filtro de selección múltiple en la cabecera de la columna (icono de
 * embudo). El estado (qué está seleccionado) lo posee quien use la tabla,
 * no `DataTable`: así puede vivir en la URL (como los de tickets) o en
 * memoria, sin que este componente lo sepa.
 */
export interface ColumnFilter {
  options: ColumnFilterOption[]
  selected: string[]
  onChange: (values: string[]) => void
  /** Título del menú. Por defecto, el propio `header` de la columna. */
  title?: ReactNode
}

export interface Column<T> {
  key: string
  header: ReactNode
  width?: string
  /** Solo para columnas que no se leen a la izquierda (cifras, fechas). */
  align?: 'right' | 'center'
  /**
   * Valor por el que ordena esta columna. Si viene, la cabecera se vuelve
   * pulsable; si no, la columna no se puede ordenar. Se separa de `render`
   * porque lo que se pinta (un badge, dos líneas) casi nunca es lo que se
   * compara (una fecha ISO, un rango de prioridad).
   */
  sortValue?: (item: T) => string | number | null
  filter?: ColumnFilter
  render: (item: T) => ReactNode
}

export type SortDir = 'asc' | 'desc'

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (item: T) => string
  isLoading?: boolean
  emptyIcon?: ReactNode
  emptyMessage?: string
  onRowClick?: (item: T) => void
  minWidth?: number
  /** Orden inicial. La columna tiene que declarar `sortValue`. */
  defaultSort?: { key: string; dir: SortDir }
  // Permite a cada tabla afinar su rejilla (anchos, densidad) sin tocar el resto.
  className?: string
  /**
   * Alto máximo del cuerpo. `'fit'` lo calcula contra el viewport para que el
   * PIE de la tabla quede siempre a la vista sin desplazar la página: la tabla
   * se cierra en pantalla en vez de crecer con los datos.
   */
  maxHeight?: number | string | 'fit'
  /**
   * Total sin filtrar. Con él, el pie dice "mostradas / totales" (mismo patrón
   * que la tabla de stock); sin él, solo el número de filas a la vista.
   */
  totalCount?: number
}

/** Margen que se reserva bajo la tabla al ajustarla al viewport (pie + aire). */
const FIT_RESERVE = 56
/** Nunca se encoge por debajo de esto, aunque el viewport sea diminuto. */
const FIT_MIN_HEIGHT = 220

/**
 * Alto disponible desde donde arranca el cuerpo hasta el borde inferior de la
 * ventana. Se recalcula al redimensionar y cuando cambia el alto de lo que hay
 * encima (las filas de filtros aparecen y desaparecen).
 */
function useFitHeight(enabled: boolean, ref: React.RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    if (!enabled) return
    const measure = () => {
      const el = ref.current
      if (!el) return
      const available = window.innerHeight - el.getBoundingClientRect().top - FIT_RESERVE
      const next = Math.max(FIT_MIN_HEIGHT, Math.round(available))
      // Umbral anti-bucle: el observer se dispara al cambiar el alto de la
      // propia tabla, y sin esto un desajuste de 1 px se realimentaría.
      setHeight((prev) => (prev !== undefined && Math.abs(prev - next) < 4 ? prev : next))
    }

    measure()
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [enabled, ref])

  return height
}

function ColumnFilterMenu({ filter, onClose }: { filter: ColumnFilter; onClose: () => void }) {
  const toggle = (value: string) => {
    const next = filter.selected.includes(value)
      ? filter.selected.filter((v) => v !== value)
      : [...filter.selected, value]
    filter.onChange(next)
  }

  return (
    <div
      className="data-table__filter-menu"
      role="dialog"
      aria-label={i18n.t('common:actions.filter')}
    >
      {filter.title && <div className="data-table__filter-title">{filter.title}</div>}
      <ul className="data-table__filter-options">
        {filter.options.map((o) => (
          <li key={o.value}>
            <Checkbox
              label={o.label}
              checked={filter.selected.includes(o.value)}
              onChange={() => toggle(o.value)}
            />
          </li>
        ))}
      </ul>
      {filter.selected.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          icon={<X size={13} aria-hidden />}
          onClick={() => {
            filter.onChange([])
            onClose()
          }}
        >
          {i18n.t('common:actions.clearFilter')}
        </Button>
      )}
    </div>
  )
}

function ColumnFilterButton({ filter }: { filter: ColumnFilter }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useDismissable<HTMLSpanElement>(isOpen, () => setIsOpen(false))
  const active = filter.selected.length > 0

  return (
    <span className="data-table__filter" ref={ref}>
      <button
        type="button"
        className={cn('data-table__filter-trigger', active && 'is-active')}
        aria-label={i18n.t('common:actions.filter')}
        aria-pressed={active}
        onClick={() => setIsOpen((v) => !v)}
      >
        <Filter size={13} aria-hidden />
        {/* Cuántos valores hay marcados: se ve que la columna filtra sin abrir
            el menú, y cuánto (el color solo diría "algo hay"). */}
        {active && <span className="data-table__filter-count">{filter.selected.length}</span>}
      </button>
      {isOpen && <ColumnFilterMenu filter={filter} onClose={() => setIsOpen(false)} />}
    </span>
  )
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyIcon,
  emptyMessage = i18n.t('common:states.empty'),
  onRowClick,
  minWidth = 720,
  defaultSort,
  className,
  maxHeight,
  totalCount,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | undefined>(defaultSort)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fitHeight = useFitHeight(maxHeight === 'fit', scrollRef)
  const resolvedMaxHeight = maxHeight === 'fit' ? fitHeight : maxHeight

  const sorted = useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.key)
    if (!sort || !column?.sortValue) return data
    const { sortValue } = column
    const factor = sort.dir === 'asc' ? 1 : -1
    // Copia: `sort` muta, y `data` es la lista que llega por props.
    return [...data].sort((a, b) => {
      const av = sortValue(a)
      const bv = sortValue(b)
      // Los vacíos van siempre al final, se ordene como se ordene: un hueco
      // no es "el más pequeño", es la ausencia de dato.
      if (av === null) return bv === null ? 0 : 1
      if (bv === null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
      return String(av).localeCompare(String(bv)) * factor
    })
  }, [data, sort, columns])

  // Primer clic ordena descendente en fechas y cifras: lo más reciente o lo
  // más alto es lo que se quiere ver arriba.
  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' },
    )

  const showFoot = !isLoading && data.length > 0

  return (
    <div className={cn('card data-table', className)}>
      <div className="data-table__scroll" ref={scrollRef} style={{ maxHeight: resolvedMaxHeight }}>
        <table className="data-table__table" style={{ minWidth }}>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key
                return (
                  <th
                    key={col.key}
                    className="u-eyebrow"
                    style={{ width: col.width, textAlign: col.align }}
                    aria-sort={
                      active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                  >
                    <span className="data-table__head">
                      {col.sortValue ? (
                        <button
                          type="button"
                          className={cn('data-table__sort', active && 'is-active')}
                          onClick={() => toggleSort(col.key)}
                        >
                          <span className="data-table__sort-label">{col.header}</span>
                          {/* La columna por la que se ordena lleva su flecha en
                              una insignia: se localiza de un vistazo entre
                              ocho cabeceras con el mismo icono apagado. */}
                          {active ? (
                            <span className="data-table__sort-badge">
                              {sort.dir === 'asc' ? (
                                <ArrowUp size={12} aria-hidden />
                              ) : (
                                <ArrowDown size={12} aria-hidden />
                              )}
                            </span>
                          ) : (
                            <ChevronsUpDown
                              size={13}
                              aria-hidden
                              className="data-table__sort-idle"
                            />
                          )}
                        </button>
                      ) : (
                        col.header
                      )}
                      {col.filter && <ColumnFilterButton filter={col.filter} />}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          {!isLoading && sorted.length > 0 && (
            <tbody>
              {sorted.map((item) => (
                <tr
                  key={rowKey(item)}
                  className={cn(onRowClick && 'data-table__row--clickable')}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  role={onRowClick ? 'button' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onRowClick(item)
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align }}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {isLoading && (
        <div className="data-table__state">
          <SkeletonRows rows={6} />
        </div>
      )}
      {!isLoading && data.length === 0 && <EmptyState icon={emptyIcon} message={emptyMessage} />}

      {/* Cierra la tabla por abajo: sin este borde, una lista con scroll propio
          parece cortada a media fila y no se sabe si queda mucho más. */}
      {showFoot && (
        <div className="data-table__foot">
          <span>
            {totalCount !== undefined && totalCount !== data.length
              ? i18n.t('common:table.rowsOf', { shown: data.length, total: totalCount })
              : i18n.t('common:table.rows', { count: data.length })}
          </span>
        </div>
      )}
    </div>
  )
}
