import { getOperation } from '@/features/operations'
import type { AgentId } from '@/features/agent-config'
import type { AgentModelUsage, CostPoint, SuccessRateItem, UseCaseCost } from '../types'
import { seededRandom, seededRange } from './mockRandom'

/**
 * Mock de coste y uso (guion §5.6.1), keyed por operationId. Nada de moneda
 * real: todo el coste va en "unidades de coste" arbitrarias, a propósito
 * (nota del guion: mismo orden de magnitud que la propuesta de BEAI, no los
 * números literales).
 */

export const USE_CASE_ORDER: AgentId[] = [
  'chat',
  'summary-overview',
  'key-issues',
  'financial-audit',
  'reports',
]

/** Modelo usado por cada agente — copia propia de `features/analytics`, no
 * importada de `agent-config`: son decorado de demo en cada sitio, y
 * mantenerlos independientes evita acoplar dos features por un detalle de
 * texto que en producción vendría del backend de observabilidad, no del
 * config del agente. */
const AGENT_MODEL: Record<AgentId, string> = {
  chat: 'GPT-4o mini · Azure OpenAI Foundry',
  'summary-overview': 'GPT-4o · Azure OpenAI Foundry',
  'key-issues': 'GPT-4o · Azure OpenAI Foundry',
  'financial-audit': 'GPT-4o · Azure OpenAI Foundry (deep reasoning)',
  reports: 'GPT-4o · Azure OpenAI Foundry',
}

export function agentModel(agentId: AgentId): string {
  return AGENT_MODEL[agentId]
}

/** Coste base por caso de uso (operación "helios", la más activa) — mismo
 * orden de magnitud que la propuesta de BEAI: Consulta ~120, Resumen ~240,
 * KIL ~420, Modelo financiero ~310. `reports` no viene en el ejemplo del
 * guion, se interpola entre Consulta y Modelo financiero. */
const BASE_USE_CASE_COST: Record<AgentId, number> = {
  chat: 120,
  'summary-overview': 240,
  'key-issues': 420,
  'financial-audit': 310,
  reports: 180,
}

/** Escala por operación: helios = referencia, meridian intermedia, solstice
 * pequeña y congelada desde su cierre (mismo criterio que el resto de mocks
 * de la POC — guion §4). */
const OPERATION_SCALE: Record<string, number> = {
  helios: 1,
  meridian: 0.55,
  solstice: 0.22,
}

function scale(operationId: string): number {
  return OPERATION_SCALE[operationId] ?? 0.4
}

export function getUseCaseCosts(operationId: string): UseCaseCost[] {
  const f = scale(operationId)
  return USE_CASE_ORDER.map((agentId) => {
    const cost = Math.round(BASE_USE_CASE_COST[agentId] * f)
    // ~1 llamada cada 2.4 unidades de coste — proporción arbitraria pero
    // estable, para que la tabla de consumo no contradiga al gráfico de coste.
    const calls = Math.max(1, Math.round(cost / 2.4))
    return { agentId, cost, calls }
  })
}

export function getAgentModelUsage(operationId: string): AgentModelUsage[] {
  const useCaseCosts = getUseCaseCosts(operationId)
  return useCaseCosts.map(({ agentId, calls }) => {
    const tokensPerCall = seededRange(`${operationId}:${agentId}:tpc`, 900, 2600)
    const total = Math.round(calls * tokensPerCall)
    // Los agentes que redactan (resumen, KIL, informes) generan más salida que
    // entrada; el agente de auditoría financiera lee mucho más de lo que escribe.
    const outRatio = agentId === 'financial-audit' ? 0.28 : 0.55
    const tokensOut = Math.round(total * outRatio)
    const tokensIn = total - tokensOut
    return { agentId, model: AGENT_MODEL[agentId], calls, tokensIn, tokensOut }
  })
}

export function getSuccessRate(operationId: string): SuccessRateItem[] {
  const useCaseCosts = getUseCaseCosts(operationId)
  return useCaseCosts.map(({ agentId, calls }) => {
    // Tasa de error creíble y no nula (95.5–99%): visible pero no alarmante —
    // el punto de la pantalla es que se puede MEDIR, no que el sistema falle.
    const errorRate = seededRange(`${operationId}:${agentId}:err`, 0.008, 0.045)
    const error = Math.max(0, Math.round(calls * errorRate))
    const success = Math.max(0, calls - error)
    return { agentId, success, error }
  })
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Serie diaria de coste de los últimos `days` días hasta hoy. Para la
 * operación cerrada, el coste cae a cero después de su fecha de cierre —
 * demuestra sin necesidad de texto que "cerrada" significa que ya no genera
 * actividad, coherente con `status: 'closed'` de `features/operations`.
 */
export function getCostSeries(operationId: string, days: number): CostPoint[] {
  const f = scale(operationId)
  const dailyBase = (Object.values(BASE_USE_CASE_COST).reduce((a, b) => a + b, 0) / 30) * f
  const operation = getOperation(operationId)
  const closedAt =
    operation?.status === 'closed' ? new Date(operation.lastActivityAt).getTime() : null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const points: CostPoint[] = []

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today.getTime() - i * DAY_MS)
    const iso = day.toISOString().slice(0, 10)

    if (closedAt !== null && day.getTime() > closedAt) {
      points.push({ date: iso, cost: 0 })
      continue
    }

    const weekday = day.getDay()
    // Fin de semana: mucha menos actividad de due diligence.
    const weekdayFactor = weekday === 0 || weekday === 6 ? 0.28 : 1
    // Deriva suave a lo largo del rango + ruido por día, ambos deterministas.
    const drift = 1 + (0.18 * (days - i)) / days
    const noise = 0.65 + seededRandom(`${operationId}:cost:${iso}`) * 0.7
    const cost = Math.max(0, Math.round(dailyBase * weekdayFactor * drift * noise))
    points.push({ date: iso, cost })
  }

  return points
}
