// Rutas centralizadas (mismo patron que TMEIC-Ports-Frontend): sin strings
// magicos repartidos por la app. Arbol tomado literal del guion §0.
const opBase = (id = ':opId') => `/ma/operations/${id}`

export const ROUTES = {
  login: '/login',
  /** Selector de aplicaciones — pantalla puente tras el login (guion §3). */
  apps: '/apps',
  /** Selector de operación / cliente (guion §4). */
  operations: '/ma/operations',

  operationRoot: (id = ':opId') => opBase(id),
  operationChat: (id = ':opId') => `${opBase(id)}/chat`,

  operationDocuments: (id = ':opId') => `${opBase(id)}/documents`,
  operationDocumentsGaps: (id = ':opId') => `${opBase(id)}/documents/gaps`,
  operationDocumentsKnowledge: (id = ':opId') => `${opBase(id)}/documents/knowledge`,

  operationSummary: (id = ':opId') => `${opBase(id)}/summary`,
  operationSummaryOverview: (id = ':opId') => `${opBase(id)}/summary/overview`,
  operationSummaryKeyIssues: (id = ':opId') => `${opBase(id)}/summary/key-issues`,
  operationSummaryFacts: (id = ':opId') => `${opBase(id)}/summary/facts`,
  operationSummaryTracking: (id = ':opId') => `${opBase(id)}/summary/tracking`,

  operationFinancialModel: (id = ':opId') => `${opBase(id)}/financial-model`,
  operationReports: (id = ':opId') => `${opBase(id)}/reports`,

  operationAnalytics: (id = ':opId') => `${opBase(id)}/analytics`,
  operationAnalyticsCost: (id = ':opId') => `${opBase(id)}/analytics/cost`,
  operationAnalyticsTraces: (id = ':opId') => `${opBase(id)}/analytics/traces`,
  operationAnalyticsMemory: (id = ':opId') => `${opBase(id)}/analytics/memory`,
} as const

// Rutas relativas usadas dentro de <Route> anidadas bajo /ma/operations/:opId
// (react-router resuelve estas contra el path del padre).
export const OPERATION_CHILD_PATHS = {
  chat: 'chat',
  documents: 'documents',
  documentsGaps: 'documents/gaps',
  documentsKnowledge: 'documents/knowledge',
  summary: 'summary',
  summaryOverview: 'summary/overview',
  summaryKeyIssues: 'summary/key-issues',
  summaryFacts: 'summary/facts',
  summaryTracking: 'summary/tracking',
  financialModel: 'financial-model',
  reports: 'reports',
  analytics: 'analytics',
  analyticsCost: 'analytics/cost',
  analyticsTraces: 'analytics/traces',
  analyticsMemory: 'analytics/memory',
} as const
