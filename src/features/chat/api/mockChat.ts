import type { Citation } from '@/shared/types/domain'
import type { ChatConversation, ChatSourceDocument } from '../types'

/**
 * Mock de Chat + historial (guion §5.1), keyed por los mismos ids de
 * `features/operations` ('helios' | 'meridian' | 'solstice'). Helios es la
 * operacion mas rica en contenido (mas conversaciones, mas fuentes), Solstice
 * la mas ligera y cerrada — misma nota de siembra que `agent-config`.
 *
 * Todo el contenido conversacional esta en ingles (requisito RFP: la demo se
 * ensena en ingles), aunque el chrome de la pantalla es bilingue via i18n.
 */

// ---------------------------------------------------------------------------
// Documentos fuente por operacion (columna derecha)
// ---------------------------------------------------------------------------

export const MOCK_SOURCE_DOCUMENTS: Record<string, ChatSourceDocument[]> = {
  helios: [
    {
      id: 'doc-helios-eia-07',
      documentId: 'doc-helios-eia-07',
      name: 'Environmental Impact Assessment — Site 07',
      category: 'ESG',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-land-12',
      documentId: 'doc-helios-land-12',
      name: 'Land Lease Agreement — Site 12 (Extremadura)',
      category: 'Legal',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-grid-conn',
      documentId: 'doc-helios-grid-conn',
      name: 'Grid Connection Permit — REE',
      category: 'Technical',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-ppa-01',
      documentId: 'doc-helios-ppa-01',
      name: 'Power Purchase Agreement — Portfolio Co.',
      category: 'Commercial',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-fin-model',
      documentId: 'doc-helios-fin-model',
      name: 'Financial Model v4.2',
      category: 'Financial',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-corp-structure',
      documentId: 'doc-helios-corp-structure',
      name: 'Corporate Structure Memo',
      category: 'Legal',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-insurance',
      documentId: 'doc-helios-insurance',
      name: 'All-risk Construction Insurance Policy',
      category: 'Insurance',
      includedByDefault: false,
    },
    {
      id: 'doc-helios-tax',
      documentId: 'doc-helios-tax',
      name: 'Tax Due Diligence Report — Draft',
      category: 'Fiscal',
      includedByDefault: false,
    },
    {
      id: 'doc-helios-labor',
      documentId: 'doc-helios-labor',
      name: 'Employment Agreements Summary',
      category: 'Labor',
      includedByDefault: true,
    },
    {
      id: 'doc-helios-om-software',
      documentId: 'doc-helios-om-software',
      name: 'O&M Software License Agreement',
      category: 'IP',
      includedByDefault: false,
    },
  ],
  meridian: [
    {
      id: 'doc-meridian-om',
      documentId: 'doc-meridian-om',
      name: 'O&M Agreement — Turbine Supplier',
      category: 'Technical',
      includedByDefault: true,
    },
    {
      id: 'doc-meridian-ppa',
      documentId: 'doc-meridian-ppa',
      name: 'Power Purchase Agreement — Utility X',
      category: 'Commercial',
      includedByDefault: true,
    },
    {
      id: 'doc-meridian-warranty',
      documentId: 'doc-meridian-warranty',
      name: 'Turbine Warranty Schedule',
      category: 'Technical',
      includedByDefault: true,
    },
    {
      id: 'doc-meridian-land',
      documentId: 'doc-meridian-land',
      name: 'Land Easement Register',
      category: 'Legal',
      includedByDefault: true,
    },
    {
      id: 'doc-meridian-fin-model',
      documentId: 'doc-meridian-fin-model',
      name: 'Financial Model v2.1',
      category: 'Financial',
      includedByDefault: true,
    },
    {
      id: 'doc-meridian-env',
      documentId: 'doc-meridian-env',
      name: 'Environmental Permit — Asset 4',
      category: 'ESG',
      includedByDefault: false,
    },
  ],
  solstice: [
    {
      id: 'doc-solstice-pipeline',
      documentId: 'doc-solstice-pipeline',
      name: 'Development Pipeline Register',
      category: 'Commercial',
      includedByDefault: true,
    },
    {
      id: 'doc-solstice-interconnection',
      documentId: 'doc-solstice-interconnection',
      name: 'Interconnection Queue Position Letters',
      category: 'Technical',
      includedByDefault: true,
    },
    {
      id: 'doc-solstice-corp',
      documentId: 'doc-solstice-corp',
      name: 'Corporate Structure Summary',
      category: 'Legal',
      includedByDefault: true,
    },
    {
      id: 'doc-solstice-fin-model',
      documentId: 'doc-solstice-fin-model',
      name: 'Early-stage Financial Model',
      category: 'Financial',
      includedByDefault: false,
    },
  ],
}

// ---------------------------------------------------------------------------
// Sugerencias de arranque (guion §5.1: "especificas de M&A")
// ---------------------------------------------------------------------------

export const MOCK_SUGGESTIONS: Record<string, string[]> = {
  helios: [
    'What are the key risks in this operation?',
    'Summarize the grid connection status across all sites.',
    'Does the PPA pricing match the financial model assumptions?',
    'What land tenure issues should I be aware of?',
    'List any environmental permits close to expiry.',
  ],
  meridian: [
    'What are the key risks in this operation?',
    'Summarize O&M availability guarantees across assets.',
    'Which turbines are outside their warranty period?',
    'What land rights are in place for each site?',
  ],
  solstice: [
    'What are the key risks in this operation?',
    'Summarize the development pipeline stage by project.',
    'What is the interconnection queue status?',
  ],
}

// ---------------------------------------------------------------------------
// Historial de conversaciones previas (columna izquierda + hilo central)
// ---------------------------------------------------------------------------

export const MOCK_CONVERSATIONS: Record<string, ChatConversation[]> = {
  helios: [
    {
      id: 'conv-helios-1',
      title: 'Key risks across the Helios portfolio',
      updatedAt: '2026-08-26T09:12:00.000Z',
      messages: [
        {
          id: 'msg-helios-1-1',
          role: 'user',
          content: 'What are the key risks in this operation?',
          createdAt: '2026-08-26T09:08:00.000Z',
        },
        {
          id: 'msg-helios-1-2',
          role: 'agent',
          content:
            'Three risks stand out across the portfolio. First, the Site 12 land lease runs shorter ' +
            'than the asset\'s remaining useful life, which needs a renewal clause before signing. ' +
            'Second, the Site 07 environmental approval carries conditions that expire ahead of ' +
            'commissioning. Third, the PPA price escalation for the portfolio company does not fully ' +
            'reconcile with the revenue assumptions in the financial model.',
          createdAt: '2026-08-26T09:09:10.000Z',
          citations: [
            {
              id: 'cit-helios-1-1',
              documentId: 'doc-helios-land-12',
              documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
              locator: 'clause 4.3',
              snippet: 'Initial term of 22 years from the commercial operation date, renewable by mutual agreement.',
            },
            {
              id: 'cit-helios-1-2',
              documentId: 'doc-helios-eia-07',
              documentName: 'Environmental Impact Assessment — Site 07',
              locator: 'condition 6, p. 9',
              snippet: 'Condition 6 (biodiversity monitoring) must be renewed 12 months before commissioning.',
            },
            {
              id: 'cit-helios-1-3',
              documentId: 'doc-helios-ppa-01',
              documentName: 'Power Purchase Agreement — Portfolio Co.',
              locator: 'Schedule 2, p. 14',
              snippet: 'Annual price escalation fixed at 1.5%, compounding from year 3.',
            },
          ],
        },
        {
          id: 'msg-helios-1-3',
          role: 'user',
          content: 'Tell me more about the land lease issue on Site 12.',
          createdAt: '2026-08-26T09:10:40.000Z',
        },
        {
          id: 'msg-helios-1-4',
          role: 'agent',
          content:
            'The Site 12 lease has an initial term of 22 years from commercial operation, renewable only ' +
            'by mutual agreement with the landowner — there is no unilateral extension option for the ' +
            'buyer. The asset\'s technical useful life is modelled at 30 years, so there is an 8-year gap ' +
            'that depends on a renegotiation with a third party. I would flag this as a Key Issue rather ' +
            'than a note, given it affects terminal value.',
          createdAt: '2026-08-26T09:11:35.000Z',
          citations: [
            {
              id: 'cit-helios-1-4',
              documentId: 'doc-helios-land-12',
              documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
              locator: 'clause 4.3, Annex A',
              snippet: 'No unilateral extension right is granted to the lessee under this agreement.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-helios-2',
      title: 'Grid connection status by site',
      updatedAt: '2026-08-25T17:40:00.000Z',
      messages: [
        {
          id: 'msg-helios-2-1',
          role: 'user',
          content: 'Summarize the grid connection status across all sites.',
          createdAt: '2026-08-25T17:36:00.000Z',
        },
        {
          id: 'msg-helios-2-2',
          role: 'agent',
          content:
            'REE has granted firm connection permits for 11 of the 12 sites in the portfolio. Site 09 ' +
            'still holds a provisional capacity reservation pending a network reinforcement study. Two ' +
            'sites (04 and 08) carry curtailment terms in their access agreements that are worth flagging ' +
            'to the commercial team.',
          createdAt: '2026-08-25T17:37:20.000Z',
          citations: [
            {
              id: 'cit-helios-2-1',
              documentId: 'doc-helios-grid-conn',
              documentName: 'Grid Connection Permit — REE',
              locator: 'Annex 3, p. 22',
              snippet: 'Site 09: capacity reservation classified as provisional, subject to reinforcement study RS-2026-114.',
            },
          ],
        },
        {
          id: 'msg-helios-2-3',
          role: 'user',
          content: 'Any curtailment terms we should flag?',
          createdAt: '2026-08-25T17:38:50.000Z',
        },
        {
          id: 'msg-helios-2-4',
          role: 'agent',
          content:
            'Yes — the access agreements for Sites 04 and 08 allow the DSO to curtail output up to 5% of ' +
            'annual expected generation without compensation. That is within typical market range for this ' +
            'region, but it should be reflected explicitly in the financial model\'s downside case if it ' +
            'is not already.',
          createdAt: '2026-08-25T17:39:45.000Z',
          citations: [
            {
              id: 'cit-helios-2-3',
              documentId: 'doc-helios-grid-conn',
              documentName: 'Grid Connection Permit — REE',
              locator: 'clause 7.2',
              snippet: 'Curtailment without compensation is capped at 5% of P50 annual generation.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-helios-3',
      title: 'PPA price vs financial model',
      updatedAt: '2026-08-24T11:05:00.000Z',
      messages: [
        {
          id: 'msg-helios-3-1',
          role: 'user',
          content: 'Does the PPA pricing match the financial model assumptions?',
          createdAt: '2026-08-24T11:02:00.000Z',
        },
        {
          id: 'msg-helios-3-2',
          role: 'agent',
          content:
            'Not exactly. The PPA fixes annual price escalation at 1.5% from year 3, while the revenue tab ' +
            'of the financial model assumes 2.1% from year 1. The gap is above the 2% materiality threshold ' +
            'used for this type of cross-check, so it should be corrected in the model or explained if it ' +
            'is intentional (e.g. a separate merchant tail assumption).',
          createdAt: '2026-08-24T11:03:15.000Z',
          citations: [
            {
              id: 'cit-helios-3-1',
              documentId: 'doc-helios-ppa-01',
              documentName: 'Power Purchase Agreement — Portfolio Co.',
              locator: 'Schedule 2, p. 14',
              snippet: 'Annual price escalation fixed at 1.5%, compounding from year 3.',
            },
            {
              id: 'cit-helios-3-2',
              documentId: 'doc-helios-fin-model',
              documentName: 'Financial Model v4.2',
              locator: "tab 'Revenue', cell C22",
              snippet: 'Escalation assumption: 2.1% p.a., applied from COD.',
            },
          ],
        },
        {
          id: 'msg-helios-3-3',
          role: 'user',
          content: 'What about contracted volume?',
          createdAt: '2026-08-24T11:04:20.000Z',
        },
        {
          id: 'msg-helios-3-4',
          role: 'agent',
          content:
            'Contracted volume is consistent — the PPA covers 85% of P50 expected generation and the ' +
            'model\'s merchant/contracted split matches that figure within rounding. No finding there.',
          createdAt: '2026-08-24T11:04:55.000Z',
          citations: [
            {
              id: 'cit-helios-3-3',
              documentId: 'doc-helios-ppa-01',
              documentName: 'Power Purchase Agreement — Portfolio Co.',
              locator: 'clause 5.1',
              snippet: 'Contracted volume: 85% of P50 estimated annual output.',
            },
            {
              id: 'cit-helios-3-4',
              documentId: 'doc-helios-fin-model',
              documentName: 'Financial Model v4.2',
              locator: "tab 'Revenue', cell D22",
              snippet: 'Contracted share: 85%.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-helios-4',
      title: 'Employment liabilities on Site 07',
      updatedAt: '2026-08-18T10:00:00.000Z',
      messages: [
        {
          id: 'msg-helios-4-1',
          role: 'user',
          content: 'What employment liabilities exist for the Site 07 team?',
          createdAt: '2026-08-18T09:58:00.000Z',
        },
        {
          id: 'msg-helios-4-2',
          role: 'agent',
          content:
            'The site has 4 direct employees under standard indefinite contracts with 30-day notice ' +
            'periods, no unusual severance terms. I don\'t have enough indexed documentation to confirm ' +
            'whether there is any pending or threatened litigation involving this team — the labor summary ' +
            'does not cover that. I would suggest requesting a litigation disclosure letter from the seller ' +
            'before closing.',
          createdAt: '2026-08-18T09:59:30.000Z',
          citations: [
            {
              id: 'cit-helios-4-1',
              documentId: 'doc-helios-labor',
              documentName: 'Employment Agreements Summary',
              locator: 'Annex B, p. 3',
              snippet: 'Site 07 headcount: 4 FTE, indefinite contracts, 30-day notice period.',
            },
          ],
        },
      ],
    },
  ],
  meridian: [
    {
      id: 'conv-meridian-1',
      title: 'O&M availability guarantees',
      updatedAt: '2026-08-21T09:05:00.000Z',
      messages: [
        {
          id: 'msg-meridian-1-1',
          role: 'user',
          content: 'Summarize O&M availability guarantees across assets.',
          createdAt: '2026-08-21T09:01:00.000Z',
        },
        {
          id: 'msg-meridian-1-2',
          role: 'agent',
          content:
            'Five of the six operating assets carry a 97% time-based availability guarantee with the ' +
            'turbine supplier, backed by a liquidated-damages mechanism. Asset 4 is the exception — its ' +
            'guarantee sits at 94%, below the 95% threshold usually considered acceptable for this asset ' +
            'class.',
          createdAt: '2026-08-21T09:02:10.000Z',
          citations: [
            {
              id: 'cit-meridian-1-1',
              documentId: 'doc-meridian-om',
              documentName: 'O&M Agreement — Turbine Supplier',
              locator: 'clause 3.2, p. 4',
              snippet: 'Availability guarantee: 97%, except Asset 4 at 94% per Schedule 1.',
            },
          ],
        },
        {
          id: 'msg-meridian-1-3',
          role: 'user',
          content: 'Which asset is below the 95% threshold?',
          createdAt: '2026-08-21T09:03:00.000Z',
        },
        {
          id: 'msg-meridian-1-4',
          role: 'agent',
          content:
            'Asset 4. I\'d recommend adding this as a Key Issue — a below-threshold guarantee usually means ' +
            'either a weaker penalty mechanism or a turbine with a known technical issue behind it, and the ' +
            'agreement does not explain which.',
          createdAt: '2026-08-21T09:03:40.000Z',
          citations: [
            {
              id: 'cit-meridian-1-3',
              documentId: 'doc-meridian-om',
              documentName: 'O&M Agreement — Turbine Supplier',
              locator: 'Schedule 1',
              snippet: 'Asset 4: guaranteed availability 94%, penalty cap 8% of annual O&M fee.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-meridian-2',
      title: 'Turbine warranty gaps by asset',
      updatedAt: '2026-08-19T14:00:00.000Z',
      messages: [
        {
          id: 'msg-meridian-2-1',
          role: 'user',
          content: 'Which turbines are outside their warranty period?',
          createdAt: '2026-08-19T13:57:00.000Z',
        },
        {
          id: 'msg-meridian-2-2',
          role: 'agent',
          content:
            'Turbines at Asset 2 and Asset 5 are past their standard 2-year manufacturer warranty based on ' +
            'commissioning dates. I don\'t see an extended-warranty or full-service contract indexed for ' +
            'either asset, so this reads as a genuine coverage gap rather than something covered elsewhere ' +
            '— worth confirming directly with the seller.',
          createdAt: '2026-08-19T13:58:20.000Z',
          citations: [
            {
              id: 'cit-meridian-2-1',
              documentId: 'doc-meridian-warranty',
              documentName: 'Turbine Warranty Schedule',
              locator: 'p. 2',
              snippet: 'Asset 2 COD: 2023-11; Asset 5 COD: 2024-02. Standard warranty term: 24 months.',
            },
          ],
        },
      ],
    },
  ],
  solstice: [
    {
      id: 'conv-solstice-1',
      title: 'Pipeline valuation basis',
      updatedAt: '2026-06-30T11:40:00.000Z',
      messages: [
        {
          id: 'msg-solstice-1-1',
          role: 'user',
          content: 'Summarize the development pipeline stage by project.',
          createdAt: '2026-06-30T11:36:00.000Z',
        },
        {
          id: 'msg-solstice-1-2',
          role: 'agent',
          content:
            'The pipeline register lists 4 early-stage BESS projects. Three have confirmed site control and ' +
            'an active permitting file; the fourth (Project D) has site control but no confirmed ' +
            'interconnection queue position in the documentation I have indexed. Per the seeded valuation ' +
            'checklist for pre-construction assets, an item without a queue position should not be counted ' +
            'as a valued asset yet — I\'d suggest treating it as a gap rather than pipeline value until the ' +
            'utility confirms it.',
          createdAt: '2026-06-30T11:37:30.000Z',
          citations: [
            {
              id: 'cit-solstice-1-1',
              documentId: 'doc-solstice-pipeline',
              documentName: 'Development Pipeline Register',
              locator: 'p. 6',
              snippet: 'Project D: site control secured 2026-02; interconnection queue position: pending confirmation.',
            },
          ],
        },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Banco de respuestas (para preguntas libres / sugerencias no historicas):
// coincidencia simple por palabra clave, no es un LLM real.
// ---------------------------------------------------------------------------

interface QaEntry {
  keywords: string[]
  content: string
  citations: Citation[]
}

const MOCK_QA: Record<string, QaEntry[]> = {
  helios: [
    {
      keywords: ['key risk', 'main risk'],
      content:
        'Three risks stand out across the portfolio: the Site 12 land lease running shorter than the ' +
        'asset\'s useful life, the Site 07 environmental approval conditions expiring before ' +
        'commissioning, and a PPA price escalation that does not fully reconcile with the financial ' +
        'model\'s revenue assumptions.',
      citations: [
        {
          id: 'cit-helios-qa-risk-1',
          documentId: 'doc-helios-land-12',
          documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
          locator: 'clause 4.3',
          snippet: 'Initial term of 22 years from the commercial operation date, renewable by mutual agreement.',
        },
        {
          id: 'cit-helios-qa-risk-2',
          documentId: 'doc-helios-eia-07',
          documentName: 'Environmental Impact Assessment — Site 07',
          locator: 'condition 6, p. 9',
          snippet: 'Condition 6 (biodiversity monitoring) must be renewed 12 months before commissioning.',
        },
      ],
    },
    {
      keywords: ['grid connection', 'connection status'],
      content:
        'REE has granted firm connection permits for 11 of the 12 sites. Site 09 still holds a provisional ' +
        'capacity reservation pending a network reinforcement study, and Sites 04 and 08 carry curtailment ' +
        'terms worth flagging to the commercial team.',
      citations: [
        {
          id: 'cit-helios-qa-grid-1',
          documentId: 'doc-helios-grid-conn',
          documentName: 'Grid Connection Permit — REE',
          locator: 'Annex 3, p. 22',
          snippet: 'Site 09: capacity reservation classified as provisional, subject to reinforcement study RS-2026-114.',
        },
      ],
    },
    {
      keywords: ['ppa pricing', 'pricing match', 'financial model assumptions', 'ppa price'],
      content:
        'Not exactly — the PPA fixes annual price escalation at 1.5% from year 3, while the financial ' +
        'model\'s revenue tab assumes 2.1% from year 1. That gap is above the 2% materiality threshold used ' +
        'for this cross-check and should be reconciled or explained.',
      citations: [
        {
          id: 'cit-helios-qa-ppa-1',
          documentId: 'doc-helios-ppa-01',
          documentName: 'Power Purchase Agreement — Portfolio Co.',
          locator: 'Schedule 2, p. 14',
          snippet: 'Annual price escalation fixed at 1.5%, compounding from year 3.',
        },
        {
          id: 'cit-helios-qa-ppa-2',
          documentId: 'doc-helios-fin-model',
          documentName: 'Financial Model v4.2',
          locator: "tab 'Revenue', cell C22",
          snippet: 'Escalation assumption: 2.1% p.a., applied from COD.',
        },
      ],
    },
    {
      keywords: ['land tenure', 'land right', 'land issue'],
      content:
        'Land tenure is confirmed by a registered lease or ownership title for 11 of the 12 sites. Site ' +
        '12 is the exception: its lease term is shorter than the asset\'s remaining useful life and has no ' +
        'unilateral extension right for the buyer — I\'d treat that as a Key Issue rather than a note.',
      citations: [
        {
          id: 'cit-helios-qa-land-1',
          documentId: 'doc-helios-land-12',
          documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
          locator: 'clause 4.3, Annex A',
          snippet: 'No unilateral extension right is granted to the lessee under this agreement.',
        },
      ],
    },
    {
      keywords: ['environmental permit', 'permits close to expiry', 'environmental'],
      content:
        'Most environmental approvals are current. The one to watch is Site 07: condition 6 of its impact ' +
        'assessment (biodiversity monitoring) must be renewed 12 months before commissioning, and that ' +
        'window is approaching.',
      citations: [
        {
          id: 'cit-helios-qa-env-1',
          documentId: 'doc-helios-eia-07',
          documentName: 'Environmental Impact Assessment — Site 07',
          locator: 'condition 6, p. 9',
          snippet: 'Condition 6 (biodiversity monitoring) must be renewed 12 months before commissioning.',
        },
      ],
    },
    {
      keywords: ['employment', 'labor', 'workforce liabilit'],
      content:
        'Site 07 has 4 direct employees under standard indefinite contracts with 30-day notice periods. I ' +
        'don\'t have enough indexed documentation to confirm pending or threatened litigation for this team ' +
        '— I\'d suggest requesting a litigation disclosure letter from the seller before closing.',
      citations: [
        {
          id: 'cit-helios-qa-labor-1',
          documentId: 'doc-helios-labor',
          documentName: 'Employment Agreements Summary',
          locator: 'Annex B, p. 3',
          snippet: 'Site 07 headcount: 4 FTE, indefinite contracts, 30-day notice period.',
        },
      ],
    },
  ],
  meridian: [
    {
      keywords: ['key risk', 'main risk'],
      content:
        'Top risks right now: Asset 4\'s O&M availability guarantee sits below the usual 95% threshold, ' +
        'and turbines at Asset 2 and Asset 5 are outside their manufacturer warranty with no extended ' +
        'coverage indexed.',
      citations: [
        {
          id: 'cit-meridian-qa-risk-1',
          documentId: 'doc-meridian-om',
          documentName: 'O&M Agreement — Turbine Supplier',
          locator: 'Schedule 1',
          snippet: 'Asset 4: guaranteed availability 94%, penalty cap 8% of annual O&M fee.',
        },
        {
          id: 'cit-meridian-qa-risk-2',
          documentId: 'doc-meridian-warranty',
          documentName: 'Turbine Warranty Schedule',
          locator: 'p. 2',
          snippet: 'Asset 2 COD: 2023-11; Asset 5 COD: 2024-02. Standard warranty term: 24 months.',
        },
      ],
    },
    {
      keywords: ['availability guarantee', 'o&m availability'],
      content:
        'Five of six assets carry a 97% time-based availability guarantee. Asset 4 is the exception at ' +
        '94%, below the 95% threshold usually considered acceptable for this asset class.',
      citations: [
        {
          id: 'cit-meridian-qa-avail-1',
          documentId: 'doc-meridian-om',
          documentName: 'O&M Agreement — Turbine Supplier',
          locator: 'clause 3.2, p. 4',
          snippet: 'Availability guarantee: 97%, except Asset 4 at 94% per Schedule 1.',
        },
      ],
    },
    {
      keywords: ['warranty'],
      content:
        'Turbines at Asset 2 and Asset 5 are past their standard 24-month manufacturer warranty and I ' +
        'don\'t see an extended-warranty or full-service contract indexed for either — a genuine coverage ' +
        'gap worth confirming with the seller.',
      citations: [
        {
          id: 'cit-meridian-qa-warranty-1',
          documentId: 'doc-meridian-warranty',
          documentName: 'Turbine Warranty Schedule',
          locator: 'p. 2',
          snippet: 'Asset 2 COD: 2023-11; Asset 5 COD: 2024-02. Standard warranty term: 24 months.',
        },
      ],
    },
    {
      keywords: ['land right', 'land easement'],
      content:
        'Easements are registered for all six sites. One easement (Asset 3) is missing the landowner\'s ' +
        'countersignature on the latest amendment — administrative rather than substantive, but worth ' +
        'chasing before signing.',
      citations: [
        {
          id: 'cit-meridian-qa-land-1',
          documentId: 'doc-meridian-land',
          documentName: 'Land Easement Register',
          locator: 'entry 3',
          snippet: 'Amendment countersignature: pending landowner execution.',
        },
      ],
    },
  ],
  solstice: [
    {
      keywords: ['key risk', 'main risk'],
      content:
        'For a pre-construction pipeline the main risk is stage confirmation: Project D has site control ' +
        'but no confirmed interconnection queue position in the indexed documentation, so it should not be ' +
        'counted as valued pipeline yet.',
      citations: [
        {
          id: 'cit-solstice-qa-risk-1',
          documentId: 'doc-solstice-pipeline',
          documentName: 'Development Pipeline Register',
          locator: 'p. 6',
          snippet: 'Project D: site control secured 2026-02; interconnection queue position: pending confirmation.',
        },
      ],
    },
    {
      keywords: ['development pipeline', 'pipeline stage', 'pipeline'],
      content:
        'The register lists 4 early-stage BESS projects. Three have confirmed site control and an active ' +
        'permitting file; Project D has site control but no confirmed interconnection queue position yet.',
      citations: [
        {
          id: 'cit-solstice-qa-pipeline-1',
          documentId: 'doc-solstice-pipeline',
          documentName: 'Development Pipeline Register',
          locator: 'p. 6',
          snippet: 'Project D: site control secured 2026-02; interconnection queue position: pending confirmation.',
        },
      ],
    },
    {
      keywords: ['interconnection', 'queue'],
      content:
        'Three projects hold a confirmed interconnection queue position letter from the utility. Project D ' +
        'does not — that is the one open item I\'d flag before treating the full pipeline as valued.',
      citations: [
        {
          id: 'cit-solstice-qa-queue-1',
          documentId: 'doc-solstice-interconnection',
          documentName: 'Interconnection Queue Position Letters',
          locator: 'summary, p. 1',
          snippet: '3 of 4 projects hold an executed queue position letter as of the last portfolio update.',
        },
      ],
    },
  ],
}

const FALLBACK_ANSWERS: Record<string, string> = {
  helios:
    'I couldn\'t find a direct match for that in the documentation indexed for Project Helios. Try asking ' +
    'about grid connection, land tenure, the PPA vs. the financial model, or employment liabilities — or ' +
    'rephrase the question.',
  meridian:
    'I couldn\'t find a direct match for that in the documentation indexed for Project Meridian. Try ' +
    'asking about O&M availability guarantees, turbine warranties, or land rights — or rephrase the ' +
    'question.',
  solstice:
    'Project Solstice is closed and only has a small set of indexed documents. I don\'t have grounded ' +
    'information to answer that — try asking about the development pipeline or the interconnection queue ' +
    'status, or request the missing documentation.',
}

const DEFAULT_FALLBACK =
  'I don\'t have enough indexed documentation to answer that for this operation. Consider requesting the ' +
  'missing document rather than guessing.'

/**
 * Simula la respuesta del agente (guion §5.1): coincidencia simple por
 * palabra clave contra `MOCK_QA`, sin streaming ni LLM real. Si no hay
 * coincidencia, cae a una respuesta que declara explicitamente la falta de
 * informacion — mismo principio que el prompt por defecto del agente de chat
 * (`features/agent-config`): nunca inventar.
 */
export function matchReply(opId: string, question: string): { content: string; citations: Citation[] } {
  const bank = MOCK_QA[opId] ?? []
  const q = question.toLowerCase()
  const hit = bank.find((entry) => entry.keywords.some((keyword) => q.includes(keyword)))
  if (hit) return { content: hit.content, citations: hit.citations }
  return { content: FALLBACK_ANSWERS[opId] ?? DEFAULT_FALLBACK, citations: [] }
}
