import type { ChatConversation } from '../types'

export type ConversationGroupKey = 'today' | 'yesterday' | 'previous7Days' | 'older'

export interface ConversationGroup {
  key: ConversationGroupKey
  conversations: ChatConversation[]
}

const DAY_MS = 24 * 60 * 60 * 1000
const GROUP_ORDER: ConversationGroupKey[] = ['today', 'yesterday', 'previous7Days', 'older']

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function bucketFor(updatedAt: string, now: Date): ConversationGroupKey {
  const diffDays = Math.round((startOfDay(now) - startOfDay(new Date(updatedAt))) / DAY_MS)
  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays <= 7) return 'previous7Days'
  return 'older'
}

/**
 * Agrupa conversaciones por fecha relativa a "ahora" (guion §5.1: "agrupadas
 * por fecha"), mas recientes primero dentro de cada grupo. `now` es un
 * parametro (no `Date.now()` interno) para que el agrupado sea determinista
 * en tests.
 */
export function groupConversationsByDate(
  conversations: ChatConversation[],
  now: Date = new Date(),
): ConversationGroup[] {
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const buckets = new Map<ConversationGroupKey, ChatConversation[]>()
  for (const conversation of sorted) {
    const key = bucketFor(conversation.updatedAt, now)
    const list = buckets.get(key)
    if (list) list.push(conversation)
    else buckets.set(key, [conversation])
  }

  return GROUP_ORDER.filter((key) => buckets.has(key)).map((key) => ({
    key,
    conversations: buckets.get(key)!,
  }))
}
