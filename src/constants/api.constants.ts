export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

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
    ME: '/auth/me',
  },
  WORKFLOW: {
    BASE: '/workflow',
    BY_ID: (id: string) => `/workflow/${id}`,
  },
  IMPORTS: {
    BASE: '/imports',
    BY_ID: (id: string) => `/imports/${id}`,
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
