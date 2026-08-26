import { useTranslation } from 'react-i18next'
import { FileQuestion, History, ShieldAlert } from 'lucide-react'
import { Badge } from '@/shared/ui'
import type { BadgeTone } from '@/shared/ui'
import type { Severity } from '@/shared/types/domain'
import type { GapStatus, GapType } from '../types'

const SEVERITY_TONE: Record<Severity, BadgeTone> = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
}

export function GapSeverityBadge({ severity }: { severity: Severity }) {
  const { t } = useTranslation('documents')
  return (
    <Badge tone={SEVERITY_TONE[severity]} dot={severity === 'critical'}>
      {t(`gaps.severity.${severity}`)}
    </Badge>
  )
}

const STATUS_TONE: Record<GapStatus, BadgeTone> = {
  open: 'warning',
  resolved: 'success',
  dismissed: 'neutral',
}

export function GapStatusBadge({ status }: { status: GapStatus }) {
  const { t } = useTranslation('documents')
  return <Badge tone={STATUS_TONE[status]}>{t(`gaps.status.${status}`)}</Badge>
}

const TYPE_ICON: Record<GapType, typeof FileQuestion> = {
  missing_documentation: FileQuestion,
  incompatible_versions: History,
  inconsistency: ShieldAlert,
}

export function GapTypeIcon({ type, size = 16 }: { type: GapType; size?: number }) {
  const Icon = TYPE_ICON[type]
  return <Icon size={size} aria-hidden />
}

export function GapTypeLabel({ type }: { type: GapType }) {
  const { t } = useTranslation('documents')
  return <>{t(`gaps.type.${type}`)}</>
}
