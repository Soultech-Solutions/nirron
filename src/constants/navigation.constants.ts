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
]

export const MAIN_NAVIGATION = NAVIGATION_ITEMS.filter((item) => item.section === 'main')
export const ADMIN_NAVIGATION = NAVIGATION_ITEMS.filter((item) => item.section === 'admin')
