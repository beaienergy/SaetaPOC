import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FileText, AlertTriangle, Clock, Plus } from 'lucide-react'
import { Badge, Button, Card, PageHeader, Spinner } from '@/shared/ui'
import { formatRelativeTime } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { ROUTES } from '@/shared/config/routes'
import { MOCK_OPERATIONS } from '../api/mockOperations'
import { useOperationStore } from '../store/operationStore'
import type { Operation } from '../types'
import { OperationsHeader } from './OperationsHeader'
import { CreateProjectModal } from './CreateProjectModal'
import './OperationCard.css'

interface SyncingOperation {
  id: string
  name: string
}

/**
 * Selector de operación (guion §4): la pantalla que más vende segregación real
 * (R-07) y aislamiento (R-08) sin necesidad de explicarlo — se ve. Pantalla
 * intermedia obligatoria: siempre se pasa por aquí antes de entrar al shell de
 * una operación (decisión confirmada con el usuario).
 */
export function OperationsScreen() {
  const { t } = useTranslation('operations')
  const navigate = useNavigate()
  const setCurrentOperationId = useOperationStore((s) => s.setCurrentOperationId)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [syncingOperations, setSyncingOperations] = useState<SyncingOperation[]>([])

  function openOperation(op: Operation) {
    setCurrentOperationId(op.id)
    navigate(ROUTES.operationChat(op.id))
  }

  function handleCreate(name: string) {
    setSyncingOperations((prev) => [...prev, { id: `pending-${prev.length}-${name}`, name }])
    setIsCreateOpen(false)
  }

  return (
    <div className="operations-page">
      <OperationsHeader />

      <main className="operations-page__content">
        <PageHeader
          title={t('title')}
          subtitle={t('subtitle')}
          actions={
            <Button
              variant="accent"
              size="sm"
              icon={<Plus size={14} aria-hidden />}
              onClick={() => setIsCreateOpen(true)}
            >
              {t('newOperation.cta')}
            </Button>
          }
        />

        <div className="op-grid">
          {MOCK_OPERATIONS.map((op) => (
            <OperationCard key={op.id} operation={op} onOpen={() => openOperation(op)} />
          ))}
          {syncingOperations.map((op) => (
            <SyncingOperationCard key={op.id} name={op.name} />
          ))}
        </div>
      </main>

      {isCreateOpen && (
        <CreateProjectModal onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}

function SyncingOperationCard({ name }: { name: string }) {
  const { t } = useTranslation('operations')

  return (
    <Card className="op-card op-card--syncing">
      <div className="op-card__top">
        <div className="op-card__name">{name}</div>
        <Badge tone="neutral">
          <Spinner size={11} /> {t('newOperation.syncing')}
        </Badge>
      </div>
      <p className="op-card__syncing-hint">{t('newOperation.syncingHint')}</p>
    </Card>
  )
}

function OperationCard({ operation, onOpen }: { operation: Operation; onOpen: () => void }) {
  const { t, i18n } = useTranslation('operations')
  const locale = i18n.language as Locale

  return (
    <Card
      className="op-card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
    >
      <div className="op-card__top">
        <div className="op-card__name">{operation.name}</div>
        <Badge tone={operation.status === 'active' ? 'success' : 'neutral'}>
          {t(`status.${operation.status}`)}
        </Badge>
      </div>

      <div className="op-card__meta">
        <span className="op-card__meta-item">
          <FileText size={13} aria-hidden />
          {t('card.documents', { count: operation.documentCount })}
        </span>
        <span className="op-card__meta-item">
          <AlertTriangle size={13} aria-hidden />
          {t('card.openIssues', { count: operation.openIssueCount })}
        </span>
        <span className="op-card__meta-item">
          <Clock size={13} aria-hidden />
          {t('card.lastActivity')}: {formatRelativeTime(operation.lastActivityAt, locale)}
        </span>
      </div>
    </Card>
  )
}
