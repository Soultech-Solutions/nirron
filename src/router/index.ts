import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { authGuard } from './guards'
import {
  alertsRoutes,
  authRoutes,
  conferenceRoutes,
  dashboardRoutes,
  historyRoutes,
  importsRoutes,
  logsRoutes,
  reportsRoutes,
  settingsRoutes,
  usersRoutes,
  validationRoutes,
  workflowRoutes,
} from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: ROUTE_PATHS.HOME,
      component: DefaultLayout,
      redirect: ROUTE_PATHS.DASHBOARD,
      children: [
        ...dashboardRoutes,
        ...importsRoutes,
        ...conferenceRoutes,
        ...historyRoutes,
        ...reportsRoutes,
        ...alertsRoutes,
        ...usersRoutes,
        ...settingsRoutes,
        ...logsRoutes,
        ...workflowRoutes,
        ...validationRoutes,
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.NOT_FOUND,
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: {
        title: 'Página não encontrada',
        layout: 'blank',
      },
    },
  ],
  scrollBehavior () {
    return { top: 0 }
  },
})

router.beforeEach(authGuard)

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} | NIRRON` : 'NIRRON'
})

export default router
