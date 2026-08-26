import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { OperationLayout, ScreenLoader } from '@/app/layout'
import { ProtectedRoute } from './ProtectedRoute'
import { RequireAdmin } from './RequireAdmin'
import { ROUTES, OPERATION_CHILD_PATHS as P } from '@/shared/config/routes'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const AppSelectorPage = lazy(() => import('@/pages/AppSelectorPage'))
const OperationsPage = lazy(() => import('@/pages/OperationsPage'))

const ChatPage = lazy(() => import('@/pages/ChatPage'))

const DocumentsSectionLayout = lazy(() => import('@/pages/DocumentsSectionLayout'))
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'))
const DocumentsGapsPage = lazy(() => import('@/pages/DocumentsGapsPage'))
const DocumentsKnowledgePage = lazy(() => import('@/pages/DocumentsKnowledgePage'))

const SummarySectionLayout = lazy(() => import('@/pages/SummarySectionLayout'))
const SummaryOverviewPage = lazy(() => import('@/pages/SummaryOverviewPage'))
const SummaryKeyIssuesPage = lazy(() => import('@/pages/SummaryKeyIssuesPage'))
const SummaryFactsPage = lazy(() => import('@/pages/SummaryFactsPage'))
const SummaryTrackingPage = lazy(() => import('@/pages/SummaryTrackingPage'))

const FinancialModelPage = lazy(() => import('@/pages/FinancialModelPage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))

const AnalyticsSectionLayout = lazy(() => import('@/pages/AnalyticsSectionLayout'))
const AnalyticsCostPage = lazy(() => import('@/pages/AnalyticsCostPage'))
const AnalyticsTracesPage = lazy(() => import('@/pages/AnalyticsTracesPage'))
const AnalyticsMemoryPage = lazy(() => import('@/pages/AnalyticsMemoryPage'))

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Rutas sin OperationLayout (login, selector de apps, selector de operacion,
// 404): necesitan su propio Suspense porque no hay shell que aporte el
// fallback. Las de dentro del shell lo heredan de OperationLayout.
const el = (node: ReactNode) => <Suspense fallback={<ScreenLoader />}>{node}</Suspense>

export const router = createBrowserRouter([
  { path: ROUTES.login, element: el(<LoginPage />) },
  {
    element: <ProtectedRoute />,
    children: [
      // Fuera de cualquier shell a proposito: son las pantallas puente entre
      // el login y el trabajo (guion §3/§4), sin sidebar ni header.
      { path: ROUTES.apps, element: el(<AppSelectorPage />) },
      { path: ROUTES.operations, element: el(<OperationsPage />) },

      {
        path: ROUTES.operationRoot(),
        element: <OperationLayout />,
        children: [
          { index: true, element: <Navigate to={P.chat} replace /> },
          { path: P.chat, element: <ChatPage /> },

          {
            path: P.documents,
            element: <DocumentsSectionLayout />,
            children: [
              { index: true, element: <DocumentsPage /> },
              { path: 'gaps', element: <DocumentsGapsPage /> },
              {
                path: 'knowledge',
                element: <RequireAdmin />,
                children: [{ index: true, element: <DocumentsKnowledgePage /> }],
              },
            ],
          },

          {
            path: P.summary,
            element: <SummarySectionLayout />,
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              { path: 'overview', element: <SummaryOverviewPage /> },
              { path: 'key-issues', element: <SummaryKeyIssuesPage /> },
              { path: 'facts', element: <SummaryFactsPage /> },
              { path: 'tracking', element: <SummaryTrackingPage /> },
            ],
          },

          { path: P.financialModel, element: <FinancialModelPage /> },
          { path: P.reports, element: <ReportsPage /> },

          {
            path: P.analytics,
            element: <RequireAdmin />,
            children: [
              {
                element: <AnalyticsSectionLayout />,
                children: [
                  { index: true, element: <Navigate to="cost" replace /> },
                  { path: 'cost', element: <AnalyticsCostPage /> },
                  { path: 'traces', element: <AnalyticsTracesPage /> },
                  { path: 'memory', element: <AnalyticsMemoryPage /> },
                ],
              },
            ],
          },
        ],
      },

      { index: true, element: <Navigate to={ROUTES.apps} replace /> },
    ],
  },
  { path: '/404', element: el(<NotFoundPage />) },
  { path: '*', element: <Navigate to="/404" replace /> },
])
