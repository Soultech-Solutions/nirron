import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

const ValidationView = () => import('@/views/validation/ValidationIndexView.vue')

export const validationRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.VALIDATION,
    name: ROUTE_NAMES.VALIDATION,
    component: ValidationView,
    meta: {
      title: 'Validações',
      icon: 'mdi-shield-check-outline',
      requiresAuth: true,
      nav: true,
      order: 4,
    },
  },
]
