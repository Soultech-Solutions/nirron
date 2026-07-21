export const API_BASE_URL
  = import.meta.env.VITE_API_BASE_URL ?? 'https://mailminer.soultech.solutions'

export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 30_000)

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/users/me',
    PASSWORD_REQUEST: '/auth/password/request',
    PASSWORD_RESET: '/auth/password/reset',
  },
  ASSETS: (id: string) => `/assets/${id}`,
  /** Collections Directus (Data Model NIRRON) */
  DIRECTUS: {
    PROCESSES: '/items/processes',
    PROCESS_BY_ID: (id: string) => `/items/processes/${id}`,
    DOCUMENTS: '/items/documents',
    DOCUMENT_BY_ID: (id: string) => `/items/documents/${id}`,
    ATTACHMENTS: '/items/attachments',
    EMAIL_BY_ID: (id: string) => `/items/emails/${id}`,
    EMAILS: '/items/emails',
    AI_PROMPTS: '/items/ai_prompts',
  },
  WORKFLOW: {
    BASE: '/workflow',
    BY_ID: (id: string) => `/workflow/${id}`,
  },
  IMPORTS: {
    BASE: '/items/processes',
    BY_ID: (id: string) => `/items/processes/${id}`,
  },
  VALIDATION: {
    BASE: '/validation',
    BY_ID: (id: string) => `/validation/${id}`,
    RULES: '/validation/rules',
  },
  REPORTS: {
    BASE: '/reports',
    BY_ID: (id: string) => `/reports/${id}`,
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    METRICS: '/dashboard/metrics',
  },
} as const
