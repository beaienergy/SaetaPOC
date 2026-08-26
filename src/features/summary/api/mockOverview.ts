import type { Citation } from '@/shared/types/domain'
import type { OperationSnapshot } from '../types'

// Ficha de operación generada por el sistema (§5.3.1). Contenido distinto por
// operación: Helios (rica), Meridian (media), Solstice (cerrada, ligera) — ver
// nota de alcance del guion. Cada operación trae al menos un campo con un
// aviso de "estado insuficiente" (§1.7), aunque el campo también tenga un
// valor parcial: no son mutuamente excluyentes (ver `SnapshotField` en
// `../types`).

function cite(documentId: string, documentName: string, locator: string, snippet: string): Citation {
  return { id: `cit-${documentId}-${locator}`.replace(/[^a-z0-9-]+/gi, '-'), documentId, documentName, locator, snippet }
}

export const MOCK_OVERVIEW: Record<string, OperationSnapshot> = {
  helios: {
    generatedAt: '2026-08-24T16:20:00.000Z',
    perimeter: {
      value:
        'Acquisition of 100% of the share capital of Helios Solar Holdco S.L., comprising 480 MWp ' +
        'of operating utility-scale solar PV across 7 sites in Spain and Portugal, plus a 65 MWp ' +
        'late-stage development pipeline.',
      citations: [
        cite(
          'doc-helios-spa-v3',
          'Share Purchase Agreement — draft v3',
          'cl. 2.1 "Scope"',
          '"...the Sale Shares represent 100% of the issued share capital of the Company, which holds, ' +
            'directly or indirectly, the Project Companies listed in Schedule 1..."',
        ),
      ],
    },
    parties: {
      value: [
        'Buyer: BEAI Capital Partners (financial sponsor)',
        'Seller: Helios Energy Holdings S.L.',
        'Target: Helios Solar Holdco S.L. and 7 project subsidiaries',
      ],
      citations: [
        cite('doc-helios-spa-v3', 'Share Purchase Agreement — draft v3', 'p. 2, "Parties"', ''),
      ],
    },
    milestones: {
      value: [
        { id: 'ms-helios-1', label: 'NDA executed', date: '2026-03-10', status: 'done' },
        { id: 'ms-helios-2', label: 'Teaser & IM reviewed', date: '2026-03-24', status: 'done' },
        { id: 'ms-helios-3', label: 'Management presentations', date: '2026-04-15', status: 'done' },
        { id: 'ms-helios-4', label: 'Data room opened', date: '2026-04-22', status: 'done' },
        { id: 'ms-helios-5', label: 'DD workstreams kickoff', date: '2026-05-05', status: 'done' },
        { id: 'ms-helios-6', label: 'SPA draft v1 circulated', date: '2026-06-18', status: 'done' },
        {
          id: 'ms-helios-7',
          label: 'Exclusivity extended to 30 Sep 2026',
          date: '2026-08-12',
          status: 'at-risk',
        },
      ],
      citations: [
        cite(
          'doc-helios-exclusivity-ext',
          'Exclusivity extension letter',
          'p. 1',
          '"...the exclusivity period under clause 3 is hereby extended to 30 September 2026..."',
        ),
      ],
      insufficient: {
        reason:
          'The post-signing timeline (long-stop date, conditions precedent schedule) is not yet ' +
          'available — the long-form SPA has not been finalized.',
        suggestedAction: 'request_documents',
      },
    },
    status: {
      value:
        'Due diligence in progress — exclusivity extended to 30 Sep 2026 pending resolution of the ' +
        'grid connection permitting and land tenure findings raised in the Key Issue List.',
      citations: [
        cite('doc-helios-exclusivity-ext', 'Exclusivity extension letter', 'p. 1', ''),
      ],
    },
    keyIssuesHighlight: {
      value: [
        'Grid connection permitting delays at 2 of 7 sites',
        'Land lease term shorter than asset remaining useful life at Site C',
        'PPA price mismatch vs. financial model at Site A',
      ],
      citations: [
        cite('doc-helios-kil-memo', 'Key Issue List — summary memo', 'p. 1', ''),
      ],
    },
  },

  meridian: {
    generatedAt: '2026-08-21T09:05:00.000Z',
    perimeter: {
      value:
        'Acquisition of a 100% interest in Meridian Wind Platform B.V. and its 6 operating onshore ' +
        'wind assets (215 MW aggregate capacity) in Spain and Italy.',
      citations: [
        cite(
          'doc-meridian-spa-v1',
          'Share Purchase Agreement — draft v1',
          'cl. 1.2 "Perimeter"',
          '"...the Assets comprise the six (6) operating wind farms identified in Schedule 1, totalling ' +
            'approximately 215 MW..."',
        ),
      ],
    },
    parties: {
      value: [
        'Buyer: BEAI Capital Partners (financial sponsor)',
        'Seller: Meridian Wind Holdings B.V.',
      ],
      citations: [
        cite('doc-meridian-spa-v1', 'Share Purchase Agreement — draft v1', 'p. 1, "Parties"', ''),
      ],
      insufficient: {
        reason:
          'Full breakdown of target subsidiaries per operating asset is not confirmed — awaiting the ' +
          'updated corporate structure chart from the seller.',
        suggestedAction: 'request_documents',
      },
    },
    milestones: {
      value: [
        { id: 'ms-meridian-1', label: 'NDA executed', date: '2026-04-02', status: 'done' },
        { id: 'ms-meridian-2', label: 'Teaser reviewed', date: '2026-04-20', status: 'done' },
        { id: 'ms-meridian-3', label: 'Data room opened', date: '2026-05-10', status: 'done' },
        { id: 'ms-meridian-4', label: 'DD workstreams kickoff', date: '2026-05-22', status: 'done' },
        { id: 'ms-meridian-5', label: 'Management call', date: '2026-06-30', status: 'done' },
        {
          id: 'ms-meridian-6',
          label: 'SPA draft v1 circulated',
          date: '2026-08-05',
          status: 'at-risk',
        },
      ],
      citations: [
        cite('doc-meridian-spa-v1', 'Share Purchase Agreement — draft v1', 'cover memo', ''),
      ],
    },
    status: {
      value:
        'Due diligence in progress — SPA draft v1 circulated to seller\'s counsel; awaiting response ' +
        'on the O&M availability guarantee and turbine warranty gaps before moving toward signing.',
      citations: [
        cite('doc-meridian-spa-v1', 'Share Purchase Agreement — draft v1', 'cover memo', ''),
      ],
    },
    keyIssuesHighlight: {
      value: [
        'Turbine warranty expired on 2 of 6 assets without extended coverage',
        'O&M availability guarantee below the 95% threshold',
      ],
      citations: [
        cite('doc-meridian-kil-memo', 'Key Issue List — summary memo', 'p. 1', ''),
      ],
    },
  },

  solstice: {
    generatedAt: '2026-06-30T11:40:00.000Z',
    perimeter: {
      value:
        'Acquisition of 100% of Solstice Storage Developer Ltd., an early-stage battery storage ' +
        '(BESS) pipeline of 9 projects (1.2 GWh aggregate, pre-construction) in the UK and Ireland.',
      citations: [
        cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'Schedule 1', ''),
      ],
    },
    parties: {
      value: [
        'Buyer: BEAI Capital Partners (financial sponsor)',
        'Seller: Solstice Storage Founders LLP',
        'Target: Solstice Storage Developer Ltd. and 9 pipeline SPVs',
      ],
      citations: [
        cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'p. 1, "Parties"', ''),
      ],
      insufficient: {
        reason:
          'Ultimate beneficial ownership of two minority co-investors in the pipeline SPVs was never ' +
          'fully confirmed prior to closing — flagged for post-closing follow-up.',
        suggestedAction: 'request_human',
      },
    },
    milestones: {
      value: [
        { id: 'ms-solstice-1', label: 'NDA executed', date: '2026-01-15', status: 'done' },
        { id: 'ms-solstice-2', label: 'Due diligence completed', date: '2026-04-10', status: 'done' },
        { id: 'ms-solstice-3', label: 'SPA signed', date: '2026-05-20', status: 'done' },
        { id: 'ms-solstice-4', label: 'Closing', date: '2026-06-30', status: 'done' },
      ],
      citations: [
        cite('doc-solstice-closing-cert', 'Closing certificate', 'p. 1', ''),
      ],
    },
    status: {
      value: 'Closed — transaction completed on 30 Jun 2026. Retained for reference; no further diligence activity.',
      citations: [cite('doc-solstice-closing-cert', 'Closing certificate', 'p. 1', '')],
    },
    keyIssuesHighlight: {
      value: [],
      citations: [],
      insufficient: {
        reason:
          'No open key issues remained at closing, but the final resolution notes for the 2 items ' +
          'flagged during diligence were never countersigned by the seller\'s counsel.',
        suggestedAction: 'request_human',
      },
    },
  },
}
