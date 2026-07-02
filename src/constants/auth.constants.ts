import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

export const AUTH_ROUTE_NAMES = {
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
} as const

export const AUTH_ROUTE_PATHS = {
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/esqueci-senha',
  RESET_PASSWORD: '/auth/redefinir-senha',
} as const

export const PUBLIC_ROUTES = [
  AUTH_ROUTE_PATHS.LOGIN,
  AUTH_ROUTE_PATHS.FORGOT_PASSWORD,
  AUTH_ROUTE_PATHS.RESET_PASSWORD,
] as const

export function isPublicRoute (path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route))
}
