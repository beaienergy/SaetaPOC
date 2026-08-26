import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrainCog, Check, Sparkles } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Collapsible, Pill, Textarea } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { getOperation } from '@/features/operations'
import { useAuthStore } from '@/features/auth'
import { cn } from '@/shared/lib/utils'
import { useBrainMemory, useBrainMemoryStore } from '../store/brainMemoryStore'
import './BrainMemoryPanel.css'

/**
 * Documento de memoria del brain (pedido explícito): el listado de versiones
 * va arriba — cada una se abre al pulsarla (acordeón, una a la vez) para ver
 * su texto completo, sin mezclarlo con las demás. "Crear nueva versión" es
 * una acción propia y explícita, no algo escondido detrás de un lápiz:
 * parte del texto de la versión activa y, al guardar, la nueva versión pasa
 * a ser la activa y se abre sola. Activar una versión antigua no la borra,
 * solo cambia cuál usa el agente.
 */
export function BrainMemoryPanel({ opId }: { opId: string }) {
  const { t, i18n } = useTranslation('analytics')
  const { t: tCommon } = useTranslation('common')
  const locale = i18n.language as Locale
  const operation = getOperation(opId)
  const { versions, activeVersionId } = useBrainMemory(opId)
  const activateVersion = useBrainMemoryStore((s) => s.activateVersion)
  const editActiveVersion = useBrainMemoryStore((s) => s.editActiveVersion)
  const actor = useAuthStore((s) => s.user?.name) ?? 'You'

  const latestVersion = versions[versions.length - 1]
  const activeVersion = versions.find((v) => v.id === activeVersionId) ?? latestVersion
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version)

  const [openVersionId, setOpenVersionId] = useState<string | null>(activeVersionId || null)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState('')

  if (!activeVersion) return null

  function startCreate() {
    setDraft(activeVersion.content)
    setIsCreating(true)
  }
  function saveCreate() {
    const trimmed = draft.trim()
    if (trimmed) {
      editActiveVersion(opId, trimmed, actor)
      const newActiveId = useBrainMemoryStore.getState().byOperation[opId]?.activeVersionId
      if (newActiveId) setOpenVersionId(newActiveId)
    }
    setIsCreating(false)
  }

  return (
    <Card className="brain-memory">
      <CardHeader
        title={t('memory.document.title', { project: operation?.name ?? opId })}
        icon={<BrainCog size={16} aria-hidden />}
        actions={
          !isCreating && (
            <Button variant="primary" size="sm" icon={<Sparkles size={14} aria-hidden />} onClick={startCreate}>
              {t('memory.document.newVersion')}
            </Button>
          )
        }
      />

      {isCreating && (
        <div className="brain-memory__editor">
          <span className="u-eyebrow">{t('memory.document.newVersionFrom', { version: activeVersion.version })}</span>
          <Textarea rows={8} value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
          <div className="brain-memory__editor-actions">
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              {tCommon('actions.cancel')}
            </Button>
            <Button variant="primary" size="sm" onClick={saveCreate}>
              {t('memory.document.save')}
            </Button>
          </div>
        </div>
      )}

      <div className="brain-memory__version-list">
        {sortedVersions.map((v) => {
          const isActive = v.id === activeVersionId
          return (
            <Collapsible
              key={v.id}
              className={cn('brain-memory__version', isActive && 'is-active')}
              strategy="mount"
              open={openVersionId === v.id}
              onOpenChange={(open) => setOpenVersionId(open ? v.id : null)}
              title={<span className="u-mono">v{v.version}</span>}
              meta={
                <span className="brain-memory__version-meta">
                  {v.id === latestVersion?.id && <Pill>{t('memory.document.latest')}</Pill>}
                  {isActive && <Badge tone="success">{t('memory.document.active')}</Badge>}
                  <span className="brain-memory__version-date">
                    {formatDate(v.createdAt, locale)} · {v.createdBy}
                  </span>
                </span>
              }
            >
              <p className="brain-memory__content">{v.content}</p>
              {v.note && <p className="brain-memory__version-note">{v.note}</p>}
              {!isActive && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Check size={13} aria-hidden />}
                  onClick={() => activateVersion(opId, v.id)}
                >
                  {t('memory.document.activate')}
                </Button>
              )}
            </Collapsible>
          )
        })}
      </div>
    </Card>
  )
}
