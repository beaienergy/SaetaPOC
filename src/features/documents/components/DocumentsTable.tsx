import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { DataTable, FilterBar } from '@/shared/ui'
import type { Column } from '@/shared/ui'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { CategoryBadge, DocumentStatusBadge } from './DocumentBadges'
import type { DdCategory, DocumentStatus, KbDocument } from '../types'
import './DocumentsTable.css'

const CATEGORIES: DdCategory[] = [
  'legal',
  'financial',
  'tax',
  'commercial',
  'technical',
  'esg',
  'hr',
]
const STATUSES: DocumentStatus[] = ['indexed', 'pending', 'error']

/**
 * Tabla de documentos del dataroom (guion §5.2): nombre, categoría de DD,
 * versión, fecha de subida y estado de ingesta. Busca por nombre y filtra
 * por categoría/estado desde la propia cabecera (`DataTable` ya trae ese
 * patrón — no hay que reconstruirlo).
 */
export function DocumentsTable({
  documents,
  onOpen,
}: {
  documents: KbDocument[]
  onOpen: (doc: KbDocument) => void
}) {
  const { t, i18n } = useTranslation('documents')
  const locale = i18n.language as Locale
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return documents.filter((doc) => {
      if (q && !doc.name.toLowerCase().includes(q)) return false
      if (categoryFilter.length > 0 && !categoryFilter.includes(doc.category)) return false
      if (statusFilter.length > 0 && !statusFilter.includes(doc.status)) return false
      return true
    })
  }, [documents, search, categoryFilter, statusFilter])

  const columns: Column<KbDocument>[] = [
    {
      key: 'name',
      header: t('table.name'),
      sortValue: (doc) => doc.name,
      render: (doc) => (
        <span className="doc-table__name">
          <FileText size={14} aria-hidden className="doc-table__name-icon" />
          {doc.name}
        </span>
      ),
    },
    {
      key: 'category',
      header: t('table.category'),
      sortValue: (doc) => doc.category,
      filter: {
        options: CATEGORIES.map((c) => ({ value: c, label: t(`categories.${c}`) })),
        selected: categoryFilter,
        onChange: setCategoryFilter,
      },
      render: (doc) => <CategoryBadge category={doc.category} />,
    },
    {
      key: 'uploadedAt',
      header: t('table.uploadedAt'),
      sortValue: (doc) => doc.uploadedAt,
      render: (doc) => formatDateShort(doc.uploadedAt, locale),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortValue: (doc) => doc.status,
      filter: {
        options: STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) })),
        selected: statusFilter,
        onChange: setStatusFilter,
      },
      render: (doc) => <DocumentStatusBadge status={doc.status} />,
    },
  ]

  return (
    <div className="u-stack">
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('table.searchPlaceholder')}
      />
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(doc) => doc.id}
        onRowClick={onOpen}
        totalCount={documents.length}
        emptyMessage={t('table.empty')}
        defaultSort={{ key: 'uploadedAt', dir: 'desc' }}
      />
    </div>
  )
}
