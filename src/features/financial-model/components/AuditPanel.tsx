import { useTranslation } from 'react-i18next'
import { Badge, Button, Card, CardHeader, EmptyState, Spinner } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import type { Severity } from '@/shared/types/domain'
import { useFinancialAuditStatus, useFinancialAuditStore } from '../store/financialAuditStore'
import type { AuditFinding } from '../types'
import { AuditFindingsTable, SEVERITY_TONE } from './AuditFindingsTable'
import './AuditPanel.css'

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low']

/**
 * Accion "Auditar" (guion §5.4): simulada con `sleep()` en el store, revela
 * el panel de hallazgos al terminar. `not_run` / `running` / `done` vienen de
 * `useFinancialAuditStore`, scopeado por operacion — Solstice arranca en
 * `not_run` para que se vea el flujo completo al menos una vez en la demo.
 */
export function AuditPanel({ opId, findings }: { opId: string; findings: AuditFinding[] }) {
  const { t, i18n } = useTranslation('financialModel')
  const locale = i18n.language as Locale
  const { status, lastRunAt } = useFinancialAuditStatus(opId)
  const runAudit = useFinancialAuditStore((s) => s.runAudit)
  const isRunning = status === 'running'

  return (
    <Card>
      <CardHeader
        title={t('audit.title')}
        subtitle={t('audit.subtitle')}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => runAudit(opId)}
            loading={isRunning}
            disabled={isRunning}
          >
            {status === 'done' ? t('audit.rerun') : t('audit.run')}
          </Button>
        }
      />

      {status === 'not_run' && (
        <EmptyState message={t('audit.notRunMessage')} hint={t('audit.notRunHint')} />
      )}

      {status === 'running' && (
        <div className="fm-audit__loading">
          <Spinner size={20} />
          <span>{t('audit.running')}</span>
        </div>
      )}

      {status === 'done' && (
        <div className="fm-audit__results u-fade-in">
          <div className="fm-audit__meta">
            <span className="fm-audit__last-run">
              {t('audit.lastRun')}: {lastRunAt ? formatDate(lastRunAt, locale) : '—'}
            </span>
            <SeveritySummary findings={findings} />
          </div>
          <AuditFindingsTable findings={findings} />
        </div>
      )}
    </Card>
  )
}

function SeveritySummary({ findings }: { findings: AuditFinding[] }) {
  const { t } = useTranslation('financialModel')
  const counts: Record<Severity, number> = { low: 0, medium: 0, high: 0, critical: 0 }
  for (const f of findings) counts[f.severity] += 1

  return (
    <div className="fm-audit__summary">
      <span className="fm-audit__summary-total">{t('audit.summary', { count: findings.length })}</span>
      {SEVERITY_ORDER.filter((sev) => counts[sev] > 0).map((sev) => (
        <Badge key={sev} tone={SEVERITY_TONE[sev]} dot={sev === 'critical'}>
          {counts[sev]} {t(`audit.severity.${sev}`)}
        </Badge>
      ))}
    </div>
  )
}
