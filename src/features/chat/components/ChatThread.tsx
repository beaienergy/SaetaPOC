import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { Button, Textarea } from '@/shared/ui'
import { getOperation } from '@/features/operations'
import { useActiveConversation, useChatStore } from '../store/chatStore'
import { MOCK_SUGGESTIONS } from '../api/mockChat'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import './ChatThread.css'

/** Columna central del patron NotebookLM (guion §5.1): hilo de mensajes,
 * sugerencias de arranque especificas de M&A y el compositor. */
export function ChatThread({ opId }: { opId: string }) {
  const { t } = useTranslation('chat')
  const conversation = useActiveConversation(opId)
  const thinking = useChatStore((state) => state.byOperation[opId]?.thinking ?? false)
  const sendMessage = useChatStore((state) => state.sendMessage)
  // "{{project}} Brain" en vez de un nombre de agente generico (pedido
  // explicito): personaliza la burbuja del agente sin depender de que
  // `features/documents`/`operations` expongan mas que el nombre.
  const agentLabel = t('thread.agentName', { project: getOperation(opId)?.name ?? '' })

  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [conversation?.messages.length, thinking])

  const suggestions = MOCK_SUGGESTIONS[opId] ?? []
  const showSuggestions = (conversation?.messages.length ?? 0) === 0 && !thinking

  function handleSend(text: string) {
    const value = text.trim()
    if (!value || thinking) return
    setDraft('')
    void sendMessage(opId, value)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(draft)
    }
  }

  return (
    <div className="chat-thread">
      <div className="chat-thread__messages" ref={listRef}>
        {!conversation && <p className="chat-thread__empty">{t('thread.selectConversation')}</p>}

        {conversation?.messages.map((message) => (
          <MessageBubble key={message.id} message={message} opId={opId} agentLabel={agentLabel} />
        ))}

        {thinking && (
          <div className="message-bubble message-bubble--agent">
            <div className="message-bubble__meta">
              <span className="message-bubble__author">{agentLabel}</span>
            </div>
            <div className="message-bubble__content">
              <TypingIndicator />
            </div>
          </div>
        )}

        {showSuggestions && (
          <div className="chat-thread__suggestions">
            <p className="chat-thread__suggestions-title">{t('thread.suggestionsTitle')}</p>
            <div className="chat-thread__suggestions-list">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="chat-thread__suggestion"
                  onClick={() => handleSend(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chat-thread__composer">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('thread.composerPlaceholder')}
          rows={2}
          disabled={thinking}
          aria-label={t('thread.composerPlaceholder')}
        />
        <Button
          variant="primary"
          icon={<Send size={15} aria-hidden />}
          onClick={() => handleSend(draft)}
          disabled={!draft.trim() || thinking}
        >
          {t('thread.send')}
        </Button>
      </div>
    </div>
  )
}
