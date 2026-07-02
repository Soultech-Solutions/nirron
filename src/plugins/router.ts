import type { App } from 'vue'
import router from '@/router'
import { AUTH_ROUTE_PATHS } from '@/constants/auth.constants'
import { setUnauthorizedHandler } from '@/services'
import { useAuthStore } from '@/stores'

export function registerRouter (app: App): void {
  app.use(router)

  setUnauthorizedHandler(() => {
    const authStore = useAuthStore()
    authStore.clearSession()
    router.push({ path: AUTH_ROUTE_PATHS.LOGIN })
  })
}
