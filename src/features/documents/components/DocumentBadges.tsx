import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui'
import type { BadgeTone } from '@/shared/ui'
import type { DdCategory, DocumentStatus } from '../types'

// Tono categórico por disciplina de DD (no semántico: ninguna categoría es
// "mejor" que otra, así que no se toca la escala roja/verde/ámbar de Badge).
const CATEGORY_TONE: Record<DdCategory, BadgeTone> = {
  legal: 'indigo',
  financial: 'blue',
  tax: 'orange',
  commercial: 'violet',
  technical: 'steel',
  esg: 'lime',
  hr: 'cyan',
}

export function CategoryBadge({ category }: { category: DdCategory }) {
  const { t } = useTranslation('documents')
  return <Badge tone={CATEGORY_TONE[category]}>{t(`categories.${category}`)}</Badge>
}

// Tono semántico del estado de ingesta: indexado = éxito, pendiente =
// atención, error = fallo. Coherente con el resto de la app (Badge.tsx).
const STATUS_TONE: Record<DocumentStatus, BadgeTone> = {
  indexed: 'success',
  pending: 'warning',
  error: 'danger',
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const { t } = useTranslation('documents')
  return (
    <Badge tone={STATUS_TONE[status]} dot>
      {t(`status.${status}`)}
    </Badge>
  )
}
