import type { Citation } from '@/shared/types/domain'
import type { KeyIssue } from '../types'

// Key Issue List (§5.3.2, UC-03). El número de filas "Open" se acerca a
// `openIssueCount` de `features/operations/api/mockOperations.ts` a
// propósito, para que la demo cuente la misma historia en ambas pantallas —
// no es una relación forzada por código, solo contenido coherente.

function cite(documentId: string, documentName: string, locator: string, snippet = ''): Citation {
  return {
    id: `cit-${documentId}-${locator}`.replace(/[^a-z0-9-]+/gi, '-'),
    documentId,
    documentName,
    locator,
    snippet,
  }
}

export const MOCK_KEY_ISSUES: Record<string, KeyIssue[]> = {
  helios: [
    {
      id: 'ki-helios-1',
      risk: 'Grid connection permitting delay at Sites D & F',
      evidence: [
        cite('doc-helios-grid-permits', 'Grid connection permit register', 'Sites D, F'),
      ],
      impact: 'high',
      owner: 'Legal & Regulatory Lead',
      mitigation: 'Seller to expedite DSO capacity reservation renewal; propose a contractual long-stop date.',
      status: 'open',
    },
    {
      id: 'ki-helios-2',
      risk: 'Land lease term shorter than remaining useful life at Site C',
      evidence: [cite('doc-helios-land-leases', 'Land lease agreements — bundle', 'Site C, cl. 4')],
      impact: 'high',
      owner: 'Real Estate Counsel',
      mitigation: 'Negotiate a lease extension option with the landowner ahead of signing.',
      status: 'open',
    },
    {
      id: 'ki-helios-3',
      risk: 'PPA price mismatch vs. financial model at Site A (>2%)',
      evidence: [cite('doc-helios-financial-model', 'Financial model v5.xlsx', "'Revenue' tab, cell C14")],
      impact: 'medium',
      owner: 'Financial Model Lead',
      mitigation: 'Reconcile PPA escalation clause with model assumptions and adjust the base case.',
      status: 'open',
    },
    {
      id: 'ki-helios-4',
      risk: 'Environmental permit conditions expired at Site B',
      evidence: [cite('doc-helios-eia-site-b', 'Environmental Impact Assessment — Site B', 'Approval conditions, p. 9')],
      impact: 'critical',
      owner: 'ESG Advisor',
      mitigation: 'Request an updated compliance report and confirm conditions are still satisfied.',
      status: 'open',
    },
    {
      id: 'ki-helios-5',
      risk: 'Pending litigation search incomplete for 2 sites',
      evidence: [cite('doc-helios-litigation-report', 'Litigation search report', 'Sites E, G')],
      impact: 'medium',
      owner: 'Legal & Regulatory Lead',
      mitigation: 'Commission an updated land registry litigation search for the outstanding sites.',
      status: 'open',
    },
    {
      id: 'ki-helios-6',
      risk: 'Insurance binder does not cover full portfolio replacement value',
      evidence: [cite('doc-helios-insurance-binder', 'Insurance binder 2026', 'Schedule of values')],
      impact: 'medium',
      owner: 'Insurance Advisor',
      mitigation: 'Obtain a revised valuation and updated binder from the broker.',
      status: 'open',
    },
    {
      id: 'ki-helios-7',
      risk: 'Curtailment terms undocumented for 3 sites',
      evidence: [cite('doc-helios-grid-permits', 'Grid connection permit register', 'Sites C, E, G')],
      impact: 'low',
      owner: 'Technical Advisor',
      mitigation: 'Request curtailment clauses from the underlying DSO/TSO access agreements.',
      status: 'open',
    },
    {
      id: 'ki-helios-8',
      risk: 'Corporate structure chart discrepancy vs. SPA schedule',
      evidence: [cite('doc-helios-structure-chart', 'Corporate structure chart', 'v2 vs. Schedule 1')],
      impact: 'medium',
      owner: 'Corporate Counsel',
      mitigation: 'Updated structure chart received and reconciled with the SPA schedule on 12 Aug 2026.',
      status: 'mitigated',
    },
    {
      id: 'ki-helios-9',
      risk: 'Change-of-control consent required from 2 project-finance lenders',
      evidence: [cite('doc-helios-facility-agreements', 'Project finance facility agreements', 'cl. 19, "Change of control"')],
      impact: 'critical',
      owner: 'Deal Lead',
      mitigation: "Escalated to the buyer's investment committee — the consent process may affect the signing timeline.",
      status: 'escalated',
    },
  ],

  meridian: [
    {
      id: 'ki-meridian-1',
      risk: 'O&M availability guarantee below the 95% threshold',
      evidence: [cite('doc-meridian-om-agreement', 'O&M agreement — turbines', 'cl. 6, "Availability guarantee"')],
      impact: 'high',
      owner: 'Technical Advisor',
      mitigation: 'Negotiate a guarantee step-up or a price adjustment with the O&M provider.',
      status: 'open',
    },
    {
      id: 'ki-meridian-2',
      risk: 'Turbine warranty expired on 2 of 6 assets without extended coverage',
      evidence: [cite('doc-meridian-warranty-schedules', 'Warranty schedules', 'Assets 3, 5')],
      impact: 'high',
      owner: 'Technical Advisor',
      mitigation: 'Obtain an extended-warranty quote or full-service contract before signing.',
      status: 'open',
    },
    {
      id: 'ki-meridian-3',
      risk: 'Version contradiction between environmental permit and compliance report for Asset 4',
      evidence: [cite('doc-meridian-env-permits', 'Environmental permits bundle', 'Asset 4')],
      impact: 'medium',
      owner: 'ESG Advisor',
      mitigation: 'Request clarification and the latest permit version from the seller.',
      status: 'open',
    },
    {
      id: 'ki-meridian-4',
      risk: 'Land lease renewal pending for Asset 6',
      evidence: [cite('doc-meridian-land-leases', 'Land lease agreements', 'Asset 6, cl. 2')],
      impact: 'medium',
      owner: 'Real Estate Counsel',
      mitigation: 'Confirm renewal terms with the landowner ahead of signing.',
      status: 'open',
    },
    {
      id: 'ki-meridian-5',
      risk: 'Financial model formula error in the revenue tab (overstated escalation)',
      evidence: [cite('doc-meridian-financial-model', 'Financial model v3.xlsx', "'Revenue' tab, cell F22")],
      impact: 'medium',
      owner: 'Financial Model Lead',
      mitigation: 'Corrected in v3 of the financial model; reviewed 18 Aug 2026.',
      status: 'mitigated',
    },
    {
      id: 'ki-meridian-6',
      risk: 'Seller disclosed a pending regulatory investigation at Asset 2',
      evidence: [cite('doc-meridian-disclosure-letter', 'Seller disclosure letter', 'Item 4')],
      impact: 'critical',
      owner: 'Deal Lead',
      mitigation: "Escalated to the buyer's investment committee for a go/no-go decision.",
      status: 'escalated',
    },
  ],

  solstice: [
    {
      id: 'ki-solstice-1',
      risk: 'Interconnection queue position unconfirmed for 2 pipeline projects',
      evidence: [cite('doc-solstice-queue-letters', 'Interconnection queue letters', 'Projects 4, 7')],
      impact: 'medium',
      owner: 'Technical Advisor',
      mitigation: 'Queue position confirmed by grid operator letter; closed 15 Jun 2026.',
      status: 'mitigated',
    },
    {
      id: 'ki-solstice-2',
      risk: 'Site control lapsed on 1 pipeline project',
      evidence: [cite('doc-solstice-pipeline-register', 'Pipeline register', 'Project 2, site control status')],
      impact: 'high',
      owner: 'Real Estate Counsel',
      mitigation: 'Renewed option agreement executed prior to closing, 22 Jun 2026.',
      status: 'mitigated',
    },
    {
      id: 'ki-solstice-3',
      risk: "Founders' warranty cap disputed during negotiation",
      evidence: [cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'cl. 11, "Warranty cap"')],
      impact: 'medium',
      owner: 'Deal Lead',
      mitigation: 'Resolved via an escrow holdback mechanism agreed in the final SPA, 20 May 2026.',
      status: 'mitigated',
    },
  ],
}
