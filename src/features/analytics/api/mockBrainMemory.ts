import type { BrainMemoryVersion } from '../types'

/**
 * Historial del documento de memoria del brain por operación (pedido
 * explícito): el texto que hoy usa el agente como contexto de fondo, más las
 * versiones anteriores que lo formaron. El contenido está deliberadamente en
 * línea con `mockMemory.ts` (las mismas propuestas aprobadas se notan aquí
 * como aprendizajes ya incorporados), para que las dos partes de la pantalla
 * cuenten la misma historia en vez de contradecirse.
 */
export const DEFAULT_BRAIN_MEMORY: Record<string, BrainMemoryVersion[]> = {
  helios: [
    {
      id: 'bm-helios-1',
      version: 1,
      createdAt: '2026-08-01T09:00:00.000Z',
      createdBy: 'Saeta Agent',
      content:
        'Project Helios is a 480 MWp utility-scale solar PV portfolio across four operating sites in ' +
        'Iberia. No prior learnings yet — this memory starts empty and grows as the deal team works ' +
        'the operation.',
    },
    {
      id: 'bm-helios-2',
      version: 2,
      createdAt: '2026-08-13T08:12:00.000Z',
      createdBy: 'Elena Vidal (Deal Lead)',
      note: 'Incorporates the approved grid-connection checklist refinement.',
      content:
        'Project Helios is a 480 MWp utility-scale solar PV portfolio across four operating sites in ' +
        'Iberia.\n\n' +
        'A complete grid connection file includes: connection permit, capacity reservation, access ' +
        'agreement with the DSO/TSO, curtailment terms AND their compensation mechanism, and the ' +
        'latest technical compliance report. A curtailment clause without an explicit compensation ' +
        'percentage is itself a gap, not a satisfied item.',
    },
    {
      id: 'bm-helios-3',
      version: 3,
      createdAt: '2026-08-09T09:00:00.000Z',
      createdBy: 'Marcos Duarte (Analyst)',
      note: 'Incorporates the approved land-lease threshold change.',
      content:
        'Project Helios is a 480 MWp utility-scale solar PV portfolio across four operating sites in ' +
        'Iberia.\n\n' +
        'A complete grid connection file includes: connection permit, capacity reservation, access ' +
        'agreement with the DSO/TSO, curtailment terms AND their compensation mechanism, and the ' +
        'latest technical compliance report. A curtailment clause without an explicit compensation ' +
        'percentage is itself a gap, not a satisfied item.\n\n' +
        "Flag any lease with less than 1.5x the asset's remaining useful life as a key issue — a lease " +
        'that merely matches useful life leaves no room for a renewal negotiation to fail.',
    },
    {
      id: 'bm-helios-4',
      version: 4,
      createdAt: '2026-08-24T11:00:00.000Z',
      createdBy: 'Elena Vidal (Deal Lead)',
      content:
        'Project Helios is a 480 MWp utility-scale solar PV portfolio across four operating sites in ' +
        'Iberia.\n\n' +
        'A complete grid connection file includes: connection permit, capacity reservation, access ' +
        'agreement with the DSO/TSO, curtailment terms AND their compensation mechanism, and the ' +
        'latest technical compliance report. A curtailment clause without an explicit compensation ' +
        'percentage is itself a gap, not a satisfied item.\n\n' +
        "Flag any lease with less than 1.5x the asset's remaining useful life as a key issue — a lease " +
        'that merely matches useful life leaves no room for a renewal negotiation to fail.\n\n' +
        'When auditing an Iberia solar financial model, check row 44 (revenue conversion) for a ' +
        'hardcoded EUR/USD rate first — it has been the source of the top finding on this operation ' +
        'more than once. Treat any EIA condition on a per-condition basis, not by a fixed age cutoff ' +
        '— a flat "3 years and it\'s expired" rule produced false positives on assets with a valid ' +
        'multi-year extension.',
    },
  ],

  meridian: [
    {
      id: 'bm-meridian-1',
      version: 1,
      createdAt: '2026-08-05T09:00:00.000Z',
      createdBy: 'Saeta Agent',
      content:
        'Project Meridian is an onshore wind platform comprising six operating assets in Southern ' +
        'Europe. No prior learnings yet.',
    },
    {
      id: 'bm-meridian-2',
      version: 2,
      createdAt: '2026-08-19T14:30:00.000Z',
      createdBy: 'Sofía Reyes (Analyst)',
      note: 'Incorporates the approved O&M/warranty cross-check refinement.',
      content:
        'Project Meridian is an onshore wind platform comprising six operating assets in Southern ' +
        'Europe.\n\n' +
        'When checking turbine warranty expiry, cross-reference against the O&M contract term as ' +
        'well as the commissioning date — an asset covered by a full-service O&M contract that ' +
        'overlaps the warranty gap is not a gap, since the O&M contract absorbs the risk. Any O&M ' +
        'availability guarantee below 95% should be raised as a Key Issue automatically.',
    },
  ],

  solstice: [
    {
      id: 'bm-solstice-1',
      version: 1,
      createdAt: '2026-06-01T09:00:00.000Z',
      createdBy: 'Saeta Agent',
      content:
        'Project Solstice was an early-stage battery storage (BESS) development pipeline. No prior ' +
        'learnings yet.',
    },
    {
      id: 'bm-solstice-2',
      version: 2,
      createdAt: '2026-06-11T09:20:00.000Z',
      createdBy: 'Elena Vidal (Deal Lead)',
      content:
        'Project Solstice was an early-stage battery storage (BESS) development pipeline (closed, no ' +
        'further activity).\n\n' +
        'A pipeline project only counts toward valuation once it has a confirmed interconnection queue ' +
        'position, confirmed site control, and a development-stage milestone — a queue position sent ' +
        'back for re-study does not count as confirmed. Record whether site control is an option to ' +
        'lease/purchase or a signed agreement: an unexercised option carries materially more risk than ' +
        'a signed lease. A project with a signed grid study agreement but no queue position yet can ' +
        'still be counted as "in development" for maturity reporting, separate from the valued set.',
    },
  ],
}
