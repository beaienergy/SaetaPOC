import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { Badge, Button, Input, Modal } from '@/shared/ui'
import { MessageBubble, TypingIndicator, matchReply, type ChatMessage } from '@/features/chat'
import { sleep } from '@/shared/lib/utils'
import type { Locale } from '@/shared/types'
import type { FactItem } from '../types'
import { FACT_KIND_TONE } from '../lib/tones'
import { CitationList } from './CitationList'
import './FactDiscussionModal.css'

let messageSeq = 0

/**
 * "Discutir en el chat" desde una tarjeta de Hechos vs conclusiones (pedido
 * explícito, §5.3.3): un chat en miniatura, con las mismas burbujas
 * (`MessageBubble`) y el mismo banco de respuestas (`matchReply`) que el chat
 * principal — para que se lea inequívocamente como un chat, no como un
 * cuadro de comentarios aparte. Arranca con el propio hecho/inferencia como
 * primer mensaje del agente, en vez de un hilo vacío.
 */
export function FactDiscussionModal({
  opId,
  item,
  onClose,
}: {
  opId: string
  item: FactItem
  onClose: () => void
}) {
  const { t, i18n } = useTranslation('summary')
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: `fact-discuss-seed-${item.id}`,
      role: 'agent',
      content: item.note ? `${item.text}\n\n${item.note}` : item.text,
      createdAt: new Date().toISOString(),
      citations: item.citations,
    },
  ])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed || thinking) return

    messageSeq += 1
    const userMessage: ChatMessage = {
      id: `fact-discuss-${item.id}-${messageSeq}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setThinking(true)

    await sleep(700 + Math.round(Math.random() * 500))

    const reply = matchReply(opId, trimmed, i18n.language as Locale)
    messageSeq += 1
    const agentMessage: ChatMessage = {
      id: `fact-discuss-${item.id}-${messageSeq}`,
      role: 'agent',
      content: reply.content,
      createdAt: new Date().toISOString(),
      citations: reply.citations,
    }
    setMessages((prev) => [...prev, agentMessage])
    setThinking(false)
  }

  return (
    <Modal title={item.text} onClose={onClose} maxWidth={620}>
      <div className="fact-discussion">
        <div className="fact-discussion__context">
          <Badge tone={FACT_KIND_TONE[item.kind]}>{t(`facts.columns.${item.kind}`)}</Badge>
          <CitationList citations={item.citations} opId={opId} />
        </div>

        <div className="fact-discussion__thread">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} opId={opId} agentLabel={t('facts.discussion.agentLabel')} />
          ))}
          {thinking && (
            <div className="message-bubble message-bubble--agent">
              <TypingIndicator />
            </div>
          )}
        </div>

        <form className="fact-discussion__composer" onSubmit={handleSubmit}>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('facts.discussion.placeholder')}
            autoFocus
          />
          <Button type="submit" variant="primary" icon={<Send size={15} aria-hidden />} disabled={!draft.trim() || thinking}>
            {t('facts.discussion.send')}
          </Button>
        </form>
      </div>
    </Modal>
  )
}
