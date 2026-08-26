import type { AgentConfig, AgentId, Skill } from '../types'

// Chips de solo lectura compartidos por varios agentes: "gestionado por la
// plataforma" (guion §1.4) — tools y middleware quedan en config de backend,
// aqui son decorado creible y no editable, igual en las 3 operaciones.
const COMMON_TOOLS = ['SharePoint search', 'Citation linker', 'Document retrieval']
const COMMON_MIDDLEWARE = ['Mandatory citation', 'Human validation gate', 'PII filter']

const CHAT_PROMPT =
  'You are the M&A deal assistant for this operation. Answer only from the documents ' +
  'indexed for this operation — never from outside knowledge or other operations. Every ' +
  'factual claim must carry an inline citation to its source document and locator. If the ' +
  'available documentation does not answer the question, say so explicitly and suggest ' +
  'requesting the missing document rather than guessing.'

const SUMMARY_OVERVIEW_PROMPT =
  'Build a structured snapshot of the operation: perimeter, parties, milestones, status ' +
  'and key issues. Every field must cite its source. Where the documentation does not ' +
  'give enough information for a field, do not infer or fabricate — flag it as ' +
  'insufficient and propose requesting human input or the missing document. This same ' +
  'agent (with the same prompt) also separates documented facts from your own inferences ' +
  'and open hypotheses on the Facts vs Conclusions screen.'

const KEY_ISSUES_PROMPT =
  'Draft and maintain the Key Issue List for this operation: risk, evidence, impact, ' +
  'owner, mitigation, status. Ground every row in cited evidence. Prefer fewer, ' +
  'well-evidenced issues over speculative ones — an issue without evidence belongs on the ' +
  'Facts vs Conclusions screen as a hypothesis, not here.'

const FINANCIAL_AUDIT_PROMPT =
  'Audit the financial model for consistency only — you operate on a working copy and must ' +
  'never suggest edits to the original file. Flag broken formulas, external links, ' +
  'hardcoded values, circularities, and inconsistencies between tabs or between inputs and ' +
  'outputs. Reference the exact sheet and cell for every finding, with a severity rating.'

const REPORTS_PROMPT =
  'Draft executive materials from the selected template, sections and sources. Every claim ' +
  'in the draft must trace back to a cited source or to an approved item from the Key Issue ' +
  'List or the operation summary — never introduce a fact that is not already established ' +
  'elsewhere in the operation.'

/**
 * Los 5 agentes configurables (guion §6), con su prompt por defecto. Iguales
 * en las 3 operaciones — lo que varia por operacion es el prompt EDITADO (si
 * lo hay) y el pool de Skills, que gestiona `agentConfigStore`.
 */
export const DEFAULT_AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  chat: {
    id: 'chat',
    agentName: 'General Query Agent',
    model: 'GPT-4o mini · Azure OpenAI Foundry',
    tools: COMMON_TOOLS,
    middleware: COMMON_MIDDLEWARE,
    prompt: CHAT_PROMPT,
    defaultPrompt: CHAT_PROMPT,
  },
  'summary-overview': {
    id: 'summary-overview',
    agentName: 'Operation Analysis Agent',
    model: 'GPT-4o · Azure OpenAI Foundry',
    tools: [...COMMON_TOOLS, 'Structured extraction'],
    middleware: COMMON_MIDDLEWARE,
    prompt: SUMMARY_OVERVIEW_PROMPT,
    defaultPrompt: SUMMARY_OVERVIEW_PROMPT,
  },
  'key-issues': {
    id: 'key-issues',
    agentName: 'Key Issue List Agent',
    model: 'GPT-4o · Azure OpenAI Foundry',
    tools: [...COMMON_TOOLS, 'Risk taxonomy lookup'],
    middleware: COMMON_MIDDLEWARE,
    prompt: KEY_ISSUES_PROMPT,
    defaultPrompt: KEY_ISSUES_PROMPT,
  },
  'financial-audit': {
    id: 'financial-audit',
    agentName: 'Consistency Audit Agent',
    model: 'GPT-4o · Azure OpenAI Foundry (deep reasoning)',
    tools: ['Spreadsheet parser', 'Formula graph analysis', 'Cross-tab consistency check'],
    middleware: [...COMMON_MIDDLEWARE, 'Read-only source lock'],
    prompt: FINANCIAL_AUDIT_PROMPT,
    defaultPrompt: FINANCIAL_AUDIT_PROMPT,
  },
  reports: {
    id: 'reports',
    agentName: 'Report Drafting Agent',
    model: 'GPT-4o · Azure OpenAI Foundry',
    tools: [...COMMON_TOOLS, 'Template composer'],
    middleware: COMMON_MIDDLEWARE,
    prompt: REPORTS_PROMPT,
    defaultPrompt: REPORTS_PROMPT,
  },
}

/** Clona los 5 configs por defecto, lista para vivir en el store de una
 * operación concreta y poder editarse sin afectar a las demás operaciones. */
export function cloneDefaultConfigs(): Record<AgentId, AgentConfig> {
  const entries = Object.values(DEFAULT_AGENT_CONFIGS).map((c) => [c.id, { ...c }])
  return Object.fromEntries(entries) as Record<AgentId, AgentConfig>
}

/**
 * Skills por operación (guion §5.2.2): distintas entre sí a propósito, para
 * que se note en la demo que Conocimiento base también está segregado por
 * carpeta — la operación cerrada (Solstice) tiene menos, porque llevaba menos
 * tiempo activa cuando se congeló.
 */
export const MOCK_SKILLS: Record<string, Skill[]> = {
  helios: [
    {
      id: 'sk-helios-1',
      title: 'How to build a Key Issue List',
      description: 'Procedure for turning a documented risk into a KIL row.',
      procedure:
        'For every candidate risk: (1) confirm it is grounded in at least one cited document, ' +
        '(2) classify impact as Low/Medium/High/Critical based on contractual or financial ' +
        'exposure, (3) propose a named responsible party from the deal team roster, (4) draft a ' +
        'mitigation only if the documentation suggests one — otherwise leave it open, (5) set ' +
        'status to "Open" by default; never mark an issue "Mitigated" without an explicit ' +
        'approval action.',
    },
    {
      id: 'sk-helios-2',
      title: 'Detecting version contradictions',
      description: 'How to flag when two documents disagree.',
      procedure:
        'When two documents cover the same clause, figure or milestone with different values, ' +
        'check document version and upload date first — a contradiction is only "resolved" if ' +
        'a newer, clearly superseding version exists. Otherwise raise it as an open gap with ' +
        'both documents linked, never pick one silently.',
    },
    {
      id: 'sk-helios-3',
      title: 'Solar PV grid connection checklist',
      description: 'What "grid connection documentation" should contain for a PV portfolio.',
      procedure:
        'A complete grid connection file includes: connection permit, capacity reservation, ' +
        'access agreement with the DSO/TSO, curtailment terms, and the latest technical ' +
        'compliance report. Missing any of these for an asset is a documentation gap, not a ' +
        'technical finding.',
    },
    {
      id: 'sk-helios-4',
      title: 'Land rights due diligence',
      description: 'Minimum evidence for land tenure on a PV asset.',
      procedure:
        'Confirm lease or ownership title, registered easements, and any pending litigation ' +
        'search for each site. Flag any lease with less remaining term than the asset\'s ' +
        'remaining useful life as a key issue, not just a note.',
    },
    {
      id: 'sk-helios-5',
      title: 'PPA revenue consistency',
      description: 'Cross-checking a Power Purchase Agreement against the financial model.',
      procedure:
        'Compare contracted price, volume, escalation and term in the PPA against the revenue ' +
        'assumptions in the financial model. A mismatch above 2% on price or volume is a ' +
        'financial model finding, referenced to both the PPA clause and the model cell.',
    },
    {
      id: 'sk-helios-6',
      title: 'Environmental permit completeness',
      description: 'What counts as a complete environmental permitting file.',
      procedure:
        'Environmental impact assessment, its approval resolution, and any conditions attached ' +
        'must all be present and unexpired. An approval with expired conditions is treated as ' +
        'incomplete, not as satisfied.',
    },
  ],
  meridian: [
    {
      id: 'sk-meridian-1',
      title: 'How to build a Key Issue List',
      description: 'Procedure for turning a documented risk into a KIL row.',
      procedure:
        'For every candidate risk: confirm grounding in a cited document, classify impact, ' +
        'propose a responsible party, and default status to "Open". Do not mitigate or escalate ' +
        'without an explicit human action recorded on the issue.',
    },
    {
      id: 'sk-meridian-2',
      title: 'Onshore wind O&M contract review',
      description: 'What to check in an operations & maintenance agreement.',
      procedure:
        'Confirm availability guarantee, penalty mechanism, contract term versus remaining ' +
        'asset life, and whether spare-parts provisioning is included. A guarantee below 95% ' +
        'availability is worth flagging as a key issue.',
    },
    {
      id: 'sk-meridian-3',
      title: 'Turbine warranty gap detection',
      description: 'Identifying assets without current warranty coverage.',
      procedure:
        'Cross-reference commissioning date and warranty term per asset against today\'s date. ' +
        'Any asset past warranty expiry without a corresponding extended-warranty or full-service ' +
        'contract is a gap, not just an observation.',
    },
    {
      id: 'sk-meridian-4',
      title: 'Detecting version contradictions',
      description: 'How to flag when two documents disagree.',
      procedure:
        'Check document version and date before calling something a contradiction — prefer the ' +
        'most recent, clearly superseding version if one exists; otherwise raise an open gap ' +
        'with both documents linked.',
    },
  ],
  solstice: [
    {
      id: 'sk-solstice-1',
      title: 'How to build a Key Issue List',
      description: 'Procedure for turning a documented risk into a KIL row.',
      procedure:
        'Confirm grounding in a cited document before adding a row. This operation is closed, ' +
        'so new issues should not be added — this skill remains for reference only.',
    },
    {
      id: 'sk-solstice-2',
      title: 'Early-stage pipeline valuation checks',
      description: 'What to verify for a pre-construction BESS pipeline asset.',
      procedure:
        'Confirm each pipeline project has an interconnection queue position, site control, and ' +
        'a development-stage milestone (permitting, land, grid) before it is counted in the ' +
        'valuation — an unconfirmed pipeline item is a gap, not a valued asset.',
    },
  ],
}
