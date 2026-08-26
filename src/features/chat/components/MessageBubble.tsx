import { useTranslation } from 'react-i18next'
import { formatDateShort } from '@/shared/lib/formatters'
import type { Locale } from '@/shared/types'
import { CitationChip } from './CitationChip'
import type { ChatMessage } from '../types'
import './MessageBubble.css'

/** Una burbuja del hilo de chat (guion §5.1): usuario a la derecha, agente a
 * la izquierda, citas inline "[1] [2]" al final de la respuesta. */
export function MessageBubble({
  message,
  opId,
  agentLabel,
}: {
  message: ChatMessage
  opId: string
  /** "{{project}} Brain" — resuelto una vez por `ChatThread` a partir del
   * nombre de la operación, en vez de repetir la llamada a `getOperation` en
   * cada burbuja. */
  agentLabel: string
}) {
  const { t, i18n } = useTranslation('chat')
  const isAgent = message.role === 'agent'
  const locale = i18n.language as Locale

  return (
    <div className={`message-bubble message-bubble--${message.role}`}>
      <div className="message-bubble__meta">
        <span className="message-bubble__author">{isAgent ? agentLabel : t('thread.you')}</span>
        <span className="message-bubble__time">{formatDateShort(message.createdAt, locale)}</span>
      </div>
      <div className="message-bubble__content">
        {message.content}
        {message.citations && message.citations.length > 0 && (
          <span className="message-bubble__citations">
            {message.citations.map((citation, i) => (
              <CitationChip key={citation.id} citation={citation} index={i + 1} opId={opId} />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
