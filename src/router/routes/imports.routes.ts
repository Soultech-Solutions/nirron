import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

const ImportsView = () => import('@/views/imports/ImportsIndexView.vue')
const ImportDetailView = () => import('@/views/imports/ImportDetailView.vue')

export const importsRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.IMPORTS,
    name: ROUTE_NAMES.IMPORTS,
    component: ImportsView,
    meta: {
      title: 'Importações',
      icon: 'mdi-package-variant-closed',
      requiresAuth: true,
    },
  },
  {
    path: ROUTE_PATHS.IMPORTS_DETAIL,
    name: ROUTE_NAMES.IMPORTS_DETAIL,
    component: ImportDetailView,
    meta: {
      title: 'Detalhe da Importação',
      requiresAuth: true,
    },
  },
]
