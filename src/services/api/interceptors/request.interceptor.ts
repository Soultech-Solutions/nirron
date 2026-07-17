import type { InternalAxiosRequestConfig } from 'axios'
import { getAccessToken } from '@/utils'

export function setupRequestInterceptor (): {
  onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  onRejected: (error: unknown) => Promise<never>
} {
  return {
    onFulfilled (config: InternalAxiosRequestConfig) {
      const skipAuth = (config as InternalAxiosRequestConfig & { skipAuth?: boolean }).skipAuth

      if (!skipAuth && !config.headers.Authorization) {
        const token = getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }

      // Não enviar headers customizados (ex.: X-Request-Id): o CORS do Directus
      // só libera headers padrão; customizados quebram o preflight em produção.
      config.headers['Accept'] = 'application/json'
      config.headers['Content-Type'] ??= 'application/json'

      return config
    },

    onRejected (error: unknown) {
      return Promise.reject(error)
    },
  }
}
