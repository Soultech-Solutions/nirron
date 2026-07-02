import type { RouteLocationRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from './routes.constants'

export interface NavigationItem {
  key: string
  title: string
  icon: string
  to: RouteLocationRaw
  routeName?: string
  badge?: string | number
  dividerBefore?: boolean
  section?: 'main' | 'admin'
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: ROUTE_PATHS.DASHBOARD,
    routeName: ROUTE_NAMES.DASHBOARD,
    section: 'main',
  },
  {
    key: 'imports',
    title: 'Importações',
    icon: 'mdi-package-variant-closed',
    to: ROUTE_PATHS.IMPORTS,
    routeName: ROUTE_NAMES.IMPORTS,
    section: 'main',
  },
  {
    key: 'conference',
    title: 'Nova Conferência',
    icon: 'mdi-plus-circle-outline',
    to: ROUTE_PATHS.CONFERENCE_NEW,
    routeName: ROUTE_NAMES.CONFERENCE_NEW,
    section: 'main',
  },
  {
    key: 'history',
    title: 'Histórico',
    icon: 'mdi-history',
    to: ROUTE_PATHS.HISTORY,
    routeName: ROUTE_NAMES.HISTORY,
    section: 'main',
  },
  {
    key: 'reports',
    title: 'Relatórios',
    icon: 'mdi-file-chart-outline',
    to: ROUTE_PATHS.REPORTS,
    routeName: ROUTE_NAMES.REPORTS,
    section: 'main',
  },
  {
    key: 'alerts',
    title: 'Alertas',
    icon: 'mdi-bell-alert-outline',
    to: ROUTE_PATHS.ALERTS,
    routeName: ROUTE_NAMES.ALERTS,
    badge: 3,
    section: 'main',
  },
  {
    key: 'users',
    title: 'Usuários',
    icon: 'mdi-account-group-outline',
    to: ROUTE_PATHS.USERS,
    routeName: ROUTE_NAMES.USERS,
    dividerBefore: true,
    section: 'admin',
  },
  {
    key: 'settings',
    title: 'Configurações',
    icon: 'mdi-cog-outline',
    to: ROUTE_PATHS.SETTINGS,
    routeName: ROUTE_NAMES.SETTINGS,
    section: 'admin',
  },
  {
    key: 'logs',
    title: 'Logs',
    icon: 'mdi-text-box-search-outline',
    to: ROUTE_PATHS.LOGS,
    routeName: ROUTE_NAMES.LOGS,
    section: 'admin',
  },
]

export const MAIN_NAVIGATION = NAVIGATION_ITEMS.filter((item) => item.section === 'main')
export const ADMIN_NAVIGATION = NAVIGATION_ITEMS.filter((item) => item.section === 'admin')
