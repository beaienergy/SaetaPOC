import type { Operation } from '../types'

/**
 * Las 3 operaciones de ejemplo de la POC (guion, nota de alcance): carpetas
 * distintas, con datos distintos entre sí, para demostrar segregación real a
 * nivel de UI. Anonimizadas y ficticias, en línea con el sector de Saeta
 * (energía renovable) y con el principio 1/2 de la RFP.
 *
 * IDs estables ('helios' | 'meridian' | 'solstice'): el resto de features
 * (documents, chat, summary, financial-model, reports, analytics) mockean su
 * propio contenido keyed por estos mismos IDs.
 */
export const MOCK_OPERATIONS: Operation[] = [
  {
    id: 'helios',
    name: 'Project Helios',
    target: 'Utility-scale solar PV portfolio — 480 MWp, Iberia',
    status: 'active',
    lastActivityAt: '2026-08-24T16:20:00.000Z',
    documentCount: 128,
    openIssueCount: 7,
  },
  {
    id: 'meridian',
    name: 'Project Meridian',
    target: 'Onshore wind platform — 6 operating assets, Southern Europe',
    status: 'active',
    lastActivityAt: '2026-08-21T09:05:00.000Z',
    documentCount: 74,
    openIssueCount: 4,
  },
  {
    id: 'solstice',
    name: 'Project Solstice',
    target: 'Battery storage (BESS) developer — early-stage pipeline',
    status: 'closed',
    lastActivityAt: '2026-06-30T11:40:00.000Z',
    documentCount: 31,
    openIssueCount: 0,
  },
]

export function getOperation(id: string): Operation | undefined {
  return MOCK_OPERATIONS.find((op) => op.id === id)
}
