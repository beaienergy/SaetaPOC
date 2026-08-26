import type { Citation } from '@/shared/types/domain'
import type { MemoryProposal } from '../types'

/**
 * Mock de propuestas de memoria de largo plazo (guion §5.6.3 — "la pantalla
 * más importante de la POC"), keyed por operationId. A diferencia de
 * `MOCK_SKILLS` de `features/agent-config` (conocimiento sembrado de
 * antemano, editado a mano), cada entrada aquí simula haber nacido del USO
 * real de un agente en una conversación concreta, con su evidencia.
 *
 * helios (activa, la más rica): mezcla sana de pendientes, aprobadas,
 * rechazadas y una revertida — para que se vea el ciclo completo, incluida
 * la marcha atrás cuando una propuesta aprobada resulta ser mala idea.
 * meridian: intermedia. solstice (cerrada): asentada, mayormente aprobada,
 * sin pendientes nuevas — coherente con que ya no hay uso activo generando
 * propuestas.
 */

function cite(input: Omit<Citation, 'id'> & { id: string }): Citation {
  return input
}

export const DEFAULT_MEMORY_PROPOSALS: Record<string, MemoryProposal[]> = {
  helios: [
    {
      id: 'mem-helios-1',
      operationId: 'helios',
      title: 'Flag PPA curtailment clauses earlier in the review',
      category: 'Negotiation pattern',
      before: '',
      after:
        'When a solar portfolio PPA includes a curtailment clause, surface it in the first-pass ' +
        'summary instead of waiting for the Key Issue List draft — sellers in this sector ' +
        'consistently push back on curtailment compensation terms during negotiation, so ' +
        'reviewers ask about it early.',
      originAgentId: 'chat',
      originConversation: 'Chat session · Aug 22, 10:14 — "risks on the PPA curtailment clause"',
      rationale:
        'Observed across 3 separate chat conversations this month: reviewers ask about ' +
        'curtailment compensation right after the PPA is uploaded, before the Key Issue List ' +
        'even has a draft entry for it.',
      evidence: [
        cite({
          id: 'ev-helios-1a',
          documentId: 'doc-helios-ppa-3',
          documentName: 'PPA_Iberia_SolarCo_v3.pdf',
          locator: 'cláusula 14.2',
          snippet: 'Curtailment events shall be compensated at 90% of the contracted price...',
        }),
      ],
      status: 'pending',
      createdAt: '2026-08-22T10:20:00.000Z',
      history: [
        { id: 'h-helios-1-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-22T10:20:00.000Z' },
      ],
    },
    {
      id: 'mem-helios-2',
      operationId: 'helios',
      title: 'Treat capacity reservation letters older than 12 months as needing revalidation',
      category: 'Risk heuristic',
      before: '',
      after:
        'A DSO/TSO capacity reservation letter older than 12 months should be flagged for ' +
        'revalidation by default, not treated as current — reservation terms in this market have ' +
        'been renegotiated mid-term on 2 of the last 4 deals reviewed.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Aug 21, 09:03',
      rationale:
        'The grid connection checklist skill already lists capacity reservation as required, but ' +
        'says nothing about staleness — this closes that gap based on two portfolios where an ' +
        '18-month-old letter turned out to be superseded.',
      evidence: [
        cite({
          id: 'ev-helios-2a',
          documentId: 'doc-helios-grid-7',
          documentName: 'Grid_Connection_Permit_AssetB.pdf',
          locator: 'p. 3',
          snippet: 'Capacity reservation valid as of the issue date, subject to periodic review...',
        }),
      ],
      status: 'pending',
      createdAt: '2026-08-21T09:10:00.000Z',
      history: [
        { id: 'h-helios-2-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-21T09:10:00.000Z' },
      ],
    },
    {
      id: 'mem-helios-3',
      operationId: 'helios',
      title: 'Check for a hardcoded FX rate in row 44 by default',
      category: 'Financial model pattern',
      before: '',
      after:
        'When auditing an Iberia solar financial model, check row 44 (revenue conversion) for a ' +
        'hardcoded EUR/USD rate first — it has been the source of the top finding in 2 of the 3 ' +
        'audits run on this operation so far.',
      originAgentId: 'financial-audit',
      originConversation: 'Financial model audit · Aug 23, 09:30',
      rationale:
        'Two separate audit runs independently surfaced the same hardcoded FX rate in the same ' +
        'row — worth checking first instead of discovering it again via a full formula-graph pass.',
      evidence: [
        cite({
          id: 'ev-helios-3a',
          documentId: 'doc-helios-fm-6',
          documentName: 'Financial_Model_Helios_v6.xlsx',
          locator: "pestaña 'Revenue', celda D44",
          snippet: '=B44*1.087 (valor fijo, no referenciado a ningún tipo de cambio de mercado)',
        }),
      ],
      status: 'pending',
      createdAt: '2026-08-23T10:05:00.000Z',
      history: [
        { id: 'h-helios-3-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-23T10:05:00.000Z' },
      ],
    },
    {
      id: 'mem-helios-4',
      operationId: 'helios',
      title: 'Grid connection checklist should also cover curtailment compensation terms',
      category: 'Skill refinement',
      before:
        'A complete grid connection file includes: connection permit, capacity reservation, ' +
        'access agreement with the DSO/TSO, curtailment terms, and the latest technical ' +
        'compliance report.',
      after:
        'A complete grid connection file includes: connection permit, capacity reservation, ' +
        'access agreement with the DSO/TSO, curtailment terms AND their compensation mechanism, ' +
        'and the latest technical compliance report. A curtailment clause without an explicit ' +
        'compensation percentage is itself a gap, not a satisfied item.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Aug 12, 15:40',
      rationale:
        'The existing skill checked for curtailment terms but not for a compensation mechanism — ' +
        'two portfolios had a curtailment clause with no compensation percentage attached, which ' +
        'the checklist marked as "present" when it should have been a gap.',
      evidence: [
        cite({
          id: 'ev-helios-4a',
          documentId: 'doc-helios-ppa-3',
          documentName: 'PPA_Iberia_SolarCo_v3.pdf',
          locator: 'cláusula 14.2',
          snippet: 'Curtailment events shall be compensated at 90% of the contracted price...',
        }),
      ],
      status: 'approved',
      createdAt: '2026-08-12T15:45:00.000Z',
      history: [
        { id: 'h-helios-4-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-12T15:45:00.000Z' },
        {
          id: 'h-helios-4-2',
          action: 'approved',
          actor: 'Elena Vidal (Deal Lead)',
          at: '2026-08-13T08:12:00.000Z',
          note: 'Matches what we saw on the last two portfolios — approve.',
        },
      ],
    },
    {
      id: 'mem-helios-5',
      operationId: 'helios',
      title: 'Lower the land-lease red-flag threshold',
      category: 'Skill refinement',
      before:
        'Flag any lease with less remaining term than the asset\'s remaining useful life as a key ' +
        'issue, not just a note.',
      after:
        'Flag any lease with less than 1.5x the asset\'s remaining useful life as a key issue — a ' +
        'lease that merely matches useful life leaves no room for a renewal negotiation to fail, ' +
        'so the safety margin should be caught earlier.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Aug 8, 11:20',
      rationale:
        'Deal team feedback on 2 draft Key Issue rows: a lease exactly matching useful life was ' +
        'still treated as an issue in practice because renewal negotiations aren\'t guaranteed to ' +
        'succeed — the threshold undercounted real risk.',
      evidence: [
        cite({
          id: 'ev-helios-5a',
          documentId: 'doc-helios-land-2',
          documentName: 'Land_Lease_AssetC.pdf',
          locator: 'cláusula 4.3',
          snippet: 'Term: 22 years from commissioning, renewable subject to landowner agreement...',
        }),
      ],
      status: 'approved',
      createdAt: '2026-08-08T11:25:00.000Z',
      history: [
        { id: 'h-helios-5-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-08T11:25:00.000Z' },
        {
          id: 'h-helios-5-2',
          action: 'approved',
          actor: 'Marcos Duarte (Analyst)',
          at: '2026-08-09T09:00:00.000Z',
          note: 'Agreed, the old threshold was too tight against renewal risk.',
        },
      ],
    },
    {
      id: 'mem-helios-6',
      operationId: 'helios',
      title: 'Assume every asset in the portfolio shares the same DSO',
      category: 'Risk heuristic',
      before: '',
      after:
        'Once one asset\'s DSO/TSO is confirmed, assume the rest of the portfolio connects to the ' +
        'same distribution operator and skip per-asset verification.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Aug 5, 14:02',
      rationale:
        'Verifying the DSO per asset took extra review turns on a 12-asset batch where the first ' +
        'three all shared the same DSO — proposed generalizing to save the extra checks.',
      evidence: [
        cite({
          id: 'ev-helios-6a',
          documentId: 'doc-helios-grid-4',
          documentName: 'Grid_Connection_Permit_AssetA.pdf',
          locator: 'p. 1',
          snippet: 'Distribution System Operator: i-DE Redes Eléctricas Inteligentes...',
        }),
      ],
      status: 'rejected',
      createdAt: '2026-08-05T14:10:00.000Z',
      history: [
        { id: 'h-helios-6-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-05T14:10:00.000Z' },
        {
          id: 'h-helios-6-2',
          action: 'rejected',
          actor: 'Elena Vidal (Deal Lead)',
          at: '2026-08-06T10:30:00.000Z',
          note: 'Too broad — DSOs differ by region even within the same portfolio. Keep per-asset verification.',
        },
      ],
    },
    {
      id: 'mem-helios-7',
      operationId: 'helios',
      title: 'Treat any EIA older than 3 years as expired',
      category: 'Skill refinement',
      before:
        'Environmental impact assessment, its approval resolution, and any conditions attached ' +
        'must all be present and unexpired. An approval with expired conditions is treated as ' +
        'incomplete, not as satisfied.',
      after:
        'Environmental impact assessment, its approval resolution, and any conditions attached ' +
        'must all be present and unexpired. Any EIA older than 3 years is treated as expired by ' +
        'default, regardless of its stated conditions.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Jul 18, 16:00',
      rationale:
        'Fixed age threshold looked like a simpler rule than checking each condition individually.',
      evidence: [
        cite({
          id: 'ev-helios-7a',
          documentId: 'doc-helios-env-5',
          documentName: 'EIA_Resolution_AssetD.pdf',
          locator: 'p. 2',
          snippet: 'Approval valid subject to conditions, extendable upon compliance review...',
        }),
      ],
      status: 'reverted',
      createdAt: '2026-07-18T16:05:00.000Z',
      history: [
        { id: 'h-helios-7-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-07-18T16:05:00.000Z' },
        {
          id: 'h-helios-7-2',
          action: 'approved',
          actor: 'Marcos Duarte (Analyst)',
          at: '2026-07-19T09:15:00.000Z',
          note: 'Simple rule, approve.',
        },
        {
          id: 'h-helios-7-3',
          action: 'reverted',
          actor: 'Elena Vidal (Deal Lead)',
          at: '2026-08-02T11:40:00.000Z',
          note: 'Caused 2 false-positive gaps on assets whose EIA had a valid multi-year extension. Reverting to the per-condition check.',
        },
      ],
    },
    {
      id: 'mem-helios-8',
      operationId: 'helios',
      title: 'Proactively request battery degradation curves from the seller',
      category: 'Negotiation pattern',
      before: '',
      after:
        'When a data room includes a BESS co-location component, request the battery degradation ' +
        'curve proactively — sellers routinely omit it from the first drop, and it is required to ' +
        'validate the revenue stacking assumptions.',
      originAgentId: 'chat',
      originConversation: 'Chat session · Aug 24, 16:20 — "is the degradation curve in the data room?"',
      rationale:
        'Third time this comes up in chat on this operation: the degradation curve is missing ' +
        'from the initial drop and has to be requested manually each time.',
      evidence: [
        cite({
          id: 'ev-helios-8a',
          documentId: 'doc-helios-bess-1',
          documentName: 'BESS_Colocation_Term_Sheet.pdf',
          locator: 'p. 5',
          snippet: 'Battery augmentation schedule: see Annex C (not provided in this data room drop)',
        }),
      ],
      status: 'pending',
      createdAt: '2026-08-24T16:25:00.000Z',
      history: [
        { id: 'h-helios-8-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-24T16:25:00.000Z' },
      ],
    },
  ],

  meridian: [
    {
      id: 'mem-meridian-1',
      operationId: 'meridian',
      title: 'Flag O&M availability guarantees below 95% by default',
      category: 'Risk heuristic',
      before: '',
      after:
        'Any O&M availability guarantee below 95% should be raised as a Key Issue automatically, ' +
        'not left to reviewer judgement — every guarantee below that line so far has needed a ' +
        'mitigation plan attached.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Aug 21, 10:15',
      rationale:
        'All 3 O&M contracts reviewed with a guarantee below 95% ended up as Key Issue rows; the ' +
        'skill already checks the threshold but does not auto-flag, which cost an extra review turn.',
      evidence: [
        cite({
          id: 'ev-meridian-1a',
          documentId: 'doc-meridian-om-2',
          documentName: 'OM_Agreement_WindCo.pdf',
          locator: 'cláusula 7.1',
          snippet: 'Guaranteed annual availability: 93%, subject to force majeure exclusions...',
        }),
      ],
      status: 'pending',
      createdAt: '2026-08-21T10:20:00.000Z',
      history: [
        { id: 'h-meridian-1-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-21T10:20:00.000Z' },
      ],
    },
    {
      id: 'mem-meridian-2',
      operationId: 'meridian',
      title: 'Cross-check turbine warranty expiry against the O&M contract term',
      category: 'Skill refinement',
      before:
        'Cross-reference commissioning date and warranty term per asset against today\'s date. ' +
        'Any asset past warranty expiry without a corresponding extended-warranty or full-service ' +
        'contract is a gap, not just an observation.',
      after:
        'Cross-reference commissioning date and warranty term per asset against today\'s date, AND ' +
        'against the O&M contract term — an asset covered by a full-service O&M contract that ' +
        'overlaps the warranty gap is not a gap, since the O&M contract absorbs the risk.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Aug 19, 09:40',
      rationale:
        'The skill flagged 2 turbines as warranty gaps that were already covered by the full-service ' +
        'O&M contract — the check needed to look at the O&M term, not just the warranty term alone.',
      evidence: [
        cite({
          id: 'ev-meridian-2a',
          documentId: 'doc-meridian-om-2',
          documentName: 'OM_Agreement_WindCo.pdf',
          locator: 'cláusula 2.4',
          snippet: 'Full-service coverage includes major component replacement through year 15...',
        }),
      ],
      status: 'approved',
      createdAt: '2026-08-19T09:45:00.000Z',
      history: [
        { id: 'h-meridian-2-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-19T09:45:00.000Z' },
        {
          id: 'h-meridian-2-2',
          action: 'approved',
          actor: 'Sofía Reyes (Analyst)',
          at: '2026-08-19T14:30:00.000Z',
          note: 'Correct catch, the O&M contract already covers those two turbines.',
        },
      ],
    },
    {
      id: 'mem-meridian-3',
      operationId: 'meridian',
      title: 'Skip version checks on documents from the same upload batch',
      category: 'Risk heuristic',
      before: '',
      after:
        'Documents uploaded in the same batch can be assumed to be the same version and skip the ' +
        'contradiction check against each other.',
      originAgentId: 'chat',
      originConversation: 'Chat session · Aug 14, 11:05',
      rationale: 'Would reduce the number of version-contradiction checks run per upload batch.',
      evidence: [
        cite({
          id: 'ev-meridian-3a',
          documentId: 'doc-meridian-om-2',
          documentName: 'OM_Agreement_WindCo.pdf',
          locator: 'metadata',
          snippet: 'Uploaded 2026-08-14, batch #14',
        }),
      ],
      status: 'rejected',
      createdAt: '2026-08-14T11:10:00.000Z',
      history: [
        { id: 'h-meridian-3-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-08-14T11:10:00.000Z' },
        {
          id: 'h-meridian-3-2',
          action: 'rejected',
          actor: 'Sofía Reyes (Analyst)',
          at: '2026-08-14T16:00:00.000Z',
          note: 'Same-batch uploads have contradicted each other before (draft + final in one drop). Keep checking every pair.',
        },
      ],
    },
  ],

  solstice: [
    {
      id: 'mem-solstice-1',
      operationId: 'solstice',
      title: 'Require an interconnection queue position before valuing a pipeline asset',
      category: 'Skill refinement',
      before:
        'Confirm each pipeline project has an interconnection queue position, site control, and a ' +
        'development-stage milestone before it is counted in the valuation.',
      after:
        'Confirm each pipeline project has an interconnection queue position, site control, and a ' +
        'development-stage milestone before it is counted in the valuation. A queue position ' +
        'pending re-study after a grid topology change does not count as confirmed.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Jun 22, 09:10',
      rationale:
        'One pipeline project had a queue position that had been sent back for re-study after a ' +
        'grid topology change — the original skill would have counted it as confirmed.',
      evidence: [
        cite({
          id: 'ev-solstice-1a',
          documentId: 'doc-solstice-pipe-3',
          documentName: 'Interconnection_Queue_Status.pdf',
          locator: 'p. 1',
          snippet: 'Queue position #142 — status: re-study required following topology change',
        }),
      ],
      status: 'approved',
      createdAt: '2026-06-22T09:15:00.000Z',
      history: [
        { id: 'h-solstice-1-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-06-22T09:15:00.000Z' },
        {
          id: 'h-solstice-1-2',
          action: 'approved',
          actor: 'Elena Vidal (Deal Lead)',
          at: '2026-06-23T10:00:00.000Z',
        },
      ],
    },
    {
      id: 'mem-solstice-2',
      operationId: 'solstice',
      title: 'BESS pipeline site control should distinguish option from purchase',
      category: 'Skill refinement',
      before: 'Confirm each pipeline project has ... site control ...',
      after:
        'Confirm each pipeline project has ... site control — and record whether it is an option ' +
        'to lease/purchase or a signed agreement, since an unexercised option carries materially ' +
        'more risk than a signed lease.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Jun 15, 13:20',
      rationale: 'Two pipeline projects had only an unexercised land option, not a signed lease.',
      evidence: [
        cite({
          id: 'ev-solstice-2a',
          documentId: 'doc-solstice-land-1',
          documentName: 'Site_Option_Agreement_ProjectX.pdf',
          locator: 'cláusula 2',
          snippet: 'Option to lease, exercisable within 18 months of signing...',
        }),
      ],
      status: 'approved',
      createdAt: '2026-06-15T13:25:00.000Z',
      history: [
        { id: 'h-solstice-2-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-06-15T13:25:00.000Z' },
        {
          id: 'h-solstice-2-2',
          action: 'approved',
          actor: 'Marcos Duarte (Analyst)',
          at: '2026-06-16T09:00:00.000Z',
        },
      ],
    },
    {
      id: 'mem-solstice-3',
      operationId: 'solstice',
      title: 'Count projects with a signed grid study agreement as "in development"',
      category: 'Skill refinement',
      before: '',
      after:
        'A pipeline project with a signed grid study agreement (but no queue position yet) can be ' +
        'counted as "in development" for portfolio maturity reporting, separate from the ' +
        'valuation-eligible set.',
      originAgentId: 'summary-overview',
      originConversation: 'Summary snapshot · Jun 10, 08:30',
      rationale: 'Improves how early-stage pipeline maturity is reported without affecting valuation.',
      evidence: [
        cite({
          id: 'ev-solstice-3a',
          documentId: 'doc-solstice-pipe-1',
          documentName: 'Grid_Study_Agreement_ProjectY.pdf',
          locator: 'p. 1',
        }),
      ],
      status: 'approved',
      createdAt: '2026-06-10T08:35:00.000Z',
      history: [
        { id: 'h-solstice-3-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-06-10T08:35:00.000Z' },
        {
          id: 'h-solstice-3-2',
          action: 'approved',
          actor: 'Elena Vidal (Deal Lead)',
          at: '2026-06-11T09:20:00.000Z',
        },
      ],
    },
    {
      id: 'mem-solstice-4',
      operationId: 'solstice',
      title: 'Treat every early-stage project the same regardless of technology',
      category: 'Risk heuristic',
      before: '',
      after:
        'Apply the same development-stage milestone checklist to every pipeline project ' +
        'regardless of whether it is standalone storage or co-located with generation.',
      originAgentId: 'key-issues',
      originConversation: 'Key Issue List draft · Jun 5, 11:00',
      rationale: 'Would simplify the checklist to a single version.',
      evidence: [
        cite({
          id: 'ev-solstice-4a',
          documentId: 'doc-solstice-pipe-2',
          documentName: 'Pipeline_Summary_Q2.pdf',
          locator: 'p. 4',
        }),
      ],
      status: 'rejected',
      createdAt: '2026-06-05T11:05:00.000Z',
      history: [
        { id: 'h-solstice-4-1', action: 'proposed', actor: 'Saeta Agent', at: '2026-06-05T11:05:00.000Z' },
        {
          id: 'h-solstice-4-2',
          action: 'rejected',
          actor: 'Marcos Duarte (Analyst)',
          at: '2026-06-05T15:40:00.000Z',
          note: 'Co-located storage needs its own interconnection checks — keep the checklists separate.',
        },
      ],
    },
  ],
}

/** Clona hondo el mock por defecto de una operación, lista para vivir en el
 * store y mutarse sin afectar a las demás operaciones (mismo patrón que
 * `cloneDefaultConfigs` de `features/agent-config`). */
export function cloneDefaultProposals(operationId: string): MemoryProposal[] {
  const proposals = DEFAULT_MEMORY_PROPOSALS[operationId] ?? []
  return proposals.map((p) => ({
    ...p,
    evidence: p.evidence.map((e) => ({ ...e })),
    history: p.history.map((h) => ({ ...h })),
  }))
}
