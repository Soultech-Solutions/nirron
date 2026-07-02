import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

const DashboardView = () => import('@/views/dashboard/DashboardIndexView.vue')

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    name: ROUTE_NAMES.DASHBOARD,
    component: DashboardView,
    meta: {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard-outline',
      requiresAuth: true,
    },
  },
]
