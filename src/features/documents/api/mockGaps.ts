import type { GapIssue } from '../types'

/**
 * Gaps y contradicciones mock por operación (guion §5.2.1, UC-05): 5-6
 * incidencias de ejemplo por operación, de los tres tipos del guion
 * (documentación pendiente, versiones incompatibles, incoherencias entre
 * informes). `affectedDocuments[].documentId` referencia un id real de
 * `mockDocuments.ts` cuando el documento existe — si no, queda sin id porque
 * es precisamente lo que falta.
 *
 * Coherencia con `mockOperations.ts`: Helios (activa, `openIssueCount: 7`) es
 * la más cargada de incidencias abiertas; Meridian (`openIssueCount: 4`)
 * intermedia; Solstice está `closed` con `openIssueCount: 0`, así que su
 * lista es toda resuelta/descartada — ninguna abierta.
 */
export const MOCK_GAPS: Record<string, GapIssue[]> = {
  helios: [
    {
      id: 'gap-helios-1',
      type: 'missing_documentation',
      title: 'Curtailment compensation schedule not on file for Site Gamma',
      description:
        'The grid curtailment addendum references a compensation schedule for Site Gamma that has ' +
        'not been provided separately. Without it, curtailment revenue impact cannot be verified ' +
        'against the financial model.',
      severity: 'high',
      status: 'open',
      detectedAt: '2026-08-21T10:00:00.000Z',
      affectedDocuments: [
        { documentName: 'Curtailment Compensation Schedule — Site Gamma' },
        { documentId: 'doc-helios-10', documentName: 'Grid Curtailment Terms Addendum.pdf' },
      ],
    },
    {
      id: 'gap-helios-2',
      type: 'incompatible_versions',
      title: 'Financial model still references PPA v1.0 pricing',
      description:
        'The financial model base case was last updated before the PPA price amendment: it uses ' +
        'v1.0 offtake pricing while the executed contract is now v2.0. Revenue assumptions should ' +
        'be reconciled to the current PPA before the model is relied on.',
      severity: 'critical',
      status: 'open',
      detectedAt: '2026-08-20T18:30:00.000Z',
      affectedDocuments: [
        { documentId: 'doc-helios-5', documentName: 'Financial Model — Helios Base Case v3.xlsx' },
        { documentId: 'doc-helios-3', documentName: 'PPA — Helios Portfolio Offtake Agreement.pdf' },
      ],
    },
    {
      id: 'gap-helios-3',
      type: 'inconsistency',
      title: 'Lease term for Site Alpha reported inconsistently',
      description:
        'The legal summary circulated to the deal team states a 25-year lease term for Site Alpha, ' +
        'while the executed lease agreement specifies 28 years plus two 10-year renewal options. ' +
        'The agreement is the authoritative source; the summary should be corrected.',
      severity: 'medium',
      status: 'open',
      detectedAt: '2026-08-15T09:20:00.000Z',
      affectedDocuments: [
        { documentId: 'doc-helios-2', documentName: 'Land Lease Agreement — Site Alpha.pdf' },
      ],
    },
    {
      id: 'gap-helios-4',
      type: 'missing_documentation',
      title: 'No litigation search on file for Site Alpha',
      description:
        'A litigation search was provided for Site Delta but not for Site Alpha, which carries the ' +
        'largest lease exposure in the portfolio. Land-rights due diligence is incomplete without ' +
        'it.',
      severity: 'medium',
      status: 'open',
      detectedAt: '2026-08-19T08:10:00.000Z',
      affectedDocuments: [
        { documentName: 'Litigation Search Report — Site Alpha' },
        { documentId: 'doc-helios-11', documentName: 'Litigation Search Report — Site Delta.pdf' },
      ],
    },
    {
      id: 'gap-helios-5',
      type: 'incompatible_versions',
      title: 'EPC contract references a superseded EIA revision',
      description:
        'The Site Gamma EPC contract conditions precedent cite the environmental impact assessment ' +
        'by an earlier revision number than the one on file, which was reissued with additional ' +
        'raptor-monitoring conditions. Confirm the EPC contractor is working from the current EIA.',
      severity: 'high',
      status: 'open',
      detectedAt: '2026-08-11T15:40:00.000Z',
      affectedDocuments: [
        { documentId: 'doc-helios-9', documentName: 'EPC Contract — Site Gamma Construction.pdf' },
        { documentId: 'doc-helios-4', documentName: 'Environmental Impact Assessment — Site Beta.pdf' },
      ],
    },
    {
      id: 'gap-helios-6',
      type: 'inconsistency',
      title: 'O&M headcount figure did not match the employment agreements',
      description:
        'An earlier HR summary understated the O&M staff headcount by 3 roles compared to the ' +
        'signed employment agreements.',
      severity: 'low',
      status: 'resolved',
      detectedAt: '2026-08-05T09:00:00.000Z',
      resolutionNote:
        'Resolved 2026-08-22 by Marta Solano — confirmed against the updated headcount roster; the ' +
        'earlier summary was a stale draft.',
      affectedDocuments: [
        { documentId: 'doc-helios-7', documentName: 'Employment Agreements Summary — O&M Staff.pdf' },
      ],
    },
  ],

  meridian: [
    {
      id: 'gap-meridian-1',
      type: 'missing_documentation',
      title: 'No extended warranty on file for Asset Cluster South',
      description:
        'Commissioning dates show the standard turbine warranty for the southern cluster expired ' +
        'in 2025. No extended-warranty or full-service contract has been provided to cover the ' +
        'gap.',
      severity: 'high',
      status: 'open',
      detectedAt: '2026-08-16T10:00:00.000Z',
      affectedDocuments: [
        { documentName: 'Extended Warranty Agreement — Asset Cluster South' },
        { documentId: 'doc-meridian-7', documentName: 'Turbine Supply Warranty Certificates.pdf' },
      ],
    },
    {
      id: 'gap-meridian-2',
      type: 'incompatible_versions',
      title: 'Financial model uses draft O&M availability terms',
      description:
        'The financial model\'s O&M cost and availability assumptions match the v1.0 draft ' +
        'agreement, not the executed v2.0 with the revised 95% availability guarantee. Downside ' +
        'case may be understating O&M risk.',
      severity: 'high',
      status: 'open',
      detectedAt: '2026-08-18T13:15:00.000Z',
      affectedDocuments: [
        { documentId: 'doc-meridian-5', documentName: 'Financial Model — Meridian Wind v2.xlsx' },
        { documentId: 'doc-meridian-1', documentName: 'O&M Agreement — Turbine Fleet.pdf' },
      ],
    },
    {
      id: 'gap-meridian-3',
      type: 'inconsistency',
      title: 'Capacity factor assumption diverges from the resource assessment',
      description:
        'The financial model assumes a 37.5% net capacity factor; the independent wind resource ' +
        'assessment supports 34.2% P50. A 3-point gap at this stage materially affects revenue ' +
        'projections.',
      severity: 'medium',
      status: 'open',
      detectedAt: '2026-08-14T09:45:00.000Z',
      affectedDocuments: [
        { documentId: 'doc-meridian-2', documentName: 'Wind Resource Assessment Report.pdf' },
        { documentId: 'doc-meridian-5', documentName: 'Financial Model — Meridian Wind v2.xlsx' },
      ],
    },
    {
      id: 'gap-meridian-4',
      type: 'missing_documentation',
      title: 'Environmental permit not on file for Asset Cluster South',
      description:
        'Only the northern asset cluster environmental permit has been provided. The southern ' +
        'cluster (3 turbines) has no corresponding permit on file.',
      severity: 'medium',
      status: 'open',
      detectedAt: '2026-08-09T11:30:00.000Z',
      affectedDocuments: [
        { documentName: 'Environmental Permit — Asset Cluster South' },
        { documentId: 'doc-meridian-6', documentName: 'Environmental Permit — Asset Cluster North.pdf' },
      ],
    },
    {
      id: 'gap-meridian-5',
      type: 'inconsistency',
      title: 'Corporate structure chart named a different PPA counterparty entity',
      description:
        'An earlier version of the corporate structure chart listed a parent entity that does not ' +
        'match the contracting entity named in the PPA.',
      severity: 'low',
      status: 'resolved',
      detectedAt: '2026-07-30T09:00:00.000Z',
      resolutionNote:
        'Resolved 2026-08-02 — confirmed as a post-signing internal reorganization; PPA assignment ' +
        'consent from the offtaker is on file.',
      affectedDocuments: [
        { documentId: 'doc-meridian-8', documentName: 'Corporate Structure Chart.pdf' },
        { documentId: 'doc-meridian-3', documentName: 'PPA — Meridian Wind Offtake Agreement.pdf' },
      ],
    },
    {
      id: 'gap-meridian-6',
      type: 'incompatible_versions',
      title: 'Warranty certificate lists an outdated turbine serial number set',
      description:
        'The turbine warranty certificate on file references a serial number list that predates a ' +
        'component swap on two units.',
      severity: 'low',
      status: 'dismissed',
      detectedAt: '2026-07-20T09:00:00.000Z',
      resolutionNote:
        'Dismissed 2026-07-25 — buyer confirmed current serials directly with the OEM; immaterial ' +
        'to valuation.',
      affectedDocuments: [
        { documentId: 'doc-meridian-7', documentName: 'Turbine Supply Warranty Certificates.pdf' },
      ],
    },
  ],

  solstice: [
    {
      id: 'gap-solstice-1',
      type: 'missing_documentation',
      title: 'Permitting sign-off was missing for two pipeline sites',
      description:
        'Two of the five pipeline sites lacked a final permitting sign-off when due diligence ' +
        'started, leaving their development-stage classification unconfirmed.',
      severity: 'medium',
      status: 'resolved',
      detectedAt: '2026-06-15T09:00:00.000Z',
      resolutionNote:
        'Resolved 2026-06-25 — updated permitting tracker (v2.0) with sign-offs for both sites ' +
        'received ahead of close.',
      affectedDocuments: [
        { documentId: 'doc-solstice-5', documentName: 'Permitting Status Tracker.pdf' },
      ],
    },
    {
      id: 'gap-solstice-2',
      type: 'incompatible_versions',
      title: 'Development budget referenced an earlier milestone schedule',
      description:
        'The first development budget version used milestone dates that predated the latest ' +
        'interconnection queue confirmations, understating time-to-notice-to-proceed for two sites.',
      severity: 'low',
      status: 'resolved',
      detectedAt: '2026-06-08T09:00:00.000Z',
      resolutionNote:
        'Resolved 2026-06-18 — superseded budget (v1.4) aligned to the confirmed queue positions ' +
        'before close.',
      affectedDocuments: [
        { documentId: 'doc-solstice-3', documentName: 'Development Budget & Milestones.xlsx' },
        { documentId: 'doc-solstice-1', documentName: 'Interconnection Queue Position Letters.pdf' },
      ],
    },
    {
      id: 'gap-solstice-3',
      type: 'inconsistency',
      title: 'Site acreage differs between site control and budget documents',
      description:
        'The site control agreement lists 38 hectares for one pipeline site; the development ' +
        'budget assumes 42 hectares for the same site.',
      severity: 'medium',
      status: 'dismissed',
      detectedAt: '2026-06-12T09:00:00.000Z',
      resolutionNote:
        'Dismissed 2026-06-20 — deemed immaterial to the early-stage valuation; flagged for the ' +
        'next development stage instead.',
      affectedDocuments: [
        { documentId: 'doc-solstice-2', documentName: 'Site Control Agreements — Pipeline Sites.pdf' },
        { documentId: 'doc-solstice-3', documentName: 'Development Budget & Milestones.xlsx' },
      ],
    },
    {
      id: 'gap-solstice-4',
      type: 'missing_documentation',
      title: 'No designated site safety officer listed',
      description:
        'The HR organization chart for the retained development team does not name a designated ' +
        'site safety officer for the pipeline sites.',
      severity: 'low',
      status: 'dismissed',
      detectedAt: '2026-05-10T09:00:00.000Z',
      resolutionNote:
        'Dismissed 2026-05-14 — not a closing condition for an early-stage pipeline acquisition.',
      affectedDocuments: [{ documentName: 'Site Safety Officer Designation' }],
    },
    {
      id: 'gap-solstice-5',
      type: 'inconsistency',
      title: 'Tax memo and budget disagreed on the holding entity for two sites',
      description:
        'The tax structure memo attributed two pipeline sites to a different SPV than the one used ' +
        'in the development budget cost allocation.',
      severity: 'medium',
      status: 'resolved',
      detectedAt: '2026-05-25T09:00:00.000Z',
      resolutionNote:
        'Resolved 2026-06-01 — holding structure confirmed with seller\'s counsel prior to close.',
      affectedDocuments: [
        { documentId: 'doc-solstice-4', documentName: 'Corporate Tax Structure Memo.pdf' },
        { documentId: 'doc-solstice-3', documentName: 'Development Budget & Milestones.xlsx' },
      ],
    },
  ],
}

export function getGaps(opId: string): GapIssue[] {
  return MOCK_GAPS[opId] ?? []
}
