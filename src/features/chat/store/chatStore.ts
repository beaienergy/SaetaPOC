import { create } from 'zustand'
import { sleep } from '@/shared/lib/utils'
import { MOCK_CONVERSATIONS, MOCK_SOURCE_DOCUMENTS, matchReply } from '../api/mockChat'
import type { ChatConversation, ChatMessage, ChatSourceDocument } from '../types'

interface OperationChatState {
  conversations: ChatConversation[]
  activeConversationId: string
  sourceDocuments: ChatSourceDocument[]
  includedDocumentIds: string[]
  /** Si el agente esta "escribiendo" una respuesta (guion §5.1: `sleep()` +
   * indicador de escritura, sin streaming real). */
  thinking: boolean
}

interface ChatState {
  byOperation: Record<string, OperationChatState>
  ensureLoaded: (opId: string) => void
  selectConversation: (opId: string, conversationId: string) => void
  startNewConversation: (opId: string) => void
  sendMessage: (opId: string, text: string) => Promise<void>
  toggleSourceDocument: (opId: string, documentId: string) => void
}

let messageSeq = 0
let conversationSeq = 0

function cloneConversations(opId: string): ChatConversation[] {
  return (MOCK_CONVERSATIONS[opId] ?? []).map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({ ...message })),
  }))
}

function truncateTitle(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/**
 * Estado de Chat + historial (guion §5.1), scopeado por operacion — mismo
 * patron de segregacion que `agentConfigStore`: entrar en Helios no puede
 * enseñar ni un mensaje de Meridian. No persiste entre recargas (tampoco lo
 * hace `agentConfigStore`): es estado de sesion de la POC, no historial real.
 */
export const useChatStore = create<ChatState>((set, get) => ({
  byOperation: {},

  ensureLoaded: (opId) => {
    if (get().byOperation[opId]) return
    const conversations = cloneConversations(opId)
    const sourceDocuments = [...(MOCK_SOURCE_DOCUMENTS[opId] ?? [])]
    set((state) => ({
      byOperation: {
        ...state.byOperation,
        [opId]: {
          conversations,
          activeConversationId: conversations[0]?.id ?? '',
          sourceDocuments,
          includedDocumentIds: sourceDocuments
            .filter((doc) => doc.includedByDefault)
            .map((doc) => doc.id),
          thinking: false,
        },
      },
    }))
  },

  selectConversation: (opId, conversationId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: { ...state.byOperation, [opId]: { ...op, activeConversationId: conversationId } },
      }
    })
  },

  startNewConversation: (opId) => {
    conversationSeq += 1
    const conversation: ChatConversation = {
      id: `conv-new-${conversationSeq}`,
      title: '',
      updatedAt: new Date().toISOString(),
      messages: [],
    }
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            conversations: [conversation, ...op.conversations],
            activeConversationId: conversation.id,
          },
        },
      }
    })
  },

  sendMessage: async (opId, text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    get().ensureLoaded(opId)
    const loaded = get().byOperation[opId]
    if (!loaded) return

    let conversationId = loaded.activeConversationId
    if (!conversationId || !loaded.conversations.some((c) => c.id === conversationId)) {
      get().startNewConversation(opId)
      conversationId = get().byOperation[opId].activeConversationId
    }

    messageSeq += 1
    const userMessage: ChatMessage = {
      id: `msg-${conversationId}-${messageSeq}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            thinking: true,
            conversations: op.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    title: c.title || truncateTitle(trimmed),
                    updatedAt: userMessage.createdAt,
                    messages: [...c.messages, userMessage],
                  }
                : c,
            ),
          },
        },
      }
    })

    // Simula latencia + "escribiendo..." (guion §5.1): sin streaming real.
    await sleep(900 + Math.round(Math.random() * 700))

    const reply = matchReply(opId, trimmed)
    messageSeq += 1
    const agentMessage: ChatMessage = {
      id: `msg-${conversationId}-${messageSeq}`,
      role: 'agent',
      content: reply.content,
      createdAt: new Date().toISOString(),
      citations: reply.citations,
    }

    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            thinking: false,
            conversations: op.conversations.map((c) =>
              c.id === conversationId
                ? { ...c, updatedAt: agentMessage.createdAt, messages: [...c.messages, agentMessage] }
                : c,
            ),
          },
        },
      }
    })
  },

  toggleSourceDocument: (opId, documentId) => {
    set((state) => {
      const op = state.byOperation[opId]
      if (!op) return state
      const isIncluded = op.includedDocumentIds.includes(documentId)
      return {
        byOperation: {
          ...state.byOperation,
          [opId]: {
            ...op,
            includedDocumentIds: isIncluded
              ? op.includedDocumentIds.filter((id) => id !== documentId)
              : [...op.includedDocumentIds, documentId],
          },
        },
      }
    })
  },
}))

/** Conversaciones de una operacion, cargando el mock por defecto si hace
 * falta (evita llamar a `ensureLoaded` desde cada componente). */
export function useConversations(opId: string): ChatConversation[] {
  useChatStore.getState().ensureLoaded(opId)
  return useChatStore((state) => state.byOperation[opId]?.conversations ?? [])
}

/** Conversacion activa de una operacion (la que se ve en el hilo central). */
export function useActiveConversation(opId: string): ChatConversation | undefined {
  useChatStore.getState().ensureLoaded(opId)
  return useChatStore((state) => {
    const op = state.byOperation[opId]
    return op?.conversations.find((c) => c.id === op.activeConversationId)
  })
}

/** Documentos fuente de una operacion (columna derecha). */
export function useSourceDocuments(opId: string): ChatSourceDocument[] {
  useChatStore.getState().ensureLoaded(opId)
  return useChatStore((state) => state.byOperation[opId]?.sourceDocuments ?? [])
}
