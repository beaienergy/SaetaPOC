import type { BadgeTone } from '@/shared/ui'
import type { Severity } from '@/shared/types/domain'
import type { KeyIssueStatus, QuestionStatus, TrackingActionStatus } from '../types'

// Mapeo estado de dominio -> tono de Badge (guion: el mapeo vive en la
// feature, no en `Badge`). `escalated` es el único `danger` a propósito: es
// el único estado que de verdad significa "urgente" en estas 3 tablas.

export const KEY_ISSUE_STATUS_TONE: Record<KeyIssueStatus, BadgeTone> = {
  open: 'warning',
  mitigated: 'success',
  escalated: 'danger',
}

export const TRACKING_STATUS_TONE: Record<TrackingActionStatus, BadgeTone> = {
  pending: 'warning',
  'in-progress': 'info',
  done: 'success',
}

export const QUESTION_STATUS_TONE: Record<QuestionStatus, BadgeTone> = {
  pending: 'warning',
  answered: 'success',
}

export const SEVERITY_TONE: Record<Severity, BadgeTone> = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
}
