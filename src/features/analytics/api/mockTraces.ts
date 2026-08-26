import type { ExecutionTrace, TraceStep } from '../types'

/**
 * Mock de trazas de ejecución (guion §5.6.2), keyed por operationId.
 * Inspiración directa de la propuesta BEAI (slide 22): la cadena de pasos
 * "entrada → autenticación → flow ingesta → flow extracción → agente KIL
 * borrador", con turnos de razonamiento internos que cuentan tokens y qué
 * tool/middleware disparó cada uno. El objetivo de la pantalla es que ese
 * razonamiento interno se vea tan medible como cualquier llamada directa.
 */

let stepSeq = 0
function step(step: Omit<TraceStep, 'id'>): TraceStep {
  stepSeq += 1
  return { id: `step-${stepSeq}`, ...step }
}

function sumTokens(steps: TraceStep[]): number {
  return steps.reduce((sum, s) => sum + (s.tokens ?? 0), 0)
}

// ---- helios ----

const heliosKilTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'User request: "Draft Key Issue List entries for the grid connection section"' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Helios' }),
  step({ kind: 'flow', label: 'Ingestion flow', detail: '12 documents re-indexed since the last run' }),
  step({ kind: 'flow', label: 'Extraction flow', detail: 'Structured facts extracted from 4 grid connection documents' }),
  step({ kind: 'flow', label: 'Key Issue List agent invoked', detail: 'Key Issue List Agent · agentId: key-issues' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o', tokens: 1240, detail: 'Reasoning over the extracted grid-connection facts' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: knowledge retrieval', detail: 'Queried Skill "How to build a Key Issue List"' }),
  step({ kind: 'model', label: 'Turn 2 · model', model: 'GPT-4o', tokens: 860, detail: 'Drafting candidate risk rows' }),
  step({ kind: 'middleware', label: 'Turn 2 · middleware: citation check', detail: 'Verified every drafted row carries a source citation' }),
  step({ kind: 'final', label: 'Result', detail: '3 new Key Issue rows proposed, 1 flagged as insufficient evidence' }),
]

const heliosChatTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'User question: "What are the main risks on the PPA curtailment clause?"' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: User · operation: Project Helios' }),
  step({ kind: 'flow', label: 'General Query agent invoked', detail: 'General Query Agent · agentId: chat' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o mini', tokens: 610, detail: 'Retrieval-augmented reasoning over indexed PPA documents' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: document retrieval', detail: 'Retrieved 3 fragments from "PPA_Iberia_SolarCo_v3.pdf"' }),
  step({ kind: 'middleware', label: 'Turn 1 · middleware: mandatory citation', detail: 'Blocked draft answer until every claim carried a citation' }),
  step({ kind: 'final', label: 'Result', detail: 'Answered with 2 inline citations, response time 2.4 s' }),
]

const heliosFinancialTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'Action: "Audit consistency" on Financial_Model_Helios_v6.xlsx' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Helios' }),
  step({ kind: 'flow', label: 'Working-copy lock', detail: 'Original file locked read-only, audit runs on a copy' }),
  step({ kind: 'flow', label: 'Consistency Audit agent invoked', detail: 'Consistency Audit Agent · agentId: financial-audit' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o (deep reasoning)', tokens: 2140, detail: 'Building the formula dependency graph across 6 tabs' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: formula graph analysis', detail: 'Timed out after 30 s on tab "Sensitivities" — retried' }),
  step({ kind: 'tool', label: 'Turn 2 · tool: formula graph analysis', detail: 'Retry succeeded · 1 circular reference found' }),
  step({ kind: 'model', label: 'Turn 2 · model', model: 'GPT-4o (deep reasoning)', tokens: 1480, detail: 'Cross-tab consistency check, inputs vs outputs' }),
  step({ kind: 'middleware', label: 'Turn 2 · middleware: read-only source lock', detail: 'Confirmed no write attempted on the original file' }),
  step({ kind: 'final', label: 'Result', detail: '6 findings raised (1 critical circularity) — one tool retry recorded' }),
]

const heliosSummaryTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'Action: "Regenerate" on the operation snapshot' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Helios' }),
  step({ kind: 'flow', label: 'Ingestion flow', detail: '3 documents changed since the last snapshot' }),
  step({ kind: 'flow', label: 'Operation Analysis agent invoked', detail: 'Operation Analysis Agent · agentId: summary-overview' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o', tokens: 1930, detail: 'Rebuilding perimeter, parties, milestones and status' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: structured extraction', detail: 'Extracted milestone dates from 2 SPA amendments' }),
  step({ kind: 'middleware', label: 'Turn 1 · middleware: human validation gate', detail: 'Snapshot queued for admin review before publishing' }),
  step({ kind: 'final', label: 'Result', detail: 'Snapshot regenerated · 1 field flagged as insufficient documentation' }),
]

const heliosReportsTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'Action: "Generate draft" — template: Executive summary' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Helios' }),
  step({ kind: 'flow', label: 'Report Drafting agent invoked', detail: 'Report Drafting Agent · agentId: reports' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o', tokens: 2380, detail: 'Composing sections from the selected sources' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: template composer', detail: 'Merged 5 sections into the executive summary template' }),
  step({ kind: 'middleware', label: 'Turn 1 · middleware: mandatory citation', detail: 'Every claim traced back to an approved source or Key Issue row' }),
  step({ kind: 'final', label: 'Result', detail: 'Draft ready for review · 14 citations, 0 unresolved claims' }),
]

// ---- meridian ----

const meridianKilTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'User request: "Draft Key Issue List entries for the O&M contracts"' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Meridian' }),
  step({ kind: 'flow', label: 'Extraction flow', detail: 'Structured facts extracted from 3 O&M agreements' }),
  step({ kind: 'flow', label: 'Key Issue List agent invoked', detail: 'Key Issue List Agent · agentId: key-issues' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o', tokens: 990, detail: 'Comparing availability guarantees against the 95% threshold' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: risk taxonomy lookup', detail: 'Classified impact as "Medium" per O&M risk taxonomy' }),
  step({ kind: 'final', label: 'Result', detail: '2 new Key Issue rows proposed' }),
]

const meridianChatTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'User question: "Which turbines are outside warranty coverage?"' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: User · operation: Project Meridian' }),
  step({ kind: 'flow', label: 'General Query agent invoked', detail: 'General Query Agent · agentId: chat' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o mini', tokens: 520, detail: 'Cross-referencing commissioning dates against warranty terms' }),
  step({ kind: 'tool', label: 'Turn 1 · tool: SharePoint search', detail: 'Located 6 asset commissioning certificates' }),
  step({ kind: 'final', label: 'Result', detail: 'Answered with 3 inline citations' }),
]

const meridianFinancialTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'Action: "Audit consistency" on Financial_Model_Meridian_v2.xlsx' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Meridian' }),
  step({ kind: 'flow', label: 'Consistency Audit agent invoked', detail: 'Consistency Audit Agent · agentId: financial-audit' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o (deep reasoning)', tokens: 1610, detail: 'Building the formula dependency graph across 4 tabs' }),
  step({ kind: 'middleware', label: 'Turn 1 · middleware: read-only source lock', detail: 'Confirmed no write attempted on the original file' }),
  step({ kind: 'final', label: 'Result', detail: '4 findings raised, all Low or Medium severity' }),
]

// ---- solstice (cerrada — trazas históricas, previas al cierre) ----

const solsticeKilTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'User request: "Draft Key Issue List entries for the pipeline valuation"' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Solstice' }),
  step({ kind: 'flow', label: 'Key Issue List agent invoked', detail: 'Key Issue List Agent · agentId: key-issues' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o', tokens: 740, detail: 'Checking interconnection queue position per pipeline project' }),
  step({ kind: 'final', label: 'Result', detail: '1 new Key Issue row proposed' }),
]

const solsticeSummaryTrace: TraceStep[] = [
  step({ kind: 'flow', label: 'Input received', detail: 'Action: "Regenerate" on the operation snapshot' }),
  step({ kind: 'flow', label: 'Authentication', detail: 'Session verified · role: Admin · operation: Project Solstice' }),
  step({ kind: 'flow', label: 'Operation Analysis agent invoked', detail: 'Operation Analysis Agent · agentId: summary-overview' }),
  step({ kind: 'model', label: 'Turn 1 · model', model: 'GPT-4o', tokens: 1120, detail: 'Rebuilding perimeter, parties and milestones' }),
  step({ kind: 'middleware', label: 'Turn 1 · middleware: human validation gate', detail: 'Snapshot queued for admin review before publishing' }),
  step({ kind: 'final', label: 'Result', detail: 'Snapshot regenerated · last one before the operation was closed' }),
]

function trace(input: {
  id: string
  operationId: string
  originLabel: string
  agentId: ExecutionTrace['agentId']
  triggeredBy: string
  startedAt: string
  durationMs: number
  status: ExecutionTrace['status']
  summary: string
  steps: TraceStep[]
}): ExecutionTrace {
  return { ...input, totalTokens: sumTokens(input.steps) }
}

export const MOCK_TRACES: Record<string, ExecutionTrace[]> = {
  helios: [
    trace({
      id: 'trace-helios-1',
      operationId: 'helios',
      originLabel: 'Summary · Key Issue List',
      agentId: 'key-issues',
      triggeredBy: 'Elena Vidal (Deal Lead)',
      startedAt: '2026-08-24T16:12:00.000Z',
      durationMs: 6800,
      status: 'success',
      summary: '3 Key Issue rows drafted from the grid connection documents',
      steps: heliosKilTrace,
    }),
    trace({
      id: 'trace-helios-2',
      operationId: 'helios',
      originLabel: 'Chat · General Query Agent',
      agentId: 'chat',
      triggeredBy: 'Marcos Duarte (Analyst)',
      startedAt: '2026-08-24T11:47:00.000Z',
      durationMs: 2900,
      status: 'success',
      summary: 'Answered a PPA curtailment question with 2 citations',
      steps: heliosChatTrace,
    }),
    trace({
      id: 'trace-helios-3',
      operationId: 'helios',
      originLabel: 'Financial model · Consistency Audit Agent',
      agentId: 'financial-audit',
      triggeredBy: 'Elena Vidal (Deal Lead)',
      startedAt: '2026-08-23T09:30:00.000Z',
      durationMs: 41200,
      status: 'partial',
      summary: '6 findings raised — one tool call timed out and was retried',
      steps: heliosFinancialTrace,
    }),
    trace({
      id: 'trace-helios-4',
      operationId: 'helios',
      originLabel: 'Summary · Overview snapshot',
      agentId: 'summary-overview',
      triggeredBy: 'System · scheduled regeneration',
      startedAt: '2026-08-22T06:00:00.000Z',
      durationMs: 9100,
      status: 'success',
      summary: 'Snapshot regenerated, 1 field flagged as insufficient documentation',
      steps: heliosSummaryTrace,
    }),
    trace({
      id: 'trace-helios-5',
      operationId: 'helios',
      originLabel: 'Reports · Executive summary',
      agentId: 'reports',
      triggeredBy: 'Elena Vidal (Deal Lead)',
      startedAt: '2026-08-20T15:05:00.000Z',
      durationMs: 12400,
      status: 'success',
      summary: 'Executive summary draft generated with 14 resolved citations',
      steps: heliosReportsTrace,
    }),
  ],
  meridian: [
    trace({
      id: 'trace-meridian-1',
      operationId: 'meridian',
      originLabel: 'Summary · Key Issue List',
      agentId: 'key-issues',
      triggeredBy: 'Sofía Reyes (Analyst)',
      startedAt: '2026-08-21T10:15:00.000Z',
      durationMs: 5200,
      status: 'success',
      summary: '2 Key Issue rows drafted from the O&M agreements',
      steps: meridianKilTrace,
    }),
    trace({
      id: 'trace-meridian-2',
      operationId: 'meridian',
      originLabel: 'Chat · General Query Agent',
      agentId: 'chat',
      triggeredBy: 'Marcos Duarte (Analyst)',
      startedAt: '2026-08-19T14:02:00.000Z',
      durationMs: 2100,
      status: 'success',
      summary: 'Answered a turbine warranty question with 3 citations',
      steps: meridianChatTrace,
    }),
    trace({
      id: 'trace-meridian-3',
      operationId: 'meridian',
      originLabel: 'Financial model · Consistency Audit Agent',
      agentId: 'financial-audit',
      triggeredBy: 'Sofía Reyes (Analyst)',
      startedAt: '2026-08-15T08:47:00.000Z',
      durationMs: 26700,
      status: 'success',
      summary: '4 findings raised, all Low or Medium severity',
      steps: meridianFinancialTrace,
    }),
  ],
  solstice: [
    trace({
      id: 'trace-solstice-1',
      operationId: 'solstice',
      originLabel: 'Summary · Key Issue List',
      agentId: 'key-issues',
      triggeredBy: 'Elena Vidal (Deal Lead)',
      startedAt: '2026-06-28T12:00:00.000Z',
      durationMs: 4300,
      status: 'success',
      summary: '1 Key Issue row drafted — last KIL run before closure',
      steps: solsticeKilTrace,
    }),
    trace({
      id: 'trace-solstice-2',
      operationId: 'solstice',
      originLabel: 'Summary · Overview snapshot',
      agentId: 'summary-overview',
      triggeredBy: 'System · scheduled regeneration',
      startedAt: '2026-06-29T06:00:00.000Z',
      durationMs: 7600,
      status: 'success',
      summary: 'Last snapshot regenerated before the operation was closed',
      steps: solsticeSummaryTrace,
    }),
  ],
}

export function getExecutionTraces(operationId: string): ExecutionTrace[] {
  return MOCK_TRACES[operationId] ?? []
}
