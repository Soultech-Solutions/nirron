import type { InternalAxiosRequestConfig } from 'axios'
import { getAccessToken } from '@/utils'

export function setupRequestInterceptor (): {
  onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  onRejected: (error: unknown) => Promise<never>
} {
  return {
    onFulfilled (config: InternalAxiosRequestConfig) {
      const skipAuth = (config as InternalAxiosRequestConfig & { skipAuth?: boolean }).skipAuth

      if (!skipAuth) {
        const token = getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }

      config.headers['X-Request-Id'] = crypto.randomUUID()
      config.headers['Accept'] = 'application/json'
      config.headers['Content-Type'] ??= 'application/json'

      return config
    },

    onRejected (error: unknown) {
      return Promise.reject(error)
    },
  }
}
