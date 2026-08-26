import type { Citation } from '@/shared/types/domain'
import type { FactsBoard } from '../types'

// Hechos vs conclusiones (§5.3.3, UC-04): tres bloques con distinto grado de
// certeza. `facts` está siempre documentado y citado; `inferences` es
// razonamiento del agente sobre hechos ya establecidos (marcado como tal, con
// `note` explicando la base); `hypotheses` son ideas sin confirmar, con `note`
// explicando qué las confirmaría.

function cite(documentId: string, documentName: string, locator: string, snippet = ''): Citation {
  return {
    id: `cit-${documentId}-${locator}`.replace(/[^a-z0-9-]+/gi, '-'),
    documentId,
    documentName,
    locator,
    snippet,
  }
}

export const MOCK_FACTS: Record<string, FactsBoard> = {
  helios: {
    facts: [
      {
        id: 'fact-helios-1',
        kind: 'fact',
        text: 'The portfolio comprises 480 MWp across 7 operating sites, commissioned between 2019 and 2023.',
        citations: [cite('doc-helios-asset-register', 'Asset register', 'p. 1')],
      },
      {
        id: 'fact-helios-2',
        kind: 'fact',
        text: 'All 7 sites hold a signed PPA with an average remaining term of 11 years.',
        citations: [cite('doc-helios-ppa-register', 'PPA register', 'summary table')],
      },
      {
        id: 'fact-helios-3',
        kind: 'fact',
        text: "The seller's group has no outstanding secured debt at the Holdco level.",
        citations: [cite('doc-helios-structure-chart', 'Corporate structure chart', 'v2, debt notes')],
      },
    ],
    inferences: [
      {
        id: 'inf-helios-1',
        kind: 'inference',
        text:
          'The PPA/model price mismatch at Site A is isolated and likely worth under 30bps of portfolio-level ' +
          'IRR — not large enough alone to affect valuation, but worth reflecting in the SPA price adjustment ' +
          'mechanism.',
        citations: [cite('doc-helios-financial-model', 'Financial model v5.xlsx', "'Revenue' tab")],
        note: 'Reasoning: the mismatch only affects 1 of 7 sites and the deviation is below the 5% materiality threshold used elsewhere in the model.',
      },
      {
        id: 'inf-helios-2',
        kind: 'inference',
        text:
          'The grid connection delays at Sites D and F likely share a common regional DSO capacity bottleneck, ' +
          'rather than being site-specific issues.',
        citations: [cite('doc-helios-grid-permits', 'Grid connection permit register', 'Sites D, F')],
        note: 'Reasoning: both delayed sites report to the same DSO substation and cite near-identical capacity-reservation language.',
      },
    ],
    hypotheses: [
      {
        id: 'hyp-helios-1',
        kind: 'hypothesis',
        text: 'The extended exclusivity period may indicate the seller is also managing a competing bidder.',
        citations: [cite('doc-helios-exclusivity-ext', 'Exclusivity extension letter', 'p. 1')],
        note: 'Would be confirmed by seller correspondence referencing another party, none seen to date.',
      },
      {
        id: 'hyp-helios-2',
        kind: 'hypothesis',
        text: 'Land lease renewal at Site C might be achievable at a similar rate to the current lease.',
        citations: [cite('doc-helios-land-leases', 'Land lease agreements — bundle', 'Site C, cl. 4')],
        note: 'Based on comparable market terms nearby — not yet tested directly with the landowner.',
      },
    ],
  },

  meridian: {
    facts: [
      {
        id: 'fact-meridian-1',
        kind: 'fact',
        text: 'The platform comprises 6 operating onshore wind assets totalling 215 MW, commissioned between 2015 and 2021.',
        citations: [cite('doc-meridian-asset-register', 'Asset register', 'p. 1')],
      },
      {
        id: 'fact-meridian-2',
        kind: 'fact',
        text: '5 of 6 assets are covered by a single O&M framework agreement with the original turbine manufacturer.',
        citations: [cite('doc-meridian-om-agreement', 'O&M agreement — turbines', 'cl. 1, "Scope"')],
      },
    ],
    inferences: [
      {
        id: 'inf-meridian-1',
        kind: 'inference',
        text:
          'The two assets with expired turbine warranties are also the oldest in the portfolio (2015 vintage), ' +
          'suggesting warranty exposure will grow as the remaining assets age past their original terms.',
        citations: [cite('doc-meridian-warranty-schedules', 'Warranty schedules', 'Assets 3, 5')],
        note: 'Reasoning: commissioning dates in the asset register correlate directly with warranty expiry dates in the schedules.',
      },
      {
        id: 'inf-meridian-2',
        kind: 'inference',
        text:
          'The regulatory investigation disclosed for Asset 2 appears related to a grid curtailment compensation ' +
          'dispute, based on similarity to a known sector-wide issue.',
        citations: [cite('doc-meridian-disclosure-letter', 'Seller disclosure letter', 'Item 4')],
        note: 'Reasoning: the disclosure references the same regulator and timeframe as a public sector-wide curtailment inquiry, though the seller has not confirmed the link.',
      },
    ],
    hypotheses: [
      {
        id: 'hyp-meridian-1',
        kind: 'hypothesis',
        text: 'The O&M guarantee shortfall may be a negotiating position by the operator ahead of contract renewal.',
        citations: [cite('doc-meridian-om-agreement', 'O&M agreement — turbines', 'cl. 6')],
        note: 'Would be confirmed by seeing the operator\'s renewal proposal, not yet in the data room.',
      },
      {
        id: 'hyp-meridian-2',
        kind: 'hypothesis',
        text: "Asset 6's land lease renewal is expected to close before signing.",
        citations: [cite('doc-meridian-land-leases', 'Land lease agreements', 'Asset 6, cl. 2')],
        note: "Based on the landowner's cooperative stance on 3 prior renewals — not yet formalized in writing.",
      },
    ],
  },

  solstice: {
    facts: [
      {
        id: 'fact-solstice-1',
        kind: 'fact',
        text: 'The pipeline comprised 9 pre-construction BESS projects (1.2 GWh aggregate) in the UK and Ireland at signing.',
        citations: [cite('doc-solstice-pipeline-register', 'Pipeline register', 'p. 1')],
      },
      {
        id: 'fact-solstice-2',
        kind: 'fact',
        text: 'All 9 projects held a confirmed interconnection queue position and site control at closing.',
        citations: [cite('doc-solstice-closing-cert', 'Closing certificate', 'Schedule of conditions satisfied')],
      },
    ],
    inferences: [
      {
        id: 'inf-solstice-1',
        kind: 'inference',
        text:
          "The founders' warranty cap dispute was resolved via escrow rather than a price reduction, suggesting " +
          'both parties assessed the underlying risk as low-probability rather than high-value.',
        citations: [cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'cl. 11')],
        note: 'Reasoning: an escrow holdback is typically used for contingent, lower-likelihood exposures rather than for a known, quantified liability.',
      },
      {
        id: 'inf-solstice-2',
        kind: 'inference',
        text:
          'Given the closed status and the absence of open key issues, the escrow release schedule is the only ' +
          'item likely to require post-closing attention.',
        citations: [cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'cl. 11')],
        note: 'Reasoning: cross-check of the final Key Issue List shows no items left in "open" or "escalated" status at closing.',
      },
    ],
    hypotheses: [
      {
        id: 'hyp-solstice-1',
        kind: 'hypothesis',
        text: "The two minority co-investors' unconfirmed UBO may relate to an informally documented seed round.",
        citations: [cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'p. 1, "Parties"')],
        note: 'Would be confirmed by requesting the original seed-round subscription documents from the founders — recommended as a post-closing follow-up.',
      },
    ],
  },
}
