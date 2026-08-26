import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pill } from '@/shared/ui'
import { AgentConfigButton } from '@/features/agent-config'
import type { Citation } from '@/shared/types/domain'
import { useActiveConversation } from '../store/chatStore'
import { HistoryColumn } from './HistoryColumn'
import { ChatThread } from './ChatThread'
import { SourcesPanel } from './SourcesPanel'
import './ChatScreen.css'

/**
 * Chat + historial (guion §5.1, UC-01/R-02): patron NotebookLM de tres
 * columnas — historial, hilo de chat, fuentes. Sin titulo/subtitulo propios:
 * la seccion ya esta identificada por el sidebar, repetirlo aqui era ruido.
 * Historial y fuentes son comprimibles (ancho controlado por variables CSS en
 * `.chat-screen__columns`, ver `ChatScreen.css`).
 */
export function ChatScreen({ opId }: { opId: string }) {
  const { t } = useTranslation('chat')
  const conversation = useActiveConversation(opId)
  const [historyCollapsed, setHistoryCollapsed] = useState(false)
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false)

  // Fuentes citadas en la conversacion activa (guion, patron NotebookLM):
  // union de las citas de todos los mensajes de agente, no la lista completa
  // de documentos de la operacion — solo lo que de verdad se ha usado para
  // responder aqui.
  const citedSources = useMemo(() => {
    const seen = new Map<string, Citation>()
    for (const message of conversation?.messages ?? []) {
      for (const citation of message.citations ?? []) {
        if (!seen.has(citation.documentId)) seen.set(citation.documentId, citation)
      }
    }
    return [...seen.values()]
  }, [conversation])

  return (
    <div className="chat-screen">
      <div className="chat-screen__toolbar">
        <Pill variant="outline" size="sm">
          {t('page.modelRouting')}
        </Pill>
        <AgentConfigButton opId={opId} agentId="chat" />
      </div>

      <div
        className="chat-screen__columns"
        style={{
          ['--history-col-w' as string]: historyCollapsed ? '48px' : '280px',
          ['--sources-col-w' as string]: sourcesCollapsed ? '48px' : '300px',
        }}
      >
        <HistoryColumn
          opId={opId}
          collapsed={historyCollapsed}
          onToggleCollapsed={() => setHistoryCollapsed((v) => !v)}
        />
        <ChatThread opId={opId} />
        <SourcesPanel
          opId={opId}
          citations={citedSources}
          collapsed={sourcesCollapsed}
          onToggleCollapsed={() => setSourcesCollapsed((v) => !v)}
        />
      </div>
    </div>
  )
}
