import type { Citation } from '@/shared/types/domain'
import type { OperationTracking } from '../types'

// Seguimiento de la operación (§5.3.4, UC-06): acciones pendientes + banco de
// preguntas para vendedor/asesores. Solstice está cerrada — su seguimiento
// muestra sobre todo acciones completadas y preguntas respondidas, con un
// único hilo abierto post-cierre (el mismo gap de UBO ya apuntado en el
// overview y en las hipótesis de la pantalla de hechos, a propósito: cuenta
// la misma historia en las tres pantallas).

function cite(documentId: string, documentName: string, locator: string, snippet = ''): Citation {
  return {
    id: `cit-${documentId}-${locator}`.replace(/[^a-z0-9-]+/gi, '-'),
    documentId,
    documentName,
    locator,
    snippet,
  }
}

export const MOCK_TRACKING: Record<string, OperationTracking> = {
  helios: {
    phase: 'due-diligence',
    actions: [
      {
        id: 'act-helios-1',
        action: "Circulate SPA draft v2 to seller's counsel",
        owner: 'Deal Lead',
        dueDate: '2026-08-30',
        status: 'done',
      },
      {
        id: 'act-helios-2',
        action: 'Reconcile PPA/model price mismatch at Site A',
        owner: 'Financial Model Lead',
        dueDate: '2026-09-01',
        status: 'in-progress',
      },
      {
        id: 'act-helios-3',
        action: 'Negotiate land lease extension option at Site C',
        owner: 'Real Estate Counsel',
        dueDate: '2026-09-20',
        status: 'in-progress',
      },
      {
        id: 'act-helios-4',
        action: 'Request updated environmental compliance report for Site B',
        owner: 'ESG Advisor',
        dueDate: '2026-09-05',
        status: 'pending',
      },
      {
        id: 'act-helios-5',
        action: 'Obtain revised insurance valuation and updated binder',
        owner: 'Insurance Advisor',
        dueDate: '2026-09-10',
        status: 'pending',
      },
      {
        id: 'act-helios-6',
        action: 'Commission updated litigation search for Sites E and G',
        owner: 'Legal & Regulatory Lead',
        dueDate: '2026-09-12',
        status: 'pending',
      },
      {
        id: 'act-helios-7',
        action: "Confirm status of lenders' change-of-control consent process",
        owner: 'Deal Lead',
        dueDate: '2026-09-25',
        status: 'pending',
      },
    ],
    questions: [
      {
        id: 'q-helios-1',
        topic: 'Legal',
        question: 'Can you confirm the proposed long-stop date and conditions precedent for closing?',
        status: 'pending',
        evidence: [cite('doc-helios-exclusivity-ext', 'Exclusivity extension letter', 'p. 1')],
      },
      {
        id: 'q-helios-2',
        topic: 'Technical',
        question: 'What is the expected resolution date for the grid capacity reservation at Sites D and F?',
        status: 'pending',
        evidence: [cite('doc-helios-grid-permits', 'Grid connection permit register', 'Sites D, F')],
        draftAnswer:
          'Agent draft, based on DSO correspondence on file: capacity reservation renewals typically take ' +
          '6–8 weeks from resubmission. No formal seller response received yet — treat as unconfirmed.',
      },
      {
        id: 'q-helios-3',
        topic: 'Financial',
        question: 'Can you clarify the PPA escalation mechanism applied at Site A?',
        status: 'answered',
        evidence: [cite('doc-helios-ppa-register', 'PPA register', 'summary table')],
        draftAnswer:
          "Per the PPA register and the seller's response (14 Aug 2026): the escalation is CPI-linked with a " +
          '2% annual cap, consistent with the other 6 sites. The financial model will be updated to match.',
      },
      {
        id: 'q-helios-4',
        topic: 'ESG',
        question: 'Please provide the updated environmental compliance report for Site B.',
        status: 'pending',
        evidence: [cite('doc-helios-eia-site-b', 'Environmental Impact Assessment — Site B', 'Approval conditions, p. 9')],
      },
      {
        id: 'q-helios-5',
        topic: 'Insurance',
        question: 'Can you confirm total insured value matches current replacement cost across the portfolio?',
        status: 'answered',
        evidence: [cite('doc-helios-insurance-binder', 'Insurance binder 2026', 'Schedule of values')],
        draftAnswer:
          'Seller confirmed on 20 Aug 2026 that the binder will be updated to reflect the 2026 revaluation ' +
          'ahead of signing.',
      },
      {
        id: 'q-helios-6',
        topic: 'Legal',
        question: "Please confirm the status of change-of-control consent requests to the two project-finance lenders.",
        status: 'pending',
        evidence: [cite('doc-helios-facility-agreements', 'Project finance facility agreements', 'cl. 19')],
        draftAnswer:
          'Agent draft: consent requests were submitted 18 Aug 2026. Typical lender response time is 4–6 ' +
          'weeks per the facility agreements — no reply received yet.',
      },
    ],
  },

  meridian: {
    phase: 'due-diligence',
    actions: [
      {
        id: 'act-meridian-1',
        action: 'Review corrected financial model v3',
        owner: 'Financial Model Lead',
        dueDate: '2026-08-22',
        status: 'done',
      },
      {
        id: 'act-meridian-2',
        action: 'Negotiate O&M availability guarantee step-up',
        owner: 'Technical Advisor',
        dueDate: '2026-09-08',
        status: 'in-progress',
      },
      {
        id: 'act-meridian-3',
        action: 'Confirm Asset 6 land lease renewal terms',
        owner: 'Real Estate Counsel',
        dueDate: '2026-08-29',
        status: 'in-progress',
      },
      {
        id: 'act-meridian-4',
        action: 'Obtain extended warranty quote for Assets 3 and 5',
        owner: 'Technical Advisor',
        dueDate: '2026-09-15',
        status: 'pending',
      },
      {
        id: 'act-meridian-5',
        action: 'Request latest environmental permit version for Asset 4',
        owner: 'ESG Advisor',
        dueDate: '2026-09-05',
        status: 'pending',
      },
      {
        id: 'act-meridian-6',
        action: 'Escalate Asset 2 regulatory investigation to investment committee',
        owner: 'Deal Lead',
        dueDate: '2026-08-28',
        status: 'pending',
      },
    ],
    questions: [
      {
        id: 'q-meridian-1',
        topic: 'Technical',
        question: 'Can you confirm whether extended warranty coverage will be offered for Assets 3 and 5?',
        status: 'pending',
        evidence: [cite('doc-meridian-warranty-schedules', 'Warranty schedules', 'Assets 3, 5')],
      },
      {
        id: 'q-meridian-2',
        topic: 'Technical',
        question: 'What corrective plan is proposed to bring O&M availability back above 95%?',
        status: 'pending',
        evidence: [cite('doc-meridian-om-agreement', 'O&M agreement — turbines', 'cl. 6')],
        draftAnswer:
          "Agent draft, based on clause 6: the contractual remedy is a service credit, not a guaranteed fix " +
          '— recommend requesting an explicit corrective action plan from the operator.',
      },
      {
        id: 'q-meridian-3',
        topic: 'Legal',
        question: 'Can you clarify the nature and current status of the regulatory investigation at Asset 2?',
        status: 'pending',
        evidence: [cite('doc-meridian-disclosure-letter', 'Seller disclosure letter', 'Item 4')],
      },
      {
        id: 'q-meridian-4',
        topic: 'Financial',
        question: 'Please confirm the corrected revenue escalation assumptions in financial model v3.',
        status: 'answered',
        evidence: [cite('doc-meridian-financial-model', 'Financial model v3.xlsx', "'Revenue' tab")],
        draftAnswer:
          "Seller's advisor confirmed on 19 Aug 2026 that v3 reflects the corrected 1.5% escalation, matching " +
          "the O&M agreement's referenced index.",
      },
      {
        id: 'q-meridian-5',
        topic: 'Environmental',
        question: 'Please provide the latest environmental permit version for Asset 4.',
        status: 'pending',
        evidence: [cite('doc-meridian-env-permits', 'Environmental permits bundle', 'Asset 4')],
      },
    ],
  },

  solstice: {
    phase: 'closed',
    actions: [
      {
        id: 'act-solstice-1',
        action: 'Confirm interconnection queue positions for Projects 4 and 7',
        owner: 'Technical Advisor',
        dueDate: '2026-06-08',
        status: 'done',
      },
      {
        id: 'act-solstice-2',
        action: 'Renew site control option for Project 2',
        owner: 'Real Estate Counsel',
        dueDate: '2026-06-20',
        status: 'done',
      },
      {
        id: 'act-solstice-3',
        action: "Agree escrow holdback mechanism for founders' warranty cap",
        owner: 'Deal Lead',
        dueDate: '2026-05-18',
        status: 'done',
      },
      {
        id: 'act-solstice-4',
        action: 'Request original subscription documents from the two minority co-investors',
        owner: 'Corporate Counsel',
        dueDate: '2026-09-15',
        status: 'pending',
      },
    ],
    questions: [
      {
        id: 'q-solstice-1',
        topic: 'Legal',
        question: 'Can you confirm final site control status for Project 2 ahead of closing?',
        status: 'answered',
        evidence: [cite('doc-solstice-pipeline-register', 'Pipeline register', 'Project 2, site control status')],
        draftAnswer: 'Confirmed via the renewed option agreement executed 22 Jun 2026, ahead of closing.',
      },
      {
        id: 'q-solstice-2',
        topic: 'Technical',
        question: 'Can you confirm the interconnection queue position for Projects 4 and 7?',
        status: 'answered',
        evidence: [cite('doc-solstice-queue-letters', 'Interconnection queue letters', 'Projects 4, 7')],
        draftAnswer: 'Grid operator letters dated 10 Jun 2026 confirm queue positions unchanged from the pipeline register.',
      },
      {
        id: 'q-solstice-3',
        topic: 'Legal',
        question: "Can you clarify the calculation basis for the founders' warranty cap?",
        status: 'answered',
        evidence: [cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'cl. 11')],
        draftAnswer: 'Resolved via the escrow holdback mechanism agreed in the final SPA — see clause 11.',
      },
      {
        id: 'q-solstice-4',
        topic: 'Corporate',
        question: 'Can you provide the original subscription documents for the two minority co-investors?',
        status: 'pending',
        evidence: [cite('doc-solstice-spa-executed', 'Share Purchase Agreement — executed', 'p. 1, "Parties"')],
      },
    ],
  },
}
