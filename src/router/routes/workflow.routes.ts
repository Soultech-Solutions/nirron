import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'

const WorkflowView = () => import('@/views/workflow/WorkflowIndexView.vue')

export const workflowRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.WORKFLOW,
    name: ROUTE_NAMES.WORKFLOW,
    component: WorkflowView,
    meta: {
      title: 'Workflow',
      icon: 'mdi-file-tree-outline',
      requiresAuth: true,
      nav: true,
      order: 2,
    },
  },
]
