import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Download } from 'lucide-react'
import { Button } from '@/shared/ui'
import type { GeneratedReport, ReportExportFormat } from '../types'
import './ExportBar.css'

const FORMATS: ReportExportFormat[] = ['pdf', 'word', 'ppt']
const TOAST_MS = 4000

interface ExportBarProps {
  report: GeneratedReport
}

/**
 * Botón de exportar (guion §5.5): mock — no genera un fichero real, muestra
 * una confirmación tipo toast. No hay sistema de toasts compartido todavía
 * en `shared/ui`, así que esta es una versión local, autocontenida, ligada
 * a la vida de este componente.
 */
export function ExportBar({ report }: ExportBarProps) {
  const { t } = useTranslation('reports')
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleExport = (format: ReportExportFormat) => {
    setMessage(t('export.confirmation', { format: t(`export.formats.${format}`), title: report.title }))
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setMessage(null), TOAST_MS)
  }

  return (
    <div className="export-bar">
      <div className="export-bar__actions">
        <span className="u-eyebrow">{t('export.title')}</span>
        {FORMATS.map((format) => (
          <Button
            key={format}
            variant="secondary"
            size="sm"
            icon={<Download size={14} aria-hidden />}
            onClick={() => handleExport(format)}
          >
            {t(`export.formats.${format}`)}
          </Button>
        ))}
      </div>
      {message && (
        <div className="export-bar__toast" role="status">
          <CheckCircle2 size={14} aria-hidden />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
