import { useTranslation } from 'react-i18next'
import { AlertTriangle, ArrowUpRight, GitCompare, Lock, RotateCcw, type LucideIcon } from 'lucide-react'
import { Badge, DataTable, Pill } from '@/shared/ui'
import type { BadgeTone, Column } from '@/shared/ui'
import type { Severity } from '@/shared/types/domain'
import type { AuditFinding, FindingType } from '../types'
import './AuditFindingsTable.css'

export const SEVERITY_RANK: Record<Severity, number> = { low: 1, medium: 2, high: 3, critical: 4 }
export const SEVERITY_TONE: Record<Severity, BadgeTone> = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
}

const TYPE_ICON: Record<FindingType, LucideIcon> = {
  broken_formula: AlertTriangle,
  external_link: ArrowUpRight,
  hardcoded_value: Lock,
  circularity: RotateCcw,
  cross_tab_inconsistency: GitCompare,
}

/** Tabla de hallazgos de la auditoria de consistencia (guion §5.4): cada fila
 * lleva severidad y referencia exacta hoja!celda, como una cita de fuente
 * (§1.6) pero apuntando al propio modelo en vez de a un documento del KB. */
export function AuditFindingsTable({ findings }: { findings: AuditFinding[] }) {
  const { t } = useTranslation('financialModel')

  const columns: Column<AuditFinding>[] = [
    {
      key: 'severity',
      header: t('audit.columns.severity'),
      width: '110px',
      sortValue: (f) => SEVERITY_RANK[f.severity],
      render: (f) => (
        <Badge tone={SEVERITY_TONE[f.severity]} dot={f.severity === 'critical'}>
          {t(`audit.severity.${f.severity}`)}
        </Badge>
      ),
    },
    {
      key: 'location',
      header: t('audit.columns.location'),
      width: '160px',
      sortValue: (f) => `${f.sheet}!${f.cell}`,
      render: (f) => (
        <code className="u-mono fm-finding__location">
          {f.sheet}!{f.cell}
        </code>
      ),
    },
    {
      key: 'type',
      header: t('audit.columns.type'),
      width: '190px',
      render: (f) => {
        const Icon = TYPE_ICON[f.type]
        return (
          <Pill variant="outline" icon={<Icon size={12} aria-hidden />}>
            {t(`audit.type.${f.type}`)}
          </Pill>
        )
      },
    },
    {
      key: 'finding',
      header: t('audit.columns.finding'),
      render: (f) => (
        <div className="fm-finding">
          <p className="fm-finding__description">{f.description}</p>
          <p className="fm-finding__recommendation">
            <span className="fm-finding__recommendation-label">{t('audit.recommendation')}:</span>{' '}
            {f.recommendation}
          </p>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={findings}
      rowKey={(f) => f.id}
      defaultSort={{ key: 'severity', dir: 'desc' }}
      minWidth={860}
    />
  )
}
