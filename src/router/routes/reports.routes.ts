import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

const ReportsView = () => import('@/views/reports/ReportsIndexView.vue')

export const reportsRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.REPORTS,
    name: ROUTE_NAMES.REPORTS,
    component: ReportsView,
    meta: {
      title: 'Relatórios',
      icon: 'mdi-file-chart-outline',
      requiresAuth: true,
    },
  },
]
