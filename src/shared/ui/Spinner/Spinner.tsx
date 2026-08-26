import { cn } from '@/shared/lib/utils'
import { i18n } from '@/shared/lib/i18n'
import './Spinner.css'

interface SpinnerProps {
  size?: number
  className?: string
}

export function Spinner({ size = 18, className }: SpinnerProps) {
  return (
    <span
      className={cn('spinner', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label={i18n.t('common:states.loading')}
    />
  )
}
