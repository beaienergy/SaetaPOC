import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { Card, CardHeader, EmptyState, Pill } from '@/shared/ui'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import type { FinancialModelFile } from '../types'
import './FinancialModelFileList.css'

/** Lista de modelos financieros cargados para la operacion (guion §5.4), con
 * su version — la copia de trabajo que audita el agente, nunca el original. */
export function FinancialModelFileList({ files }: { files: FinancialModelFile[] }) {
  const { t, i18n } = useTranslation('financialModel')
  const locale = i18n.language as Locale

  return (
    <Card>
      <CardHeader title={t('files.title')} subtitle={t('files.subtitle')} />
      {files.length === 0 ? (
        <EmptyState message={t('files.empty')} />
      ) : (
        <ul className="fm-files">
          {files.map((file) => (
            <li key={file.id} className="fm-files__row">
              <span className="fm-files__icon" aria-hidden>
                <FileText size={18} />
              </span>
              <div className="fm-files__main">
                <span className="fm-files__name">{file.name}</span>
                <span className="fm-files__meta">
                  {t('files.sheetCount', { count: file.sheetCount })} · {file.sizeLabel} ·{' '}
                  {t('files.updated')} {formatDateShort(file.updatedAt, locale)}
                </span>
              </div>
              <Pill variant="outline">{file.version}</Pill>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
