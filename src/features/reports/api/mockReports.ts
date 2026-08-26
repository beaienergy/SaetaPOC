import type { Citation } from '@/shared/types/domain'
import type {
  GeneratedReport,
  ReportBlock,
  ReportSection,
  ReportSectionKey,
  ReportSourceOption,
  ReportTemplate,
  ReportTemplateId,
} from '../types'

/**
 * Las 4 plantillas de la POC (guion §5.5: "resumen ejecutivo, IC memo,
 * informe de estado…"). `sections[].id` es la clave con la que
 * `MOCK_SECTION_CONTENT` busca el contenido mock de cada operación para esa
 * sección — cambiar el id de una sección implica añadir la clave abajo.
 */
export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'One-page overview for senior stakeholders: rationale, key risks and headline financials.',
    audience: 'Senior stakeholders / board',
    sections: [
      {
        id: 'overview',
        title: 'Deal overview',
        description: 'Target, structure and rationale for the transaction.',
        defaultIncluded: true,
      },
      {
        id: 'risks',
        title: 'Key risks',
        description: 'Top risks identified across workstreams, with severity.',
        defaultIncluded: true,
      },
      {
        id: 'financials',
        title: 'Financial highlights',
        description: 'Headline figures from the financial model and latest accounts.',
        defaultIncluded: true,
      },
      {
        id: 'recommendation',
        title: 'Recommendation',
        description: 'Overall go / no-go recommendation and rationale.',
        defaultIncluded: false,
      },
    ],
  },
  {
    id: 'ic-memo',
    name: 'Investment Committee Memo',
    description:
      'Full-length memo for the Investment Committee: rationale, diligence findings, valuation and next steps.',
    audience: 'Investment Committee',
    sections: [
      {
        id: 'transaction',
        title: 'Transaction overview',
        description: 'Structure of the deal and what is being acquired.',
        defaultIncluded: true,
      },
      {
        id: 'rationale',
        title: 'Strategic rationale',
        description: 'Why this asset, why now.',
        defaultIncluded: true,
      },
      {
        id: 'keyIssues',
        title: 'Key issues & mitigants',
        description: 'Material findings from due diligence and how they are addressed.',
        defaultIncluded: true,
      },
      {
        id: 'financialAnalysis',
        title: 'Financial analysis',
        description: 'Historical performance and the model’s base-case output.',
        defaultIncluded: true,
      },
      {
        id: 'valuation',
        title: 'Valuation',
        description: 'How the proposed price compares to the diligence findings.',
        defaultIncluded: false,
      },
      {
        id: 'icRecommendation',
        title: 'Recommendation & next steps',
        description: 'What the Committee is being asked to approve.',
        defaultIncluded: true,
      },
    ],
  },
  {
    id: 'status-report',
    name: 'Status Report',
    description: 'Periodic progress update on the due diligence workstreams, for internal tracking.',
    audience: 'Deal team / internal',
    sections: [
      {
        id: 'progress',
        title: 'Progress since last update',
        description: 'What moved since the previous status report.',
        defaultIncluded: true,
      },
      {
        id: 'workstreams',
        title: 'Open workstreams',
        description: 'Status of each active workstream.',
        defaultIncluded: true,
      },
      {
        id: 'pendingDocs',
        title: 'Outstanding documentation requests',
        description: 'What is still needed from the seller or advisors.',
        defaultIncluded: true,
      },
      {
        id: 'milestones',
        title: 'Upcoming milestones',
        description: 'Key dates on the deal timeline.',
        defaultIncluded: false,
      },
    ],
  },
  {
    id: 'red-flag-summary',
    name: 'Red Flag Summary',
    description: 'Focused summary of critical findings that could affect the deal’s viability.',
    audience: 'Deal lead / IC chair',
    sections: [
      {
        id: 'criticalFindings',
        title: 'Critical findings',
        description: 'The findings with the highest potential impact.',
        defaultIncluded: true,
      },
      {
        id: 'dealBreakers',
        title: 'Deal-breaker assessment',
        description: 'Whether any finding rises to deal-breaker severity.',
        defaultIncluded: true,
      },
      {
        id: 'actions',
        title: 'Recommended actions',
        description: 'What should happen next to close out each finding.',
        defaultIncluded: true,
      },
    ],
  },
]

export function getTemplate(id: ReportTemplateId): ReportTemplate {
  const template = REPORT_TEMPLATES.find((t) => t.id === id)
  if (!template) throw new Error(`Unknown report template: ${id}`)
  return template
}

export function sectionsFor(templateId: ReportTemplateId): ReportSection[] {
  return getTemplate(templateId).sections
}

/**
 * Documentos de la operación que se pueden incluir como fuente del borrador
 * (guion §5.5: "elegir secciones/fuentes a incluir"). No es la tabla de
 * Documentación real (esa feature no está construida todavía) — es una lista
 * suficiente para demostrar el paso de selección de fuentes.
 */
export const MOCK_REPORT_SOURCES: Record<string, ReportSourceOption[]> = {
  helios: [
    { id: 'doc-helios-spa', label: 'Share Purchase Agreement — draft', category: 'Legal', defaultIncluded: true },
    { id: 'doc-helios-ppa', label: 'Power Purchase Agreement', category: 'Commercial', defaultIncluded: true },
    { id: 'doc-helios-grid', label: 'Grid connection permits pack', category: 'Technical', defaultIncluded: true },
    { id: 'doc-helios-land', label: 'Land lease register', category: 'Legal', defaultIncluded: true },
    { id: 'doc-helios-fm', label: 'Financial model v4.2', category: 'Financial', defaultIncluded: true },
    {
      id: 'doc-helios-fy25',
      label: 'FY25 audited financial statements',
      category: 'Financial',
      defaultIncluded: true,
    },
    { id: 'doc-helios-eia', label: 'Environmental impact assessment', category: 'ESG', defaultIncluded: false },
  ],
  meridian: [
    {
      id: 'doc-meridian-apa',
      label: 'Asset Purchase Agreement — draft',
      category: 'Legal',
      defaultIncluded: true,
    },
    { id: 'doc-meridian-om', label: 'O&M contracts — 6 assets', category: 'Technical', defaultIncluded: true },
    {
      id: 'doc-meridian-warranty',
      label: 'Turbine warranty schedules',
      category: 'Technical',
      defaultIncluded: false,
    },
    { id: 'doc-meridian-mgmt', label: 'FY25 management accounts', category: 'Financial', defaultIncluded: true },
    { id: 'doc-meridian-fm', label: 'Financial model v2.1', category: 'Financial', defaultIncluded: true },
  ],
  solstice: [
    { id: 'doc-solstice-pipeline', label: 'Pipeline asset register', category: 'Technical', defaultIncluded: true },
    { id: 'doc-solstice-site', label: 'Site control summary', category: 'Legal', defaultIncluded: true },
    {
      id: 'doc-solstice-interconnect',
      label: 'Interconnection queue status',
      category: 'Technical',
      defaultIncluded: true,
    },
    {
      id: 'doc-solstice-fm',
      label: 'Financial model v1.0 (final)',
      category: 'Financial',
      defaultIncluded: true,
    },
  ],
}

type CitationPool = Record<string, Citation>

const HELIOS_CITATIONS: CitationPool = {
  h1: {
    id: 'h1',
    documentId: 'doc-helios-spa',
    documentName: 'Share Purchase Agreement — draft',
    locator: 'clause 2.1',
    snippet:
      'The Purchaser shall acquire 100% of the issued share capital of HoldCo, holder of the four project companies comprising the Portfolio.',
  },
  h2: {
    id: 'h2',
    documentId: 'doc-helios-ppa',
    documentName: 'Power Purchase Agreement',
    locator: 'clause 4.3',
    snippet:
      'Contracted price is indexed annually to CPI (capped at 3%) for a fixed 12-year term from commercial operation date.',
  },
  h3: {
    id: 'h3',
    documentId: 'doc-helios-grid',
    documentName: 'Grid connection permits pack',
    locator: 'p. 12',
    snippet: 'Capacity reservation of 480 MW confirmed by the transmission operator, subject to commissioning by Q3 2027.',
  },
  h4: {
    id: 'h4',
    documentId: 'doc-helios-land',
    documentName: 'Land lease register',
    locator: 'row 14',
    snippet: "Site 3 lease term (11 years remaining) is shorter than the asset's 25-year design life.",
  },
  h4b: {
    id: 'h4b',
    documentId: 'doc-helios-land',
    documentName: 'Land lease register',
    locator: 'row 14 (amended)',
    snippet: 'Site 3 lease extended by 15 years via executed amendment dated 18 Aug 2026.',
  },
  h5: {
    id: 'h5',
    documentId: 'doc-helios-fm',
    documentName: 'Financial model v4.2',
    locator: "'Revenue' tab, cell C22",
    snippet: 'Base-case unlevered IRR of 8.4% over a 25-year hold period.',
  },
  h6: {
    id: 'h6',
    documentId: 'doc-helios-fy25',
    documentName: 'FY25 audited financial statements',
    locator: 'p. 34',
    snippet: 'EBITDA margin of 71% on total revenue of €38.2M for FY25.',
  },
  h7: {
    id: 'h7',
    documentId: 'doc-helios-eia',
    documentName: 'Environmental impact assessment',
    locator: 'section 6',
    snippet: 'No unresolved conditions attached to the environmental approval for any of the four sites.',
  },
  h8: {
    id: 'h8',
    documentId: 'doc-helios-grid',
    documentName: 'Grid connection permits pack',
    locator: 'p. 15',
    snippet: 'Curtailment risk is capped at 5% of annual generation under the current connection agreement.',
  },
}

const MERIDIAN_CITATIONS: CitationPool = {
  m1: {
    id: 'm1',
    documentId: 'doc-meridian-apa',
    documentName: 'Asset Purchase Agreement — draft',
    locator: 'clause 3.2',
    snippet: 'Transaction structured as an asset deal covering six operating wind assets and their associated O&M contracts.',
  },
  m2: {
    id: 'm2',
    documentId: 'doc-meridian-om',
    documentName: 'O&M contracts — 6 assets',
    locator: 'clause 7',
    snippet: 'Availability guarantee of 96%, with liquidated damages below that threshold; term is co-terminous with turbine warranty.',
  },
  m3: {
    id: 'm3',
    documentId: 'doc-meridian-warranty',
    documentName: 'Turbine warranty schedules',
    locator: 'p. 4',
    snippet: 'Two of six assets are past original warranty expiry with no extended-service contract in place.',
  },
  m4: {
    id: 'm4',
    documentId: 'doc-meridian-mgmt',
    documentName: 'FY25 management accounts',
    locator: 'p. 9',
    snippet: 'Revenue of €19.6M for FY25, down 4% year-on-year on lower wind resource.',
  },
  m5: {
    id: 'm5',
    documentId: 'doc-meridian-fm',
    documentName: 'Financial model v2.1',
    locator: "'Sensitivities' tab, cell C14",
    snippet: 'A 5% drop in P50 wind resource reduces unlevered IRR by approximately 90 basis points.',
  },
}

const SOLSTICE_CITATIONS: CitationPool = {
  s1: {
    id: 's1',
    documentId: 'doc-solstice-pipeline',
    documentName: 'Pipeline asset register',
    locator: 'row 6',
    snippet: '6 of 10 pipeline sites do not yet hold a confirmed interconnection queue position.',
  },
  s2: {
    id: 's2',
    documentId: 'doc-solstice-site',
    documentName: 'Site control summary',
    locator: 'p. 3',
    snippet: 'Site control (option or lease) is confirmed for 4 of 10 pipeline sites.',
  },
  s3: {
    id: 's3',
    documentId: 'doc-solstice-interconnect',
    documentName: 'Interconnection queue status',
    locator: 'p. 2',
    snippet: 'Average queue position across the portfolio implies a 3–4 year lead time to energization.',
  },
  s4: {
    id: 's4',
    documentId: 'doc-solstice-fm',
    documentName: 'Financial model v1.0 (final)',
    locator: "'Valuation' tab, cell F9",
    snippet: "Implied valuation gap of 22% versus the seller's ask price under the base case.",
  },
}

const MOCK_CITATION_POOLS: Record<string, CitationPool> = {
  helios: HELIOS_CITATIONS,
  meridian: MERIDIAN_CITATIONS,
  solstice: SOLSTICE_CITATIONS,
}

interface SectionContent {
  kind: 'paragraph' | 'bullets'
  paragraph?: string
  bullets?: string[]
  citationIds: string[]
}

type ContentMap = Record<ReportSectionKey, SectionContent>

const HELIOS_CONTENT: ContentMap = {
  overview: {
    kind: 'paragraph',
    paragraph:
      'Project Helios is the proposed acquisition of a 480 MWp utility-scale solar PV portfolio across four operating sites in Iberia, structured as a 100% share purchase of the holding company.',
    citationIds: ['h1'],
  },
  risks: {
    kind: 'bullets',
    bullets: [
      "Site 3's land lease runs shorter than the asset's design life.",
      'Curtailment exposure is capped at 5% of annual generation under current connection terms.',
      'PPA pricing is CPI-linked and capped, limiting upside if inflation runs hot.',
    ],
    citationIds: ['h4', 'h8', 'h2'],
  },
  financials: {
    kind: 'paragraph',
    paragraph:
      "FY25 revenue reached €38.2M at a 71% EBITDA margin; the financial model's base case implies an unlevered IRR of 8.4% over a 25-year hold.",
    citationIds: ['h6', 'h5'],
  },
  recommendation: {
    kind: 'paragraph',
    paragraph: 'Proceed to exclusivity, subject to closing out the Site 3 land-lease shortfall before signing.',
    citationIds: ['h4'],
  },
  transaction: {
    kind: 'paragraph',
    paragraph:
      'The transaction is structured as a full share purchase of HoldCo, the entity holding the four project companies that make up the 480 MWp portfolio.',
    citationIds: ['h1'],
  },
  rationale: {
    kind: 'paragraph',
    paragraph:
      'The portfolio offers contracted, CPI-linked revenue with a confirmed 480 MW grid capacity reservation, giving a de-risked entry into Iberian utility-scale solar.',
    citationIds: ['h2', 'h3'],
  },
  keyIssues: {
    kind: 'bullets',
    bullets: [
      "Land lease on Site 3 is shorter than the asset's remaining useful life.",
      'Two of four sites carry curtailment risk under current connection terms.',
      'PPA escalation is capped at 3%, below recent inflation prints.',
    ],
    citationIds: ['h4', 'h8', 'h2'],
  },
  financialAnalysis: {
    kind: 'paragraph',
    paragraph:
      "FY25 audited revenue of €38.2M and a 71% EBITDA margin support the model's base-case assumptions; unlevered IRR is estimated at 8.4% over 25 years.",
    citationIds: ['h6', 'h5'],
  },
  valuation: {
    kind: 'paragraph',
    paragraph:
      'At the proposed price, the transaction implies an entry multiple broadly in line with recent Iberian solar comparables, before accounting for the Site 3 lease shortfall.',
    citationIds: ['h5'],
  },
  icRecommendation: {
    kind: 'paragraph',
    paragraph:
      'The Committee is asked to approve proceeding to exclusivity, conditional on the seller resolving the Site 3 land-lease term ahead of signing.',
    citationIds: ['h4'],
  },
  progress: {
    kind: 'paragraph',
    paragraph:
      'Legal, technical and financial workstreams are complete; the land-rights workstream remains open pending the Site 3 lease resolution.',
    citationIds: ['h4'],
  },
  workstreams: {
    kind: 'bullets',
    bullets: [
      'Legal — complete, SPA in final markup.',
      'Technical — complete, grid capacity confirmed.',
      'Land rights — open, Site 3 lease shortfall pending resolution.',
    ],
    citationIds: ['h1', 'h3', 'h4'],
  },
  pendingDocs: {
    kind: 'bullets',
    bullets: ['Executed lease amendment for Site 3.', 'Updated curtailment forecast from the grid operator.'],
    citationIds: ['h8'],
  },
  milestones: {
    kind: 'bullets',
    bullets: ['Exclusivity target — 5 Sep 2026.', 'SPA signing target — 30 Sep 2026.', 'Financial close target — Q4 2026.'],
    citationIds: [],
  },
  criticalFindings: {
    kind: 'bullets',
    bullets: [
      "Site 3 land lease term is shorter than the asset's design life — the single largest open item.",
      'Curtailment risk of up to 5% of annual generation is not currently priced into the base case.',
    ],
    citationIds: ['h4', 'h8'],
  },
  dealBreakers: {
    kind: 'paragraph',
    paragraph:
      'No item identified to date rises to deal-breaker severity; the Site 3 lease shortfall is assessed as resolvable pre-signing.',
    citationIds: ['h4'],
  },
  actions: {
    kind: 'bullets',
    bullets: [
      'Request the seller execute the Site 3 lease extension before signing.',
      'Commission an independent curtailment study for the two exposed sites.',
      'Re-run the financial model with the amended lease term once available.',
    ],
    citationIds: ['h4', 'h8', 'h5'],
  },
}

const MERIDIAN_CONTENT: ContentMap = {
  overview: {
    kind: 'paragraph',
    paragraph:
      'Project Meridian is the proposed acquisition of an onshore wind platform comprising six operating assets in Southern Europe, structured as an asset purchase.',
    citationIds: ['m1'],
  },
  risks: {
    kind: 'bullets',
    bullets: [
      'Two of six turbines are outside warranty with no extended-service contract.',
      'FY25 revenue is down 4% year-on-year on lower wind resource.',
      'IRR is sensitive to wind resource: a 5% P50 miss costs roughly 90 basis points.',
    ],
    citationIds: ['m3', 'm4', 'm5'],
  },
  financials: {
    kind: 'paragraph',
    paragraph:
      'FY25 revenue of €19.6M was down 4% year-on-year; the model shows unlevered IRR moving roughly 90 basis points for every 5% swing in P50 wind resource.',
    citationIds: ['m4', 'm5'],
  },
  recommendation: {
    kind: 'paragraph',
    paragraph: 'Proceed, conditional on the seller extending service cover for the two assets currently outside warranty.',
    citationIds: ['m3'],
  },
  transaction: {
    kind: 'paragraph',
    paragraph:
      'The transaction is structured as an asset purchase covering six operating wind assets and their O&M contracts, rather than a share deal.',
    citationIds: ['m1'],
  },
  rationale: {
    kind: 'paragraph',
    paragraph:
      'The platform carries a 96% availability guarantee across its O&M contracts, giving predictable operating performance once the warranty gap is closed.',
    citationIds: ['m2'],
  },
  keyIssues: {
    kind: 'bullets',
    bullets: [
      'Two of six assets are past warranty expiry with no extended-service contract.',
      'Revenue is down 4% year-on-year on lower wind resource, ahead of the acquisition.',
    ],
    citationIds: ['m3', 'm4'],
  },
  financialAnalysis: {
    kind: 'paragraph',
    paragraph:
      'FY25 revenue of €19.6M and the O&M availability guarantee of 96% anchor the base case; resource variability is the main swing factor on returns.',
    citationIds: ['m4', 'm2'],
  },
  valuation: {
    kind: 'paragraph',
    paragraph:
      'The proposed valuation assumes the warranty gap on two assets is closed pre-close; unresolved, it would reduce the offer by the estimated cost of service cover.',
    citationIds: ['m3'],
  },
  icRecommendation: {
    kind: 'paragraph',
    paragraph:
      'The Committee is asked to approve proceeding, subject to the seller extending service cover for the two out-of-warranty assets before close.',
    citationIds: ['m3'],
  },
  progress: {
    kind: 'paragraph',
    paragraph:
      'Legal and commercial workstreams are on track; the technical workstream flagged a warranty gap on two assets that is now with the seller for resolution.',
    citationIds: ['m3'],
  },
  workstreams: {
    kind: 'bullets',
    bullets: [
      'Legal — on track, APA markup in progress.',
      'Technical — warranty gap on 2 of 6 assets, pending seller response.',
      'Financial — model updated with FY25 actuals.',
    ],
    citationIds: ['m1', 'm3', 'm4'],
  },
  pendingDocs: {
    kind: 'bullets',
    bullets: [
      'Extended-service quote for the two out-of-warranty turbines.',
      "FY26 budget from the seller's asset manager.",
    ],
    citationIds: ['m3'],
  },
  milestones: {
    kind: 'bullets',
    bullets: ['Management presentation — 4 Sep 2026.', 'Binding offer target — 22 Sep 2026.'],
    citationIds: [],
  },
  criticalFindings: {
    kind: 'bullets',
    bullets: [
      'Two of six assets are outside warranty with no service cover in place.',
      "Revenue decline of 4% year-on-year has not yet been fully explained by the seller.",
    ],
    citationIds: ['m3', 'm4'],
  },
  dealBreakers: {
    kind: 'paragraph',
    paragraph:
      'No finding to date is assessed as a deal-breaker; the warranty gap is priceable and the revenue decline appears resource-driven rather than structural.',
    citationIds: ['m4'],
  },
  actions: {
    kind: 'bullets',
    bullets: [
      'Request an extended-service quote for the two out-of-warranty turbines.',
      "Ask the seller for a resource-adjusted explanation of the FY25 revenue decline.",
    ],
    citationIds: ['m3', 'm4'],
  },
}

const SOLSTICE_CONTENT: ContentMap = {
  overview: {
    kind: 'paragraph',
    paragraph:
      'Project Solstice is an early-stage battery storage (BESS) development pipeline; the operation was closed after due diligence without proceeding to an offer.',
    citationIds: ['s4'],
  },
  risks: {
    kind: 'bullets',
    bullets: [
      '6 of 10 pipeline sites lack a confirmed interconnection queue position.',
      'Site control is confirmed for only 4 of 10 sites.',
      "Implied valuation gap of 22% versus the seller's ask price.",
    ],
    citationIds: ['s1', 's2', 's4'],
  },
  financials: {
    kind: 'paragraph',
    paragraph:
      "Under the base case, the portfolio implies a 22% valuation gap versus the seller's ask, driven largely by unconfirmed interconnection timing.",
    citationIds: ['s4'],
  },
  recommendation: {
    kind: 'paragraph',
    paragraph:
      "Do not proceed. The valuation gap and the share of unconfirmed pipeline sites exceed the Committee's threshold for an early-stage platform.",
    citationIds: ['s4'],
  },
  transaction: {
    kind: 'paragraph',
    paragraph:
      "The proposed transaction was a full acquisition of the developer's early-stage BESS pipeline, prior to closing this operation without an offer.",
    citationIds: ['s4'],
  },
  rationale: {
    kind: 'paragraph',
    paragraph:
      "Entry into BESS development was strategically attractive, but the confirmed portion of the pipeline was too small to underwrite at the seller's ask.",
    citationIds: ['s2'],
  },
  keyIssues: {
    kind: 'bullets',
    bullets: [
      '6 of 10 sites lack a confirmed interconnection queue position.',
      'Average queue position implies a 3–4 year lead time to energization.',
    ],
    citationIds: ['s1', 's3'],
  },
  financialAnalysis: {
    kind: 'paragraph',
    paragraph:
      "The base case implies a 22% valuation gap versus the seller's ask, with the unconfirmed 60% of the pipeline as the principal driver.",
    citationIds: ['s4'],
  },
  valuation: {
    kind: 'paragraph',
    paragraph:
      "Valuing only the 4 confirmed sites materially narrows the pipeline versus the seller's presentation, producing the 22% base-case gap.",
    citationIds: ['s4', 's2'],
  },
  icRecommendation: {
    kind: 'paragraph',
    paragraph:
      "The Committee's decision was not to proceed. The confirmed portion of the pipeline does not support the seller's ask, and the operation was closed on that basis.",
    citationIds: ['s4'],
  },
  progress: {
    kind: 'paragraph',
    paragraph: "All due diligence workstreams are complete; the operation is closed following the Committee's decision not to proceed.",
    citationIds: ['s4'],
  },
  workstreams: {
    kind: 'bullets',
    bullets: [
      'Technical — complete, queue and site-control status confirmed.',
      'Financial — complete, valuation gap quantified.',
    ],
    citationIds: ['s1', 's2', 's4'],
  },
  pendingDocs: {
    kind: 'bullets',
    bullets: ['None outstanding — the operation is closed.'],
    citationIds: [],
  },
  milestones: {
    kind: 'bullets',
    bullets: ['Operation closed — 30 Jun 2026.'],
    citationIds: [],
  },
  criticalFindings: {
    kind: 'bullets',
    bullets: [
      '60% of the pipeline lacks a confirmed interconnection queue position.',
      "Implied valuation gap of 22% versus the seller's ask under the base case.",
    ],
    citationIds: ['s1', 's4'],
  },
  dealBreakers: {
    kind: 'paragraph',
    paragraph:
      "The combination of unconfirmed pipeline and the resulting valuation gap was assessed as a deal-breaker at the seller's ask price.",
    citationIds: ['s4'],
  },
  actions: {
    kind: 'bullets',
    bullets: [
      'No further action — operation closed.',
      'Revisit only if the seller re-approaches with a materially reduced ask or a more mature pipeline.',
    ],
    citationIds: [],
  },
}

const MOCK_SECTION_CONTENT: Record<string, ContentMap> = {
  helios: HELIOS_CONTENT,
  meridian: MERIDIAN_CONTENT,
  solstice: SOLSTICE_CONTENT,
}

/**
 * Genera el cuerpo del borrador (bloques de texto formateado + panel de citas)
 * para una operación, plantilla y selección de secciones dadas — lo que
 * dispara "Generar borrador" (guion §5.5). El contenido es mock, pero
 * distinto por operación y coherente con sus documentos (`MOCK_REPORT_SOURCES`).
 */
export function buildDraftBody(
  opId: string,
  templateId: ReportTemplateId,
  sectionIds: ReportSectionKey[],
): { body: ReportBlock[]; citations: Citation[] } {
  const contentMap = MOCK_SECTION_CONTENT[opId] ?? HELIOS_CONTENT
  const pool = MOCK_CITATION_POOLS[opId] ?? HELIOS_CITATIONS
  const sections = sectionsFor(templateId).filter((s) => sectionIds.includes(s.id))

  const body: ReportBlock[] = []
  const usedCitationIds: string[] = []

  for (const section of sections) {
    const content = contentMap[section.id]
    body.push({ kind: 'heading', text: section.title })
    if (content.kind === 'paragraph') {
      body.push({ kind: 'paragraph', text: content.paragraph ?? '', citationIds: content.citationIds })
    } else {
      body.push({ kind: 'bullets', items: content.bullets ?? [], citationIds: content.citationIds })
    }
    for (const id of content.citationIds) {
      if (!usedCitationIds.includes(id)) usedCitationIds.push(id)
    }
  }

  const citations = usedCitationIds.map((id) => pool[id]).filter((c): c is Citation => Boolean(c))
  return { body, citations }
}

/**
 * Historial de informes ya generados (guion §5.5). Helios (la operación más
 * rica/activa) trae varias versiones para enseñar cómo se ve una pantalla
 * "usada" — incluida una IC Memo que evoluciona de v1 a v2 (el hueco de
 * arrendamiento del Site 3 se cierra entre versiones). Solstice (cerrada)
 * trae un único informe final de cierre. Meridian empieza vacía.
 */
export const MOCK_REPORTS: Record<string, GeneratedReport[]> = {
  helios: [
    {
      id: 'helios-rep-3',
      templateId: 'status-report',
      title: 'Project Helios — Status Report',
      version: 1,
      status: 'draft',
      generatedAt: '2026-08-24T16:45:00.000Z',
      generatedBy: 'Elena Vidal (Associate)',
      sectionIds: ['progress', 'workstreams', 'pendingDocs', 'milestones'],
      sourceIds: ['doc-helios-spa', 'doc-helios-grid', 'doc-helios-land'],
      body: [
        { kind: 'heading', text: 'Progress since last update' },
        {
          kind: 'paragraph',
          text:
            'Legal, technical and financial workstreams are complete; the land-rights item on Site 3 closed this week with an executed lease amendment.',
          citationIds: ['h4b'],
        },
        { kind: 'heading', text: 'Open workstreams' },
        {
          kind: 'bullets',
          items: [
            'Legal — complete, SPA in final markup.',
            'Technical — complete, curtailment study underway on the two exposed sites.',
            'Land rights — complete, Site 3 lease amendment executed this week.',
          ],
          citationIds: ['h1', 'h8', 'h4b'],
        },
        { kind: 'heading', text: 'Outstanding documentation requests' },
        {
          kind: 'bullets',
          items: [
            'Independent curtailment study for the two exposed sites.',
            'Updated grid operator forecast reflecting the amended connection terms.',
          ],
          citationIds: ['h8'],
        },
        { kind: 'heading', text: 'Upcoming milestones' },
        {
          kind: 'bullets',
          items: ['SPA signing target — 30 Sep 2026.', 'Financial close target — Q4 2026.'],
          citationIds: [],
        },
      ],
      citations: [HELIOS_CITATIONS.h4b, HELIOS_CITATIONS.h1, HELIOS_CITATIONS.h8],
    },
    {
      id: 'helios-rep-2',
      templateId: 'ic-memo',
      title: 'Project Helios — Investment Committee Memo',
      version: 2,
      status: 'draft',
      generatedAt: '2026-08-20T11:10:00.000Z',
      generatedBy: 'Marcus Webb (VP)',
      sectionIds: ['transaction', 'rationale', 'keyIssues', 'financialAnalysis', 'valuation', 'icRecommendation'],
      sourceIds: ['doc-helios-spa', 'doc-helios-ppa', 'doc-helios-grid', 'doc-helios-land', 'doc-helios-fm', 'doc-helios-fy25'],
      body: [
        { kind: 'heading', text: 'Transaction overview' },
        {
          kind: 'paragraph',
          text:
            'Project Helios is the proposed acquisition of a 480 MWp utility-scale solar PV portfolio across four operating sites in Iberia, structured as a 100% share purchase of the holding company.',
          citationIds: ['h1'],
        },
        { kind: 'heading', text: 'Strategic rationale' },
        {
          kind: 'paragraph',
          text:
            'The portfolio offers contracted, CPI-linked revenue with a confirmed 480 MW grid capacity reservation, giving a de-risked entry into Iberian utility-scale solar.',
          citationIds: ['h2', 'h3'],
        },
        { kind: 'heading', text: 'Key issues & mitigants' },
        {
          kind: 'bullets',
          items: [
            'Site 3 land lease has been extended by 15 years via an executed amendment — this item is now closed.',
            'Two of four sites still carry curtailment risk of up to 5% of annual generation; an independent study has been commissioned.',
          ],
          citationIds: ['h4b', 'h8'],
        },
        { kind: 'heading', text: 'Financial analysis' },
        {
          kind: 'paragraph',
          text:
            "FY25 audited revenue of €38.2M at a 71% EBITDA margin supports the model's base case, which implies an unlevered IRR of 8.4% over a 25-year hold.",
          citationIds: ['h6', 'h5'],
        },
        { kind: 'heading', text: 'Valuation' },
        {
          kind: 'paragraph',
          text:
            'At the proposed price, the transaction implies an entry multiple broadly in line with recent Iberian solar comparables, now that the Site 3 lease shortfall is resolved.',
          citationIds: ['h5'],
        },
        { kind: 'heading', text: 'Recommendation & next steps' },
        {
          kind: 'paragraph',
          text:
            'Proceed to signing. The land-lease item flagged in the previous draft is now closed; no other item is assessed as a blocker.',
          citationIds: ['h4b'],
        },
      ],
      citations: [
        HELIOS_CITATIONS.h1,
        HELIOS_CITATIONS.h2,
        HELIOS_CITATIONS.h3,
        HELIOS_CITATIONS.h4b,
        HELIOS_CITATIONS.h5,
        HELIOS_CITATIONS.h6,
        HELIOS_CITATIONS.h8,
      ],
    },
    {
      id: 'helios-rep-1',
      templateId: 'ic-memo',
      title: 'Project Helios — Investment Committee Memo',
      version: 1,
      status: 'draft',
      generatedAt: '2026-08-12T09:30:00.000Z',
      generatedBy: 'Elena Vidal (Associate)',
      sectionIds: ['transaction', 'rationale', 'keyIssues', 'financialAnalysis', 'icRecommendation'],
      sourceIds: ['doc-helios-spa', 'doc-helios-ppa', 'doc-helios-grid', 'doc-helios-land', 'doc-helios-fm', 'doc-helios-fy25'],
      body: [
        { kind: 'heading', text: 'Transaction overview' },
        {
          kind: 'paragraph',
          text:
            'Project Helios is the proposed acquisition of a 480 MWp utility-scale solar PV portfolio across four operating sites in Iberia, structured as a 100% share purchase of the holding company.',
          citationIds: ['h1'],
        },
        { kind: 'heading', text: 'Strategic rationale' },
        {
          kind: 'paragraph',
          text:
            'The portfolio offers contracted, CPI-linked revenue with a confirmed 480 MW grid capacity reservation, giving a de-risked entry into Iberian utility-scale solar.',
          citationIds: ['h2', 'h3'],
        },
        { kind: 'heading', text: 'Key issues & mitigants' },
        {
          kind: 'bullets',
          items: [
            "Site 3's land lease (11 years remaining) is shorter than the asset's 25-year design life — no mitigant in place yet.",
            'Two of four sites carry curtailment risk of up to 5% of annual generation under current connection terms.',
          ],
          citationIds: ['h4', 'h8'],
        },
        { kind: 'heading', text: 'Financial analysis' },
        {
          kind: 'paragraph',
          text:
            "FY25 audited revenue of €38.2M at a 71% EBITDA margin supports the model's base case, which implies an unlevered IRR of 8.4% over a 25-year hold.",
          citationIds: ['h6', 'h5'],
        },
        { kind: 'heading', text: 'Recommendation & next steps' },
        {
          kind: 'paragraph',
          text: "Proceed to exclusivity, subject to the seller resolving the Site 3 land-lease shortfall before signing.",
          citationIds: ['h4'],
        },
      ],
      citations: [
        HELIOS_CITATIONS.h1,
        HELIOS_CITATIONS.h2,
        HELIOS_CITATIONS.h3,
        HELIOS_CITATIONS.h4,
        HELIOS_CITATIONS.h5,
        HELIOS_CITATIONS.h6,
        HELIOS_CITATIONS.h8,
      ],
    },
  ],
  meridian: [],
  solstice: [
    {
      id: 'solstice-rep-1',
      templateId: 'ic-memo',
      title: 'Project Solstice — Investment Committee Memo (Final)',
      version: 1,
      status: 'final',
      generatedAt: '2026-06-28T10:00:00.000Z',
      generatedBy: 'Diego Ferrer (VP)',
      sectionIds: ['transaction', 'rationale', 'keyIssues', 'financialAnalysis', 'valuation', 'icRecommendation'],
      sourceIds: ['doc-solstice-pipeline', 'doc-solstice-site', 'doc-solstice-interconnect', 'doc-solstice-fm'],
      body: [
        { kind: 'heading', text: 'Transaction overview' },
        {
          kind: 'paragraph',
          text:
            "The proposed transaction was a full acquisition of the developer's early-stage battery storage (BESS) pipeline; this operation has since been closed without proceeding to an offer.",
          citationIds: ['s4'],
        },
        { kind: 'heading', text: 'Strategic rationale' },
        {
          kind: 'paragraph',
          text:
            "Entry into BESS development was strategically attractive, but the confirmed portion of the pipeline was too small to underwrite at the seller's ask.",
          citationIds: ['s2'],
        },
        { kind: 'heading', text: 'Key issues & mitigants' },
        {
          kind: 'bullets',
          items: [
            '6 of 10 pipeline sites do not hold a confirmed interconnection queue position, with no mitigant available within the deal timeline.',
            'Average queue position across the portfolio implies a 3–4 year lead time to energization.',
          ],
          citationIds: ['s1', 's3'],
        },
        { kind: 'heading', text: 'Financial analysis' },
        {
          kind: 'paragraph',
          text:
            "Valuing only the 4 confirmed sites materially narrows the pipeline versus the seller's presentation, producing a 22% valuation gap under the base case.",
          citationIds: ['s4', 's2'],
        },
        { kind: 'heading', text: 'Valuation' },
        {
          kind: 'paragraph',
          text:
            "The implied valuation gap of 22% versus the seller's ask exceeds the Committee's threshold for an early-stage platform of this profile.",
          citationIds: ['s4'],
        },
        { kind: 'heading', text: 'Recommendation & next steps' },
        {
          kind: 'paragraph',
          text:
            "The Committee's decision was not to proceed. The confirmed portion of the pipeline does not support the seller's ask, and the operation was closed on that basis. No further action is planned unless the seller re-approaches with a materially reduced ask.",
          citationIds: ['s4'],
        },
      ],
      citations: [SOLSTICE_CITATIONS.s1, SOLSTICE_CITATIONS.s2, SOLSTICE_CITATIONS.s3, SOLSTICE_CITATIONS.s4],
    },
  ],
}
