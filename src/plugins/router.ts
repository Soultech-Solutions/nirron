import type { App } from 'vue'
import { AUTH_ROUTE_PATHS } from '@/constants/auth.constants'
import router from '@/router'
import { setUnauthorizedHandler } from '@/services'
import { useAuthStore, useNotificationStore } from '@/stores'

export function registerRouter (app: App): void {
  app.use(router)

  setUnauthorizedHandler(() => {
    // Requisições 401 simultâneas disparam o handler mais de uma vez;
    // se já estamos na tela de login, não há o que fazer.
    if (router.currentRoute.value.path === AUTH_ROUTE_PATHS.LOGIN) {
      return
    }

    const authStore = useAuthStore()
    authStore.clearSession()
    router
      .push({
        path: AUTH_ROUTE_PATHS.LOGIN,
        query: { redirect: router.currentRoute.value.fullPath },
      })
      .then(() => {
        // Notifica somente após a troca de layout: o snackbar do layout
        // anterior descarta a fila ao ser desmontado.
        useNotificationStore().warning('Sessão expirada', 'Faça login novamente para continuar.')
      })
  })
}
