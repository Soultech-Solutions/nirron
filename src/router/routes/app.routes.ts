import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

const PlaceholderView = () => import('@/views/shared/PlaceholderView.vue')

function placeholderRoute (
  path: string,
  name: string,
  title: string,
  description?: string,
): RouteRecordRaw {
  return {
    path,
    name,
    component: PlaceholderView,
    meta: { title, description, requiresAuth: true },
  }
}

export const conferenceRoutes: RouteRecordRaw[] = [
  placeholderRoute(
    ROUTE_PATHS.CONFERENCE_NEW,
    ROUTE_NAMES.CONFERENCE_NEW,
    'Nova Conferência',
    'Inicie uma nova conferência pré-registro de DI ou DUIMP.',
  ),
]

export const historyRoutes: RouteRecordRaw[] = [
  placeholderRoute(
    ROUTE_PATHS.HISTORY,
    ROUTE_NAMES.HISTORY,
    'Histórico',
    'Consulte o histórico de operações de conferência.',
  ),
]

export const alertsRoutes: RouteRecordRaw[] = [
  placeholderRoute(
    ROUTE_PATHS.ALERTS,
    ROUTE_NAMES.ALERTS,
    'Alertas',
    'Alertas e notificações do sistema.',
  ),
]

export const usersRoutes: RouteRecordRaw[] = [
  placeholderRoute(
    ROUTE_PATHS.USERS,
    ROUTE_NAMES.USERS,
    'Usuários',
    'Gerenciamento de usuários e permissões.',
  ),
]

export const settingsRoutes: RouteRecordRaw[] = [
  placeholderRoute(
    ROUTE_PATHS.SETTINGS,
    ROUTE_NAMES.SETTINGS,
    'Configurações',
    'Configurações gerais do sistema.',
  ),
]

export const logsRoutes: RouteRecordRaw[] = [
  placeholderRoute(
    ROUTE_PATHS.LOGS,
    ROUTE_NAMES.LOGS,
    'Logs',
    'Logs de auditoria e rastreabilidade.',
  ),
]
