import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button, Input } from '@/shared/ui'
import { useDebounce } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { useChatStore, useConversations } from '../store/chatStore'
import { groupConversationsByDate, type ConversationGroupKey } from '../lib/groupConversations'
import './HistoryColumn.css'

const GROUP_LABEL_KEY: Record<ConversationGroupKey, string> = {
  today: 'history.groups.today',
  yesterday: 'history.groups.yesterday',
  previous7Days: 'history.groups.previous7Days',
  older: 'history.groups.older',
}

/** Columna izquierda del patron NotebookLM (guion §5.1): historial agrupado
 * por fecha, buscador simple y "nueva conversacion". Comprimible hacia la
 * izquierda — colapsada se queda en un riel estrecho con los dos accesos que
 * siguen teniendo sentido sin la lista (nueva conversacion, expandir). */
export function HistoryColumn({
  opId,
  collapsed,
  onToggleCollapsed,
}: {
  opId: string
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  const { t } = useTranslation('chat')
  const conversations = useConversations(opId)
  const activeConversationId = useChatStore((state) => state.byOperation[opId]?.activeConversationId)
  const selectConversation = useChatStore((state) => state.selectConversation)
  const startNewConversation = useChatStore((state) => state.startNewConversation)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(q) ||
        conversation.messages.some((message) => message.content.toLowerCase().includes(q)),
    )
  }, [conversations, debouncedQuery])

  const groups = useMemo(() => groupConversationsByDate(filtered), [filtered])

  if (collapsed) {
    return (
      <div className="history-column history-column--rail">
        <button
          type="button"
          className="history-column__rail-btn"
          onClick={onToggleCollapsed}
          aria-label={t('history.expand')}
          title={t('history.expand')}
        >
          <PanelLeftOpen size={16} />
        </button>
        <button
          type="button"
          className="history-column__rail-btn"
          onClick={() => startNewConversation(opId)}
          aria-label={t('history.newConversation')}
          title={t('history.newConversation')}
        >
          <Plus size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('history-column', collapsed && 'is-collapsed')}>
      <div className="history-column__header">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          icon={<Plus size={15} aria-hidden />}
          onClick={() => startNewConversation(opId)}
        >
          {t('history.newConversation')}
        </Button>
        <button
          type="button"
          className="history-column__collapse-btn"
          onClick={onToggleCollapsed}
          aria-label={t('history.collapse')}
          title={t('history.collapse')}
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      <div className="history-column__search">
        <Search size={14} className="history-column__search-icon" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('history.searchPlaceholder')}
          aria-label={t('history.searchPlaceholder')}
          className="history-column__search-input"
        />
      </div>

      <div className="history-column__list">
        {groups.length === 0 && <p className="history-column__empty">{t('history.noResults')}</p>}

        {groups.map((group) => (
          <div key={group.key} className="history-column__group">
            <div className="history-column__group-title">{t(GROUP_LABEL_KEY[group.key])}</div>
            {group.conversations.map((conversation) => {
              const lastMessage = conversation.messages[conversation.messages.length - 1]
              return (
                <button
                  key={conversation.id}
                  type="button"
                  className={cn(
                    'history-column__item',
                    conversation.id === activeConversationId && 'is-active',
                  )}
                  onClick={() => selectConversation(opId, conversation.id)}
                >
                  <span className="history-column__item-title">
                    {conversation.title || t('history.newConversation')}
                  </span>
                  <span className="history-column__item-preview">
                    {lastMessage ? lastMessage.content : t('history.emptyPreview')}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
