import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { AUTH_ROUTE_PATHS, isPublicRoute } from '@/constants/auth.constants'
import { ROUTE_PATHS } from '@/constants'
import { useAuthStore } from '@/stores'

export function authGuard (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const authStore = useAuthStore()

  if (isPublicRoute(to.path)) {
    if (authStore.isAuthenticated && to.path === AUTH_ROUTE_PATHS.LOGIN) {
      next({ path: ROUTE_PATHS.DASHBOARD })
      return
    }
    next()
    return
  }

  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    next({ path: AUTH_ROUTE_PATHS.LOGIN, query: { redirect: to.fullPath } })
    return
  }

  const requiredRoles = to.meta.roles
  if (requiredRoles?.length && !requiredRoles.some((role) => authStore.hasRole(role))) {
    next({ path: ROUTE_PATHS.DASHBOARD })
    return
  }

  next()
}
