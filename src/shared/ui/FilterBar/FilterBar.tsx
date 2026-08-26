import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import './FilterBar.css'

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children?: ReactNode
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
}: FilterBarProps) {
  return (
    // Compone `.card` en vez de repetir su receta: superficie, borde, radio y
    // sombra vienen de un solo sitio.
    <div className="card filter-bar">
      <div className="filter-bar__search">
        <Search size={16} aria-hidden />
        <input
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {children && <div className="filter-bar__filters">{children}</div>}
    </div>
  )
}
