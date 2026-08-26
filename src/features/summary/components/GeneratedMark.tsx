import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { cn } from '@/shared/lib/utils'
import './GeneratedMark.css'

/**
 * Marca de "generado automáticamente" (guion §5.3.1): fecha/hora del último
 * análisis + botón "regenerar" (simulado con `sleep()` desde el store).
 */
export function GeneratedMark({
  generatedAt,
  isRegenerating,
  onRegenerate,
  className,
}: {
  generatedAt: string
  isRegenerating: boolean
  onRegenerate: () => void
  className?: string
}) {
  const { t, i18n } = useTranslation('summary')
  const locale = i18n.language as Locale

  return (
    <div className={cn('generated-mark', className)}>
      <span className="generated-mark__badge">
        <Sparkles size={13} aria-hidden />
        {t('generated.label')}
      </span>
      <span className="generated-mark__date">{t('generated.at', { date: formatDate(generatedAt, locale) })}</span>
      <Button
        variant="ghost"
        size="sm"
        icon={<Sparkles size={14} aria-hidden />}
        loading={isRegenerating}
        onClick={onRegenerate}
      >
        {t('generated.regenerate')}
      </Button>
    </div>
  )
}
