import { create } from 'zustand'
import { sleep } from '@/shared/lib/utils'
import { i18n } from '@/shared/lib/i18n'
import type { Locale } from '@/shared/types'
import { MOCK_SOURCE_DOCUMENTS, getConversations, matchReply } from '../api/mockChat'
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

/** El idioma activo de la interfaz decide en qué idioma se sirve el chat
 * (pedido explícito) — cada combinación opId+idioma guarda su propio estado,
 * así que cambiar de idioma no pierde lo escrito en el otro. */
function currentLocale(): Locale {
  return i18n.language === 'es' ? 'es' : 'en'
}

function storeKey(opId: string): string {
  return `${opId}:${currentLocale()}`
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
    const key = storeKey(opId)
    if (get().byOperation[key]) return
    const conversations = getConversations(opId, currentLocale()).map((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => ({ ...message })),
    }))
    const sourceDocuments = [...(MOCK_SOURCE_DOCUMENTS[opId] ?? [])]
    set((state) => ({
      byOperation: {
        ...state.byOperation,
        [key]: {
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
    const key = storeKey(opId)
    set((state) => {
      const op = state.byOperation[key]
      if (!op) return state
      return {
        byOperation: { ...state.byOperation, [key]: { ...op, activeConversationId: conversationId } },
      }
    })
  },

  startNewConversation: (opId) => {
    const key = storeKey(opId)
    conversationSeq += 1
    const conversation: ChatConversation = {
      id: `conv-new-${conversationSeq}`,
      title: '',
      updatedAt: new Date().toISOString(),
      messages: [],
    }
    set((state) => {
      const op = state.byOperation[key]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [key]: {
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

    const locale = currentLocale()
    const key = storeKey(opId)

    get().ensureLoaded(opId)
    const loaded = get().byOperation[key]
    if (!loaded) return

    let conversationId = loaded.activeConversationId
    if (!conversationId || !loaded.conversations.some((c) => c.id === conversationId)) {
      get().startNewConversation(opId)
      conversationId = get().byOperation[key].activeConversationId
    }

    messageSeq += 1
    const userMessage: ChatMessage = {
      id: `msg-${conversationId}-${messageSeq}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const op = state.byOperation[key]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [key]: {
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

    const reply = matchReply(opId, trimmed, locale)
    messageSeq += 1
    const agentMessage: ChatMessage = {
      id: `msg-${conversationId}-${messageSeq}`,
      role: 'agent',
      content: reply.content,
      createdAt: new Date().toISOString(),
      citations: reply.citations,
    }

    set((state) => {
      const op = state.byOperation[key]
      if (!op) return state
      return {
        byOperation: {
          ...state.byOperation,
          [key]: {
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
    const key = storeKey(opId)
    set((state) => {
      const op = state.byOperation[key]
      if (!op) return state
      const isIncluded = op.includedDocumentIds.includes(documentId)
      return {
        byOperation: {
          ...state.byOperation,
          [key]: {
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
  return useChatStore((state) => state.byOperation[storeKey(opId)]?.conversations ?? [])
}

/** Conversacion activa de una operacion (la que se ve en el hilo central). */
export function useActiveConversation(opId: string): ChatConversation | undefined {
  useChatStore.getState().ensureLoaded(opId)
  return useChatStore((state) => {
    const op = state.byOperation[storeKey(opId)]
    return op?.conversations.find((c) => c.id === op.activeConversationId)
  })
}

/** Id de la conversacion activa (columna de historial: qué fila resaltar). */
export function useActiveConversationId(opId: string): string | undefined {
  return useChatStore((state) => state.byOperation[storeKey(opId)]?.activeConversationId)
}

/** Documentos fuente de una operacion (columna derecha). */
export function useSourceDocuments(opId: string): ChatSourceDocument[] {
  useChatStore.getState().ensureLoaded(opId)
  return useChatStore((state) => state.byOperation[storeKey(opId)]?.sourceDocuments ?? [])
}

/** Si el agente esta "escribiendo" una respuesta ahora mismo. */
export function useIsThinking(opId: string): boolean {
  return useChatStore((state) => state.byOperation[storeKey(opId)]?.thinking ?? false)
}
