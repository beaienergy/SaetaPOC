import type { KbDocument } from '../types'

/**
 * Dataroom mock por operación (guion §5.2, R-05): las tres carpetas de
 * ejemplo con contenido distinto entre sí, coherente con el "target" de cada
 * operación en `features/operations/api/mockOperations.ts` — Helios (PV,
 * Iberia) es la más rica, Meridian (eólica) intermedia, Solstice (BESS en
 * pipeline, cerrada) la más ligera. Nunca se procesó un fichero real: solo
 * metadatos y un `previewText` de mentira por documento.
 */
export const MOCK_DOCUMENTS: Record<string, KbDocument[]> = {
  helios: [
    {
      id: 'doc-helios-1',
      name: 'Grid Connection Permit — Solar Park II.pdf',
      category: 'technical',
      version: 'v2.1',
      uploadedAt: '2026-08-12T09:14:00.000Z',
      uploadedBy: 'Marta Solano',
      status: 'indexed',
      sizeBytes: 2_430_000,
      previewText:
        'Grid connection permit issued by the regional TSO for Solar Park II (140 MWp). Confirms ' +
        'capacity reservation of 132 MW, connection point at the Alcázar substation, and ' +
        'curtailment terms referenced in a separate addendum. Valid through Q4 2031, subject to ' +
        'commissioning milestones in Annex III.',
      versions: [
        { version: 'v2.1', uploadedAt: '2026-08-12T09:14:00.000Z', uploadedBy: 'Marta Solano' },
        {
          version: 'v2.0',
          uploadedAt: '2026-05-03T11:02:00.000Z',
          uploadedBy: 'Marta Solano',
          note: 'Updated after TSO capacity re-reservation.',
        },
        { version: 'v1.0', uploadedAt: '2025-11-20T16:45:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-2',
      name: 'Land Lease Agreement — Site Alpha.pdf',
      category: 'legal',
      version: 'v1.3',
      uploadedAt: '2026-07-28T10:05:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 1_180_000,
      previewText:
        'Lease agreement over 210 hectares for Site Alpha, 28-year term from commissioning date, ' +
        'renewable for two further 10-year periods at lessor\'s option. Annual rent indexed to ' +
        'CPI. No registered easements affecting the array layout as of the last title search.',
      versions: [
        { version: 'v1.3', uploadedAt: '2026-07-28T10:05:00.000Z', uploadedBy: 'Deal room (seller)' },
        { version: 'v1.2', uploadedAt: '2026-02-14T08:30:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-3',
      name: 'PPA — Helios Portfolio Offtake Agreement.pdf',
      category: 'commercial',
      version: 'v2.0',
      uploadedAt: '2026-08-05T14:22:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 3_050_000,
      previewText:
        'Power purchase agreement with a utility offtaker for 100% of Helios output, 15-year term, ' +
        'fixed price with annual escalator. Volume floor and ceiling defined per contract year. ' +
        'Assignment clause requires offtaker consent on change of control.',
      versions: [
        { version: 'v2.0', uploadedAt: '2026-08-05T14:22:00.000Z', uploadedBy: 'Deal room (seller)' },
        {
          version: 'v1.0',
          uploadedAt: '2025-09-18T09:00:00.000Z',
          uploadedBy: 'Deal room (seller)',
          note: 'Original signed version before the 2026 price amendment.',
        },
      ],
    },
    {
      id: 'doc-helios-4',
      name: 'Environmental Impact Assessment — Site Beta.pdf',
      category: 'esg',
      version: 'v1.0',
      uploadedAt: '2026-06-30T12:40:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 4_870_000,
      previewText:
        'Environmental impact assessment for Site Beta covering avifauna, soil and hydrology. ' +
        'Approved with 6 attached conditions, all confirmed satisfied in the latest compliance ' +
        'monitoring report except the raptor-monitoring condition, still open for the 2026 season.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-06-30T12:40:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-5',
      name: 'Financial Model — Helios Base Case v3.xlsx',
      category: 'financial',
      version: 'v3',
      uploadedAt: '2026-08-20T17:10:00.000Z',
      uploadedBy: 'Marta Solano',
      status: 'indexed',
      sizeBytes: 6_120_000,
      previewText:
        'Consolidated 25-year cash flow model for the Helios portfolio: revenue, opex, debt ' +
        'service and equity returns by asset and consolidated. Base case assumes the PPA v2.0 ' +
        'pricing — see the financial model audit for consistency findings against contract terms.',
      versions: [
        { version: 'v3', uploadedAt: '2026-08-20T17:10:00.000Z', uploadedBy: 'Marta Solano' },
        { version: 'v2', uploadedAt: '2026-07-02T10:00:00.000Z', uploadedBy: 'Marta Solano' },
      ],
    },
    {
      id: 'doc-helios-6',
      name: 'Corporate Tax Compliance Certificate 2025.pdf',
      category: 'tax',
      version: 'v1.0',
      uploadedAt: '2026-05-15T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 540_000,
      previewText:
        'Tax authority certificate confirming no outstanding corporate tax liabilities for FY2025 ' +
        'across the three project SPVs. No open audits or disputes disclosed as of issue date.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-05-15T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-7',
      name: 'Employment Agreements Summary — O&M Staff.pdf',
      category: 'hr',
      version: 'v1.1',
      uploadedAt: '2026-08-22T08:55:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'pending',
      sizeBytes: 890_000,
      previewText: 'Indexing in progress — preview will be available once processing completes.',
      versions: [
        { version: 'v1.1', uploadedAt: '2026-08-22T08:55:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-8',
      name: 'Insurance Policy Schedule — All Risk Construction.pdf',
      category: 'legal',
      version: 'v1.0',
      uploadedAt: '2026-04-11T13:20:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 1_020_000,
      previewText:
        'All-risk construction insurance schedule covering the remaining Site Gamma works, sum ' +
        'insured aligned with the EPC contract value, standard exclusions for war and nuclear ' +
        'risk only.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-04-11T13:20:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-9',
      name: 'EPC Contract — Site Gamma Construction.pdf',
      category: 'commercial',
      version: 'v1.4',
      uploadedAt: '2026-07-01T15:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 2_960_000,
      previewText:
        'Fixed-price EPC contract for Site Gamma (90 MWp), liquidated damages for delay capped at ' +
        '15% of contract value, performance guarantees tested at provisional acceptance. ' +
        'References the environmental permit as a condition precedent to notice to proceed.',
      versions: [
        { version: 'v1.4', uploadedAt: '2026-07-01T15:00:00.000Z', uploadedBy: 'Deal room (seller)' },
        { version: 'v1.0', uploadedAt: '2025-12-09T10:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-10',
      name: 'Grid Curtailment Terms Addendum.pdf',
      category: 'technical',
      version: 'v1.0',
      uploadedAt: '2026-03-19T09:30:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'error',
      sizeBytes: 610_000,
      previewText:
        'Ingestion error — the source file appears to be a scanned image without an extractable ' +
        'text layer. Re-upload a text-native version to enable indexing and citation support.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-03-19T09:30:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-11',
      name: 'Litigation Search Report — Site Delta.pdf',
      category: 'legal',
      version: 'v1.0',
      uploadedAt: '2026-08-18T11:15:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'pending',
      sizeBytes: 430_000,
      previewText: 'Indexing in progress — preview will be available once processing completes.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-08-18T11:15:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-helios-12',
      name: 'Related Party Transactions Disclosure.pdf',
      category: 'tax',
      version: 'v1.0',
      uploadedAt: '2026-06-02T10:45:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 320_000,
      previewText:
        'Disclosure schedule of related-party transactions across the SPVs for FY2024-2025: O&M ' +
        'services from an affiliated operator, priced at arm\'s length per the attached benchmark ' +
        'study.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-06-02T10:45:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
  ],

  meridian: [
    {
      id: 'doc-meridian-1',
      name: 'O&M Agreement — Turbine Fleet.pdf',
      category: 'technical',
      version: 'v2.0',
      uploadedAt: '2026-08-10T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 1_760_000,
      previewText:
        'Full-service O&M agreement for the 6-asset turbine fleet, 95% time-based availability ' +
        'guarantee with liquidated damages below threshold, 12-year remaining term with spare ' +
        'parts provisioning included.',
      versions: [
        { version: 'v2.0', uploadedAt: '2026-08-10T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
        {
          version: 'v1.0',
          uploadedAt: '2026-01-22T09:00:00.000Z',
          uploadedBy: 'Deal room (seller)',
          note: 'Executed version before the 2026 availability guarantee amendment.',
        },
      ],
    },
    {
      id: 'doc-meridian-2',
      name: 'Wind Resource Assessment Report.pdf',
      category: 'technical',
      version: 'v1.2',
      uploadedAt: '2026-07-14T13:30:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 3_340_000,
      previewText:
        'Independent wind resource assessment across the 6 sites: P50 net capacity factor of ' +
        '34.2%, P90/P50 ratio of 0.87. Measurement campaign covers 3 full years plus long-term ' +
        'correlation.',
      versions: [
        { version: 'v1.2', uploadedAt: '2026-07-14T13:30:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-meridian-3',
      name: 'PPA — Meridian Wind Offtake Agreement.pdf',
      category: 'commercial',
      version: 'v1.0',
      uploadedAt: '2026-06-28T10:10:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 2_210_000,
      previewText:
        'Offtake agreement for the Meridian platform, 10-year term, hybrid fixed/merchant pricing ' +
        'structure with a floor. Counterparty is an investment-grade regional utility.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-06-28T10:10:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-meridian-4',
      name: 'Land Rights Registry Extract.pdf',
      category: 'legal',
      version: 'v1.1',
      uploadedAt: '2026-05-19T08:40:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 780_000,
      previewText:
        'Registry extracts confirming land tenure for all 6 asset sites — 4 under long-term ' +
        'lease, 2 under freehold ownership held by the project SPVs.',
      versions: [
        { version: 'v1.1', uploadedAt: '2026-05-19T08:40:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-meridian-5',
      name: 'Financial Model — Meridian Wind v2.xlsx',
      category: 'financial',
      version: 'v2',
      uploadedAt: '2026-08-19T16:05:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'pending',
      sizeBytes: 4_580_000,
      previewText: 'Indexing in progress — preview will be available once processing completes.',
      versions: [
        { version: 'v2', uploadedAt: '2026-08-19T16:05:00.000Z', uploadedBy: 'Deal room (seller)' },
        { version: 'v1', uploadedAt: '2026-03-11T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-meridian-6',
      name: 'Environmental Permit — Asset Cluster North.pdf',
      category: 'esg',
      version: 'v1.0',
      uploadedAt: '2026-04-02T11:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 2_040_000,
      previewText:
        'Environmental permit for the northern asset cluster (3 turbines), unconditional approval, ' +
        'no expired conditions. Southern cluster permit is tracked separately as a gap.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-04-02T11:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-meridian-7',
      name: 'Turbine Supply Warranty Certificates.pdf',
      category: 'technical',
      version: 'v1.0',
      uploadedAt: '2026-02-25T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'error',
      sizeBytes: 260_000,
      previewText:
        'Ingestion error — password-protected PDF. Request an unprotected copy from the seller to ' +
        'enable indexing.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-02-25T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-meridian-8',
      name: 'Corporate Structure Chart.pdf',
      category: 'legal',
      version: 'v1.3',
      uploadedAt: '2026-08-01T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 410_000,
      previewText:
        'Group structure chart showing the holding company, the 6 project SPVs and the offtake ' +
        'contracting entity. Updated after a 2026 internal reorganization.',
      versions: [
        { version: 'v1.3', uploadedAt: '2026-08-01T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
        { version: 'v1.0', uploadedAt: '2025-10-05T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
  ],

  solstice: [
    {
      id: 'doc-solstice-1',
      name: 'Interconnection Queue Position Letters.pdf',
      category: 'technical',
      version: 'v1.0',
      uploadedAt: '2026-06-10T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 1_120_000,
      previewText:
        'Queue position confirmation letters from the ISO for all 5 pipeline sites, positions ' +
        'ranging from #14 to #62. No withdrawal notices on file.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-06-10T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-solstice-2',
      name: 'Site Control Agreements — Pipeline Sites.pdf',
      category: 'legal',
      version: 'v1.1',
      uploadedAt: '2026-06-05T10:30:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 940_000,
      previewText:
        'Option-to-lease agreements over the 5 pipeline sites, exercise windows tied to permitting ' +
        'milestones. Acreage figures per site listed in Schedule A.',
      versions: [
        { version: 'v1.1', uploadedAt: '2026-06-05T10:30:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-solstice-3',
      name: 'Development Budget & Milestones.xlsx',
      category: 'financial',
      version: 'v1.4',
      uploadedAt: '2026-06-18T14:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 780_000,
      previewText:
        'Development-stage budget and milestone schedule for the 5-site pipeline: interconnection, ' +
        'land, permitting and notice-to-proceed dates per site, with cost-to-date and ' +
        'cost-to-complete columns.',
      versions: [
        { version: 'v1.4', uploadedAt: '2026-06-18T14:00:00.000Z', uploadedBy: 'Deal room (seller)' },
        { version: 'v1.0', uploadedAt: '2026-02-01T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-solstice-4',
      name: 'Corporate Tax Structure Memo.pdf',
      category: 'tax',
      version: 'v1.0',
      uploadedAt: '2026-05-22T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 390_000,
      previewText:
        'Memo describing the holding structure used for the pipeline SPVs and the tax treatment of ' +
        'development-stage costs. Prepared by seller\'s tax counsel.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-05-22T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-solstice-5',
      name: 'Permitting Status Tracker.pdf',
      category: 'technical',
      version: 'v2.0',
      uploadedAt: '2026-06-25T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 260_000,
      previewText:
        'Site-by-site permitting status tracker: 3 sites with full sign-off, 2 sites at ' +
        'application stage. Updated shortly before close to reflect the final sign-offs.',
      versions: [
        {
          version: 'v2.0',
          uploadedAt: '2026-06-25T09:00:00.000Z',
          uploadedBy: 'Deal room (seller)',
          note: 'Replaces v1.0 after the two outstanding sign-offs came through.',
        },
        { version: 'v1.0', uploadedAt: '2026-04-30T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
    {
      id: 'doc-solstice-6',
      name: 'HR Organization Chart — Development Team.pdf',
      category: 'hr',
      version: 'v1.0',
      uploadedAt: '2026-05-08T09:00:00.000Z',
      uploadedBy: 'Deal room (seller)',
      status: 'indexed',
      sizeBytes: 190_000,
      previewText:
        'Organization chart for the 4-person development team retained post-close, reporting ' +
        'lines and role summaries only — no compensation data included.',
      versions: [
        { version: 'v1.0', uploadedAt: '2026-05-08T09:00:00.000Z', uploadedBy: 'Deal room (seller)' },
      ],
    },
  ],
}

export function getDocuments(opId: string): KbDocument[] {
  return MOCK_DOCUMENTS[opId] ?? []
}
