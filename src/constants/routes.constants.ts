export const ROUTE_NAMES = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  WORKFLOW: 'workflow',
  WORKFLOW_DETAIL: 'workflow-detail',
  IMPORTS: 'imports',
  IMPORTS_DETAIL: 'imports-detail',
  CONFERENCE_NEW: 'conference-new',
  HISTORY: 'history',
  VALIDATION: 'validation',
  VALIDATION_DETAIL: 'validation-detail',
  REPORTS: 'reports',
  REPORTS_DETAIL: 'reports-detail',
  ALERTS: 'alerts',
  USERS: 'users',
  SETTINGS: 'settings',
  LOGS: 'logs',
  NOT_FOUND: 'not-found',
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  WORKFLOW: '/workflow',
  WORKFLOW_DETAIL: '/workflow/:id',
  IMPORTS: '/imports',
  IMPORTS_DETAIL: '/imports/:id',
  CONFERENCE_NEW: '/conferencia/nova',
  HISTORY: '/historico',
  VALIDATION: '/validation',
  VALIDATION_DETAIL: '/validation/:id',
  REPORTS: '/reports',
  REPORTS_DETAIL: '/reports/:id',
  ALERTS: '/alertas',
  USERS: '/usuarios',
  SETTINGS: '/configuracoes',
  LOGS: '/logs',
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]
